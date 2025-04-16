import { NextResponse } from 'next/server';
import Pusher from 'pusher';
import { getCounterValue, incrementCounter, initializeDb } from '@/lib/db';

// Initialize the database when the module is loaded
initializeDb().catch((error) => {
  console.error('Failed to initialize database:', error);
});

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// Store IP addresses to prevent spam (still using in-memory for rate limiting)
const ipAddresses = new Map<string, number>();

// PRODUCTION NOTE: In a production environment, you should:
// 1. Use a database to store the counter (e.g., MongoDB, PostgreSQL)
// 2. Use database transactions to safely increment the counter
// 3. Consider using a caching layer (Redis) for better performance
//
// Example with a hypothetical database:
//
// async function getCounterValue() {
//   // Connect to your database
//   const db = await connectToDatabase();
//   // Get the counter document/row
//   const counterDoc = await db.collection('counters').findOne({ id: 'ldr-counter' });
//   // Return the current count or default to 0
//   return counterDoc ? counterDoc.count : 0;
// }
//
// async function incrementCounter() {
//   // Connect to your database
//   const db = await connectToDatabase();
//   // Increment the counter and return the new value
//   const result = await db.collection('counters').findOneAndUpdate(
//     { id: 'ldr-counter' },
//     { $inc: { count: 1 } },
//     { upsert: true, returnDocument: 'after' }
//   );
//   return result.count;
// }

export async function GET() {
  // Get the current counter value from the database
  const count = await getCounterValue();
  return NextResponse.json({ count });
}

export async function POST(request: Request) {
  try {
    // Check if this is an auto-increment or user action
    let body = {};
    let isAutoIncrement = false;

    try {
      body = await request.json();
    } catch (error) {
      // If request body can't be parsed as JSON, assume it's auto-increment
      isAutoIncrement = true;
    }

    const { captchaToken } = body as { captchaToken?: string };

    // Get client IP for verification and rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Skip CAPTCHA verification for auto-increment
    if (!isAutoIncrement && !captchaToken) {
      return NextResponse.json(
        { error: 'CAPTCHA token required' },
        { status: 400 }
      );
    }

    // Verify CAPTCHA for user actions only
    if (!isAutoIncrement && captchaToken) {
      // Skip verification for survey submission
      if (captchaToken === 'survey-submission') {
        // Process submission without CAPTCHA verification or IP check
        // This is allowed because the survey already verified CAPTCHA
      } else {
        // Proper verification according to Google's documentation
        const verificationUrl =
          'https://www.google.com/recaptcha/api/siteverify';
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        // Verify that secret key is available
        if (!secretKey) {
          console.error('RECAPTCHA_SECRET_KEY not configured');
          return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
          );
        }

        // Prepare form data for verification
        const formData = new URLSearchParams();
        formData.append('secret', secretKey);
        formData.append('response', captchaToken);
        formData.append('remoteip', ip); // Optional but recommended

        // Make verification request
        const verificationResponse = await fetch(verificationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });

        const captchaData = await verificationResponse.json();

        // Check verification result
        if (!captchaData.success) {
          const errorCodes = captchaData['error-codes'] || ['unknown-error'];
          console.error('CAPTCHA verification failed:', errorCodes);

          return NextResponse.json(
            {
              error: 'CAPTCHA verification failed',
              details: errorCodes,
            },
            { status: 400 }
          );
        }

        // Verify the hostname matches (security check)
        const expectedHostname =
          process.env.HOSTNAME || request.headers.get('host');
        if (
          expectedHostname &&
          captchaData.hostname &&
          captchaData.hostname !== expectedHostname
        ) {
          console.error('CAPTCHA hostname mismatch:', {
            expected: expectedHostname,
            received: captchaData.hostname,
          });
          return NextResponse.json(
            { error: 'CAPTCHA verification failed: hostname mismatch' },
            { status: 400 }
          );
        }

        // Check if the token is expired (older than 2 minutes)
        if (captchaData.challenge_ts) {
          const challengeTimestamp = new Date(
            captchaData.challenge_ts
          ).getTime();
          const currentTimestamp = Date.now();
          const twoMinutesMs = 2 * 60 * 1000;

          if (currentTimestamp - challengeTimestamp > twoMinutesMs) {
            return NextResponse.json(
              { error: 'CAPTCHA token expired, please try again' },
              { status: 400 }
            );
          }
        }

        // For user actions, check IP rate limiting
        const lastParticipation = ipAddresses.get(ip);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (lastParticipation && now - lastParticipation < oneDay) {
          return NextResponse.json(
            { error: 'You have already participated recently' },
            { status: 429 }
          );
        }

        // Update IP tracking for real user actions
        ipAddresses.set(ip, now);
      }
    }

    // Increment the counter in the database
    const newCount = await incrementCounter();

    // Trigger Pusher event to update all clients
    await pusher.trigger('ldr-counter', 'counter-updated', {
      count: newCount,
    });

    return NextResponse.json({ count: newCount });
  } catch (error) {
    console.error('Error in counter API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

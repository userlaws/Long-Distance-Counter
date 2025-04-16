import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

// In-memory counter for demo purposes
// In a production app, you would use a database
let counter = 0;

// Track IPs to prevent multiple submissions
const submissionIPs = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    // Get client IP address for verification
    const ipAddress =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // Prevent the same IP from incrementing more than once per 24 hours
    if (submissionIPs.has(ipAddress)) {
      return NextResponse.json(
        { error: 'You have already participated recently' },
        { status: 429 }
      );
    }

    // Get request data (would contain captcha token in production)
    const data = await req.json();

    // In production, verify the CAPTCHA token
    // const captchaVerified = await verifyCaptcha(data.captchaToken)
    const captchaVerified = true; // For demo purposes

    if (!captchaVerified) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Add IP to tracker to prevent multiple submissions
    submissionIPs.add(ipAddress);

    // Set a timeout to remove the IP after 24 hours
    setTimeout(() => {
      submissionIPs.delete(ipAddress);
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Increment counter
    counter++;

    // Initialize Pusher
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID || '1975789',
      key: process.env.NEXT_PUBLIC_PUSHER_KEY || 'a4b2e46fa5024db4e41a',
      secret: process.env.PUSHER_SECRET || '11e90bd60cf6f9d9b068',
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
      useTLS: true,
    });

    // Trigger event to update all clients
    await pusher.trigger('ldr-counter', 'counter-updated', {
      count: counter,
    });

    return NextResponse.json({ success: true, count: counter });
  } catch (error) {
    console.error('Error incrementing counter:', error);
    return NextResponse.json(
      { error: 'Failed to increment counter' },
      { status: 500 }
    );
  }
}

// In production, implement this function to verify the CAPTCHA token
// async function verifyCaptcha(token: string): Promise<boolean> {
//   try {
//     const response = await fetch(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
//       { method: "POST" }
//     )
//     const data = await response.json()
//     return data.success
//   } catch (error) {
//     console.error("Error verifying CAPTCHA:", error)
//     return false
//   }
// }

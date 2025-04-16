import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// In-memory counter (you might want to use a database in production)
let counter = 0;

// Store IP addresses to prevent spam
const ipAddresses = new Map<string, number>();

export async function GET() {
  return NextResponse.json({ count: counter });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { captchaToken } = body;

    // Verify CAPTCHA token
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;

    const recaptchaResponse = await fetch(verificationURL, {
      method: 'POST',
    });

    const captchaData = await recaptchaResponse.json();

    if (!captchaData.success) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Get IP address for rate limiting
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check if this IP has already participated
    const lastParticipation = ipAddresses.get(ip);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastParticipation && now - lastParticipation < oneDay) {
      return NextResponse.json(
        { error: 'You have already participated recently' },
        { status: 429 }
      );
    }

    // Update IP tracking
    ipAddresses.set(ip, now);

    // Increment counter
    counter++;

    // Trigger Pusher event to update all clients
    await pusher.trigger('ldr-counter', 'counter-updated', {
      count: counter,
    });

    return NextResponse.json({ success: true, count: counter });
  } catch (error) {
    console.error('Error in counter API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

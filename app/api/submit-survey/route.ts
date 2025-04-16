import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';
import crypto from 'crypto';

// In-memory storage for submissions (replace with a database in production)
interface StorySurvey {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
  approved: boolean;
}

// Define the question types
type QuestionId =
  | 'meaning'
  | 'memorable'
  | 'challenges'
  | 'connection'
  | 'advice';

const stories: StorySurvey[] = [];

// Track IPs to prevent multiple submissions
const submissionIPs = new Set<string>();

// Counter for demo purposes (in production, use a database)
let counter = 0;

function generateId(): string {
  return crypto.randomBytes(16).toString('hex');
}

export async function POST(req: NextRequest) {
  try {
    // Get client IP address for verification
    const ipAddress =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // Check if this IP has already submitted a response recently
    // Allow resubmission after 24 hours
    if (submissionIPs.has(ipAddress)) {
      return NextResponse.json(
        { error: 'You have already submitted a response recently' },
        { status: 429 }
      );
    }

    // Get submission data
    const data = await req.json();

    // Verify CAPTCHA token with Google's API in production
    // For demo purposes, we'll skip this step, but in production:
    // const captchaVerified = await verifyCaptcha(data.captchaToken)
    const captchaVerified = true;

    if (!captchaVerified) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Add IP to the set to prevent multiple submissions
    submissionIPs.add(ipAddress);

    // Set a timeout to remove the IP after 24 hours
    setTimeout(() => {
      submissionIPs.delete(ipAddress);
    }, 24 * 60 * 60 * 1000);

    // Increment counter
    counter++;

    // Initialize Pusher
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: true,
    });

    // Trigger counter update event
    await pusher.trigger('ldr-counter', 'counter-updated', {
      count: counter,
    });

    // Process the story submission if opted in
    if (data.shareStory && data.selectedQuestion) {
      const questionId = data.selectedQuestion as QuestionId;
      const questionMap: Record<QuestionId, string> = {
        meaning: 'What does being in a long-distance relationship mean to you?',
        memorable: 'Can you share a memorable moment from your relationship?',
        challenges:
          'What challenges do you face in maintaining your relationship?',
        connection: 'How do you stay connected despite the distance?',
        advice:
          'What advice would you give to others in long-distance relationships?',
      };

      const storyData: StorySurvey = {
        id: generateId(),
        question: questionMap[questionId] || '',
        answer: data.answers[questionId],
        timestamp: new Date().toISOString(),
        approved: true, // Auto-approve for demo, would be false in production
      };

      // Add to stories collection
      stories.push(storyData);

      // Trigger an event to update story feed in real-time
      if (stories.length <= 6) {
        // Only trigger real-time updates for the first 6 stories
        await pusher.trigger('ldr-stories', 'story-added', {
          stories: stories.filter((s) => s.approved),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing survey submission:', error);
    return NextResponse.json(
      { error: 'Failed to process survey submission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return approved stories for display on the stories page
  const approvedStories = stories.filter((story) => story.approved);
  return NextResponse.json({ stories: approvedStories });
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

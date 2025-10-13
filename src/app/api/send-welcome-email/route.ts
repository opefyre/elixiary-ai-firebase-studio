import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  try {
    const { email, displayName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await sendWelcomeEmail(email, displayName);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Welcome email API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


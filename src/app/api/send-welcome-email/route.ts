import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/brevo';
import { verifyFirebaseToken } from '@/lib/firebase-auth-verify';
import type { DecodedIdToken } from 'firebase-admin/auth';

type AuthSuccess =
  | { type: 'firebase'; user: DecodedIdToken; rateLimitKey: string }
  | { type: 'secret'; rateLimitKey: string };

type AuthResult =
  | { success: true; value: AuthSuccess }
  | { success: false; response: NextResponse };

type RateLimitEntry = { count: number; windowStart: number };

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, RateLimitEntry>();

export async function POST(request: NextRequest) {
  try {
    const { email, displayName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const auth = authResult.value;
    if (auth.type === 'firebase') {
      const userEmail = auth.user.email?.toLowerCase();
      if (!userEmail) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      if (userEmail !== email.toLowerCase()) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
    }

    const rateLimitKey = buildRateLimitKey(request, auth);
    const rateLimitCheck = applyRateLimit(rateLimitKey);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        {
          status: 429,
          headers: rateLimitCheck.retryAfter
            ? { 'Retry-After': rateLimitCheck.retryAfter.toString() }
            : undefined,
        }
      );
    }

    const result = await sendWelcomeEmail(email, displayName);

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Failed to send welcome email' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('Welcome email API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export function __resetRateLimitStateForTests() {
  rateLimitStore.clear();
}

function buildRateLimitKey(request: NextRequest, auth: AuthSuccess) {
  const ipAddress =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown';

  return `${auth.rateLimitKey}|ip:${ipAddress}`;
}

function applyRateLimit(key: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || now - existing.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterMs = existing.windowStart + RATE_LIMIT_WINDOW_MS - now;
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);

  return { allowed: true };
}

async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  const serviceSecret = process.env.SEND_WELCOME_EMAIL_SECRET;
  const providedSecret =
    request.headers.get('x-service-secret') ||
    request.headers.get('x-internal-service-key');

  if (serviceSecret && providedSecret && providedSecret === serviceSecret) {
    return {
      success: true,
      value: { type: 'secret', rateLimitKey: `secret:${serviceSecret}` },
    };
  }

  try {
    const authorization = request.headers.get('authorization');
    const fallbackToken = request.headers.get('x-firebase-id-token');
    const verification = await verifyFirebaseToken(authorization, {
      fallbackToken,
    });

    if (!verification.user) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ),
      };
    }

    return {
      success: true,
      value: {
        type: 'firebase',
        user: verification.user,
        rateLimitKey: `uid:${verification.user.uid}`,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    };
  }
}


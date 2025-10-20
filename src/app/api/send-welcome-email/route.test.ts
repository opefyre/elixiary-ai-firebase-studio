import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST, __resetRateLimitStateForTests } from './route';
import { verifyFirebaseToken } from '@/lib/firebase-auth-verify';
import { sendWelcomeEmail } from '@/lib/brevo';

vi.mock('@/lib/firebase-auth-verify', () => ({
  verifyFirebaseToken: vi.fn(),
}));

vi.mock('@/lib/brevo', () => ({
  sendWelcomeEmail: vi.fn(),
}));

describe('send welcome email API route', () => {
  const verifyFirebaseTokenMock = vi.mocked(verifyFirebaseToken);
  const sendWelcomeEmailMock = vi.mocked(sendWelcomeEmail);

  beforeEach(() => {
    vi.clearAllMocks();
    __resetRateLimitStateForTests();
    delete process.env.SEND_WELCOME_EMAIL_SECRET;
  });

  afterEach(() => {
    __resetRateLimitStateForTests();
  });

  it('sends a welcome email when authenticated user matches the payload email', async () => {
    verifyFirebaseTokenMock.mockResolvedValue({
      user: { uid: 'uid-123', email: 'user@example.com' } as any,
      error: null,
    });
    sendWelcomeEmailMock.mockResolvedValue({ success: true } as any);

    const headers = new Headers({ authorization: 'Bearer valid-token' });
    const request = {
      headers,
      ip: '127.0.0.1',
      json: async () => ({ email: 'user@example.com', displayName: 'User' }),
    } as any;

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(sendWelcomeEmailMock).toHaveBeenCalledWith('user@example.com', 'User');
  });

  it('returns 401 when authentication fails', async () => {
    verifyFirebaseTokenMock.mockResolvedValue({ user: null, error: 'Invalid token' });

    const request = {
      headers: new Headers(),
      ip: '127.0.0.1',
      json: async () => ({ email: 'user@example.com', displayName: 'User' }),
    } as any;

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
    expect(sendWelcomeEmailMock).not.toHaveBeenCalled();
  });

  it('returns 403 when authenticated user email does not match request payload', async () => {
    verifyFirebaseTokenMock.mockResolvedValue({
      user: { uid: 'uid-123', email: 'other@example.com' } as any,
      error: null,
    });

    const request = {
      headers: new Headers({ authorization: 'Bearer valid-token' }),
      ip: '127.0.0.1',
      json: async () => ({ email: 'user@example.com', displayName: 'User' }),
    } as any;

    const response = await POST(request);

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'Forbidden' });
    expect(sendWelcomeEmailMock).not.toHaveBeenCalled();
  });

  it('enforces a per-user rate limit', async () => {
    verifyFirebaseTokenMock.mockResolvedValue({
      user: { uid: 'uid-123', email: 'user@example.com' } as any,
      error: null,
    });
    sendWelcomeEmailMock.mockResolvedValue({ success: true } as any);

    const makeRequest = () => ({
      headers: new Headers({ authorization: 'Bearer valid-token' }),
      ip: '127.0.0.1',
      json: async () => ({ email: 'user@example.com', displayName: 'User' }),
    }) as any;

    for (let i = 0; i < 5; i += 1) {
      const response = await POST(makeRequest());
      expect(response.status).toBe(200);
    }

    const limitedResponse = await POST(makeRequest());

    expect(limitedResponse.status).toBe(429);
    expect(await limitedResponse.json()).toEqual({ error: 'Too Many Requests' });
    expect(sendWelcomeEmailMock).toHaveBeenCalledTimes(5);
  });
});

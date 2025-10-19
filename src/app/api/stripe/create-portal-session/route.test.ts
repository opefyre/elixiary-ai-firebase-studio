import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';
import { verifyFirebaseToken, getUserByUid } from '@/lib/firebase-auth-verify';
import Stripe from 'stripe';

const mockCreate = vi.fn();

vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      billingPortal: {
        sessions: {
          create: mockCreate,
        },
      },
    })),
  };
});

vi.mock('@/lib/firebase-auth-verify', () => ({
  verifyFirebaseToken: vi.fn(),
  getUserByUid: vi.fn(),
}));

describe('create portal session route', () => {
  const verifyFirebaseTokenMock = vi.mocked(verifyFirebaseToken);
  const getUserByUidMock = vi.mocked(getUserByUid);
  const StripeMock = Stripe as unknown as vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'sk_test';
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
  });

  afterEach(() => {
    delete process.env.INTERNAL_SERVICE_KEY;
  });

  it('returns 401 when authentication fails', async () => {
    verifyFirebaseTokenMock.mockResolvedValue({ user: null, error: 'Invalid token' });

    const headers = new Headers();
    const request = {
      json: async () => ({ customerId: 'cus_123' }),
      headers,
      cookies: { get: () => undefined },
    } as any;

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ error: 'Unauthorized' });
    expect(verifyFirebaseTokenMock).toHaveBeenCalledWith(null, { fallbackToken: null });
  });

  it('returns 403 when customerId does not match Firestore record', async () => {
    verifyFirebaseTokenMock.mockResolvedValue({ user: { uid: 'user_123' } as any, error: null });
    getUserByUidMock.mockResolvedValue({ stripeCustomerId: 'cus_999' } as any);

    const headers = new Headers({ authorization: 'Bearer valid-token' });
    const request = {
      json: async () => ({ customerId: 'cus_123' }),
      headers,
      cookies: { get: () => undefined },
    } as any;

    const response = await POST(request);

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ error: 'Forbidden' });
  });

  it('creates a portal session when authentication and customer match', async () => {
    verifyFirebaseTokenMock.mockResolvedValue({ user: { uid: 'user_123' } as any, error: null });
    getUserByUidMock.mockResolvedValue({ stripeCustomerId: 'cus_123' } as any);
    mockCreate.mockResolvedValue({ id: 'bps_123', url: 'https://stripe.test' });

    const headers = new Headers({ authorization: 'Bearer valid-token' });
    const request = {
      json: async () => ({ customerId: 'cus_123' }),
      headers,
      cookies: { get: () => undefined },
    } as any;

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: 'https://stripe.test' });
    expect(mockCreate).toHaveBeenCalledWith({
      customer: 'cus_123',
      return_url: 'https://example.com/account',
    });
    expect(StripeMock).toHaveBeenCalledWith('sk_test', { apiVersion: '2024-12-18.acacia' });
  });

  it('requires userId when using an internal service key', async () => {
    process.env.INTERNAL_SERVICE_KEY = 'super-secret';
    const headers = new Headers({ 'x-internal-service-key': 'super-secret' });
    const request = {
      json: async () => ({ customerId: 'cus_123' }),
      headers,
      cookies: { get: () => undefined },
    } as any;

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: expect.stringContaining('userId') });
    expect(verifyFirebaseTokenMock).not.toHaveBeenCalled();
  });

  it('authenticates using the firebase id token header when authorization is stripped', async () => {
    verifyFirebaseTokenMock.mockResolvedValue({ user: { uid: 'user_123' } as any, error: null });
    getUserByUidMock.mockResolvedValue({ stripeCustomerId: 'cus_123' } as any);
    mockCreate.mockResolvedValue({ id: 'bps_123', url: 'https://stripe.test' });

    const headers = new Headers({ 'x-firebase-id-token': 'token-from-header' });
    const request = {
      json: async () => ({ customerId: 'cus_123' }),
      headers,
      cookies: { get: () => undefined },
    } as any;

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: 'https://stripe.test' });
    expect(verifyFirebaseTokenMock).toHaveBeenCalledWith(null, {
      fallbackToken: 'token-from-header',
    });
  });
});

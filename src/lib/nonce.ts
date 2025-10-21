import { headers } from 'next/headers';

/**
 * Get the nonce from the response headers set by middleware
 */
export async function getNonce(): Promise<string> {
  const headersList = await headers();
  const nonce = headersList.get('X-Nonce');
  
  if (!nonce) {
    throw new Error('Nonce not found in headers. Make sure middleware is properly configured.');
  }
  
  return nonce;
}

/**
 * Get the nonce synchronously (for client components that need it)
 * This should only be used when the nonce is guaranteed to be available
 */
export function getNonceSync(): string {
  if (typeof window !== 'undefined') {
    // On client side, we need to get the nonce from a meta tag or data attribute
    const nonceMeta = document.querySelector('meta[name="nonce"]');
    return nonceMeta?.getAttribute('content') || '';
  }
  
  throw new Error('getNonceSync can only be used on the client side');
}

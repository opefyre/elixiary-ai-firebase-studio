import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a unique nonce for this request using Web Crypto API (Edge Runtime compatible)
  const nonce = crypto.getRandomValues(new Uint8Array(16)).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  
  // Create response with the nonce
  const response = NextResponse.next();
  
  // Set the nonce in response headers so it can be used in the app
  response.headers.set('X-Nonce', nonce);
  
  // Set CSP header with the actual nonce value
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://apis.google.com`,
           `style-src 'self' 'nonce-${nonce}' 'unsafe-hashes' 'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk=' 'sha256-1OjyRYLAOH1vhXLUN4bBHal0rWxuwBDBP220NNc0CNU=' 'sha256-nzTgYzXYDNe6BAHiiI7NNlfK8n/auuOAhh2t92YvuXo=' 'sha256-441zG27rExd4/il+NvIqyL8zFx5XmyNQtE381kSkUJk=' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https://lh3.googleusercontent.com https://images.unsplash.com https://picsum.photos https://placehold.co https://drive.google.com https://www.googletagmanager.com https://www.google-analytics.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.googleapis.com https://*.google.com https://*.firebase.com https://*.firebaseapp.com https://*.stripe.com https://api.stripe.com https://checkout.stripe.com wss://*.firebase.com https://www.google-analytics.com https://*.google-analytics.com https://accounts.google.com",
    "frame-src https://accounts.google.com https://*.firebaseapp.com https://*.firebase.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

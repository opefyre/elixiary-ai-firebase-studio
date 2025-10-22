'use client';

import { User } from 'firebase/auth';

interface TokenRefreshOptions {
  maxRetries?: number;
  retryDelay?: number;
}

interface TokenRefreshResult {
  token: string | null;
  error: string | null;
  refreshed: boolean;
}

/**
 * Firebase Token Manager
 * Handles Firebase ID token refresh with proper error handling and retry logic
 */
export class FirebaseTokenManager {
  private static instance: FirebaseTokenManager;
  private refreshPromises = new Map<string, Promise<TokenRefreshResult>>();

  private constructor() {}

  static getInstance(): FirebaseTokenManager {
    if (!FirebaseTokenManager.instance) {
      FirebaseTokenManager.instance = new FirebaseTokenManager();
    }
    return FirebaseTokenManager.instance;
  }

  /**
   * Get a valid Firebase ID token, refreshing if necessary
   */
  async getValidToken(
    user: User,
    options: TokenRefreshOptions = {}
  ): Promise<TokenRefreshResult> {
    const { maxRetries = 2, retryDelay = 1000 } = options;
    const userId = user.uid;

    // Check if we already have a refresh in progress for this user
    if (this.refreshPromises.has(userId)) {
      return this.refreshPromises.get(userId)!;
    }

    const refreshPromise = this.performTokenRefresh(user, maxRetries, retryDelay);
    this.refreshPromises.set(userId, refreshPromise);

    try {
      const result = await refreshPromise;
      return result;
    } finally {
      // Clean up the promise after completion
      this.refreshPromises.delete(userId);
    }
  }

  private async performTokenRefresh(
    user: User,
    maxRetries: number,
    retryDelay: number
  ): Promise<TokenRefreshResult> {
    let lastError: string | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // First try to get the cached token
        const token = await user.getIdToken(false);
        
        // Verify the token is still valid by checking its expiration
        if (this.isTokenValid(token)) {
          return { token, error: null, refreshed: false };
        }

        // If cached token is expired, force refresh
        const refreshedToken = await user.getIdToken(true);
        return { token: refreshedToken, error: null, refreshed: true };

      } catch (error: any) {
        lastError = error.message || 'Failed to get token';
        
        // If this is not the last attempt, wait before retrying
        if (attempt < maxRetries) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    return { token: null, error: lastError, refreshed: false };
  }

  /**
   * Check if a token is valid by parsing its expiration time
   */
  private isTokenValid(token: string): boolean {
    try {
      // Parse the JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      
      // Consider token invalid if it expires within the next 5 minutes
      return payload.exp > (now + 300);
    } catch {
      return false;
    }
  }

  /**
   * Utility function to delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make an authenticated fetch request with automatic token refresh
   */
  async authenticatedFetch(
    user: User,
    url: string,
    options: RequestInit = {},
    tokenOptions: TokenRefreshOptions = {}
  ): Promise<Response> {
    const { token, error } = await this.getValidToken(user, tokenOptions);

    if (!token) {
      throw new Error(error || 'Failed to get authentication token');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If we get a 401, try refreshing the token once more
    if (response.status === 401) {
      const { token: refreshedToken, error: refreshError } = await this.getValidToken(user, {
        ...tokenOptions,
        maxRetries: 1, // Only one retry for 401 responses
      });

      if (refreshedToken && refreshedToken !== token) {
        // Retry the request with the new token
        const retryHeaders = {
          ...options.headers,
          'Authorization': `Bearer ${refreshedToken}`,
        };

        return fetch(url, {
          ...options,
          headers: retryHeaders,
        });
      }
    }

    return response;
  }
}

// Export singleton instance
export const tokenManager = FirebaseTokenManager.getInstance();

// Export convenience function
export async function getValidFirebaseToken(
  user: User,
  options?: TokenRefreshOptions
): Promise<TokenRefreshResult> {
  return tokenManager.getValidToken(user, options);
}

// Export convenience function for authenticated fetch
export async function authenticatedFetch(
  user: User,
  url: string,
  options?: RequestInit,
  tokenOptions?: TokenRefreshOptions
): Promise<Response> {
  return tokenManager.authenticatedFetch(user, url, options, tokenOptions);
}

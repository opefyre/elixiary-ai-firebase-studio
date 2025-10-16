import { initializeFirebaseServer } from '@/firebase/server';
import { APIKey, RATE_LIMITS, SECURITY_LIMITS } from '@/types/api';
import { randomBytes } from 'crypto';

export class APIKeyManager {
  private adminDb: any;

  constructor() {
    const { adminDb } = initializeFirebaseServer();
    this.adminDb = adminDb;
  }

  /**
   * Generate a new API key
   */
  generateAPIKey(): string {
    const randomPart = randomBytes(16).toString('hex');
    return `elx_live_${randomPart}`;
  }

  /**
   * Create a new API key for a Pro user
   */
  async createAPIKey(
    userId: string,
    email: string,
    name: string
  ): Promise<APIKey> {
    // Check if user is Pro
    const userDoc = await this.adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    if (userData.subscriptionTier !== 'pro') {
      throw new Error('API access requires Pro subscription');
    }

    // Check API key limit
    const existingKeys = await this.adminDb
      .collection('api_keys')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .get();

    if (existingKeys.size >= SECURITY_LIMITS.maxApiKeysPerUser) {
      throw new Error('Maximum API keys limit reached');
    }

    // Generate new API key
    const apiKey = this.generateAPIKey();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year

    const keyData: APIKey = {
      id: apiKey,
      userId,
      email,
      name,
      tier: 'pro',
      status: 'active',
      permissions: {
        recipes: true,
        userData: true,
        rateLimit: RATE_LIMITS.pro.requestsPerHour,
        dailyLimit: RATE_LIMITS.pro.requestsPerDay,
        monthlyLimit: RATE_LIMITS.pro.requestsPerMonth
      },
      usage: {
        requestsToday: 0,
        requestsThisMonth: 0,
        lastUsed: now,
        totalRequests: 0
      },
      createdAt: now,
      expiresAt,
      lastRotated: now
    };

    // Save to database
    await this.adminDb.collection('api_keys').doc(apiKey).set(keyData);

    return keyData;
  }

  /**
   * Validate an API key
   */
  async validateAPIKey(apiKey: string, email: string): Promise<APIKey> {
    const keyDoc = await this.adminDb.collection('api_keys').doc(apiKey).get();
    
    if (!keyDoc.exists) {
      throw new Error('Invalid API key');
    }

    const keyData = keyDoc.data() as APIKey;

    // Check if key is active
    if (keyData.status !== 'active') {
      throw new Error('API key is not active');
    }

    // Check if key is expired
    const expiresAt = keyData.expiresAt instanceof Date ? keyData.expiresAt : keyData.expiresAt.toDate();
    if (new Date() > expiresAt) {
      throw new Error('API key has expired');
    }

    // Verify email matches
    if (keyData.email !== email) {
      throw new Error('Email does not match API key');
    }

    // Check if user is still Pro
    const userDoc = await this.adminDb.collection('users').doc(keyData.userId).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    if (userData.subscriptionTier !== 'pro') {
      throw new Error('Pro subscription required');
    }

    return keyData;
  }

  /**
   * Get user's API keys
   */
  async getUserAPIKeys(userId: string): Promise<APIKey[]> {
    // For now, get all keys and filter client-side to avoid index requirement
    const keysSnapshot = await this.adminDb
      .collection('api_keys')
      .where('userId', '==', userId)
      .get();

    const keys = keysSnapshot.docs.map(doc => doc.data() as APIKey);
    
    // Sort by createdAt on the client side
    return keys.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }

  /**
   * Revoke an API key
   */
  async revokeAPIKey(apiKey: string, userId: string): Promise<void> {
    const keyDoc = await this.adminDb.collection('api_keys').doc(apiKey).get();
    
    if (!keyDoc.exists) {
      throw new Error('API key not found');
    }

    const keyData = keyDoc.data() as APIKey;
    if (keyData.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await this.adminDb.collection('api_keys').doc(apiKey).update({
      status: 'revoked',
      updatedAt: new Date()
    });
  }

  /**
   * Rotate an API key
   */
  async rotateAPIKey(oldApiKey: string, userId: string): Promise<string> {
    const keyDoc = await this.adminDb.collection('api_keys').doc(oldApiKey).get();
    
    if (!keyDoc.exists) {
      throw new Error('API key not found');
    }

    const keyData = keyDoc.data() as APIKey;
    if (keyData.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Generate new API key
    const newApiKey = this.generateAPIKey();
    const now = new Date();

    // Create new key
    const newKeyData: APIKey = {
      ...keyData,
      id: newApiKey,
      lastRotated: now,
      usage: {
        ...keyData.usage,
        requestsToday: 0,
        requestsThisMonth: 0
      }
    };

    // Save new key and revoke old one
    await this.adminDb.collection('api_keys').doc(newApiKey).set(newKeyData);
    await this.adminDb.collection('api_keys').doc(oldApiKey).update({
      status: 'revoked',
      updatedAt: now
    });

    return newApiKey;
  }

  /**
   * Update usage counters
   */
  async updateUsage(apiKey: string): Promise<void> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const keyDoc = await this.adminDb.collection('api_keys').doc(apiKey).get();
    if (!keyDoc.exists) return;

    const keyData = keyDoc.data() as APIKey;
    const lastUsed = keyData.usage.lastUsed instanceof Date ? keyData.usage.lastUsed : keyData.usage.lastUsed.toDate();
    const lastUsedToday = new Date(lastUsed.getFullYear(), lastUsed.getMonth(), lastUsed.getDate());
    const lastUsedMonth = new Date(lastUsed.getFullYear(), lastUsed.getMonth(), 1);

    // Reset daily counter if new day
    const requestsToday = lastUsedToday.getTime() === today.getTime() 
      ? keyData.usage.requestsToday + 1 
      : 1;

    // Reset monthly counter if new month
    const requestsThisMonth = lastUsedMonth.getTime() === monthStart.getTime()
      ? keyData.usage.requestsThisMonth + 1
      : 1;

    await this.adminDb.collection('api_keys').doc(apiKey).update({
      'usage.requestsToday': requestsToday,
      'usage.requestsThisMonth': requestsThisMonth,
      'usage.lastUsed': now,
      'usage.totalRequests': keyData.usage.totalRequests + 1
    });
  }
}

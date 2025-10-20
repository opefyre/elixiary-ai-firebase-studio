import { initializeFirebaseServer } from '@/firebase/server';
import { APIKey, RATE_LIMITS, SECURITY_LIMITS } from '@/types/api';
import { CryptoUtils } from './crypto-utils';
import { randomBytes } from 'crypto';

export class APIKeyManager {
  private adminDb: any;

  constructor() {
    const { adminDb } = initializeFirebaseServer();
    this.adminDb = adminDb;
  }

  /**
   * Generate a new API key with enhanced entropy
   */
  generateAPIKey(): string {
    // Use 32 bytes for better entropy (256 bits)
    const randomPart = randomBytes(32).toString('hex');
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

    // Validate secret key at runtime before using it
    CryptoUtils.validateSecretKey();
    
    // Generate secure document ID based on key content
    const keyId = CryptoUtils.generateAPIKeyId(apiKey);
    
    // Hash the API key for secure storage
    const keyHash = CryptoUtils.hashAPIKey(apiKey);

    const keyData: APIKey = {
      id: keyId, // Use hashed ID as document ID
      userId,
      email,
      name,
      tier: 'pro',
      status: 'active',
      keyHash: keyHash, // Store hashed version
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

    // Save to database using hashed ID
    await this.adminDb.collection('api_keys').doc(keyId).set(keyData);

    // Return key data with the original API key (only returned once)
    return {
      ...keyData,
      id: apiKey, // Return original API key to user
      keyHash: undefined // Don't return hash to user
    };
  }

  /**
   * Validate an API key using secure hash verification
   */
  async validateAPIKey(apiKey: string, email: string): Promise<APIKey> {
    // Validate secret key at runtime before using it
    CryptoUtils.validateSecretKey();
    
    // Generate the key ID from the API key to find the document
    const keyId = CryptoUtils.generateAPIKeyId(apiKey);
    const keyDoc = await this.adminDb.collection('api_keys').doc(keyId).get();
    
    if (!keyDoc.exists) {
      throw new Error('Invalid API key');
    }

    const keyData = keyDoc.data() as APIKey;

    // Verify the API key hash matches (constant time comparison)
    if (!keyData.keyHash || !CryptoUtils.verifyAPIKey(apiKey, keyData.keyHash)) {
      throw new Error('Invalid API key');
    }

    // Check if key is active
    if (keyData.status !== 'active') {
      throw new Error('API key is not active');
    }

    // Check if key is expired
    const expiresAt = keyData.expiresAt instanceof Date ? 
      keyData.expiresAt : 
      (keyData.expiresAt && typeof keyData.expiresAt.toDate === 'function' ? 
        keyData.expiresAt.toDate() : 
        new Date(keyData.expiresAt));
    const now = new Date();
    if (now > expiresAt) {
      throw new Error('API key has expired');
    }

    // Check if key expires within 30 days and log warning
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (expiresAt <= thirtyDaysFromNow) {
      // Log expiration warning for monitoring
      try {
        const { AuditLogger } = await import('./audit-logger');
        const auditLogger = new AuditLogger();
        const requestId = AuditLogger.generateRequestId();
        
        await auditLogger.logSecurityEvent(
          requestId,
          'authentication_failed', // Reusing for security monitoring
          {
            endpoint: 'api-key-validation',
            method: 'AUTH',
            ipAddress: 'system',
            userAgent: 'api-key-validator'
          },
          {
            userId: keyData.userId,
            errorMessage: 'API key expiring soon',
            metadata: {
              keyId: keyData.id,
              expiresAt: expiresAt.toISOString(),
              daysUntilExpiry: Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
            }
          }
        );
      } catch (error) {
        // Don't fail validation if logging fails
        console.warn('Failed to log API key expiration warning:', error);
      }
    }

    // Verify email matches (case-insensitive, sanitized)
    const sanitizedEmail = email.toLowerCase().trim();
    if (keyData.email.toLowerCase().trim() !== sanitizedEmail) {
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

    // Return key data without the hash for security
    return {
      ...keyData,
      keyHash: undefined // Don't return hash
    };
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

    const keys = keysSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt),
        usage: {
          ...data.usage,
          lastUsed: data.usage?.lastUsed?.toDate ? data.usage.lastUsed.toDate() : (data.usage?.lastUsed ? new Date(data.usage.lastUsed) : null)
        }
      } as APIKey;
    });
    
    // Sort by createdAt on the client side
    return keys.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }

  /**
   * Revoke an API key (actually delete it)
   */
  async revokeAPIKey(apiKey: string, userId: string): Promise<void> {
    const keyId = CryptoUtils.generateAPIKeyId(apiKey);
    const keyDoc = await this.adminDb.collection('api_keys').doc(keyId).get();
    
    if (!keyDoc.exists) {
      throw new Error('API key not found');
    }

    const keyData = keyDoc.data() as APIKey;
    
    // Verify the API key hash matches before allowing revocation
    if (!keyData.keyHash || !CryptoUtils.verifyAPIKey(apiKey, keyData.keyHash)) {
      throw new Error('Invalid API key');
    }
    
    if (keyData.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Actually delete the API key document
    await this.adminDb.collection('api_keys').doc(keyId).delete();
  }

  /**
   * Rotate an API key by keyId (for API endpoint)
   */
  async rotateAPIKeyById(keyId: string, userId: string): Promise<string> {
    const keyDoc = await this.adminDb.collection('api_keys').doc(keyId).get();
    
    if (!keyDoc.exists) {
      throw new Error('API key not found');
    }

    const keyData = keyDoc.data() as APIKey;
    
    if (keyData.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (keyData.status !== 'active') {
      throw new Error('Cannot rotate inactive API key');
    }

    // Validate secret key at runtime before using it
    CryptoUtils.validateSecretKey();

    // Generate new API key
    const newApiKey = this.generateAPIKey();
    const newKeyId = CryptoUtils.generateAPIKeyId(newApiKey);
    const newKeyHash = CryptoUtils.hashAPIKey(newApiKey);
    const now = new Date();

    // Create new key with same data but new ID and hash
    const newKeyData: APIKey = {
      ...keyData,
      id: newKeyId,
      keyHash: newKeyHash,
      lastRotated: now,
      usage: {
        requestsToday: 0,
        requestsThisMonth: 0,
        totalRequests: 0,
        lastUsed: now
      },
      createdAt: now
    };

    // Save new key and revoke old one
    await this.adminDb.collection('api_keys').doc(newKeyId).set(newKeyData);
    await this.adminDb.collection('api_keys').doc(keyId).update({
      status: 'revoked',
      updatedAt: now,
      revokedAt: now
    });

    return newApiKey;
  }

  /**
   * Rotate an API key by actual key string
   */
  async rotateAPIKey(oldApiKey: string, userId: string): Promise<string> {
    const oldKeyId = CryptoUtils.generateAPIKeyId(oldApiKey);
    const keyDoc = await this.adminDb.collection('api_keys').doc(oldKeyId).get();
    
    if (!keyDoc.exists) {
      throw new Error('API key not found');
    }

    const keyData = keyDoc.data() as APIKey;
    
    // Verify the API key hash matches before allowing rotation
    if (!keyData.keyHash || !CryptoUtils.verifyAPIKey(oldApiKey, keyData.keyHash)) {
      throw new Error('Invalid API key');
    }
    
    if (keyData.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Generate new API key
    const newApiKey = this.generateAPIKey();
    const newKeyId = CryptoUtils.generateAPIKeyId(newApiKey);
    const newKeyHash = CryptoUtils.hashAPIKey(newApiKey);
    const now = new Date();

    // Create new key
    const newKeyData: APIKey = {
      ...keyData,
      id: newKeyId,
      keyHash: newKeyHash,
      lastRotated: now,
      usage: {
        ...keyData.usage,
        requestsToday: 0,
        requestsThisMonth: 0
      }
    };

    // Save new key and revoke old one
    await this.adminDb.collection('api_keys').doc(newKeyId).set(newKeyData);
    await this.adminDb.collection('api_keys').doc(oldKeyId).update({
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

    const keyId = CryptoUtils.generateAPIKeyId(apiKey);
    const keyDoc = await this.adminDb.collection('api_keys').doc(keyId).get();
    if (!keyDoc.exists) return;

    const keyData = keyDoc.data() as APIKey;
    const lastUsed = keyData.usage.lastUsed instanceof Date ? 
      keyData.usage.lastUsed : 
      (keyData.usage.lastUsed && typeof keyData.usage.lastUsed.toDate === 'function' ? 
        keyData.usage.lastUsed.toDate() : 
        new Date(keyData.usage.lastUsed));
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

    // Check for usage anomalies
    await this.checkUsageAnomalies(keyData, requestsToday, requestsThisMonth, now);

    await this.adminDb.collection('api_keys').doc(keyId).update({
      'usage.requestsToday': requestsToday,
      'usage.requestsThisMonth': requestsThisMonth,
      'usage.lastUsed': now,
      'usage.totalRequests': keyData.usage.totalRequests + 1
    });
  }

  /**
   * Check for usage anomalies and log security events
   */
  private async checkUsageAnomalies(
    keyData: APIKey, 
    requestsToday: number, 
    requestsThisMonth: number, 
    now: Date
  ): Promise<void> {
    try {
      const { AuditLogger } = await import('./audit-logger');
      const auditLogger = new AuditLogger();
      const requestId = AuditLogger.generateRequestId();

      // Check for unusual daily usage patterns
      const dailyLimit = keyData.permissions.dailyLimit || 1000;
      if (requestsToday > dailyLimit * 0.8) { // More than 80% of daily limit
        await auditLogger.logSecurityEvent(
          requestId,
          'authentication_failed', // Reusing for security monitoring
          {
            endpoint: 'api-usage-monitoring',
            method: 'USAGE_CHECK',
            ipAddress: 'system',
            userAgent: 'usage-anomaly-detector'
          },
          {
            userId: keyData.userId,
            errorMessage: 'High daily API usage detected',
            metadata: {
              keyId: keyData.id,
              requestsToday,
              dailyLimit,
              percentageUsed: Math.round((requestsToday / dailyLimit) * 100)
            }
          }
        );
      }

      // Check for unusual monthly usage patterns
      const monthlyLimit = keyData.permissions.monthlyLimit || 10000;
      if (requestsThisMonth > monthlyLimit * 0.9) { // More than 90% of monthly limit
        await auditLogger.logSecurityEvent(
          requestId,
          'authentication_failed',
          {
            endpoint: 'api-usage-monitoring',
            method: 'USAGE_CHECK',
            ipAddress: 'system',
            userAgent: 'usage-anomaly-detector'
          },
          {
            userId: keyData.userId,
            errorMessage: 'High monthly API usage detected',
            metadata: {
              keyId: keyData.id,
              requestsThisMonth,
              monthlyLimit,
              percentageUsed: Math.round((requestsThisMonth / monthlyLimit) * 100)
            }
          }
        );
      }

      // Check for unusually rapid usage (more than 50 requests in last 5 minutes)
      const lastUsed = keyData.usage.lastUsed instanceof Date ? keyData.usage.lastUsed : new Date(keyData.usage.lastUsed);
      const timeDiff = now.getTime() - lastUsed.getTime();
      
      if (timeDiff < 5 * 60 * 1000 && requestsToday > 50) { // Less than 5 minutes and high daily count
        await auditLogger.logSecurityEvent(
          requestId,
          'authentication_failed',
          {
            endpoint: 'api-usage-monitoring',
            method: 'USAGE_CHECK',
            ipAddress: 'system',
            userAgent: 'usage-anomaly-detector'
          },
          {
            userId: keyData.userId,
            errorMessage: 'Unusually rapid API usage detected',
            metadata: {
              keyId: keyData.id,
              requestsToday,
              timeSinceLastRequest: Math.round(timeDiff / 1000),
              potentialAbuse: true
            }
          }
        );
      }

    } catch (error) {
      // Don't fail if anomaly detection fails
      console.warn('Failed to check usage anomalies:', error);
    }
  }
}

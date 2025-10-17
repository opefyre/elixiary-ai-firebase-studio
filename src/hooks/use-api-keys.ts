'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/firebase';

interface APIKey {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'revoked';
  createdAt: string;
  expiresAt: string;
  lastUsed: string;
  usage: {
    requestsToday: number;
    requestsThisMonth: number;
    totalRequests: number;
  };
}

interface UseAPIKeysResult {
  apiKeys: APIKey[];
  loading: boolean;
  error: string | null;
  createKey: (name: string) => Promise<APIKey | null>;
  deleteKey: (keyId: string) => Promise<boolean>;
  rotateKey: (keyId: string) => Promise<string | null>;
  refreshKeys: () => Promise<void>;
}

export function useAPIKeys(): UseAPIKeysResult {
  const { user } = useUser();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAPIKeys = useCallback(async () => {
    if (!user) {
      setApiKeys([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/api-keys?userId=${user.uid}`);
      const data = await response.json();

      if (response.ok) {
        setApiKeys(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch API keys');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createKey = useCallback(async (name: string): Promise<APIKey | null> => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, action: 'create', data: { name } }),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchAPIKeys(); // Refresh the list
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create API key');
      }
    } catch (err: any) {
      console.error('Error creating API key:', err);
      throw err;
    }
  }, [user, fetchAPIKeys]);

  const deleteKey = useCallback(async (keyId: string): Promise<boolean> => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, action: 'delete', data: { keyId } }),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchAPIKeys(); // Refresh the list
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete API key');
      }
    } catch (err: any) {
      console.error('Error deleting API key:', err);
      throw err;
    }
  }, [user, fetchAPIKeys]);

  const rotateKey = useCallback(async (keyId: string): Promise<string | null> => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, action: 'rotate', data: { keyId } }),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchAPIKeys(); // Refresh the list
        return result.data.newApiKey;
      } else {
        throw new Error(result.error || 'Failed to rotate API key');
      }
    } catch (err: any) {
      console.error('Error rotating API key:', err);
      throw err;
    }
  }, [user, fetchAPIKeys]);

  const refreshKeys = useCallback(async () => {
    await fetchAPIKeys();
  }, [fetchAPIKeys]);

  useEffect(() => {
    fetchAPIKeys();
  }, [fetchAPIKeys]);

  return {
    apiKeys,
    loading,
    error,
    createKey,
    deleteKey,
    rotateKey,
    refreshKeys,
  };
}

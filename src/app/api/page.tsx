'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
import { useAPIKeys } from '@/hooks/use-api-keys';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { APIKeyManager } from '@/components/api-key-manager';
import { Loader2, Key, ExternalLink, BarChart3, Clock, Zap, Shield, Code, BookOpen, Globe } from 'lucide-react';
import Link from 'next/link';

interface APIUsageStats {
  requestsToday: number;
  requestsThisMonth: number;
  totalRequests: number;
  remainingToday: number;
  remainingThisMonth: number;
}

export default function APIPage() {
  const { user, isUserLoading } = useFirebase();
  const { apiKeys, loading: apiKeysLoading } = useAPIKeys();
  const [usageStats, setUsageStats] = useState<APIUsageStats | null>(null);

  useEffect(() => {
    if (apiKeys.length > 0) {
      // Calculate usage stats from the first API key
      const firstKey = apiKeys[0];
      setUsageStats({
        requestsToday: firstKey.usage?.requestsToday || 0,
        requestsThisMonth: firstKey.usage?.requestsThisMonth || 0,
        totalRequests: firstKey.usage?.totalRequests || 0,
        remainingToday: Math.max(0, 1000 - (firstKey.usage?.requestsToday || 0)),
        remainingThisMonth: Math.max(0, 10000 - (firstKey.usage?.requestsThisMonth || 0))
      });
    } else {
      setUsageStats({
        requestsToday: 0,
        requestsThisMonth: 0,
        totalRequests: 0,
        remainingToday: 1000,
        remainingThisMonth: 10000
      });
    }
  }, [apiKeys]);

  if (isUserLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative text-6xl">🔑</div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground text-center mb-6">
              Please sign in to access the API management.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.subscriptionTier !== 'pro') {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative text-6xl">⭐</div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Pro Subscription Required</h2>
            <p className="text-muted-foreground text-center mb-6">
              API access is available for Pro users only. Upgrade to access our comprehensive API.
            </p>
            <Button asChild>
              <Link href="/pricing">Upgrade to Pro</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pt-20 md:py-12 md:pt-24">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold md:text-4xl mb-4">
          🔑 API Management
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your API keys, monitor usage, and access comprehensive documentation for integrating with Elixiary AI.
        </p>
      </div>

      {/* API Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Today's Requests</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {apiKeysLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                usageStats?.requestsToday || 0
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {usageStats ? `${usageStats.remainingToday} remaining` : 'Loading...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {apiKeysLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                usageStats?.requestsThisMonth || 0
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {usageStats ? `${usageStats.remainingThisMonth} remaining` : 'Loading...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Requests</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {apiKeysLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                usageStats?.totalRequests || 0
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Rate Limits</span>
            </div>
            <p className="text-sm font-bold mt-2">100/hour</p>
            <p className="text-xs text-muted-foreground mt-1">1K/day • 10K/month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Key Management */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <APIKeyManager />
            </CardContent>
          </Card>
        </div>

        {/* API Documentation & Resources */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Access comprehensive API documentation with examples, endpoints, and integration guides.
              </p>
              <Button asChild className="w-full">
                <Link href="/api/docs" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Open API Documentation
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Create API Key</p>
                    <p className="text-xs text-muted-foreground">Generate your first API key above</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Add Headers</p>
                    <p className="text-xs text-muted-foreground">Include x-api-key and x-user-email in requests</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Start Building</p>
                    <p className="text-xs text-muted-foreground">Use our endpoints to access cocktail recipes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                API Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Base URL</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">https://ai.elixiary.com/api/v1</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Authentication</span>
                  <Badge variant="secondary">API Key + Email</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Format</span>
                  <Badge variant="secondary">JSON</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Support Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-sm">Contact us at </span>
            <a href="mailto:hello@elixiary.com" className="text-primary hover:underline">
              hello@elixiary.com
            </a>
            <span className="text-sm text-muted-foreground">for API support</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

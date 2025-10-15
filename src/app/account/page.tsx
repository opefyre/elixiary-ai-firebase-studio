'use client';

import { useUser, useSubscription } from '@/firebase';
import { useDailyUsage } from '@/hooks/use-daily-usage';
import { Loader2, Crown, Sparkles, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UsageChart } from '@/components/usage-chart';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState, useMemo } from 'react';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const { 
    subscription, 
    isLoading: isSubLoading, 
    isPro,
    limits,
    remainingGenerations,
    nextResetDate,
  } = useSubscription();
  const { toast } = useToast();
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const { data: dailyUsageData, loading: isUsageLoading } = useDailyUsage(7);

  const handleManageBilling = async () => {
    if (!subscription?.stripeCustomerId) {
      toast({
        title: 'Error',
        description: 'No billing information found.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingPortal(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: subscription.stripeCustomerId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to create portal session');
      }

      window.location.href = data.url;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to open billing portal. Please try again.',
        variant: 'destructive',
      });
      setIsLoadingPortal(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (isUserLoading || isSubLoading || isUsageLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  const generationPercentage = isPro 
    ? 100 
    : subscription 
      ? Math.min(100, (subscription.recipesGeneratedThisMonth / limits.generationsPerMonth) * 100)
      : 0;

  const savePercentage = isPro
    ? 100
    : subscription
      ? Math.min(100, (subscription.recipeCount / limits.maxSavedRecipes) * 100)
      : 0;

  // Use real daily usage data
  const dailyGenerationData = dailyUsageData?.usageData.map(day => ({
    date: day.date,
    count: day.recipesGenerated
  })) || [];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 pt-20 md:py-12 md:pt-24">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isPro ? (
            <span className="flex items-center gap-2">
              <Crown className="h-7 w-7 text-yellow-500 fill-current" />
              Pro Account
            </span>
          ) : (
            'My Account'
          )}
        </h1>
        <p className="text-muted-foreground">
          {isPro 
            ? `Enjoying unlimited access ${subscription?.isEarlyBird ? `• Early Bird Member #${subscription.earlyBirdNumber}` : ''}`
            : 'Track your usage and manage your subscription'
          }
        </p>
      </div>

      {/* Usage Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Recipe Generations Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recipe Generations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold">
                  {isPro ? '∞' : remainingGenerations}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isPro ? 'Unlimited' : `of ${limits.generationsPerMonth} this month`}
                </p>
              </div>
              
              {!isPro && (
                <>
                  <Progress value={generationPercentage} className="h-2" />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Resets {formatDate(nextResetDate)}
                  </div>
                </>
              )}

              {isPro && (
                <div className="text-sm text-muted-foreground">
                  {subscription?.totalRecipesGenerated || 0} total generated
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Saved Recipes Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Saved Recipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold">
                  {subscription?.recipeCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isPro ? 'recipes saved' : `of ${limits.maxSavedRecipes} maximum`}
                </p>
              </div>
              
              {!isPro && (
                <Progress value={savePercentage} className="h-2" />
              )}

              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/recipes">
                  View Collection
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Generation Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Generation Activity</CardTitle>
            <CardDescription>Recipes generated this week</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageChart
              data={dailyGenerationData}
              maxValue={limits.generationsPerMonth / 4} // 1/4 of monthly limit as reasonable daily max
              label="Recipes generated per day"
              color="#8b5cf6"
            />
          </CardContent>
        </Card>

        {/* Saved Recipes Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Saved Activity</CardTitle>
            <CardDescription>Recipes saved this week</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageChart
              data={dailyUsageData?.usageData.map(day => ({
                date: day.date,
                count: day.recipesSaved
              })) || []}
              maxValue={limits.maxSavedRecipes / 4} // 1/4 of monthly limit as reasonable daily max
              label="Recipes saved per day"
              color="#10b981"
            />
          </CardContent>
        </Card>
      </div>

      {/* Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isPro ? (
              <>
                <Crown className="h-5 w-5 text-yellow-500" />
                Pro Subscription
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-primary" />
                Free Plan
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isPro 
              ? 'Manage your subscription and billing'
              : 'Upgrade to unlock unlimited access'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPro && subscription && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="default" className="capitalize">
                  {subscription.subscriptionStatus}
                </Badge>
              </div>
              {subscription.currentPeriodEnd && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next Renewal</span>
                  <span className="font-medium">
                    {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
              )}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleManageBilling}
                disabled={isLoadingPortal}
              >
                {isLoadingPortal ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Manage Billing'
                )}
              </Button>
            </>
          )}

          {!isPro && (
            <>
              <p className="text-sm text-muted-foreground">
                Get unlimited recipe generations, unlimited saves, PDF export, and advanced customization.
              </p>
              <Button size="lg" className="w-full" asChild>
                <Link href="/pricing">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

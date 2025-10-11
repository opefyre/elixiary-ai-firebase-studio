'use client';

import { useUser, useSubscription } from '@/firebase';
import { Loader2, Crown, Calendar, TrendingUp, BookOpen, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const { 
    subscription, 
    isLoading: isSubLoading, 
    isPro,
    limits,
    remainingGenerations,
    remainingSaves,
    nextResetDate,
  } = useSubscription();
  const { toast } = useToast();
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

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

      if (!response.ok) throw new Error('Failed to create portal session');

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open billing portal. Please try again.',
        variant: 'destructive',
      });
      setIsLoadingPortal(false);
    }
  };

  if (isUserLoading || isSubLoading) {
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
      ? (subscription.recipesGeneratedThisMonth / limits.generationsPerMonth) * 100
      : 0;

  const savesPercentage = isPro
    ? 100
    : subscription
      ? (subscription.recipeCount / limits.maxSavedRecipes) * 100
      : 0;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pt-24 md:py-12 md:pt-28">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold md:text-4xl">
              Account Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage your subscription and view usage statistics
            </p>
          </div>
          {isPro && (
            <Badge variant="default" className="gap-1 px-3 py-1.5 text-sm">
              <Crown className="h-4 w-4 fill-current" />
              Pro Member
            </Badge>
          )}
        </div>
      </div>

      {/* Subscription Tier Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isPro ? (
                  <>
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Pro Plan
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-primary" />
                    Free Plan
                  </>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {isPro 
                  ? 'Unlimited access to all features'
                  : 'Limited features with monthly reset'
                }
              </CardDescription>
            </div>
            {!isPro && (
              <Button size="lg" asChild>
                <Link href="/pricing">
                  Upgrade to Pro
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Recipe Generation</p>
              <p className="text-2xl font-bold">
                {isPro ? '∞' : limits.generationsPerMonth}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Saved Recipes</p>
              <p className="text-2xl font-bold">
                {isPro ? '∞' : limits.maxSavedRecipes}
              </p>
              <p className="text-xs text-muted-foreground">maximum</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pro Features</p>
              <p className="text-2xl font-bold">
                {isPro ? '✓' : '✗'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isPro ? 'All unlocked' : 'Upgrade to access'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recipe Generations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Recipe Generations
            </CardTitle>
            <CardDescription>
              {isPro ? 'Unlimited generations' : 'Resets monthly on the 1st'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {isPro ? 'Generated this month' : 'Used this month'}
                </span>
                <span className="text-sm font-medium">
                  {subscription?.recipesGeneratedThisMonth || 0}
                  {!isPro && ` / ${limits.generationsPerMonth}`}
                </span>
              </div>
              {!isPro && (
                <Progress value={generationPercentage} className="h-2" />
              )}
            </div>
            
            {!isPro && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Next Reset</span>
                </div>
                <p className="text-muted-foreground">
                  {formatDate(nextResetDate)}
                </p>
              </div>
            )}

            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Total generated: {subscription?.totalRecipesGenerated || 0} recipes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Saved Recipes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5" />
              Saved Recipes
            </CardTitle>
            <CardDescription>
              {isPro ? 'Unlimited storage' : 'Maximum 20 recipes'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Current collection
                </span>
                <span className="text-sm font-medium">
                  {subscription?.recipeCount || 0}
                  {!isPro && ` / ${limits.maxSavedRecipes}`}
                </span>
              </div>
              {!isPro && (
                <Progress value={savesPercentage} className="h-2" />
              )}
            </div>

            {!isPro && subscription && subscription.recipeCount >= limits.maxSavedRecipes && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <p className="font-medium">Storage limit reached</p>
                <p className="text-xs mt-1">
                  Delete recipes or upgrade to Pro for unlimited storage
                </p>
              </div>
            )}

            <div className="pt-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/recipes">
                  View My Recipes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade CTA for Free Users */}
      {!isPro && (
        <Card className="mt-6 border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Unlock Unlimited Access
            </CardTitle>
            <CardDescription>
              Upgrade to Pro and get unlimited everything
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Unlimited recipe generations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Unlimited saved recipes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>AI-generated cocktail images</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>PDF export with beautiful formatting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Advanced customization options</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Priority support</span>
                </div>
              </div>
              
              <Button size="lg" className="w-full" asChild>
                <Link href="/pricing">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Pro - Starting at $1.49/month
                </Link>
              </Button>
              
              <p className="text-center text-xs text-muted-foreground">
                🔥 Limited offer: 70% off for first 50 users
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pro User - Billing Management */}
      {isPro && subscription && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Billing & Subscription</CardTitle>
            <CardDescription>
              Manage your subscription and payment methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="default">{subscription.subscriptionStatus}</Badge>
              </div>
              {subscription.isEarlyBird && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Early Bird</span>
                  <Badge variant="secondary">Member #{subscription.earlyBirdNumber}</Badge>
                </div>
              )}
              {subscription.currentPeriodEnd && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Renews on</span>
                  <span className="font-medium">
                    {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
              )}
            </div>

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
          </CardContent>
        </Card>
      )}

      {/* Account Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          {subscription?.createdAt && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-medium">
                {formatDate(subscription.createdAt)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


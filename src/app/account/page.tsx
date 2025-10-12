'use client';

import { useUser, useSubscription } from '@/firebase';
import { Loader2, Crown, Sparkles, ArrowRight } from 'lucide-react';
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

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pt-24 md:py-12 md:pt-28">
      {/* Subscription Tier Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                {isPro ? (
                  <>
                    <Crown className="h-6 w-6 text-yellow-500 fill-current" />
                    Pro Member
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6 text-primary" />
                    Free Plan
                  </>
                )}
              </CardTitle>
              <CardDescription className="mt-2">
                {isPro 
                  ? `Enjoying unlimited access ${subscription?.isEarlyBird ? `• Early Bird #${subscription.earlyBirdNumber}` : ''}`
                  : 'Upgrade to unlock unlimited features'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        {!isPro && (
          <CardContent>
            <div className="space-y-4">
              {/* Generation Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Recipe Generations</span>
                  <span className="text-sm font-medium">
                    {remainingGenerations} / {limits.generationsPerMonth} left
                  </span>
                </div>
                <Progress value={generationPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Resets on {formatDate(nextResetDate)}
                </p>
              </div>

              {/* Save Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Saved Recipes</span>
                  <span className="text-sm font-medium">
                    {subscription?.recipeCount || 0} / {limits.maxSavedRecipes}
                  </span>
                </div>
                <Progress 
                  value={subscription ? (subscription.recipeCount / limits.maxSavedRecipes) * 100 : 0} 
                  className="h-2" 
                />
              </div>

              {/* Upgrade CTA */}
              <Button size="lg" className="w-full mt-4" asChild>
                <Link href="/pricing" className="gap-2">
                  <Crown className="h-4 w-4" />
                  Upgrade to Pro
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>
              </Button>
            </div>
          </CardContent>
        )}

        {isPro && subscription && (
          <CardContent>
            <div className="space-y-4">
              {/* Subscription Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Status</p>
                  <Badge variant="default" className="capitalize">
                    {subscription.subscriptionStatus}
                  </Badge>
                </div>
                {subscription.currentPeriodEnd && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Renews</p>
                    <p className="font-medium">
                      {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                )}
              </div>

              {/* Manage Billing */}
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
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

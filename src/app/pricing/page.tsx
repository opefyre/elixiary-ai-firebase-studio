'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUser, useSubscription } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Loader2, Sparkles, Zap, ArrowRight, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';

function PricingContent() {
  const { user, isUserLoading } = useUser();
  const { isPro, subscription } = useSubscription();
  const { auth } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  // Check for success/cancel params
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Welcome to Pro! 🎉",
        description: "Your subscription is now active. Enjoy unlimited access!",
      });
      router.replace('/account');
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        title: "Checkout Canceled",
        description: "You can upgrade to Pro anytime from this page.",
        variant: "default",
      });
      router.replace('/pricing');
    }
  }, [searchParams, router, toast]);


  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (isPro) {
      toast({
        title: "You're Already Pro!",
        description: "You have an active Pro subscription.",
      });
      return;
    }

    setIsLoadingCheckout(true);

    try {
      // Call API to create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: selectedPlan,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (data.error || !response.ok) {
        throw new Error(data.message || data.error || 'Checkout failed');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      // Handle checkout error without exposing details
      toast({
        title: "Checkout Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoadingCheckout(false);
    }
  };

  const handleManageBilling = async () => {
    if (!subscription?.stripeCustomerId) {
      toast({
        title: 'No Subscription Found',
        description: 'Please upgrade to Pro first to manage billing.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingPortal(true);
    try {
      if (!auth.currentUser) {
        throw new Error('You must be signed in to manage billing.');
      }

      const token = await auth.currentUser.getIdToken();
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customerId: subscription.stripeCustomerId }),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to open billing portal');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to open billing portal',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleSwitchPlan = async (newPlanType: 'monthly' | 'annual') => {
    if (!user || !subscription?.stripeCustomerId) {
      toast({
        title: 'Error',
        description: 'Unable to switch plan. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (currentPlanType === newPlanType) {
      toast({
        title: 'Same Plan',
        description: `You're already on the ${newPlanType} plan.`,
        variant: 'default',
      });
      return;
    }

    setIsLoadingCheckout(true);
    try {
      // Create a checkout session for plan change
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: newPlanType,
          userId: user.uid,
          userEmail: user.email,
          isPlanChange: true, // Flag to indicate this is a plan change
        }),
      });

      const data = await response.json();

      if (data.error || !response.ok) {
        throw new Error(data.message || data.error || 'Plan switch failed');
      }

      // Redirect to Stripe Checkout for plan change
      window.location.href = data.url;
    } catch (error: any) {
      // Handle plan switch error without exposing details
      toast({
        title: "Plan Switch Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoadingCheckout(false);
    }
  };

  // Determine current plan type
  const getCurrentPlanType = () => {
    if (!subscription?.stripePriceId) return null;
    
    // Check if it's monthly or annual based on price ID
    if (subscription.stripePriceId.includes('monthly') || subscription.stripePriceId.includes('month')) {
      return 'monthly';
    }
    if (subscription.stripePriceId.includes('annual') || subscription.stripePriceId.includes('year')) {
      return 'annual';
    }
    return null;
  };

  const currentPlanType = getCurrentPlanType();

  if (isUserLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Calculate pricing
  const getPricing = () => {
    return {
      monthly: { price: 2.49, original: null, period: 'month' },
      annual: { price: 23.88, original: null, period: 'year' }
    };
  };

  const pricing = getPricing();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pt-24 md:py-12 md:pt-28">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-headline text-3xl font-bold md:text-4xl mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Start free, upgrade when you're ready.
        </p>
      </div>


      {/* Pricing Cards */}
      <div className={`grid gap-6 max-w-3xl mx-auto ${isPro ? 'md:grid-cols-1' : 'md:grid-cols-2'}`}>
        {/* Free Plan - Only show for non-Pro users */}
        {!isPro && (
          <Card className="relative">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-muted rounded-lg">
                  <Sparkles className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>Perfect for trying out</CardDescription>
              <div className="mt-4">
                <div className="text-3xl font-bold">$0</div>
                <p className="text-sm text-muted-foreground">forever</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>10 AI recipes per month</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Save up to 20 recipes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Browse curated recipes</span>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => !user && router.push('/login')}
              >
                {user ? 'Current Plan' : 'Get Started Free'}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Pro Plan */}
        <Card className="relative border-primary shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="gap-1 px-3 py-1 text-xs">
              <Crown className="h-3 w-3" />
              Most Popular
            </Badge>
          </div>
          
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Crown className="h-5 w-5 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">Pro</CardTitle>
            <CardDescription>For cocktail enthusiasts</CardDescription>

            {/* Plan Toggle - Only show if not Pro or if Pro user wants to change plan */}
            {!isPro && (
              <div className="mt-4">
                <div className="flex bg-muted rounded-lg p-1 mb-4">
                  <button
                    onClick={() => setSelectedPlan('monthly')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
                      selectedPlan === 'monthly'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedPlan('annual')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
                      selectedPlan === 'annual'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Annual
                  </button>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-3xl font-bold">
                      ${pricing[selectedPlan].price}
                    </span>
                    {pricing[selectedPlan].original && (
                      <span className="text-sm line-through text-muted-foreground">
                        ${pricing[selectedPlan].original}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    per {pricing[selectedPlan].period}
                  </p>
                  {selectedPlan === 'annual' && (
                    <p className="text-xs text-primary mt-1">
                      Save 20% vs monthly • Billed once per year
                    </p>
                  )}
                  {selectedPlan === 'annual' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Equals $1.99 per month
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Current Plan Display for Pro Users */}
            {isPro && currentPlanType && (
              <div className="mt-4">
                <div className="bg-primary/10 rounded-lg p-3 mb-4 text-center">
                  <p className="text-sm font-medium text-primary">
                    Current Plan: {currentPlanType === 'monthly' ? 'Monthly' : 'Annual'} Pro
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Next billing: {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentPlanType === 'monthly' ? 'Billed monthly' : 'Billed annually'}
                  </p>
                </div>
                
                {/* Plan Switching Options */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-center mb-3">Switch Plan:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={currentPlanType === 'monthly' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSwitchPlan('monthly')}
                      disabled={isLoadingCheckout || currentPlanType === 'monthly'}
                    >
                      {isLoadingCheckout && currentPlanType !== 'monthly' ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : null}
                      Monthly
                      {currentPlanType === 'monthly' && ' ✓'}
                    </Button>
                    <Button
                      variant={currentPlanType === 'annual' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSwitchPlan('annual')}
                      disabled={isLoadingCheckout || currentPlanType === 'annual'}
                    >
                      {isLoadingCheckout && currentPlanType !== 'annual' ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : null}
                      Annual
                      {currentPlanType === 'annual' && ' ✓'}
                    </Button>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Changes take effect on next billing cycle
                  </p>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="font-medium">Unlimited AI recipes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="font-medium">Unlimited saved recipes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Smart shopping lists</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>PDF export & sharing</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Gamified achievements</span>
            </div>
          </CardContent>
          
          <CardFooter>
            {isPro ? (
              <div className="w-full space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleManageBilling}
                    disabled={isLoadingPortal}
                    className="text-xs"
                  >
                    {isLoadingPortal ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Crown className="h-3 w-3 mr-1" />
                    )}
                    Billing
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/account')}
                    className="text-xs"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Account
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Use buttons above to switch plans or manage billing
                </p>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={isLoadingCheckout}
              >
                {isLoadingCheckout ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-2" />
                )}
                Upgrade to Pro
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Trust Signals */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Secure payment via Stripe • Cancel anytime • No hidden fees
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-6xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}


'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUser, useSubscription } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Loader2, Sparkles, Zap, ArrowRight, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';

function PricingContent() {
  const { user, isUserLoading } = useUser();
  const { isPro } = useSubscription();
  const { firestore } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [earlyBirdSpotsLeft, setEarlyBirdSpotsLeft] = useState<number>(50);
  const [isEarlyBirdActive, setIsEarlyBirdActive] = useState(true);

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

  // Fetch early bird status
  useEffect(() => {
    async function fetchEarlyBirdStatus() {
      if (!firestore) return;
      
      const configRef = doc(firestore, 'config', 'earlyBird');
      const configSnap = await getDoc(configRef);
      
      if (configSnap.exists()) {
        const data = configSnap.data();
        const count = data.count || 0;
        setEarlyBirdSpotsLeft(Math.max(0, 50 - count));
        setIsEarlyBirdActive(data.isActive && count < 50);
      }
    }
    
    fetchEarlyBirdStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchEarlyBirdStatus, 30000);
    return () => clearInterval(interval);
  }, [firestore]);

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
          isEarlyBird: isEarlyBirdActive,
        }),
      });

      const data = await response.json();

      if (data.error || !response.ok) {
        throw new Error(data.message || data.error || 'Checkout failed');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoadingCheckout(false);
    }
  };

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
    if (isEarlyBirdActive) {
      return {
        monthly: { price: 1.49, original: 4.99, period: 'month' },
        annual: { price: 14.99, original: 49.99, period: 'year' }
      };
    }
    return {
      monthly: { price: 4.99, original: null, period: 'month' },
      annual: { price: 49, original: null, period: 'year' }
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

      {/* Early Bird Banner */}
      {isEarlyBirdActive && (
        <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-semibold">Early Bird Special</span>
          </div>
          <p className="text-sm text-muted-foreground">
            70% OFF for the first 50 members • Only <strong>{earlyBirdSpotsLeft} spots</strong> left
          </p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free Plan */}
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
              disabled={isPro}
              onClick={() => !user && router.push('/login')}
            >
              {user ? (isPro ? 'Current Plan' : 'Current Plan') : 'Get Started Free'}
            </Button>
          </CardFooter>
        </Card>

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

            {/* Plan Toggle */}
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
                {isEarlyBirdActive && (
                  <p className="text-xs text-primary mt-1">
                    {selectedPlan === 'monthly' ? 'First 3 months, then $4.99/mo' : 'First year, then $49/year'}
                  </p>
                )}
              </div>
            </div>
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
            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={isLoadingCheckout || isPro}
            >
              {isLoadingCheckout ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isPro ? 'Current Plan' : `Upgrade to Pro`}
            </Button>
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


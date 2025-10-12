'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUser, useSubscription } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Loader2, Sparkles, Zap } from 'lucide-react';
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
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
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

  const handleCheckout = async (priceType: 'monthly' | 'annual') => {
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
    setSelectedPrice(priceType);

    try {
      // Call API to create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: priceType, // 'monthly' or 'annual'
          userId: user.uid,
          userEmail: user.email,
          isEarlyBird: isEarlyBirdActive,
        }),
      });

      const data = await response.json();

      if (data.error || !response.ok) {
        // Show the specific error message from the server
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
      setSelectedPrice(null);
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

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pt-24 md:py-12 md:pt-28">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold md:text-5xl mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free, upgrade when you're ready. No credit card required for free tier.
        </p>
      </div>

      {/* Early Bird Banner */}
      {isEarlyBirdActive && (
        <div className="mb-8 rounded-lg border border-primary/50 bg-gradient-to-r from-primary/10 to-yellow-500/10 p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold text-lg">Limited Time Offer!</span>
          </div>
          <p className="text-sm text-muted-foreground">
            🔥 70% OFF for the first 50 Pro members • Only <strong>{earlyBirdSpotsLeft} spots</strong> remaining
          </p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Free
                </CardTitle>
                <CardDescription className="mt-2">
                  Perfect for trying out Elixiary
                </CardDescription>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-bold">$0</div>
              <p className="text-sm text-muted-foreground">forever</p>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>10 recipe generations per month</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Save up to 20 recipes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Search & filter recipes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Tags & collections</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Share & copy recipes</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="outline"
              disabled={isPro}
              onClick={() => !user && router.push('/login')}
            >
              {user ? (isPro ? 'Current: Pro Plan' : 'Current Plan') : 'Get Started Free'}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="relative border-primary shadow-lg shadow-primary/20">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="gap-1 px-3 py-1 text-sm">
              <Crown className="h-3.5 w-3.5 fill-current" />
              Most Popular
            </Badge>
          </div>
          
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  Pro
                </CardTitle>
                <CardDescription className="mt-2">
                  For serious mixologists
                </CardDescription>
              </div>
            </div>
            
            {/* Pricing Toggle */}
            <div className="mt-6 space-y-4">
              {/* Monthly */}
              <div className="rounded-lg border border-border p-4 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Monthly</p>
                    <div className="flex items-center gap-2 mt-1">
                      {isEarlyBirdActive ? (
                        <>
                          <span className="text-3xl font-bold">$1.49</span>
                          <span className="text-sm line-through text-muted-foreground">$4.99</span>
                          <Badge variant="secondary" className="text-xs">70% OFF</Badge>
                        </>
                      ) : (
                        <span className="text-3xl font-bold">$4.99</span>
                      )}
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                    {isEarlyBirdActive && (
                      <p className="text-xs text-muted-foreground mt-1">
                        First 3 months, then $4.99/mo
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCheckout('monthly')}
                    disabled={isLoadingCheckout || isPro}
                  >
                    {isLoadingCheckout && selectedPrice === 'monthly' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Select'
                    )}
                  </Button>
                </div>
              </div>

              {/* Annual */}
              <div className="rounded-lg border border-primary p-4 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Annual</p>
                      <Badge variant="default" className="text-xs">Best Value</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {isEarlyBirdActive ? (
                        <>
                          <span className="text-3xl font-bold">$14.99</span>
                          <span className="text-sm line-through text-muted-foreground">$49.99</span>
                          <Badge variant="secondary" className="text-xs">70% OFF</Badge>
                        </>
                      ) : (
                        <span className="text-3xl font-bold">$49</span>
                      )}
                      <span className="text-sm text-muted-foreground">/year</span>
                    </div>
                    {isEarlyBirdActive && (
                      <p className="text-xs text-muted-foreground mt-1">
                        First year, then $49/year
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCheckout('annual')}
                    disabled={isLoadingCheckout || isPro}
                  >
                    {isLoadingCheckout && selectedPrice === 'annual' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Select'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm font-semibold mb-3">Everything in Free, plus:</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Unlimited recipe generations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="font-medium">Unlimited saved recipes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Smart shopping list generator</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>PDF export with beautiful formatting</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Advanced customization options</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Recipe visuals & theming</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Trust Signals */}
      <div className="mt-16 text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          ✅ Secure payment via Stripe • 🔒 Cancel anytime • 💳 No hidden fees
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


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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-7xl px-4 py-16 pt-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Start free, upgrade when you're ready. No hidden fees, no surprises.
          </p>
        </div>

        {/* Early Bird Banner */}
        {isEarlyBirdActive && (
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-6 w-6 text-amber-500" />
                <span className="text-lg font-semibold text-amber-900 dark:text-amber-100">Early Bird Special</span>
              </div>
              <p className="text-amber-800 dark:text-amber-200">
                70% OFF for the first 50 members • Only <strong>{earlyBirdSpotsLeft} spots</strong> left
              </p>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Free Plan */}
          <Card className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Sparkles className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Free</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Perfect for getting started
                  </CardDescription>
                </div>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-bold text-slate-900 dark:text-slate-100">$0</div>
                <p className="text-slate-600 dark:text-slate-400">forever</p>
              </div>
            </CardHeader>
            
            <CardContent className="pb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">10 AI recipes per month</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">Save up to 20 recipes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">Browse 500+ curated recipes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">Search & filter tools</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full h-12 text-base font-medium"
                variant="outline"
                disabled={isPro}
                onClick={() => !user && router.push('/login')}
              >
                {user ? (isPro ? 'Current Plan' : 'Current Plan') : 'Get Started Free'}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="relative overflow-hidden border-2 border-primary shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground">
                <Crown className="h-4 w-4" />
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="pb-6 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    For serious cocktail enthusiasts
                  </CardDescription>
                </div>
              </div>

              {/* Plan Toggle */}
              <div className="mb-6">
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-4">
                  <button
                    onClick={() => setSelectedPlan('monthly')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      selectedPlan === 'monthly'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedPlan('annual')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      selectedPlan === 'annual'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    Annual
                    <Badge variant="secondary" className="ml-2 text-xs">Save 17%</Badge>
                  </button>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-slate-900 dark:text-slate-100">
                      ${pricing[selectedPlan].price}
                    </span>
                    {pricing[selectedPlan].original && (
                      <span className="text-xl line-through text-slate-500 dark:text-slate-400">
                        ${pricing[selectedPlan].original}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    per {pricing[selectedPlan].period}
                    {isEarlyBirdActive && (
                      <span className="block text-sm text-amber-600 dark:text-amber-400 mt-1">
                        {selectedPlan === 'monthly' ? 'First 3 months, then $4.99/mo' : 'First year, then $49/year'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium text-slate-900 dark:text-slate-100">Unlimited AI recipes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium text-slate-900 dark:text-slate-100">Unlimited saved recipes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">Smart shopping lists</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">PDF export & sharing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">Advanced customization</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">Gamified achievements</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">Priority support</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full h-12 text-base font-medium"
                onClick={handleCheckout}
                disabled={isLoadingCheckout || isPro}
              >
                {isLoadingCheckout ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="h-5 w-5 mr-2" />
                )}
                {isPro ? 'Current Plan' : `Upgrade to Pro - $${pricing[selectedPlan].price}/${pricing[selectedPlan].period}`}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Trust Signals */}
        <div className="text-center space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure payment via Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No hidden fees</span>
            </div>
          </div>
          
          <div className="text-sm text-slate-500 dark:text-slate-500">
            Join thousands of cocktail enthusiasts who trust Elixiary
          </div>
        </div>
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


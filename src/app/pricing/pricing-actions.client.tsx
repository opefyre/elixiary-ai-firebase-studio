'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight, Crown, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useSubscription, useUser } from '@/firebase';
import { AppClientProviders } from '@/components/providers/app-client-providers';

type PlanType = 'monthly' | 'annual';

type PricingOption = {
  price: number;
  original: number | null;
  period: string;
};

type PricingMap = Record<PlanType, PricingOption>;

type ProPlanActionsProps = {
  pricing: PricingMap;
};

function FreePlanActionContent() {
  const { user, isUserLoading } = useUser();
  const { isPro } = useSubscription();
  const router = useRouter();

  if (isUserLoading) {
    return (
      <Button variant="outline" className="w-full" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking status...
      </Button>
    );
  }

  if (isPro) {
    return (
      <div className="w-full text-center text-xs text-muted-foreground">
        Included with your Pro membership.
      </div>
    );
  }

  if (user) {
    return (
      <Button variant="outline" className="w-full" disabled>
        Current Plan
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => router.push('/login')}
    >
      Get Started Free
    </Button>
  );
}

function ProPlanActionsContent({ pricing }: ProPlanActionsProps) {
  const { user, isUserLoading } = useUser();
  const { isPro, subscription } = useSubscription();
  const { auth } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Welcome to Pro! 🎉",
        description: "Your subscription is now active. Enjoy unlimited access!",
      });
      router.replace('/account');
    } else if (searchParams.get('canceled') === 'true') {
      toast({
        title: 'Checkout Canceled',
        description: "You can upgrade to Pro anytime from this page.",
        variant: 'default',
      });
      router.replace('/pricing');
    }
  }, [router, searchParams, toast]);

  const currentPlanType = useMemo(() => {
    if (!subscription?.stripePriceId) return null;

    if (subscription.stripePriceId.includes('monthly') || subscription.stripePriceId.includes('month')) {
      return 'monthly';
    }

    if (subscription.stripePriceId.includes('annual') || subscription.stripePriceId.includes('year')) {
      return 'annual';
    }

    return null;
  }, [subscription?.stripePriceId]);

  const handleCheckout = async () => {
    if (!user || !auth) {
      router.push('/login');
      return;
    }

    if (isPro) {
      toast({
        title: "You're Already Pro!",
        description: 'You have an active Pro subscription.',
      });
      return;
    }

    setIsLoadingCheckout(true);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planType: selectedPlan }),
      });

      const data = await response.json();

      if (data.error || !response.ok) {
        throw new Error(data.message || data.error || 'Checkout failed');
      }

      window.location.href = data.url;
    } catch (error: any) {
      toast({
        title: 'Checkout Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
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
      if (!auth?.currentUser) {
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

  const handleSwitchPlan = async (newPlanType: PlanType) => {
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
      const token = await user.getIdToken();
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planType: newPlanType,
          isPlanChange: true,
        }),
      });

      const data = await response.json();

      if (data.error || !response.ok) {
        throw new Error(data.message || data.error || 'Plan switch failed');
      }

      window.location.href = data.url;
    } catch (error: any) {
      toast({
        title: 'Plan Switch Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsLoadingCheckout(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="w-full space-y-3">
        <Button className="w-full" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Checking subscription...
        </Button>
      </div>
    );
  }

  if (isPro) {
    return (
      <div className="w-full space-y-3">
        {currentPlanType && (
          <div className="bg-primary/10 rounded-lg p-3 text-center text-sm">
            <p className="font-medium text-primary">
              Current Plan: {currentPlanType === 'monthly' ? 'Monthly' : 'Annual'} Pro
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Next billing:{' '}
              {subscription?.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={handleManageBilling}
            disabled={isLoadingPortal}
            className="text-xs"
          >
            {isLoadingPortal ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Crown className="mr-1 h-3 w-3" />
            )}
            Billing
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/account')}
            className="text-xs"
          >
            <Star className="mr-1 h-3 w-3" />
            Account
          </Button>
        </div>

        {currentPlanType && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-center">Switch Plan</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={currentPlanType === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSwitchPlan('monthly')}
                disabled={isLoadingCheckout || currentPlanType === 'monthly'}
              >
                {isLoadingCheckout && currentPlanType !== 'monthly' ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
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
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : null}
                Annual
                {currentPlanType === 'annual' && ' ✓'}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Changes take effect on the next billing cycle.
            </p>
          </div>
        )}
      </div>
    );
  }

  const pricingDetails = pricing[selectedPlan];

  return (
    <div className="w-full space-y-4">
      <div className="flex bg-muted rounded-lg p-1">
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
          <span className="text-3xl font-bold">${pricingDetails.price}</span>
          {pricingDetails.original && (
            <span className="text-sm line-through text-muted-foreground">
              ${pricingDetails.original}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">per {pricingDetails.period}</p>
        {selectedPlan === 'annual' && (
          <>
            <p className="text-xs text-primary mt-1">
              Save 20% vs monthly • Billed once per year
            </p>
            <p className="text-xs text-muted-foreground mt-1">Equals $1.99 per month</p>
          </>
        )}
      </div>

      <Button
        className="w-full"
        onClick={handleCheckout}
        disabled={isLoadingCheckout || isUserLoading}
      >
        {isLoadingCheckout ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="mr-2 h-4 w-4" />
        )}
        {isUserLoading ? 'Checking subscription...' : user ? 'Upgrade to Pro' : 'Log in to upgrade'}
      </Button>

      {!user && !isUserLoading && (
        <p className="text-xs text-center text-muted-foreground">
          Sign in to unlock unlimited recipes.
        </p>
      )}
    </div>
  );
}

export function FreePlanAction() {
  return (
    <AppClientProviders>
      <FreePlanActionContent />
    </AppClientProviders>
  );
}

export function ProPlanActions({ pricing }: ProPlanActionsProps) {
  return (
    <AppClientProviders>
      <ProPlanActionsContent pricing={pricing} />
    </AppClientProviders>
  );
}

'use client';

import { useUser, useSubscription } from '@/firebase';
import { useRecipes } from '@/firebase/firestore/use-recipes';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { useBadges } from '@/hooks/use-badges';
import { 
  Loader2, 
  User, 
  Crown, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Settings, 
  LogOut,
  ExternalLink,
  TrendingUp,
  Star,
  Clock,
  CreditCard,
  Download,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BadgeStats, BadgeGrid } from '@/components/badge-display';
import { BadgeCelebration } from '@/components/badge-celebration';
import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const { firebase } = useFirebase();
  const { 
    subscription, 
    isLoading: isSubLoading, 
    isPro,
    limits,
    remainingGenerations,
    nextResetDate,
  } = useSubscription();
  const { recipes: aiRecipes } = useRecipes();
  const { savedRecipes } = useSavedRecipes();
  const { userBadges, stats, progress, loading: badgesLoading, updateBadges } = useBadges();
  const { toast } = useToast();
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);
  const [showBadgeCelebration, setShowBadgeCelebration] = useState(false);

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
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const handleSignOut = async () => {
    try {
      await signOut(firebase.auth);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === Infinity) return 0;
    return Math.min((used / limit) * 100, 100);
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
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Not Signed In</h2>
            <p className="text-muted-foreground text-center mb-6">
              Please sign in to view your account information.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const generationPercentage = getUsagePercentage(
    subscription?.recipesGeneratedThisMonth || 0,
    limits.generationsPerMonth
  );

  const savePercentage = getUsagePercentage(
    subscription?.recipeCount || 0,
    limits.maxSavedRecipes
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pt-20 md:py-12 md:pt-24">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground">
          Manage your subscription, view usage, and account settings.
        </p>
      </div>

      {/* Profile Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <h3 className="font-semibold">{user.displayName || 'User'}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant={isPro ? 'default' : 'secondary'} className="mt-1">
                {isPro ? (
                  <>
                    <Crown className="h-3 w-3 mr-1" />
                    Pro Member
                  </>
                ) : (
                  'Free Member'
                )}
              </Badge>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Member since:</span>
              <p className="font-medium">{formatDate(subscription?.createdAt)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Account status:</span>
              <p className="font-medium capitalize">
                {subscription?.subscriptionStatus || 'Active'}
              </p>
            </div>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage Overview
          </CardTitle>
          <CardDescription>
            Your current usage and limits for this month
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recipe Generations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">Recipe Generations</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {isPro ? '∞' : `${subscription?.recipesGeneratedThisMonth || 0} / ${limits.generationsPerMonth}`}
              </span>
            </div>
            {!isPro && (
              <div className="space-y-1">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${generationPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {remainingGenerations} generations remaining this month
                </p>
              </div>
            )}
          </div>

          {/* Saved Recipes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-medium">Saved Recipes</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {isPro ? '∞' : `${subscription?.recipeCount || 0} / ${limits.maxSavedRecipes}`}
              </span>
            </div>
            {!isPro && (
              <div className="space-y-1">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${savePercentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {limits.maxSavedRecipes - (subscription?.recipeCount || 0)} saves remaining
                </p>
              </div>
            )}
          </div>

          {/* Reset Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Usage resets on {formatDate(nextResetDate)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI Generated</span>
            </div>
            <p className="text-2xl font-bold mt-1">{aiRecipes.length}</p>
            <p className="text-xs text-muted-foreground">Total recipes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Favorites</span>
            </div>
            <p className="text-2xl font-bold mt-1">{savedRecipes.length}</p>
            <p className="text-xs text-muted-foreground">Curated recipes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <p className="text-2xl font-bold mt-1">{subscription?.recipesGeneratedThisMonth || 0}</p>
            <p className="text-xs text-muted-foreground">Generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPro ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pro Subscription</p>
                  <p className="text-sm text-muted-foreground">
                    Next billing: {formatDate(subscription?.currentPeriodEnd)}
                  </p>
                </div>
                <Badge variant="default">
                  <Crown className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleManageBilling}
                  disabled={isLoadingPortal}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoadingPortal ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Settings className="h-4 w-4 mr-2" />
                  )}
                  Manage Billing
                </Button>
                <Button asChild variant="outline">
                  <Link href="/pricing">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Plans
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Free Plan</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro for unlimited access
                </p>
              </div>
              
              <Button asChild className="w-full">
                <Link href="/pricing">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements Section - Only for Pro users */}
      {isPro && stats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>
              Unlock badges by generating recipes, saving favorites, and exploring new flavors!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Badge Stats */}
            <BadgeStats stats={stats} />
            
            {/* Badge Categories */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  🍸 Recipe Generation
                </h4>
                <BadgeGrid badges={progress} category="generation" />
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  ⭐ Recipe Collection
                </h4>
                <BadgeGrid badges={progress} category="collection" />
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  🏆 Special Achievements
                </h4>
                <BadgeGrid badges={progress} category="achievement" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/recipes">
                <BookOpen className="h-4 w-4 mr-2" />
                View My Recipes
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="justify-start">
              <Link href="/cocktails">
                <Star className="h-4 w-4 mr-2" />
                Browse Cocktails
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="justify-start">
              <Link href="/privacy">
                <ExternalLink className="h-4 w-4 mr-2" />
                Privacy & Terms
              </Link>
            </Button>
            
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="justify-start text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Badge Celebration Modal */}
      {showBadgeCelebration && newBadgeIds.length > 0 && (
        <BadgeCelebration
          newBadgeIds={newBadgeIds}
          onClose={() => {
            setShowBadgeCelebration(false);
            setNewBadgeIds([]);
          }}
        />
      )}
    </div>
  );
}
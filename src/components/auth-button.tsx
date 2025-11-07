'use client';

import { signOut } from 'firebase/auth';
import { useAuth, useUser, useSubscription } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogIn, LogOut, Crown, Settings, CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import './auth-button.css';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export function AuthButton() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { isPro, subscription } = useSubscription();
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

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to create portal session');
      }

      window.location.href = data.url;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to open billing portal.',
        variant: 'destructive',
      });
      setIsLoadingPortal(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      // Error signing out
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    
    // Force account selection and show consent screen
    provider.setCustomParameters({
      prompt: 'select_account consent',
      hd: '', // Don't restrict to specific domain
    });
    
    // Add scopes explicitly
    provider.addScope('email');
    provider.addScope('profile');
    
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      // Error signing in with Google
    }
  };

  if (isUserLoading) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (!user) {
    return (
      <Button asChild variant="outline">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full transition-all hover:scale-105 hover:ring-2 hover:ring-primary/20"
        >
          <Avatar className="h-10 w-10 transition-all">
            <AvatarImage
              src={user.photoURL ?? ''}
              alt={user.displayName ?? 'User'}
            />
            <AvatarFallback>
              {user.displayName?.charAt(0) ?? user.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {isPro && (
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center ring-2 ring-background animate-subtle-pulse">
              <Crown className="h-3 w-3 text-white fill-current" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{user.displayName || 'User'}</p>
              {isPro && (
                <Badge variant="default" className="gap-1 h-5">
                  <Crown className="h-3 w-3 fill-current" />
                  <span className="text-xs">Pro</span>
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/account" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>My Account</span>
          </Link>
        </DropdownMenuItem>

        {isPro && subscription?.stripeCustomerId && (
          <DropdownMenuItem onClick={handleManageBilling} disabled={isLoadingPortal}>
            {isLoadingPortal ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Manage Billing</span>
              </>
            )}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

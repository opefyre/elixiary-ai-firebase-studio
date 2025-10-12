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
import { LogIn, LogOut, Crown, Settings, CreditCard, TrendingUp } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export function AuthButton() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { isPro, remainingGenerations, subscription } = useSubscription();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
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
          <div className="flex flex-col space-y-2">
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
        
        {/* Usage Stats */}
        <div className="px-2 py-2">
          <div className="text-xs text-muted-foreground mb-2">This Month</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Recipes</span>
              <span className="font-medium">
                {isPro ? '∞' : `${remainingGenerations} left`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Saved</span>
              <span className="font-medium">
                {subscription?.recipeCount || 0}
                {!isPro && '/20'}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/account" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>

        {isPro && (
          <DropdownMenuItem asChild>
            <Link href="/pricing" className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </Link>
          </DropdownMenuItem>
        )}

        {!isPro && (
          <DropdownMenuItem asChild>
            <Link href="/pricing" className="cursor-pointer">
              <Crown className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Upgrade to Pro</span>
            </Link>
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

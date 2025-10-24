'use client';

import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { AuthButton } from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import { BookOpen, Wine, Code, GraduationCap } from "lucide-react";
import { useUser } from "@/firebase";
import { useSubscription } from "@/firebase/firestore/use-subscription";

export function Header() {
  const { user } = useUser();
  const { subscription } = useSubscription();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md mobile-navbar-fix">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Logo width={24} height={24} className="h-6 w-6" />
          <h1 className="text-lg font-bold leading-none font-headline">Elixiary</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cocktails">
              <Wine className="mr-2 h-4 w-4" />
              Cocktails
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/education">
              <GraduationCap className="mr-2 h-4 w-4" />
              Education
            </Link>
          </Button>
          {user && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/recipes">
                <BookOpen className="mr-2 h-4 w-4" />
                My Recipes
              </Link>
            </Button>
          )}
          {user && subscription?.tier === 'pro' && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/api/docs">
                <Code className="mr-2 h-4 w-4" />
                API Docs
              </Link>
            </Button>
          )}
          <AuthButton />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cocktails">
              <Wine className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/education">
              <GraduationCap className="h-4 w-4" />
            </Link>
          </Button>
          {user && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/recipes">
                <BookOpen className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {user && subscription?.tier === 'pro' && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/api/docs">
                <Code className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

'use client';

import { handleGenerateRecipe } from '@/app/actions';
import { RecipeGenerationForm } from '@/components/recipe-generation-form';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { user, isUserLoading } = useUser();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pt-24 md:py-12 md:pt-28">
      <section className="mb-12 text-center">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Craft Your Perfect Elixir
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
          Tell our AI mixologist what you're in the mood for, and it will
          invent a unique cocktail recipe just for you.
        </p>
      </section>

      <section>
        {isUserLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : user ? (
          <RecipeGenerationForm handleGenerateRecipe={handleGenerateRecipe} />
        ) : (
          <div className="text-center space-y-8 py-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative text-7xl">🍹</div>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-4">
              <h2 className="font-headline text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Let's Get Mixing! 🎯
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
                Sign in to unlock AI-powered cocktail recipes tailored to your taste. 
                No bartending experience needed.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                ⚡ Generate in seconds
              </span>
              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                💾 Save favorites
              </span>
              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                🎲 Random ideas
              </span>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Button 
                asChild 
                size="lg"
                className="rounded-full px-10 py-6 text-base font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
              >
                <Link href="/login" className="gap-2">
                  Start Creating
                  <span className="text-lg">→</span>
                </Link>
              </Button>
            </div>

            {/* Trust signal */}
            <p className="text-xs text-muted-foreground/60">
              Free account • Google sign-in • No credit card
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border/50">
        <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              By using Elixiary AI, you agree to our{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy & Terms
              </Link>
            </p>
          <p className="text-xs text-muted-foreground/60">
            © 2024 Elixiary AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

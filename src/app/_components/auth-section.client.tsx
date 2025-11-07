'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';

const RecipeGenerationForm = dynamic(
  () =>
    import('@/components/recipe-generation-form').then(
      (mod) => mod.RecipeGenerationForm
    ),
  {
    loading: () => (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
    ssr: false,
  }
);

export function AuthSection() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-8 py-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative text-7xl">🍹</div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h2 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-headline text-2xl font-bold text-transparent">
            Let's Get Mixing! 🎯
          </h2>
          <p className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground">
            Sign in to unlock AI-powered cocktail recipes tailored to your taste. No bartending experience needed.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary">
            ⚡ Generate in seconds
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary">
            💾 Save favorites
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary">
            🎲 Random ideas
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Button
            asChild
            size="lg"
            className="rounded-full px-10 py-6 text-base font-medium shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
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
    );
  }

  return <RecipeGenerationForm />;
}

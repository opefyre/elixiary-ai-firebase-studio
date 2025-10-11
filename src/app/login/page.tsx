'use client';

import { AuthForm } from '@/components/auth-form';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center overflow-hidden py-12 pt-20">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-10 text-center space-y-6">
          {/* Hero Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative text-6xl">🍸</div>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="font-headline text-3xl font-bold md:text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Your AI Bartender Awaits
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
              Craft personalized cocktails with AI, save your favorites, and become your own mixologist.
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2 text-xs pt-2">
            <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
              ⚡ Instant recipes
            </span>
            <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
              🎯 Personalized
            </span>
            <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
              🆓 Free forever
            </span>
          </div>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}

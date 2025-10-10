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
    <div className="container flex min-h-screen flex-col items-center justify-center py-12 pt-20">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-3xl font-bold md:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Sign in to continue to Elixiary.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}

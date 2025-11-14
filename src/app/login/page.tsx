'use client';

import { AuthForm } from '@/components/auth-form';
import { useUser } from '@/firebase';
import { AppClientProviders } from '@/components/providers/app-client-providers';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function LoginPageContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden py-12 pt-32 md:pt-20">
      <div className="mx-auto w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AppClientProviders>
      <LoginPageContent />
    </AppClientProviders>
  );
}

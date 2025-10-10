'use client';

import { AuthForm } from '@/components/auth-form';
import { useUser } from '@/firebase';
import { Botanic, Citrus, GlassWater, Loader2, Martini } from 'lucide-react';
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
    <div className="container relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-12 pt-20">
      <div className="absolute top-1/4 left-1/4 h-32 w-32 animate-float text-primary/10 [animation-delay:-2s]" >
        <Martini className="h-full w-full" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 h-24 w-24 animate-float text-primary/10 [animation-delay:-4s]" >
        <Citrus className="h-full w-full" />
      </div>
      <div className="absolute bottom-1/3 left-[15%] h-20 w-20 animate-float text-primary/10 [animation-delay:-6s]" >
        <GlassWater className="h-full w-full" />
      </div>
      <div className="absolute top-1/3 right-[20%] h-28 w-28 animate-float text-primary/10" >
        <Botanic className="h-full w-full" />
      </div>
      
      <div className="mx-auto w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-3xl font-bold md:text-4xl">
            Sign In or Create an Account
          </h1>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}

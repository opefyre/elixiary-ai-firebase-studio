'use client';

import { type ReactNode } from 'react';
import dynamic from 'next/dynamic';

import { useUser } from '@/firebase';

const RecipeGenerationForm = dynamic(
  () =>
    import('@/components/recipe-generation-form').then(
      (mod) => mod.RecipeGenerationForm
    ),
  { ssr: false }
);

type AuthSectionProps = {
  guestHero: ReactNode;
};

export function AuthSection({ guestHero }: AuthSectionProps) {
  const { user, isUserLoading } = useUser();

  if (isUserLoading || !user) {
    return <>{guestHero}</>;
  }

  return <RecipeGenerationForm />;
}

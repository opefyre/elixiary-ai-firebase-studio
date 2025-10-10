'use client';

import { handleGenerateRecipe } from '@/app/actions';
import { RecipeGenerationForm } from '@/components/recipe-generation-form';
import { useUser } from '@/firebase';
import { AuthButton } from '@/components/auth-button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Please Sign In</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <p className="text-muted-foreground">
                You need to be signed in to generate cocktail recipes.
              </p>
              <AuthButton />
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

'use client';

import { useUser, useRecipes } from '@/firebase';
import { Loader2, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipe-card';

export default function RecipesPage() {
  const { user, isUserLoading } = useUser();
  const { recipes, isLoading, deleteRecipe } = useRecipes();

  if (isUserLoading || isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">
              You need to be signed in to view your saved recipes.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pt-24 md:py-12 md:pt-28">
      <section className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold md:text-4xl flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              My Cocktail Recipes
            </h1>
            <p className="mt-2 text-muted-foreground">
              Your collection of AI-generated cocktail recipes
            </p>
          </div>
          <Button asChild>
            <Link href="/">Generate New Recipe</Link>
          </Button>
        </div>
      </section>

      {recipes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">No Recipes Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start generating cocktail recipes to build your collection!
                </p>
                <Button asChild>
                  <Link href="/">Create Your First Recipe</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={deleteRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
}


"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeCard } from "@/components/recipe-card";
import type { GenerateCocktailRecipeOutput } from "@/ai/flows/generate-cocktail-recipe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { placeholderImages } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";
import { FlaskConical } from "lucide-react";

export default function Home() {
  const [recipes, setRecipes] = useState<GenerateCocktailRecipeOutput[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewRecipe = (recipe: GenerateCocktailRecipeOutput) => {
    setRecipes((prev) => [recipe, ...prev]);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <section className="mb-12">
            <Card className="border-primary/20 bg-card/50 shadow-lg shadow-black/20">
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl lg:text-4xl">
                  Craft Your Perfect Elixir
                </CardTitle>
                <CardDescription className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Unleash your inner mixologist. Input your available
                  ingredients, set the mood, and let our AI conjure a unique
                  cocktail recipe just for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecipeForm
                  onNewRecipe={handleNewRecipe}
                  setIsLoading={setIsLoading}
                />
              </CardContent>
            </Card>
          </section>

          <Separator className="my-8 bg-primary/10" />

          <section>
            <h2 className="font-headline text-3xl mb-6 text-center">
              Your Generated Cocktails
            </h2>
            {isLoading && recipes.length === 0 ? (
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-card/30 p-24">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="font-semibold text-muted-foreground">
                    Conjuring your elixir...
                  </p>
                </div>
              </div>
            ) : recipes.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {isLoading && (
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-card/30 p-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <p className="text-muted-foreground">
                        Generating next...
                      </p>
                    </div>
                  </div>
                )}
                {recipes.map((recipe, index) => (
                  <RecipeCard
                    key={`${recipe.recipeName}-${index}`}
                    recipe={recipe}
                    image={
                      placeholderImages[index % placeholderImages.length]
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-card/30 p-24 text-center">
                <div className="flex flex-col items-center gap-4">
                  <FlaskConical className="h-16 w-16 text-primary/50" />
                  <h3 className="font-headline text-2xl font-semibold">
                    Your canvas is empty
                  </h3>
                  <p className="max-w-sm text-muted-foreground">
                    Generated cocktail recipes will appear here, ready to be
                    mixed and enjoyed.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

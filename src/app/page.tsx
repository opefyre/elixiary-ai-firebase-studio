"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilterPanel } from "@/components/filter-panel";
import { RecipeCard } from "@/components/recipe-card";
import { placeholderImages } from "@/lib/placeholder-images";
import type { GenerateCocktailRecipeOutput } from "@/ai/flows/generate-cocktail-recipe";
import { mockRecipes } from "@/lib/mock-data";

export default function Home() {
  // Replace with actual data fetching and filtering logic
  const [recipes] = useState(mockRecipes);

  return (
    <div className="container mx-auto px-4 py-8 pt-24 md:py-12 md:pt-28">
      <section className="mb-12">
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="p-0 text-center">
            <CardTitle className="font-headline text-[26px] font-bold md:text-[32px]">
              Craft Your Perfect Elixir
            </CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl text-lg text-muted-foreground">
              Discover and create amazing cocktails. Tell us what you like, and
              we&apos;ll find the perfect recipe for you.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="mb-12">
        <FilterPanel />
      </section>

      <section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              image={placeholderImages[index % placeholderImages.length]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

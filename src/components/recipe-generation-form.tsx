"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { GenerateCocktailRecipeOutput } from "@/ai/flows/generate-cocktail-recipe";

const formSchema = z.object({
  ingredients: z.string().min(1, "Please list at least one ingredient."),
  mood: z.string().min(1, "Please describe the mood or occasion."),
  flavorProfile: z.string().min(1, "Please describe the flavor profile."),
});

type FormValues = z.infer<typeof formSchema>;

type RecipeGenerationFormProps = {
  handleGenerateRecipe: (
    input: FormValues
  ) => Promise<{
    recipe: GenerateCocktailRecipeOutput | null;
    error: string | null;
  }>;
};

export function RecipeGenerationForm({
  handleGenerateRecipe,
}: RecipeGenerationFormProps) {
  const [recipe, setRecipe] = useState<GenerateCocktailRecipeOutput | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: "",
      mood: "",
      flavorProfile: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setRecipe(null);
    setError(null);
    const result = await handleGenerateRecipe(data);
    setRecipe(result.recipe);
    setError(result.error);
    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Generate a Recipe</CardTitle>
          <CardDescription>
            Fill out the form below and let our AI create a unique cocktail for
            you.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Ingredients</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Gin, Lime Juice, Simple Syrup"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood / Occasion</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Refreshing summer day, cozy night in" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flavorProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Flavor Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sweet and fruity, smoky and strong" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Recipe"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {error && (
        <Card className="mt-8 bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Generation Failed</CardTitle>
                <CardDescription className="text-destructive/80">{error}</CardDescription>
            </CardHeader>
        </Card>
      )}

      {recipe && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{recipe.recipeName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Ingredients:</h4>
              <p className="whitespace-pre-wrap">{recipe.ingredients}</p>
            </div>
            <div>
              <h4 className="font-semibold">Instructions:</h4>
              <p className="whitespace-pre-wrap">{recipe.instructions}</p>
            </div>
            {recipe.garnish && (
              <div>
                <h4 className="font-semibold">Garnish:</h4>
                <p>{recipe.garnish}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

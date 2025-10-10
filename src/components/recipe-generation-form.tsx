"use client";

import { useState } from "react";
import Image from "next/image";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import type { GenerateCocktailRecipeOutput } from "@/ai/flows/generate-cocktail-recipe";
import type { GenerateCocktailImageOutput } from "@/ai/flows/generate-cocktail-image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    image: GenerateCocktailImageOutput | null;
    error: string | null;
  }>;
};

export function RecipeGenerationForm({
  handleGenerateRecipe,
}: RecipeGenerationFormProps) {
  const [recipe, setRecipe] = useState<GenerateCocktailRecipeOutput | null>(
    null
  );
  const [image, setImage] = useState<GenerateCocktailImageOutput | null>(null);
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
    setImage(null);
    setError(null);
    const result = await handleGenerateRecipe(data);
    setRecipe(result.recipe);
    setImage(result.image);
    setError(result.error);
    setIsLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-0 bg-transparent shadow-none sm:border-2 sm:bg-card sm:shadow-sm">
        <CardContent className="p-0 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
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
                      <Input placeholder="e.g., Refreshing summer day" {...field} />
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
                    <FormLabel>Flavor Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sweet and fruity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isLoading} size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Recipe
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-8">
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recipe && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">{recipe.recipeName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {image && (
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image
                  src={image.imageUrl}
                  alt={recipe.recipeName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h4 className="font-semibold text-lg">Ingredients</h4>
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{recipe.ingredients}</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg">Instructions</h4>
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{recipe.instructions}</p>
            </div>
            {recipe.garnish && (
              <div>
                <h4 className="font-semibold text-lg">Garnish</h4>
                <p className="mt-1 text-muted-foreground">{recipe.garnish}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

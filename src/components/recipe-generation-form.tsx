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
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Dices } from "lucide-react";
import type { GenerateCocktailRecipeOutput } from "@/ai/flows/generate-cocktail-recipe";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  prompt: z.string(),
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

const luckyPrompts = [
  "A refreshing gin-based cocktail for a hot summer day.",
  "Something smoky and sophisticated with whiskey.",
  "A spicy and tropical tequila drink.",
  "A non-alcoholic mocktail that's fruity and fun.",
  "Create a unique cocktail using bourbon and pear.",
];

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
      prompt: "",
    },
  });

  const handleRandomPrompt = () => {
    const randomPrompt = luckyPrompts[Math.floor(Math.random() * luckyPrompts.length)];
    form.setValue("prompt", randomPrompt);
  };

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="e.g., A refreshing gin-based cocktail for a hot summer day."
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center pt-2 gap-4">
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
            <Button type="button" variant="outline" size="lg" onClick={handleRandomPrompt} aria-label="I'm feeling lucky">
                <Dices className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recipe && recipe.recipeName && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">{recipe.recipeName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recipe.ingredients && (
              <div>
                <h4 className="text-lg font-semibold">Ingredients</h4>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                  {recipe.ingredients}
                </p>
              </div>
            )}
            {recipe.instructions && (
              <div>
                <h4 className="text-lg font-semibold">Instructions</h4>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                  {recipe.instructions}
                </p>
              </div>
            )}
            {recipe.garnish && (
              <div>
                <h4 className="text-lg font-semibold">Garnish</h4>
                <p className="mt-1 text-muted-foreground">{recipe.garnish}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

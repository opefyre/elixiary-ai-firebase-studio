"use server";

import {
  generateCocktailRecipe,
  type GenerateCocktailRecipeInput,
  type GenerateCocktailRecipeOutput,
} from "@/ai/flows/generate-cocktail-recipe";
import {
  generateCocktailImage,
  type GenerateCocktailImageOutput,
} from "@/ai/flows/generate-cocktail-image";
import { z } from "zod";

const actionSchema = z.object({
  prompt: z.string().min(1, "Please enter a prompt."),
});

type State = {
  recipe: GenerateCocktailRecipeOutput | null;
  image: GenerateCocktailImageOutput | null;
  error: string | null;
};

export async function handleGenerateRecipe(
  input: GenerateCocktailRecipeInput
): Promise<State> {
  const validatedFields = actionSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      recipe: null,
      image: null,
      error: "Invalid input.",
    };
  }

  try {
    const recipe = await generateCocktailRecipe(validatedFields.data);
    
    // Only generate an image if we have a valid recipe with ingredients.
    if (recipe.ingredients) {
      const image = await generateCocktailImage({
        recipeName: recipe.recipeName,
        ingredients: recipe.ingredients,
      });
      return { recipe, image, error: null };
    }

    // If no ingredients, it means the AI is asking for more info.
    // Return just the recipe part (which contains the question).
    return { recipe, image: null, error: null };

  } catch (error: any) {
    console.error("Detailed Error:", error);
    const errorMessage = error.message || "An unknown error occurred. Please check the server logs.";
    return {
      recipe: null,
      image: null,
      error: `Failed to generate recipe: ${errorMessage}`,
    };
  }
}

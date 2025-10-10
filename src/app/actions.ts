"use server";

import {
  generateCocktailRecipe,
  type GenerateCocktailRecipeInput,
  type GenerateCocktailRecipeOutput,
} from "@/ai/flows/generate-cocktail-recipe";
import { z } from "zod";

const actionSchema = z.object({
  prompt: z.string(),
});

type State = {
  recipe: GenerateCocktailRecipeOutput | null;
  error: string | null;
};

export async function handleGenerateRecipe(
  input: GenerateCocktailRecipeInput
): Promise<State> {
  const validatedFields = actionSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      recipe: null,
      error: "Invalid input.",
    };
  }

  try {
    const recipe = await generateCocktailRecipe(validatedFields.data);
    if (!recipe) {
      return {
        recipe: null,
        error: "The AI did not return a recipe. Please try a different prompt.",
      };
    }
    return { recipe, error: null };
  } catch (error: any) {
    console.error("Detailed Error:", error);
    const errorMessage = error.message || "An unknown error occurred. Please check the server logs.";
    return {
      recipe: null,
      error: `Failed to generate recipe: ${errorMessage}`,
    };
  }
}

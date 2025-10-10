"use server";

import {
  generateCocktailRecipe,
  type GenerateCocktailRecipeInput,
  type GenerateCocktailRecipeOutput,
} from "@/ai/flows/generate-cocktail-recipe";
import { 
  generateCocktailImage,
  type GenerateCocktailImageOutput
} from "@/ai/flows/generate-cocktail-image";
import { z } from "zod";

const actionSchema = z.object({
  prompt: z.string().min(10, "Please provide a more detailed description."),
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
    const image = await generateCocktailImage({
      recipeName: recipe.recipeName,
      ingredients: recipe.ingredients,
    });
    return { recipe, image, error: null };
  } catch (error) {
    console.error(error);
    return {
      recipe: null,
      image: null,
      error: "Failed to generate recipe. The AI may be busy, please try again.",
    };
  }
}

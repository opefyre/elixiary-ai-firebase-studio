'use server';

/**
 * @fileOverview Generates a custom cocktail recipe based on available ingredients, mood/occasion, and flavor profile.
 *
 * - generateCocktailRecipe - A function that generates a cocktail recipe.
 * - GenerateCocktailRecipeInput - The input type for the generateCocktailRecipe function.
 * - GenerateCocktailRecipeOutput - The return type for the generateCocktailRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCocktailRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of available ingredients.'),
  mood: z.string().describe('The desired mood or occasion for the cocktail.'),
  flavorProfile: z
    .string()
    .describe('The preferred flavor profile (e.g., sweet, tart, smoky).'),
});
export type GenerateCocktailRecipeInput = z.infer<
  typeof GenerateCocktailRecipeInputSchema
>;

const GenerateCocktailRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated cocktail recipe.'),
  instructions: z
    .string()
    .describe('Step-by-step instructions for making the cocktail.'),
  ingredients: z.string().describe('A list of ingredients with amounts.'),
  garnish: z.string().describe('Suggestion for a garnish.'),
});
export type GenerateCocktailRecipeOutput = z.infer<
  typeof GenerateCocktailRecipeOutputSchema
>;

export async function generateCocktailRecipe(
  input: GenerateCocktailRecipeInput
): Promise<GenerateCocktailRecipeOutput> {
  return generateCocktailRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCocktailRecipePrompt',
  input: {schema: GenerateCocktailRecipeInputSchema},
  output: {schema: GenerateCocktailRecipeOutputSchema},
  prompt: `You are an expert mixologist. Generate a unique and delicious cocktail recipe based on the following criteria:

Available Ingredients: {{{ingredients}}}
Mood/Occasion: {{{mood}}}
Flavor Profile: {{{flavorProfile}}}

Consider the available ingredients, mood, and flavor profile to create a balanced and appealing cocktail. Provide clear and concise instructions, specific ingredient amounts, and a garnish suggestion.

Recipe Name:
Ingredients:
Instructions:
Garnish: `,
});

const generateCocktailRecipeFlow = ai.defineFlow(
  {
    name: 'generateCocktailRecipeFlow',
    inputSchema: GenerateCocktailRecipeInputSchema,
    outputSchema: GenerateCocktailRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

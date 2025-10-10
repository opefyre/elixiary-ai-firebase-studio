'use server';

/**
 * @fileOverview Generates a custom cocktail recipe based on a user prompt.
 *
 * - generateCocktailRecipe - A function that generates a cocktail recipe.
 * - GenerateCocktailRecipeInput - The input type for the generateCocktailRecipe function.
 * - GenerateCocktailRecipeOutput - The return type for the generateCocktailRecipe function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const GenerateCocktailRecipeInputSchema = z.object({
  prompt: z
    .string()
    .describe('A user-provided prompt describing the desired cocktail.'),
});
export type GenerateCocktailRecipeInput = z.infer<
  typeof GenerateCocktailRecipeInputSchema
>;

const GenerateCocktailRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated cocktail recipe. If the user prompt is too vague, ask for more details.'),
  instructions: z
    .string()
    .describe('Step-by-step instructions for making the cocktail. If the user prompt is too vague, ask for more details.'),
  ingredients: z.string().describe('A list of ingredients with amounts. If the user prompt is too vague, ask for more details.'),
  garnish: z.string().describe('Suggestion for a garnish. If the user prompt is too vague, ask for more details.'),
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
  prompt: `You are an expert mixologist. Generate a unique and delicious cocktail recipe based on the user's request.

User Request: {{{prompt}}}

Interpret the user's request, considering any mentioned ingredients, moods, flavors, or occasions. Create a balanced and appealing cocktail. Provide clear and concise instructions, specific ingredient amounts, and a garnish suggestion.

If the user's prompt is too vague (e.g., "make me a drink"), do not generate a recipe. Instead, politely ask for more information in the 'recipeName' field, like "I can do that! To help me craft the perfect cocktail, could you tell me a bit more about what you're in the mood for? For example, what kind of spirits, flavors, or mood are you in the mood for?". Leave the other fields empty.
`,
  model: 'gemini-pro',
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

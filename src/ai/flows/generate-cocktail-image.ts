'use server';

/**
 * @fileOverview Generates a cocktail image based on its name and ingredients.
 *
 * - generateCocktailImage - A function that generates a cocktail image.
 * - GenerateCocktailImageInput - The input type for the generateCocktailImage function.
 * - GenerateCocktailImageOutput - The return type for the generateCocktailImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCocktailImageInputSchema = z.object({
  recipeName: z.string().describe('The name of the cocktail.'),
  ingredients: z.string().describe('A comma-separated list of ingredients.'),
});
export type GenerateCocktailImageInput = z.infer<
  typeof GenerateCocktailImageInputSchema
>;

const GenerateCocktailImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateCocktailImageOutput = z.infer<
  typeof GenerateCocktailImageOutputSchema
>;

export async function generateCocktailImage(
  input: GenerateCocktailImageInput
): Promise<GenerateCocktailImageOutput> {
  return generateCocktailImageFlow(input);
}

const generateCocktailImageFlow = ai.defineFlow(
  {
    name: 'generateCocktailImageFlow',
    inputSchema: GenerateCocktailImageInputSchema,
    outputSchema: GenerateCocktailImageOutputSchema,
  },
  async ({recipeName, ingredients}) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-pro-vision',
      prompt: `Generate a photorealistic image of a cocktail named "${recipeName}".
      The cocktail contains the following ingredients: ${ingredients}.
      The image should be professionally styled, well-lit, and appealing, as if for a high-end cocktail menu.
      Show the cocktail in an appropriate glass, with a simple, elegant background that is out of focus.`,
    });

    if (!media.url) {
      throw new Error('Image generation failed to return a URL.');
    }

    return {
      imageUrl: media.url,
    };
  }
);

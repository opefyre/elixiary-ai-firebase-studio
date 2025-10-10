'use server';

/**
 * @fileOverview Summarizes reviews of a cocktail recipe.
 *
 * - summarizeRecipeReviews - A function that summarizes cocktail recipe reviews.
 * - SummarizeRecipeReviewsInput - The input type for the summarizeRecipeReviews function.
 * - SummarizeRecipeReviewsOutput - The return type for the summarizeRecipeReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRecipeReviewsInputSchema = z.object({
  recipeName: z.string().describe('The name of the cocktail recipe.'),
  reviews: z.array(z.string()).describe('An array of reviews for the cocktail recipe.'),
});
export type SummarizeRecipeReviewsInput = z.infer<typeof SummarizeRecipeReviewsInputSchema>;

const SummarizeRecipeReviewsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the cocktail recipe reviews.'),
});
export type SummarizeRecipeReviewsOutput = z.infer<typeof SummarizeRecipeReviewsOutputSchema>;

export async function summarizeRecipeReviews(
  input: SummarizeRecipeReviewsInput
): Promise<SummarizeRecipeReviewsOutput> {
  return summarizeRecipeReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRecipeReviewsPrompt',
  input: {schema: SummarizeRecipeReviewsInputSchema},
  output: {schema: SummarizeRecipeReviewsOutputSchema},
  prompt: `Summarize the following reviews for the cocktail recipe "{{recipeName}}":\n\n{% each reviews %}{{this}}\n{% endeach %}\n\nProvide a concise summary of the reviews, highlighting common themes and sentiments. Focus on whether users generally liked the recipe, and why or why not.`,
});

const summarizeRecipeReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeRecipeReviewsFlow',
    inputSchema: SummarizeRecipeReviewsInputSchema,
    outputSchema: SummarizeRecipeReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

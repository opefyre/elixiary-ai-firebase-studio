'use server';

/**
 * @fileOverview AI-powered ingredient substitution suggestion flow.
 *
 * - suggestIngredientSubstitutions - A function that suggests ingredient substitutions for a cocktail recipe.
 * - SuggestIngredientSubstitutionsInput - The input type for the suggestIngredientSubstitutions function.
 * - SuggestIngredientSubstitutionsOutput - The return type for the suggestIngredientSubstitutions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIngredientSubstitutionsInputSchema = z.object({
  missingIngredients: z
    .string()
    .describe('A comma separated list of ingredients that need substitution.'),
  recipe: z.string().describe('The original cocktail recipe.'),
});

export type SuggestIngredientSubstitutionsInput =
  z.infer<typeof SuggestIngredientSubstitutionsInputSchema>;

const SuggestIngredientSubstitutionsOutputSchema = z.object({
  suggestedSubstitutions: z
    .string()
    .describe(
      'A list of suggested substitutions for the missing ingredients in the cocktail recipe.'
    ),
});

export type SuggestIngredientSubstitutionsOutput =
  z.infer<typeof SuggestIngredientSubstitutionsOutputSchema>;

export async function suggestIngredientSubstitutions(
  input: SuggestIngredientSubstitutionsInput
): Promise<SuggestIngredientSubstitutionsOutput> {
  return suggestIngredientSubstitutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIngredientSubstitutionsPrompt',
  input: {schema: SuggestIngredientSubstitutionsInputSchema},
  output: {schema: SuggestIngredientSubstitutionsOutputSchema},
  prompt: `You are a master mixologist. Given a cocktail recipe and a list of missing ingredients, you will suggest suitable substitutions for those ingredients. The substitutions should maintain the overall flavor profile of the cocktail.

Recipe: {{{recipe}}}

Missing Ingredients: {{{missingIngredients}}}

Suggest ingredient substitutions:
`,
});

const suggestIngredientSubstitutionsFlow = ai.defineFlow(
  {
    name: 'suggestIngredientSubstitutionsFlow',
    inputSchema: SuggestIngredientSubstitutionsInputSchema,
    outputSchema: SuggestIngredientSubstitutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

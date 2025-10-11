'use server';

/**
 * @fileOverview Generates a custom cocktail recipe based on a user prompt.
 *
 * - generateCocktailRecipe - A function that generates a cocktail recipe.
 * - GenerateCocktailRecipeInput - The input type for the generateCocktailRecipe function.
 * - GenerateCocktailRecipeOutput - The return type for the generateCocktailRecipe function.
 */

import {ai} from '@/ai/genkit';
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
  recipeName: z.string().describe('A creative, appealing name for the cocktail. Should be catchy and match the theme.'),
  description: z.string().describe('A brief 1-2 sentence description of the cocktail, its flavor profile, and the experience.'),
  ingredients: z.string().describe('A detailed list of ingredients with precise measurements. Format as a bulleted list with each ingredient on a new line.'),
  instructions: z
    .string()
    .describe('Clear, numbered step-by-step instructions for making the cocktail. Include preparation, mixing, and serving details.'),
  garnish: z.string().describe('Detailed garnish suggestions with specific placement and presentation tips.'),
  glassware: z.string().describe('The recommended type of glass to serve the cocktail in.'),
  difficultyLevel: z.string().describe('Easy, Medium, or Hard - indicating the skill level required.'),
  servingSize: z.string().describe('Number of servings this recipe makes (e.g., "1 cocktail" or "Serves 2").'),
  tips: z.string().describe('Professional mixologist tips and variations for this cocktail.'),
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
  prompt: `You are a world-renowned master mixologist with decades of experience crafting innovative and delicious cocktails. Your expertise spans classic cocktails, molecular mixology, and modern flavor combinations. You have an encyclopedic knowledge of spirits, liqueurs, bitters, syrups, and fresh ingredients.

🍸 USER REQUEST: {{{prompt}}}

Your task is to create a unique, well-balanced cocktail recipe that perfectly matches the user's request. Consider:

1. **Flavor Profile**: Balance sweet, sour, bitter, and savory elements
2. **Spirit Selection**: Choose spirits that complement each other and match the request
3. **Technique**: Consider shaking, stirring, muddling, or other appropriate techniques
4. **Presentation**: Think about visual appeal, garnish, and glassware
5. **Occasion & Mood**: Match the cocktail to the context (refreshing, sophisticated, celebratory, etc.)
6. **Seasonality**: Consider seasonal ingredients when relevant

**RECIPE REQUIREMENTS:**
- Create a UNIQUE recipe, not just a known cocktail (unless specifically requested)
- Use PRECISE measurements (oz, ml, dashes, barspoons)
- Include DETAILED step-by-step instructions
- Suggest appropriate GLASSWARE
- Provide professional TIPS for best results
- Add creative GARNISH ideas
- Specify DIFFICULTY level honestly

**FORMAT GUIDELINES:**
- Ingredients: Use bullet points (•) with precise measurements
- Instructions: Use numbered steps (1., 2., 3., etc.)
- Be specific about techniques (e.g., "dry shake for 10 seconds", "strain through fine mesh", "express lemon peel over drink")
- Include temperature notes (chilled glass, room temperature spirits, etc.)

**TONE**: Professional yet approachable, passionate about craft cocktails, eager to share knowledge

If the request is too vague (e.g., just "make me a drink"), politely ask for more specific details about preferred spirits, flavors, or occasion in the recipeName field and leave other fields with helpful prompts.
`,
  model: 'googleai/gemini-1.5-flash',
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

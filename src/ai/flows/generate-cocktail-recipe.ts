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
  customization: z.object({
    complexity: z.enum(['simple', 'moderate', 'complex']).optional(),
    dietary: z.array(z.string()).optional(),
    alcoholLevel: z.enum(['low', 'medium', 'strong']).optional(),
    sweetness: z.enum(['dry', 'balanced', 'sweet']).optional(),
    flavorProfile: z.array(z.string()).optional(),
    occasion: z.string().optional(),
    season: z.string().optional(),
    restrictions: z.string().optional(),
  }).optional(),
});
export type GenerateCocktailRecipeInput = z.infer<
  typeof GenerateCocktailRecipeInputSchema
>;

const GenerateCocktailRecipeOutputSchema = z.object({
  recipeName: z.string().describe('A creative, appealing name for the cocktail. Should be catchy and match the theme.'),
  description: z.string().describe('A brief 1-2 sentence description of the cocktail, its flavor profile, and the experience.'),
  ingredients: z.string().describe('A detailed list of ingredients with precise measurements. CRITICAL FORMATTING RULES:\n1. Each ingredient on its own line, separated by newline (\\n)\n2. Start each line with a dash (-)\n3. Format: QUANTITY UNIT INGREDIENT_NAME\n4. Be SPECIFIC and DECISIVE - no examples, no alternatives, no parentheses\n5. NO brand suggestions (e.g., Tanqueray)\n6. NO "or" options\n7. NO explanatory text in parentheses\n8. Use standard units: oz, ml, dash, barspoon\n9. Use generic names: "Gin" NOT "London Dry Gin (e.g., Tanqueray)"\n\nGOOD Examples:\n- 2 oz Gin\n- 1 oz Fresh lemon juice\n- 0.5 oz Simple syrup\n- 2 dashes Angostura bitters\n\nBAD Examples (DO NOT DO THIS):\n- 2 oz Aged Jamaican Rum (e.g., Appleton Estate)\n- 1 oz Gin or Vodka\n- 0.5 oz Simple syrup (or honey syrup)'),
  instructions: z
    .string()
    .describe('Clear, numbered step-by-step instructions for making the cocktail. IMPORTANT: Put each step on its own line, separated by newline characters (\\n). Number each step. Example format:\n1. Fill shaker with ice\\n2. Add all ingredients\\n3. Shake vigorously for 10 seconds'),
  garnish: z.string().describe('Detailed garnish suggestions. If multiple options, separate with newline characters (\\n).'),
  glassware: z.string().describe('The recommended type of glass to serve the cocktail in.'),
  equipment: z.string().describe('Required bar tools and equipment needed to make this cocktail. IMPORTANT: If multiple items, put each on its own line separated by newline characters (\\n). Example: "Cocktail shaker\\nStrainer\\nMuddler"'),
  difficultyLevel: z.enum(['Easy', 'Medium', 'Hard']).describe('Difficulty level - be honest and varied:\nEasy: Simple mixing, 3-4 ingredients, no special techniques (e.g., highball, simple shaken drinks)\nMedium: Multiple steps, 5-7 ingredients, basic techniques (e.g., muddling, layering, standard shaking/stirring)\nHard: Complex techniques, 8+ ingredients, advanced skills (e.g., molecular mixology, fat washing, smoking, multiple preparation steps)\nIMPORTANT: Vary difficulty based on actual recipe complexity - not all cocktails should be Medium!'),
  servingSize: z.string().describe('Number of servings this recipe makes (e.g., "1 cocktail" or "Serves 2").'),
  tips: z.string().describe('Professional mixologist tips and variations. IMPORTANT: If multiple tips, put each on its own line separated by newline characters (\\n). Use bullet points or dashes.'),
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

{{#if customization}}
🎛️ CUSTOMIZATION PREFERENCES:
{{#if customization.complexity}}- Complexity: {{customization.complexity}}{{/if}}
{{#if customization.alcoholLevel}}- Alcohol Level: {{customization.alcoholLevel}}{{/if}}
{{#if customization.sweetness}}- Sweetness: {{customization.sweetness}}{{/if}}
{{#if customization.dietary}}- Dietary: {{customization.dietary}}{{/if}}
{{#if customization.flavorProfile}}- Flavor Profile: {{customization.flavorProfile}}{{/if}}
{{#if customization.occasion}}- Occasion: {{customization.occasion}}{{/if}}
{{#if customization.season}}- Season: {{customization.season}}{{/if}}
{{#if customization.restrictions}}- Restrictions: {{customization.restrictions}}{{/if}}
{{/if}}

Your task is to create a unique, well-balanced cocktail recipe that perfectly matches the user's request and customization preferences. Consider:

1. **Flavor Profile**: Balance sweet, sour, bitter, and savory elements according to preferences
2. **Spirit Selection**: Choose spirits that complement each other and match the request
3. **Technique**: Consider shaking, stirring, muddling, or other appropriate techniques
4. **Presentation**: Think about visual appeal, garnish, and glassware
5. **Occasion & Mood**: Match the cocktail to the context (refreshing, sophisticated, celebratory, etc.)
6. **Seasonality**: Consider seasonal ingredients when relevant - use fresh, in-season ingredients
7. **Equipment**: Recommend appropriate bar tools and equipment needed
8. **Dietary Restrictions**: Ensure all ingredients meet dietary requirements and restrictions

**RECIPE REQUIREMENTS:**
- Create a UNIQUE recipe, not just a known cocktail (unless specifically requested)
- Use PRECISE measurements (oz, ml, dashes, barspoons)
- Include DETAILED step-by-step instructions
- Suggest appropriate GLASSWARE
- Provide professional TIPS for best results
- Add creative GARNISH ideas
- Specify DIFFICULTY level HONESTLY based on recipe complexity:
  * Easy: 3-4 ingredients, simple mixing (gin & tonic, rum & coke, simple highballs)
  * Medium: 5-7 ingredients, basic techniques (classic cocktails, muddling, layering)
  * Hard: 8+ ingredients, advanced techniques (tiki drinks, molecular mixology, complex prep)
  * IMPORTANT: Match difficulty to actual complexity - vary your ratings!

**FORMAT GUIDELINES - EXTREMELY IMPORTANT:**

INGREDIENTS FORMAT (CRITICAL):
- Each ingredient on a SEPARATE LINE with \\n
- Format: "- QUANTITY UNIT NAME\\n"
- Example: "- 2 oz Gin\\n- 1 oz Lemon juice\\n- 0.5 oz Simple syrup"
- Use GENERIC names only: "Gin" NOT "London Dry Gin (e.g., Tanqueray)"
- NO brand examples in parentheses
- NO alternatives (no "or")
- NO explanatory text
- DECISIVE and SPECIFIC only
- Standard units: oz, ml, dash, barspoon

INSTRUCTIONS FORMAT:
- Each step on a SEPARATE LINE using \\n
- Format: "1. First step\\n2. Second step\\n3. Third step"
- Be specific about techniques

TIPS FORMAT:
- Each tip on a SEPARATE LINE using \\n
- Format: "- Tip one\\n- Tip two\\n- Tip three"
- Keep tips concise

CRITICAL: NEVER include brand suggestions, alternatives, or explanatory text in parentheses in the ingredients list!

**TONE**: Professional yet approachable, passionate about craft cocktails, eager to share knowledge

If the request is too vague (e.g., just "make me a drink"), politely ask for more specific details about preferred spirits, flavors, or occasion in the recipeName field and leave other fields with helpful prompts.
`,
  model: 'googleai/gemini-2.5-flash',
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

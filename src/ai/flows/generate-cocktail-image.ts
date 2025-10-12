'use server';

/**
 * @fileOverview Generates a cocktail image description or uses AI to create visual representation
 * 
 * Note: Since Gemini Imagen requires Vertex AI (paid tier), we use an alternative approach:
 * 1. Generate a detailed, artistic image prompt using Gemini
 * 2. Use this prompt with a free image generation service (or as placeholder for future Imagen integration)
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCocktailImageInputSchema = z.object({
  recipeName: z.string().describe('The name of the cocktail'),
  description: z.string().describe('The cocktail description'),
  ingredients: z.string().describe('The main ingredients'),
  glassware: z.string().describe('The type of glass'),
  garnish: z.string().describe('The garnish details'),
});

export type GenerateCocktailImageInput = z.infer<typeof GenerateCocktailImageInputSchema>;

const GenerateCocktailImageOutputSchema = z.object({
  imagePrompt: z.string().describe('A detailed, artistic prompt for image generation'),
  imageUrl: z.string().optional().describe('Generated image URL (if available)'),
  placeholderColor: z.string().describe('Suggested color theme for the cocktail (hex code)'),
});

export type GenerateCocktailImageOutput = z.infer<typeof GenerateCocktailImageOutputSchema>;

export async function generateCocktailImage(
  input: GenerateCocktailImageInput
): Promise<GenerateCocktailImageOutput> {
  return generateCocktailImageFlow(input);
}

const imagePromptGenerator = ai.definePrompt({
  name: 'generateCocktailImagePrompt',
  input: {schema: GenerateCocktailImageInputSchema},
  
  prompt: `You are an expert at creating detailed, artistic image generation prompts for cocktails.

Given this cocktail:
- Name: {{{recipeName}}}
- Description: {{{description}}}
- Ingredients: {{{ingredients}}}
- Glass: {{{glassware}}}
- Garnish: {{{garnish}}}

Create a detailed, photorealistic image prompt that would generate a beautiful photograph of this cocktail.

**Image Prompt Requirements**:
- Professional cocktail photography style
- Describe the drink's color, clarity, and layers
- Describe the glass type and how it's filled
- Describe the garnish in detail (placement, freshness)
- Describe the lighting (warm, natural, dramatic)
- Describe the background (bar setting, marble, wood, minimal)
- Describe any condensation, ice, or bubbles
- Keep it under 200 words
- Use vivid, visual language
- Think like a professional food/drink photographer

**Color Theme**:
Also suggest a hex color code that represents this cocktail's primary color (based on its ingredients and appearance).

**Example**:
For a Mojito: "A tall, frosted highball glass filled with a refreshing pale green cocktail, crushed ice visible throughout. Fresh mint sprigs burst from the top, their vibrant green leaves glistening with tiny water droplets. A lime wheel perched on the rim. The drink sparkles with tiny bubbles from soda water. Shot from a slight angle on a rustic wooden bar top with warm, natural window light creating soft highlights on the glass. Background softly blurred with hints of a tropical beach bar atmosphere. Professional food photography, shallow depth of field, appetizing presentation."

Color: #98D8C8 (minty pale green)
`,
  model: 'googleai/gemini-2.5-flash',
});

const generateCocktailImageFlow = ai.defineFlow(
  {
    name: 'generateCocktailImageFlow',
    inputSchema: GenerateCocktailImageInputSchema,
    outputSchema: GenerateCocktailImageOutputSchema,
  },
  async input => {
    const {output} = await imagePromptGenerator(input);
    
    // For now, we return the prompt without actually generating the image
    // This can be extended later with actual image generation API
    return {
      imagePrompt: output || 'A beautiful cocktail in a glass',
      placeholderColor: '#8b5cf6', // Default purple
    };
  }
);


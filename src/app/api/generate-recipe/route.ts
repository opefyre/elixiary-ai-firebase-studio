import { NextRequest, NextResponse } from 'next/server';
import { generateCocktailRecipe } from '@/ai/flows/generate-cocktail-recipe';
import { z } from 'zod';

const requestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = requestSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedFields.error.errors },
        { status: 400 }
      );
    }

    const recipe = await generateCocktailRecipe(validatedFields.data);
    
    if (!recipe) {
      return NextResponse.json(
        { error: 'The AI did not return a recipe. Please try a different prompt.' },
        { status: 500 }
      );
    }
    
    // Fix: Convert literal \n to actual newlines
    const fixedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients?.replace(/\\n/g, '\n'),
      instructions: recipe.instructions?.replace(/\\n/g, '\n'),
      garnish: recipe.garnish?.replace(/\\n/g, '\n'),
      ...(('tips' in recipe && recipe.tips) && {
        tips: recipe.tips.replace(/\\n/g, '\n')
      }),
    };
    
    return NextResponse.json({ recipe: fixedRecipe, error: null });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: `Failed to generate recipe: ${error.message || 'Unknown error'}`,
        recipe: null 
      },
      { status: 500 }
    );
  }
}

'use client';

import { Button } from '@/components/ui/button';
import { SaveRecipeButton } from '@/components/save-recipe-button';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';
import type { CuratedRecipe } from './types';

interface RecipeActionsProps {
  recipe: CuratedRecipe;
}

export function RecipeActions({ recipe }: RecipeActionsProps) {
  const { toast } = useToast();

  const buildRecipeText = useCallback(() => {
    const ingredientsText = recipe.ingredients
      .map((ingredient) => `• ${ingredient.measure} ${ingredient.name}`)
      .join('\n');

    const instructionsArray = Array.isArray(recipe.instructions)
      ? recipe.instructions
      : [recipe.instructions].filter(Boolean);

    const instructionsText = instructionsArray
      .map((instruction, index) => `${index + 1}. ${instruction}`)
      .join('\n');

    return `
${recipe.name}

Ingredients:
${ingredientsText}

Instructions:
${instructionsText}

Glassware: ${recipe.glassware}
Garnish: ${recipe.garnish || 'None'}
Prep Time: ${recipe.prepTime}
Difficulty: ${recipe.difficulty}

Source: ${recipe.source || 'Elixiary AI'}
`.trim();
  }, [recipe]);

  const copyRecipe = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildRecipeText());
      toast({
        title: 'Recipe copied!',
        description: 'Recipe has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy recipe to clipboard.',
        variant: 'destructive',
      });
    }
  }, [buildRecipeText, toast]);

  const shareRecipe = useCallback(async () => {
    const shareData = {
      title: recipe.name,
      text: `Check out this ${recipe.name} recipe from Elixiary AI!`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyRecipe();
      }
    } catch (error) {
      // Swallow the error; user may cancel share dialog
      console.error('Error sharing recipe:', error);
    }
  }, [copyRecipe, recipe.name]);

  return (
    <div className="flex gap-2">
      <SaveRecipeButton
        recipeId={recipe.id}
        recipeData={recipe}
        variant="outline"
        className="flex-1"
      />
      <Button onClick={copyRecipe} variant="outline" className="flex-1">
        <Copy className="h-4 w-4 mr-2" />
        Copy Recipe
      </Button>
      <Button onClick={shareRecipe} variant="outline" className="flex-1">
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
}

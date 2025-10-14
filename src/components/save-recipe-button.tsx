'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Loader2, Star } from 'lucide-react';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { useSubscription } from '@/firebase';
import { FeatureUpgradeDialog } from '@/components/feature-upgrade-dialog';

interface SaveRecipeButtonProps {
  recipeId: string;
  recipeData: any;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
  className?: string;
}

export function SaveRecipeButton({ 
  recipeId, 
  recipeData, 
  variant = 'outline',
  size = 'sm',
  showText = true,
  className = ''
}: SaveRecipeButtonProps) {
  const { isRecipeSaved, saveRecipe, unsaveRecipe } = useSavedRecipes();
  const { isPro } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const isSaved = isRecipeSaved(recipeId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the star button
    
    if (!isPro) {
      setShowUpgradeDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await unsaveRecipe(recipeId);
      } else {
        await saveRecipe(recipeId, recipeData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isLoading}
        className={`gap-2 ${className}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Star className={`h-4 w-4 ${isSaved ? 'text-yellow-500 fill-current' : ''}`} />
        )}
        {showText && (
          <span>
            {isSaved ? 'Saved' : 'Save Recipe'}
          </span>
        )}
        {!isPro && (
          <Badge variant="secondary" className="ml-1 gap-1 px-1.5">
            <Crown className="h-3 w-3" />
          </Badge>
        )}
      </Button>

      <FeatureUpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        feature="Save Curated Recipes"
        description="Save your favorite curated cocktail recipes to your personal collection and access them anytime from your profile."
        proFeatures={[
          'Save unlimited curated recipes',
          'Access saved recipes from your profile',
          'Organize your favorite cocktails',
          'Quick access to your go-to drinks'
        ]}
      />
    </>
  );
}

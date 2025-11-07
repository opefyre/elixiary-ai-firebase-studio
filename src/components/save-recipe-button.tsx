'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { useSubscription } from '@/firebase';
import { useBadges } from '@/hooks/use-badges';
import { FeatureUpgradeDialog } from '@/components/feature-upgrade-dialog';

interface SaveRecipeButtonProps {
  recipeId: string;
  recipeData: any;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg' | 'icon';
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
  const { updateBadges } = useBadges();
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const isSaved = isRecipeSaved(recipeId);
  const label = isSaved ? 'Unsave recipe' : 'Save recipe';

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
        
        // Update badges for recipe saving
        try {
          await updateBadges('recipe_saved');
        } catch (error) {
          // Silent error handling for badge updates
        }
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
        aria-label={label}
        title={label}
        className={cn(showText ? 'gap-2' : 'relative gap-0', className)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Star className={`h-4 w-4 ${isSaved ? 'text-yellow-500 fill-current' : ''}`} />
        )}
        {showText ? (
          <span>{isSaved ? 'Saved' : 'Save Recipe'}</span>
        ) : (
          <span className="sr-only">{label}</span>
        )}
        {!isPro && (
          showText ? (
            <Badge variant="secondary" className="ml-1 gap-1 px-1.5">
              <Crown className="h-3 w-3" />
            </Badge>
          ) : (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
            >
              <Crown className="h-2.5 w-2.5" />
            </span>
          )
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

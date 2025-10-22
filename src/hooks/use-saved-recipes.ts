import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirebase } from '@/firebase';
import { useToast } from './use-toast';

interface SavedRecipe {
  id: string;
  userId: string;
  recipeId: string;
  recipeData: any;
  savedAt: any;
  isCurated: boolean;
  source: string;
}

export function useSavedRecipes() {
  const { user } = useUser();
  const { auth } = useFirebase();
  const { toast } = useToast();
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch user's saved recipes
  const fetchSavedRecipes = useCallback(async () => {
    if (!user || !auth) return;

    setLoading(true);
    try {
      // Get token (don't force refresh to avoid quota issues)
      const token = await user.getIdToken();
      const response = await fetch('/api/user-recipes/saved', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSavedRecipes(data.savedRecipes || []);
        setSavedRecipeIds(new Set(data.savedRecipes?.map((r: SavedRecipe) => r.recipeId) || []));
      }
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      // Silent error handling for fetching saved recipes
    } finally {
      setLoading(false);
    }
  }, [user, auth]);

  // Check if a specific recipe is saved
  const isRecipeSaved = useCallback((recipeId: string) => {
    return savedRecipeIds.has(recipeId);
  }, [savedRecipeIds]);

  // Save a recipe
  const saveRecipe = useCallback(async (recipeId: string, recipeData: any) => {
    if (!user || !auth) return false;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/user-recipes/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipeId,
          recipeData
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Optimistic update
        setSavedRecipeIds(prev => new Set([...prev, recipeId]));
        toast({
          title: 'Recipe Saved!',
          description: 'Added to your saved recipes collection.',
        });
        return true;
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save recipe',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save recipe',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, auth, toast]);

  // Unsave a recipe
  const unsaveRecipe = useCallback(async (recipeId: string) => {
    if (!user || !auth) return false;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/user-recipes/unsave', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipeId
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Optimistic update
        setSavedRecipeIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
        setSavedRecipes(prev => prev.filter(r => r.recipeId !== recipeId));
        toast({
          title: 'Recipe Removed',
          description: 'Removed from your saved recipes.',
        });
        return true;
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to remove recipe',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove recipe',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, auth, toast]);

  // Load saved recipes on mount
  useEffect(() => {
    fetchSavedRecipes();
  }, [fetchSavedRecipes]);

  return {
    savedRecipes,
    savedRecipeIds,
    loading,
    isRecipeSaved,
    saveRecipe,
    unsaveRecipe,
    refetch: fetchSavedRecipes
  };
}

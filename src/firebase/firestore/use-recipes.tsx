'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { useRecipeActions } from '@/firebase/firestore/use-recipe-actions';
import type { GenerateCocktailRecipeOutput } from '@/ai/flows/generate-cocktail-recipe';

export interface SavedRecipe extends GenerateCocktailRecipeOutput {
  id: string;
  userId: string;
  userPrompt: string;
  createdAt: any;
  tags?: string[];
  collection?: string;
  isFavorite?: boolean;
  imageUrl?: string;
  imagePrompt?: string;
}

export function useRecipes() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const actions = useRecipeActions();

  useEffect(() => {
    if (!user) {
      setRecipes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const recipesRef = collection(firestore, `users/${user.uid}/recipes`);
    const q = query(recipesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const recipeData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SavedRecipe[];
        setRecipes(recipeData);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching recipes:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, firestore]);

  return {
    recipes,
    isLoading,
    error,
    ...actions,
  };
}


'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import type { GenerateCocktailRecipeOutput } from '@/ai/flows/generate-cocktail-recipe';

export interface SavedRecipe extends GenerateCocktailRecipeOutput {
  id: string;
  userId: string;
  userPrompt: string;
  createdAt: any;
}

export function useRecipes() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  const saveRecipe = async (
    recipe: GenerateCocktailRecipeOutput,
    userPrompt: string
  ) => {
    if (!user) throw new Error('User must be authenticated to save recipes');

    const recipesRef = collection(firestore, `users/${user.uid}/recipes`);
    await addDoc(recipesRef, {
      ...recipe,
      userId: user.uid,
      userPrompt,
      createdAt: serverTimestamp(),
    });
  };

  const deleteRecipe = async (recipeId: string) => {
    if (!user) throw new Error('User must be authenticated to delete recipes');

    const recipeRef = doc(firestore, `users/${user.uid}/recipes/${recipeId}`);
    await deleteDoc(recipeRef);
  };

  return {
    recipes,
    isLoading,
    error,
    saveRecipe,
    deleteRecipe,
  };
}


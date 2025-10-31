'use client';

import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase/provider';
import { updateRecipeCount } from '@/firebase/firestore/use-subscription';
import type { GenerateCocktailRecipeOutput } from '@/ai/flows/generate-cocktail-recipe';

type UserLike = ReturnType<typeof useUser>['user'];

function assertUser(user: UserLike, message: string) {
  if (!user) {
    throw new Error(message);
  }

  return user;
}

export function useRecipeActions() {
  const firestore = useFirestore();
  const { user } = useUser();

  const saveRecipe = async (
    recipe: GenerateCocktailRecipeOutput,
    userPrompt: string
  ) => {
    const currentUser = assertUser(user, 'User must be authenticated to save recipes');
    const recipesRef = collection(firestore, `users/${currentUser.uid}/recipes`);
    await addDoc(recipesRef, {
      ...recipe,
      userId: currentUser.uid,
      userPrompt,
      createdAt: serverTimestamp(),
    });

    await updateRecipeCount(currentUser.uid, firestore, 1);
  };

  const deleteRecipe = async (recipeId: string) => {
    const currentUser = assertUser(user, 'User must be authenticated to delete recipes');
    const recipeRef = doc(firestore, `users/${currentUser.uid}/recipes/${recipeId}`);
    await deleteDoc(recipeRef);

    await updateRecipeCount(currentUser.uid, firestore, -1);
  };

  const updateRecipeTags = async (recipeId: string, tags: string[]) => {
    const currentUser = assertUser(user, 'User must be authenticated');
    const recipeRef = doc(firestore, `users/${currentUser.uid}/recipes/${recipeId}`);
    await updateDoc(recipeRef, { tags });
  };

  const updateRecipeCollection = async (recipeId: string, collection: string) => {
    const currentUser = assertUser(user, 'User must be authenticated');
    const recipeRef = doc(firestore, `users/${currentUser.uid}/recipes/${recipeId}`);
    await updateDoc(recipeRef, { collection });
  };

  const toggleFavorite = async (recipeId: string, isFavorite: boolean) => {
    const currentUser = assertUser(user, 'User must be authenticated');
    const recipeRef = doc(firestore, `users/${currentUser.uid}/recipes/${recipeId}`);
    await updateDoc(recipeRef, { isFavorite });
  };

  const updateRecipeImage = async (
    recipeId: string,
    imageUrl: string,
    imagePrompt?: string
  ) => {
    const currentUser = assertUser(user, 'User must be authenticated');
    const recipeRef = doc(firestore, `users/${currentUser.uid}/recipes/${recipeId}`);
    await updateDoc(recipeRef, {
      imageUrl,
      ...(imagePrompt && { imagePrompt }),
    });
  };

  return {
    saveRecipe,
    deleteRecipe,
    updateRecipeTags,
    updateRecipeCollection,
    toggleFavorite,
    updateRecipeImage,
  };
}

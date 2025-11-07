export interface Category {
  id: string;
  name: string;
  description: string;
  recipeCount?: number;
  icon?: string;
  color?: string;
  sortOrder?: number;
}

export type { CuratedRecipeSummary as CuratedRecipe } from '../../types';

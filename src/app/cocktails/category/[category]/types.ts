export interface Category {
  id: string;
  name: string;
  description: string;
  recipeCount?: number;
  icon?: string;
  color?: string;
  sortOrder?: number;
}

export interface CuratedRecipe {
  id: string;
  name: string;
  ingredients: Array<{
    name: string;
    measure: string;
    amount?: number;
    unit?: string;
    ingredient?: string;
  }>;
  instructions: string | string[];
  glassware: string;
  garnish?: string;
  category: string;
  categoryId?: string;
  difficulty: string;
  prepTime: string;
  tags: string[];
  moods?: string[];
  imageUrl?: string;
  isCurated?: boolean;
  source?: string;
}

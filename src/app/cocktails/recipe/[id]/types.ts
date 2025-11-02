export interface CuratedRecipeIngredient {
  name: string;
  measure: string;
  amount?: number;
  unit?: string;
  ingredient?: string;
}

export interface CuratedRecipe {
  id: string;
  name: string;
  ingredients: CuratedRecipeIngredient[];
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

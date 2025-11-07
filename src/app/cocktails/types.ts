export interface CuratedRecipeSummary {
  id: string;
  name: string;
  prepTime: string;
  glassware: string;
  difficulty: string;
  tags: string[];
  imageUrl?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  recipeCount: number;
  icon: string;
  color: string;
  sortOrder: number;
}

export interface Tag {
  id: string;
  name: string;
  type: string;
  count: number;
  color: string;
}

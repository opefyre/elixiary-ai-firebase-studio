import { CuratedCocktailsClient } from './curated-client';
import { Category, CuratedRecipe, Tag } from './types';

interface InitialCocktailsData {
  recipes: CuratedRecipe[];
  categories: Category[];
  tags: Tag[];
  hasMore: boolean;
  error?: string;
}

async function loadInitialCocktailsData(): Promise<InitialCocktailsData> {
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');
    const [recipesRes, categoriesRes, tagsRes] = await Promise.all([
      fetch(`${baseUrl}/api/curated-recipes?limit=20&page=1`, {
        cache: 'no-store'
      }),
      fetch(`${baseUrl}/api/curated-categories`, {
        cache: 'no-store'
      }),
      fetch(`${baseUrl}/api/curated-tags`, {
        cache: 'no-store'
      })
    ]);

    if (!recipesRes.ok || !categoriesRes.ok || !tagsRes.ok) {
      throw new Error('Failed to load curated cocktails');
    }

    const [recipesData, categoriesData, tagsData] = await Promise.all([
      recipesRes.json(),
      categoriesRes.json(),
      tagsRes.json()
    ]);

    return {
      recipes: recipesData.recipes || [],
      categories: categoriesData.categories || [],
      tags: tagsData.tags || [],
      hasMore: recipesData.pagination?.hasNext ?? false
    };
  } catch (error) {
    console.error('Error loading curated cocktails', error);
    return {
      recipes: [],
      categories: [],
      tags: [],
      hasMore: false,
      error: 'Unable to load curated cocktail data at this time.'
    };
  }
}

export default async function CuratedPage() {
  const initialData = await loadInitialCocktailsData();

  return (
    <CuratedCocktailsClient
      initialRecipes={initialData.recipes}
      initialCategories={initialData.categories}
      initialTags={initialData.tags}
      initialHasMore={initialData.hasMore}
      initialError={initialData.error}
    />
  );
}

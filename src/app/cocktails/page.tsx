import { CuratedCocktailsClient } from './curated-client';
import { Category, CuratedRecipeSummary, Tag } from './types';
import { initializeFirebaseServer } from '@/firebase/server';

interface InitialCocktailsData {
  recipes: CuratedRecipeSummary[];
  categories: Category[];
  tags: Tag[];
  hasMore: boolean;
  error?: string;
}

async function loadInitialCocktailsData(): Promise<InitialCocktailsData> {
  try {
    const { adminDb } = initializeFirebaseServer();

    const limit = 20;

    const recipesQuery = adminDb
      .collection('curated-recipes')
      .orderBy('name', 'asc')
      .limit(limit);

    const categoriesQuery = adminDb
      .collection('curated-categories')
      .orderBy('sortOrder', 'asc');

    const tagsQuery = adminDb
      .collection('curated-tags')
      .orderBy('count', 'desc');

    const [recipesSnapshot, totalRecipesSnapshot, categoriesSnapshot, tagsSnapshot] =
      await Promise.all([
        recipesQuery.get(),
        adminDb.collection('curated-recipes').get(),
        categoriesQuery.get(),
        tagsQuery.get()
      ]);

    const recipes = recipesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        prepTime: data.prepTime,
        glassware: data.glassware,
        difficulty: data.difficulty,
        tags: data.tags ?? [],
        imageUrl: data.imageUrl ?? null
      } as CuratedRecipeSummary;
    });

    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];

    const tags = tagsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tag[];

    const total = totalRecipesSnapshot.size;

    return {
      recipes,
      categories,
      tags,
      hasMore: limit < total
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

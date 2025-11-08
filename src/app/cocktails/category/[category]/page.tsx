import { notFound } from 'next/navigation';
import { initializeFirebaseServer } from '@/firebase/server';
import { Badge } from '@/components/ui/badge';
import { Martini } from 'lucide-react';
import { CocktailBreadcrumbs } from '@/app/cocktails/_components';
import { getCategoryDisplayName } from '@/lib/cocktails';
import { CategoryRecipesGrid } from './category-recipes-grid';
import type { Category, CuratedRecipe } from './types';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const INITIAL_LIMIT = 20;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { adminDb } = initializeFirebaseServer();

  const categoryDoc = await adminDb.collection('curated-categories').doc(params.category).get();

  if (!categoryDoc.exists) {
    notFound();
  }

  const category = { id: categoryDoc.id, ...(categoryDoc.data() as Omit<Category, 'id'>) } as Category;

  let recipesQuery = adminDb
    .collection('curated-recipes')
    .where('categoryId', '==', params.category)
    .orderBy('name', 'asc')
    .limit(INITIAL_LIMIT + 1);

  let recipesSnapshot = await recipesQuery.get();

  if (recipesSnapshot.empty) {
    recipesQuery = adminDb
      .collection('curated-recipes')
      .where('category', '==', params.category)
      .orderBy('name', 'asc')
      .limit(INITIAL_LIMIT + 1);

    recipesSnapshot = await recipesQuery.get();
  }
  const recipesDocs = recipesSnapshot.docs;

  const recipes = recipesDocs.slice(0, INITIAL_LIMIT).map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      prepTime: data.prepTime,
      glassware: data.glassware,
      difficulty: data.difficulty,
      tags: data.tags ?? [],
      imageUrl: data.imageUrl ?? null,
    } as CuratedRecipe;
  });

  const hasMore = recipesDocs.length > INITIAL_LIMIT;

  const displayName = getCategoryDisplayName(category);
  const breadcrumbs = [
    { label: 'Cocktails', href: '/cocktails' },
    { label: displayName, href: `/cocktails/category/${params.category}` },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <CocktailBreadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Martini className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-4 text-4xl font-bold">{displayName}</h1>
        {category.description && (
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{category.description}</p>
        )}
        <div className="mt-4">
          <Badge variant="secondary" className="text-sm">
            {category.recipeCount ?? recipes.length} recipes
          </Badge>
        </div>
      </div>

      <CategoryRecipesGrid
        initialRecipes={recipes}
        categoryId={params.category}
        initialHasMore={hasMore}
      />
    </div>
  );
}

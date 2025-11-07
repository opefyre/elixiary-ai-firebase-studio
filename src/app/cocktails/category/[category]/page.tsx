import Link from 'next/link';
import { notFound } from 'next/navigation';
import { initializeFirebaseServer } from '@/firebase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Martini, ArrowLeft } from 'lucide-react';
import { CategoryRecipesGrid } from './category-recipes-grid';
import type { Category, CuratedRecipe } from './types';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const INITIAL_LIMIT = 20;

const getCategoryDisplayName = (category: Category) => {
  if (category.name) {
    return category.name;
  }

  return category.id
    .replace(/^cat_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { adminDb } = initializeFirebaseServer();

  const categoryDoc = await adminDb.collection('curated-categories').doc(params.category).get();

  if (!categoryDoc.exists) {
    notFound();
  }

  const category = { id: categoryDoc.id, ...(categoryDoc.data() as Omit<Category, 'id'>) } as Category;

  const recipesQuery = adminDb
    .collection('curated-recipes')
    .where('category', '==', params.category)
    .orderBy('name', 'asc')
    .limit(INITIAL_LIMIT + 1);

  const recipesSnapshot = await recipesQuery.get();
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

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/cocktails">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cocktails
          </Link>
        </Button>
      </div>

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

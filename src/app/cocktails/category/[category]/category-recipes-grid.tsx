'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Martini, Clock, Zap } from 'lucide-react';
import { SaveRecipeButton } from '@/components/save-recipe-button';
import type { CuratedRecipe } from './types';

interface CategoryRecipesGridProps {
  initialRecipes: CuratedRecipe[];
  categoryId: string;
  initialHasMore: boolean;
}

const formatTagText = (tag: string) => {
  const cleaned = tag.replace(/^style\s+/i, '').replace(/_/g, ' ');
  return cleaned.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getGoogleDriveThumbnail = (url?: string | null) => {
  if (!url) return null;

  const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId[1]}=w400-h600-p`;
  }

  return url;
};

export function CategoryRecipesGrid({
  initialRecipes,
  categoryId,
  initialHasMore,
}: CategoryRecipesGridProps) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      return;
    }

    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: nextPage.toString(),
        limit: '20',
        category: categoryId,
      });

      const response = await fetch(`/api/curated-recipes?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to load more recipes');
      }

      setRecipes((prev) => [...prev, ...data.recipes]);
      setPage(nextPage);
      setHasMore(data.pagination?.hasNext ?? false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, hasMore, isLoading, page]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {recipes.map((recipe) => (
          <Link key={recipe.id} href={`/cocktails/recipe/${recipe.id}`} className="block">
            <Card className="group h-full cursor-pointer transition-all duration-300 hover:shadow-lg">
              <CardContent className="flex h-full flex-col p-0">
                <div className="relative h-80 flex-shrink-0 overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 to-primary/5">
                  {recipe.imageUrl ? (
                    <Image
                      src={getGoogleDriveThumbnail(recipe.imageUrl) || recipe.imageUrl}
                      alt={recipe.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.classList.add('hidden');
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <Martini className="h-16 w-16 text-primary/30" />
                    </div>
                  )}

                  <div className="absolute right-3 top-3">
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-grow flex-col p-4">
                  <h3 className="mb-3 line-clamp-2 flex-grow text-lg font-semibold">
                    {recipe.name}
                  </h3>

                  <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">{recipe.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5" />
                      <span className="text-xs">{recipe.glassware}</span>
                    </div>
                  </div>

                  <div className="mt-auto mb-3 flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-muted/50 px-2 py-0.5 text-xs">
                        {formatTagText(tag)}
                      </Badge>
                    ))}
                    {recipe.tags.length > 2 && (
                      <Badge variant="secondary" className="bg-muted/50 px-2 py-0.5 text-xs">
                        +{recipe.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <SaveRecipeButton
                      recipeId={recipe.id}
                      recipeData={recipe}
                      variant="ghost"
                      size="sm"
                      showText={false}
                      className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <Button onClick={handleLoadMore} variant="outline" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More Recipes'}
          </Button>
        </div>
      )}

      {recipes.length === 0 && !hasMore && (
        <div className="py-12 text-center">
          <Martini className="mb-4 h-16 w-16 mx-auto text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold">No recipes found</h3>
          <p className="text-muted-foreground">This category doesn&apos;t have any recipes yet.</p>
        </div>
      )}
    </>
  );
}

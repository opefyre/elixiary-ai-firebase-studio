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
      return 'bg-emerald-500/80 text-white shadow-lg backdrop-blur-sm';
    case 'medium':
      return 'bg-amber-500/80 text-white shadow-lg backdrop-blur-sm';
    case 'hard':
      return 'bg-rose-500/80 text-white shadow-lg backdrop-blur-sm';
    default:
      return 'bg-slate-500/80 text-white shadow-lg backdrop-blur-sm';
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <Link key={recipe.id} href={`/cocktails/recipe/${recipe.id}`} className="block">
            <Card className="group relative h-full overflow-hidden rounded-3xl border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <CardContent className="relative flex h-full flex-col p-0">
                <div className="relative flex h-full min-h-[28rem] flex-col">
                  {recipe.imageUrl ? (
                    <Image
                      src={getGoogleDriveThumbnail(recipe.imageUrl) || recipe.imageUrl}
                      alt={recipe.name}
                      fill
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.classList.add('hidden');
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/40 to-primary/10 text-white/70">
                      <Martini className="h-16 w-16" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10 transition-opacity duration-300 group-hover:from-black/85 group-hover:via-black/60" />

                  <div className="relative z-10 flex h-full flex-col justify-between p-5">
                    <div className="flex items-start justify-between gap-3">
                      <Badge className={`rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-white drop-shadow-lg">
                          {recipe.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-wide text-white/80">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-white/70" />
                            <span>{recipe.prepTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-white/70" />
                            <span>{recipe.glassware}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {recipe.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-sm"
                          >
                            {formatTagText(tag)}
                          </Badge>
                        ))}
                        {recipe.tags.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-sm"
                          >
                            +{recipe.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium uppercase tracking-wide text-white/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          View full recipe
                        </span>

                        <SaveRecipeButton
                          recipeId={recipe.id}
                          recipeData={recipe}
                          variant="ghost"
                          size="sm"
                          showText={false}
                          className="rounded-full border border-white/20 bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white group-hover:opacity-100"
                        />
                      </div>
                    </div>
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

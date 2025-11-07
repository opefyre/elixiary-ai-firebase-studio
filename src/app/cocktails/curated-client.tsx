'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/firebase';
import {
  Search,
  Filter,
  Clock,
  Zap,
  Martini,
  Loader2,
  Star
} from 'lucide-react';
import { CuratedRecipe, Category, Tag } from './types';

interface CuratedCocktailsClientProps {
  initialRecipes: CuratedRecipe[];
  initialCategories: Category[];
  initialTags: Tag[];
  initialHasMore: boolean;
  initialError?: string;
}

interface FetchOptions {
  page?: number;
  append?: boolean;
  query?: string;
  categoryOverride?: string | null;
  difficultyOverride?: string | null;
  tagsOverride?: string[];
}

const DynamicSaveRecipeButton = dynamic(
  () => import('@/components/save-recipe-button').then((mod) => mod.SaveRecipeButton),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="sr-only">Preparing save option...</span>
      </Button>
    )
  }
);

export function CuratedCocktailsClient({
  initialRecipes,
  initialCategories,
  initialTags,
  initialHasMore,
  initialError
}: CuratedCocktailsClientProps) {
  const [recipes, setRecipes] = useState<CuratedRecipe[]>(initialRecipes);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(initialError ?? null);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  const filtersInitialized = useRef(false);
  const { user } = useUser();
  const router = useRouter();

  const handlePromptSignIn = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const redirectPath = typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : '/cocktails';
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    },
    [router]
  );

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

  const getGoogleDriveThumbnail = (url: string, width = 400, height = 600) => {
    if (!url) return null;
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId[1]}=w${width}-h${height}-c`;
    }
    return url;
  };

  const fetchRecipes = useCallback(async ({
    page: pageParam = 1,
    append = false,
    query,
    categoryOverride,
    difficultyOverride,
    tagsOverride
  }: FetchOptions = {}) => {
    const searchTerm = (query ?? lastSearchQuery ?? '').trim();
    const isSearchRequest = searchTerm.length >= 3;
    const categoryFilter = categoryOverride ?? selectedCategory;
    const difficultyFilter = difficultyOverride ?? selectedDifficulty;
    const tagFilter = tagsOverride ?? selectedTags;

    try {
      setSearchError(null);
      if (isSearchRequest) {
        setIsSearching(true);
      }
      setIsLoading(true);

      if (!append && pageParam === 1 && !isSearchRequest) {
        setPage(1);
      }

      if (!append && pageParam === 1) {
        setHasMore(true);
      }

      const params = new URLSearchParams({
        limit: '20',
        page: pageParam.toString()
      });

      if (categoryFilter) params.append('category', categoryFilter);
      if (difficultyFilter) params.append('difficulty', difficultyFilter);
      if (tagFilter.length > 0) params.append('tags', tagFilter.join(','));

      let data: any = null;

      if (isSearchRequest) {
        const searchParams = new URLSearchParams({
          q: searchTerm,
          limit: '20',
          offset: ((pageParam - 1) * 20).toString()
        });

        const response = await fetch(`/api/curated-recipes/search?${searchParams.toString()}`);

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        data = await response.json();
      } else {
        const response = await fetch(`/api/curated-recipes?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch recipes: ${response.status}`);
        }

        data = await response.json();
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const newRecipes: CuratedRecipe[] = data.recipes || [];
      const hasNext = data.pagination?.hasNext ?? false;

      setHasMore(hasNext);

      if (append) {
        setRecipes(prev => [...prev, ...newRecipes]);
        setPage(pageParam);
      } else {
        setRecipes(newRecipes);
        setPage(pageParam);
      }

      if (isSearchRequest || searchTerm.length === 0) {
        setLastSearchQuery(searchTerm);
      }
    } catch (error: any) {
      setSearchError(error.message || 'Failed to fetch recipes');
      if (!append) {
        setRecipes([]);
      }
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [lastSearchQuery, selectedCategory, selectedDifficulty, selectedTags]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery === lastSearchQuery) {
        return;
      }

      if (trimmedQuery.length >= 3) {
        setLastSearchQuery(trimmedQuery);
        fetchRecipes({ page: 1, append: false, query: trimmedQuery });
        setPage(1);
      } else if (trimmedQuery.length === 0) {
        setLastSearchQuery('');
        fetchRecipes({ page: 1, append: false, query: '' });
        setPage(1);
      } else {
        setRecipes([]);
        setHasMore(false);
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, lastSearchQuery, fetchRecipes]);

  useEffect(() => {
    if (!filtersInitialized.current) {
      filtersInitialized.current = true;
      return;
    }

    fetchRecipes({ page: 1, append: false });
  }, [selectedCategory, selectedDifficulty, selectedTags, fetchRecipes]);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length >= 3 || trimmedQuery.length === 0) {
      fetchRecipes({ page: 1, append: false, query: trimmedQuery });
      setPage(1);
      setLastSearchQuery(trimmedQuery);
    }
  };

  const handleLoadMore = () => {
    if (isLoading) return;
    const nextPage = page + 1;
    fetchRecipes({ page: nextPage, append: true });
  };

  const clearFilters = () => {
    filtersInitialized.current = false;
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSelectedTags([]);
    setSearchQuery('');
    setLastSearchQuery('');
    setPage(1);
    fetchRecipes({
      page: 1,
      append: false,
      query: '',
      categoryOverride: null,
      difficultyOverride: null,
      tagsOverride: []
    });
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const categories = initialCategories;
  const tags = initialTags;

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Cocktails</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {lastSearchQuery && lastSearchQuery.length >= 3 ? (
            <>
              Search results for "<span className="font-semibold text-primary">{lastSearchQuery}</span>"
              {recipes.length > 0 && (
                <span className="block text-sm mt-1">
                  Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
                </span>
              )}
            </>
          ) : (
            'Discover our collection of professionally curated cocktail recipes from around the world.'
          )}
        </p>
      </div>

      <div className="mb-8 space-y-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cocktails, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-4"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {searchError && (
          <div className="text-center">
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-md">
              Search error: {searchError}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <div className="flex-1">
            <Select value={selectedCategory || 'all'} onValueChange={(value: string) => setSelectedCategory(value === 'all' ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name} ({category.recipeCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select value={selectedDifficulty || 'all'} onValueChange={(value: string) => setSelectedDifficulty(value === 'all' ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(selectedCategory || selectedDifficulty || selectedTags.length > 0 || searchQuery) && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="whitespace-nowrap">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2 justify-center">
            <Filter className="h-4 w-4" />
            Popular Tags
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag) => {
              const isActive = selectedTags.includes(tag.id);
              return (
                <Badge
                  key={tag.id}
                  variant={isActive ? 'default' : 'secondary'}
                  className={`cursor-pointer px-3 py-1 text-xs transition ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-muted-foreground'}`}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
        {recipes.map((recipe, index) => (
          <Card
            key={recipe.id}
            className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm cursor-pointer h-full"
            onClick={() => (window.location.href = `/cocktails/recipe/${recipe.id}`)}
          >
            <CardContent className="p-0 h-full flex flex-col">
              <div className="relative h-80 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden flex-shrink-0">
                {recipe.imageUrl ? (
                  <Image
                    src={getGoogleDriveThumbnail(recipe.imageUrl, 400, 600) || recipe.imageUrl}
                    alt={recipe.name}
                    width={400}
                    height={600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.classList.add('hidden');
                    }}
                    priority={index === 0}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <Martini className="h-12 w-12 text-primary/40" />
                  </div>
                )}

                <div className="absolute top-3 right-3">
                  <Badge className={`${getDifficultyColor(recipe.difficulty)} text-xs font-medium px-2 py-1`}>
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-3 line-clamp-2 leading-tight">
                  {recipe.name}
                </h3>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" />
                    <span className="text-xs">{recipe.glassware}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3 mt-auto">
                  {recipe.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 bg-muted/50">
                      {tag.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                  {recipe.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-muted/50">
                      +{recipe.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-center">
                  {user ? (
                    <DynamicSaveRecipeButton
                      recipeId={recipe.id}
                      recipeData={recipe}
                      variant="ghost"
                      size="sm"
                      showText={false}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePromptSignIn}
                      title="Sign in to save recipes"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Star className="h-4 w-4" />
                      <span className="sr-only">Sign in to save recipes</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && !isSearching && recipes.length > 0 && (
        <div className="text-center">
          <Button onClick={handleLoadMore} variant="outline" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {isSearching && (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Searching...</span>
          </div>
        </div>
      )}

      {lastSearchQuery && lastSearchQuery.length >= 3 && !isSearching && recipes.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
            <p className="text-muted-foreground mb-4">
              No recipes match your search for "<span className="font-medium">{lastSearchQuery}</span>"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          </div>
        </div>
      )}

      {recipes.length === 0 && !isSearching && !isLoading && (
        <div className="text-center py-12">
          <Martini className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Clock, 
  Zap, 
  Martini,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { SaveRecipeButton } from '@/components/save-recipe-button';

interface CuratedRecipe {
  id: string;
  name: string;
  ingredients: Array<{
    name: string;
    measure: string;
    amount: number;
    unit: string;
    ingredient: string;
  }>;
  instructions: string[];
  glassware: string;
  garnish: string;
  category: string;
  categoryId: string;
  difficulty: string;
  prepTime: string;
  tags: string[];
  moods: string[];
  imageUrl: string;
  isCurated: boolean;
  source: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  recipeCount: number;
  icon: string;
  color: string;
  sortOrder: number;
}

interface Tag {
  id: string;
  name: string;
  type: string;
  count: number;
  color: string;
}

export default function CuratedPage() {
  const [recipes, setRecipes] = useState<CuratedRecipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch recipes when filters change
  useEffect(() => {
    if (categories.length > 0) {
      fetchRecipes();
    }
  }, [selectedCategory, selectedDifficulty, selectedTags, page]);

  // Fetch initial recipes when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && recipes.length === 0) {
      fetchRecipes();
    }
  }, [categories]);

  const fetchData = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch('/api/v1/categories'),
        fetch('/api/v1/tags')
      ]);

      const [categoriesData, tagsData] = await Promise.all([
        categoriesRes.json(),
        tagsRes.json()
      ]);

      setCategories(categoriesData.data || []);
      setTags(tagsData.data || []);
      
      // Don't set loading to false here - wait for recipes to load
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Only set to false on error
    }
  };

  const fetchRecipes = async () => {
    try {
      setSearchError(null);
      
      // If there's a search query, use the search API
      if (searchQuery && searchQuery.trim().length >= 3) {
        const params = new URLSearchParams({
          q: searchQuery.trim(),
          limit: '20',
          offset: ((page - 1) * 20).toString()
        });

        const response = await fetch(`/api/v1/recipes?${params}`);
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }
        
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Search failed');
        }

        const recipes = data.data.recipes || [];
        const pagination = data.data.pagination || {};

        if (page === 1) {
          setRecipes(recipes);
        } else {
          setRecipes(prev => [...prev, ...recipes]);
        }

        setHasMore(pagination.hasNext || false);
        setIsSearching(false);
        return;
      }

      // Regular filtered search
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));

      const response = await fetch(`/api/v1/recipes?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.status}`);
      }
      
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch recipes');
      }

      const recipes = data.data.recipes || [];
      const pagination = data.data.pagination || {};

      if (page === 1) {
        setRecipes(recipes);
      } else {
        setRecipes(prev => [...prev, ...recipes]);
      }

      setHasMore(pagination.hasNext || false);
      setIsSearching(false);
      setLoading(false); // Set loading to false when recipes are loaded
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      setSearchError(error.message || 'Failed to fetch recipes');
      setIsSearching(false);
      setLoading(false); // Set loading to false even on error
    }
  };

  // Optimized debounced search with better rate limiting
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();
      
      // Only search if query is different from last search (prevents duplicate requests)
      if (trimmedQuery !== lastSearchQuery) {
        setLastSearchQuery(trimmedQuery);
        
        if (trimmedQuery.length >= 3) {
          // Only search with 3+ characters to reduce server load
          setIsSearching(true);
          setPage(1);
          setRecipes([]); // Clear current recipes
          fetchRecipes();
        } else if (trimmedQuery.length === 0) {
          // If search is cleared, reload all recipes
          setPage(1);
          setRecipes([]);
          fetchRecipes();
        } else {
          // For 1-2 characters, clear results but don't search yet
          setRecipes([]);
          setHasMore(false);
        }
      }
    }, 800); // Increased debounce time to 800ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, lastSearchQuery]);

  const handleSearch = () => {
    setPage(1);
    fetchRecipes();
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSelectedTags([]);
    setSearchQuery('');
    setPage(1);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
    setPage(1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (iconName: string) => {
    // Return appropriate icon component based on iconName
    return <Martini className="h-5 w-5" />;
  };

  const getGoogleDriveThumbnail = (url: string) => {
    if (!url) return null;
    
    // Convert Google Drive file URL to optimized image URL
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileId) {
      // Use optimized size for faster loading - w400 for card thumbnails
      return `https://lh3.googleusercontent.com/d/${fileId[1]}=w400-h600-p`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Search and Filters Skeleton */}
          <div className="space-y-6">
            <div className="max-w-md mx-auto">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>

          {/* Recipe Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-80 w-full" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Cocktails</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {searchQuery && searchQuery.trim().length >= 3 ? (
            <>
              Search results for "<span className="font-semibold text-primary">{searchQuery}</span>"
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

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cocktails, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-4"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        
        {/* Search Error Display */}
        {searchError && (
          <div className="text-center">
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-md">
              Search error: {searchError}
            </p>
          </div>
        )}
        

        {/* Filter Section with Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          {/* Category Filter */}
          <div className="flex-1">
            <Select value={selectedCategory || "all"} onValueChange={(value: string) => setSelectedCategory(value === "all" ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.recipeCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex-1">
            <Select value={selectedDifficulty || "all"} onValueChange={(value: string) => setSelectedDifficulty(value === "all" ? null : value)}>
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

          {/* Clear Filters */}
          {(selectedCategory || selectedDifficulty || selectedTags.length > 0 || searchQuery) && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="whitespace-nowrap">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
        {recipes.map((recipe) => (
          <Card 
            key={recipe.id} 
            className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm cursor-pointer h-full"
            onClick={() => window.location.href = `/cocktails/recipe/${recipe.id}`}
          >
            <CardContent className="p-0 h-full flex flex-col">
                {/* Recipe Image */}
                <div className="relative h-80 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden flex-shrink-0">
                  {recipe.imageUrl ? (
                    <Image
                      src={getGoogleDriveThumbnail(recipe.imageUrl) || recipe.imageUrl}
                      alt={recipe.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <Martini className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getDifficultyColor(recipe.difficulty)} text-xs font-medium px-2 py-1`}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Recipe Info - Better organized and distributed */}
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

                  {/* Tags - Better spacing and alignment */}
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

                  {/* Save Recipe Button */}
                  <div className="flex justify-center">
                    <SaveRecipeButton 
                      recipeId={recipe.id} 
                      recipeData={recipe}
                      variant="ghost"
                      size="sm"
                      showText={false}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </div>

                </div>
              </CardContent>
            </Card>
        ))}
      </div>

      {/* Load More */}
      {hasMore && !isSearching && (
        <div className="text-center">
          <Button onClick={handleLoadMore} variant="outline" disabled={loading}>
            {loading ? (
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

      {/* Search Loading State */}
      {isSearching && (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Searching...</span>
          </div>
        </div>
      )}

      {/* No Search Results State */}
      {searchQuery && searchQuery.trim().length >= 3 && !isSearching && recipes.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
            <p className="text-muted-foreground mb-4">
              No recipes match your search for "<span className="font-medium">{searchQuery}</span>"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {recipes.length === 0 && !loading && (
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

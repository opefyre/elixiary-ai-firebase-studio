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
  ChevronRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
        fetch('/api/curated-categories'),
        fetch('/api/curated-tags')
      ]);

      const [categoriesData, tagsData] = await Promise.all([
        categoriesRes.json(),
        tagsRes.json()
      ]);

      setCategories(categoriesData.categories);
      setTags(tagsData.tags);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      // If there's a search query, use the search API
      if (searchQuery && searchQuery.trim().length >= 2) {
        const params = new URLSearchParams({
          q: searchQuery.trim(),
          limit: '20',
          offset: ((page - 1) * 20).toString()
        });

        const response = await fetch(`/api/curated-recipes/search?${params}`);
        const data = await response.json();

        if (page === 1) {
          setRecipes(data.recipes);
        } else {
          setRecipes(prev => [...prev, ...data.recipes]);
        }

        setHasMore(data.hasMore);
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

      const response = await fetch(`/api/curated-recipes?${params}`);
      const data = await response.json();

      if (page === 1) {
        setRecipes(data.recipes);
      } else {
        setRecipes(prev => [...prev, ...data.recipes]);
      }

      setHasMore(data.pagination.hasNext);
      setIsSearching(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        setPage(1);
        setRecipes([]); // Clear current recipes
        fetchRecipes();
      } else if (searchQuery.trim().length === 0) {
        // If search is cleared, reload all recipes
        setPage(1);
        setRecipes([]);
        fetchRecipes();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
    
    // Convert Google Drive file URL to direct image URL
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId[1]}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
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
        <h1 className="text-4xl font-bold mb-4">Curated Cocktails</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover our collection of {recipes.length > 0 ? '495+' : ''} professionally curated cocktail recipes from around the world.
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              {/* Recipe Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden">
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
                ) : null}
                
                {/* Fallback placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <Martini className="h-12 w-12 text-primary/40" />
                </div>
                
                {/* Difficulty Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className={`${getDifficultyColor(recipe.difficulty)} text-xs font-medium px-2 py-1`}>
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-3 line-clamp-2 leading-tight">
                  {recipe.name}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" />
                    <span className="text-xs">{recipe.glassware}</span>
                  </div>
                </div>

                {/* Tags - Only show 2 most relevant */}
                <div className="flex flex-wrap gap-1 mb-4">
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

                {/* View Recipe Button */}
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={`/curated/recipe/${recipe.id}`} className="flex items-center justify-center gap-2">
                    <span>View Recipe</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button onClick={handleLoadMore} variant="outline">
            Load More Recipes
          </Button>
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

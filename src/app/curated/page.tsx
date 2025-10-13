'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/curated-recipes?${params}`);
      const data = await response.json();

      if (page === 1) {
        setRecipes(data.recipes || []);
      } else {
        setRecipes(prev => [...prev, ...(data.recipes || [])]);
      }

      setHasMore(data.pagination?.hasNext || false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
      setHasMore(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchRecipes();
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
          Discover our collection of 495+ professionally curated cocktail recipes from around the world.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cocktails, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        {/* Mobile-Friendly Filter Toggle */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-2 flex-wrap justify-center max-w-4xl">
            {/* Category Dropdown for Mobile */}
            <div className="hidden md:flex gap-2 flex-wrap justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.slice(0, 4).map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
              {categories.length > 4 && (
                <Button variant="outline" size="sm" onClick={() => {/* Show more categories */}}>
                  +{categories.length - 4} more
                </Button>
              )}
            </div>

            {/* Mobile Category Selector */}
            <div className="md:hidden w-full max-w-xs">
              <select 
                value={selectedCategory || ''} 
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.recipeCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter - Simplified */}
            <div className="flex gap-1">
              {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
                  className="text-xs"
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedCategory || selectedDifficulty || selectedTags.length > 0 || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All Filters
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
              <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden">
                {/* Use a placeholder image instead of Google Drive links */}
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/10">
                  <div className="text-center">
                    <Martini className="h-12 w-12 text-primary/60 mx-auto mb-2" />
                    <div className="text-xs text-primary/60 font-medium">{recipe.category}</div>
                  </div>
                </div>
                
                {/* Difficulty Badge */}
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs px-2 py-1 ${getDifficultyColor(recipe.difficulty)}`}
                  >
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-base mb-1 line-clamp-2 leading-tight">
                    {recipe.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{recipe.category}</p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {recipe.prepTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {recipe.glassware}
                  </div>
                </div>

                {/* View Recipe Button */}
                <Button asChild className="w-full text-sm py-2">
                  <Link href={`/curated/recipe/${recipe.id}`}>
                    View Recipe
                    <ChevronRight className="h-3 w-3 ml-1" />
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

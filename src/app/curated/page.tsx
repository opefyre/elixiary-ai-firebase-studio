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
        setRecipes(data.recipes);
      } else {
        setRecipes(prev => [...prev, ...data.recipes]);
      }

      setHasMore(data.pagination.hasNext);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Curated Cocktails</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover our collection of {recipes.length > 0 ? '495+' : ''} professionally curated cocktail recipes from around the world.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2 max-w-md mx-auto">
          <Input
            placeholder="Search cocktails, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} ({category.recipeCount})
            </Button>
          ))}
        </div>

        {/* Difficulty Filters */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={selectedDifficulty === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty(null)}
          >
            All Levels
          </Button>
          {['Easy', 'Medium', 'Hard'].map((difficulty) => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty}
            </Button>
          ))}
        </div>

        {/* Clear Filters */}
        {(selectedCategory || selectedDifficulty || selectedTags.length > 0 || searchQuery) && (
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {/* Recipe Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg overflow-hidden">
                {recipe.imageUrl ? (
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Martini className="h-16 w-16 text-primary/30" />
                  </div>
                )}
                
                {/* Difficulty Badge */}
                <div className="absolute top-2 right-2">
                  <Badge className={getDifficultyColor(recipe.difficulty)}>
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {recipe.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {recipe.prepTime}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    {recipe.glassware}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                  {recipe.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{recipe.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* View Recipe Button */}
                <Button asChild className="w-full">
                  <Link href={`/curated/recipe/${recipe.id}`}>
                    View Recipe
                    <ChevronRight className="h-4 w-4 ml-1" />
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

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  Zap, 
  Martini,
  ArrowLeft,
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

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [recipes, setRecipes] = useState<CuratedRecipe[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCategoryAndRecipes();
  }, [params.category]);

  useEffect(() => {
    if (category) {
      fetchRecipes();
    }
  }, [page]);

  const fetchCategoryAndRecipes = async () => {
    try {
      // Fetch category info
      const categoriesResponse = await fetch('/api/curated-categories');
      const categoriesData = await categoriesResponse.json();
      
      const foundCategory = categoriesData.categories.find(
        (cat: Category) => cat.id === params.category
      );
      
      if (foundCategory) {
        setCategory(foundCategory);
      } else {
        console.error('Category not found:', params.category);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        category: params.category
      });

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

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <Button asChild>
          <Link href="/curated">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Curated Recipes
          </Link>
        </Button>
      </div>
    );
  }

  const getGoogleDriveThumbnail = (url: string) => {
    if (!url) return null;
    
    // Convert Google Drive file URL to optimized image URL
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileId) {
      // Use optimized size for category page cards - w400 for thumbnails
      return `https://lh3.googleusercontent.com/d/${fileId[1]}=w400-h600-p`;
    }
    return url;
  };

  const formatTagText = (tag: string) => {
    // Remove 'style' prefix if it exists and format to proper case
    let formatted = tag.replace(/^style\s+/i, '').replace(/_/g, ' ');
    // Convert to title case
    return formatted.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/cocktails">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cocktails
          </Link>
        </Button>
      </div>

      {/* Category Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Martini className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {category.description}
        </p>
        <div className="mt-4">
          <Badge variant="secondary" className="text-sm">
            {recipes.length} recipes
          </Badge>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {recipes.map((recipe) => (
          <Link key={recipe.id} href={`/cocktails/recipe/${recipe.id}`} className="block">
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Recipe Image */}
                <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg overflow-hidden flex-shrink-0">
                  {recipe.imageUrl ? (
                    <Image
                      src={getGoogleDriveThumbnail(recipe.imageUrl) || recipe.imageUrl}
                      alt={recipe.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <Martini className="h-16 w-16 text-primary/30" />
                    </div>
                  )}
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Recipe Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg mb-3 line-clamp-2 flex-grow">
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

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3 mt-auto">
                    {recipe.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 bg-muted/50">
                        {formatTagText(tag)}
                      </Badge>
                    ))}
                    {recipe.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-muted/50">
                        +{recipe.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Subtle click indicator */}
                  <div className="flex items-center justify-center text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span>Click to view details</span>
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
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
            This category doesn't have any recipes yet.
          </p>
          <Button asChild>
            <Link href="/curated">
              Browse All Recipes
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

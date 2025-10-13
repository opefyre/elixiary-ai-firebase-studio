'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  Zap, 
  Martini,
  ArrowLeft,
  Share2,
  Copy,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

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

interface RecipeDetailPageProps {
  params: {
    id: string;
  };
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const [recipe, setRecipe] = useState<CuratedRecipe | null>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<CuratedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecipe();
  }, [params.id]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/curated-recipes/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setRecipe(data.recipe);
        setRelatedRecipes(data.relatedRecipes);
      } else {
        console.error('Error fetching recipe:', data.error);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyRecipe = async () => {
    if (!recipe) return;

    const recipeText = `
${recipe.name}

Ingredients:
${recipe.ingredients.map(ing => `• ${ing.measure} ${ing.name}`).join('\n')}

Instructions:
${recipe.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

Glassware: ${recipe.glassware}
Garnish: ${recipe.garnish || 'None'}
Prep Time: ${recipe.prepTime}
Difficulty: ${recipe.difficulty}

Source: ${recipe.source}
    `.trim();

    try {
      await navigator.clipboard.writeText(recipeText);
      toast({
        title: 'Recipe copied!',
        description: 'Recipe has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy recipe to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const shareRecipe = async () => {
    if (!recipe) return;

    const shareData = {
      title: recipe.name,
      text: `Check out this ${recipe.name} recipe from Elixiary AI!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyRecipe();
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGoogleDriveThumbnail = (url: string) => {
    if (!url) return null;
    
    // Convert Google Drive file URL to optimized image URL
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileId) {
      // Use higher resolution for detail page - w800 for main image
      return `https://lh3.googleusercontent.com/d/${fileId[1]}=w800-h1200-p`;
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
        <Button asChild>
          <Link href="/curated">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Curated Recipes
          </Link>
        </Button>
      </div>
    );
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recipe Image */}
        <div className="space-y-4">
          <div className="relative h-[800px] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
            {recipe.imageUrl ? (
              <Image
                src={getGoogleDriveThumbnail(recipe.imageUrl) || recipe.imageUrl}
                alt={recipe.name}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            
            {/* Fallback placeholder - only show if no image */}
            {!recipe.imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <Martini className="h-24 w-24 text-primary/30" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={copyRecipe} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy Recipe
            </Button>
            <Button onClick={shareRecipe} variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Recipe Details */}
        <div className="space-y-6">
          {/* Recipe Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <Badge className={getDifficultyColor(recipe.difficulty)}>
                {recipe.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {recipe.prepTime}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Zap className="h-4 w-4" />
                {recipe.glassware}
              </div>
            </div>
            <p className="text-muted-foreground">
              {recipe.category} • {recipe.source}
            </p>
          </div>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-muted-foreground">{ingredient.measure}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {Array.isArray(recipe.instructions) ? recipe.instructions.join('\n\n') : recipe.instructions}
              </div>
            </CardContent>
          </Card>

          {/* Garnish */}
          {recipe.garnish && (
            <Card>
              <CardHeader>
                <CardTitle>Garnish</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{recipe.garnish}</p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {formatTagText(tag)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">More {recipe.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {relatedRecipes.map((relatedRecipe) => (
              <Link key={relatedRecipe.id} href={`/cocktails/recipe/${relatedRecipe.id}`} className="block">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="relative h-60 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg overflow-hidden flex-shrink-0">
                      {relatedRecipe.imageUrl ? (
                        <Image
                          src={getGoogleDriveThumbnail(relatedRecipe.imageUrl) || relatedRecipe.imageUrl}
                          alt={relatedRecipe.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <Martini className="h-8 w-8 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 flex-grow">
                        {relatedRecipe.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Clock className="h-3 w-3" />
                        {relatedRecipe.prepTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

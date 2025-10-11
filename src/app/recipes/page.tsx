'use client';

import { useState, useMemo } from 'react';
import { useUser, useRecipes } from '@/firebase';
import { Loader2, BookOpen, Search, Filter, X, ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipe-card';
import { ShoppingListDialog } from '@/components/shopping-list-dialog';

export default function RecipesPage() {
  const { user, isUserLoading } = useUser();
  const { recipes, isLoading, deleteRecipe } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterGlassware, setFilterGlassware] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<Set<string>>(new Set());

  // Filter and search recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Search filter
      const matchesSearch = searchQuery.trim() === '' || 
        recipe.recipeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (recipe.ingredients && recipe.ingredients.toLowerCase().includes(searchQuery.toLowerCase()));

      // Difficulty filter
      const matchesDifficulty = filterDifficulty === 'all' || 
        ('difficultyLevel' in recipe && recipe.difficultyLevel === filterDifficulty);

      // Glassware filter
      const matchesGlassware = filterGlassware === 'all' || 
        ('glassware' in recipe && recipe.glassware?.toLowerCase().includes(filterGlassware.toLowerCase()));

      // Tag filter
      const matchesTag = filterTag === 'all' || 
        (recipe.tags && recipe.tags.includes(filterTag));

      // Favorites filter
      const matchesFavorite = !showFavoritesOnly || recipe.isFavorite;

      return matchesSearch && matchesDifficulty && matchesGlassware && matchesTag && matchesFavorite;
    });
  }, [recipes, searchQuery, filterDifficulty, filterGlassware, filterTag, showFavoritesOnly]);

  // Get unique difficulty levels and glassware types
  const difficulties = useMemo(() => {
    const unique = new Set(recipes.map(r => 'difficultyLevel' in r ? r.difficultyLevel : '').filter(Boolean));
    return Array.from(unique);
  }, [recipes]);

  const glasswareTypes = useMemo(() => {
    const unique = new Set(recipes.map(r => 'glassware' in r ? r.glassware : '').filter(Boolean));
    return Array.from(unique);
  }, [recipes]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    recipes.forEach(r => {
      if (r.tags) r.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [recipes]);

  if (isUserLoading || isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">
              You need to be signed in to view your saved recipes.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pt-24 md:py-12 md:pt-28">
      <section className="mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-headline text-3xl font-bold md:text-4xl flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                My Cocktail Recipes
              </h1>
              <p className="mt-2 text-muted-foreground">
                {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} 
                {recipes.length !== filteredRecipes.length && ` (filtered from ${recipes.length})`}
              </p>
            </div>
            <div className="flex gap-2">
              {recipes.length > 0 && (
                <>
                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className="gap-2"
                  >
                    <Star className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">Favorites</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRecipeIds(new Set(filteredRecipes.map(r => r.id)));
                      setShowShoppingList(true);
                    }}
                    className="gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">Shopping List</span>
                  </Button>
                </>
              )}
              <Button asChild className="hidden sm:flex">
                <Link href="/">Generate New Recipe</Link>
              </Button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          {recipes.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipes by name, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Difficulty Filter */}
              {difficulties.length > 0 && (
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Difficulties</option>
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              )}

              {/* Glassware Filter */}
              {glasswareTypes.length > 0 && (
                <select
                  value={filterGlassware}
                  onChange={(e) => setFilterGlassware(e.target.value)}
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Glassware</option>
                  {glasswareTypes.map((glass) => (
                    <option key={glass} value={glass}>
                      {glass}
                    </option>
                  ))}
                </select>
              )}

              {/* Clear Filters */}
              {(searchQuery || filterDifficulty !== 'all' || filterGlassware !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterDifficulty('all');
                    setFilterGlassware('all');
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
              </div>

              {/* Tag Filter Pills */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setFilterTag(filterTag === tag ? 'all' : tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        filterTag === tag
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                      }`}
                    >
                      <Tag className="h-3 w-3 inline mr-1" />
                      {tag}
                    </button>
                  ))}
                  {filterTag !== 'all' && (
                    <button
                      onClick={() => setFilterTag('all')}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20"
                    >
                      <X className="h-3 w-3 inline mr-1" />
                      Clear tag
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {recipes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">No Recipes Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start generating cocktail recipes to build your collection!
                </p>
                <Button asChild>
                  <Link href="/">Create Your First Recipe</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : filteredRecipes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2">No Recipes Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterDifficulty('all');
                    setFilterGlassware('all');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={deleteRecipe}
            />
          ))}
        </div>
      )}

      <ShoppingListDialog
        selectedRecipes={recipes.filter(r => selectedRecipeIds.has(r.id))}
        isOpen={showShoppingList}
        onClose={() => setShowShoppingList(false)}
      />
    </div>
  );
}


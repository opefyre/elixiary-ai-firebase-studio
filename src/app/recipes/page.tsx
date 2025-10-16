'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useRecipes, useSubscription } from '@/firebase';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { Loader2, BookOpen, Search, Filter, X, ShoppingCart, Star, Tag, Crown, Heart, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { UnifiedRecipeCard } from '@/components/unified-recipe-card';
import { ShoppingListDialog } from '@/components/shopping-list-dialog';
import { FeatureUpgradeDialog } from '@/components/feature-upgrade-dialog';

export default function RecipesPage() {
  const { user, isUserLoading } = useUser();
  const { recipes, isLoading, deleteRecipe } = useRecipes();
  const { savedRecipes, unsaveRecipe } = useSavedRecipes();
  const { isPro } = useSubscription();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<Set<string>>(new Set());
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'favorites'>('ai');

  // Combine AI recipes and saved curated recipes
  const allRecipes = useMemo(() => {
    const aiRecipes = recipes.map(recipe => ({ ...recipe, source: 'ai' }));
    const curatedRecipes = savedRecipes.map(saved => ({ 
      ...saved.recipeData, 
      source: 'curated',
      id: saved.recipeId,
      savedAt: saved.savedAt
    }));
    return [...aiRecipes, ...curatedRecipes];
  }, [recipes, savedRecipes]);

  // Filter and search recipes
  const filteredRecipes = useMemo(() => {
    let recipesToFilter = allRecipes;

    // Tab filter
    if (activeTab === 'ai') {
      recipesToFilter = allRecipes.filter(recipe => recipe.source === 'ai');
    } else if (activeTab === 'favorites') {
      recipesToFilter = allRecipes.filter(recipe => recipe.source === 'curated');
    }

    return recipesToFilter.filter((recipe) => {
      // Search filter - safely handle ingredients field
      const matchesSearch = searchQuery.trim() === '' || 
        recipe.recipeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (recipe.ingredients && typeof recipe.ingredients === 'string' && recipe.ingredients.toLowerCase().includes(searchQuery.toLowerCase()));

      // Tag filter
      const matchesTag = filterTag === 'all' || 
        (recipe.tags && recipe.tags.includes(filterTag));

      return matchesSearch && matchesTag;
    });
  }, [allRecipes, searchQuery, filterTag, activeTab]);


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
      <div className="container mx-auto max-w-6xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center space-y-8 max-w-md">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-full p-8">
                  <BookOpen className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-3">
              <h2 className="font-headline text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Ready to Build Your Bar?
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
                Save your AI-crafted cocktails, organize favorites, and never lose a great recipe again.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                ✨ AI-Generated Recipes
              </span>
              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                🏷️ Smart Tags
              </span>
              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                🛒 Shopping Lists
              </span>
            </div>

            {/* CTA Button */}
            <Button 
              asChild 
              size="lg"
              className="rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
            >
              <Link href="/login" className="gap-2">
                Get Started Free
                <span className="text-lg">→</span>
              </Link>
            </Button>

            {/* Subtle hint */}
            <p className="text-xs text-muted-foreground/60">
              No credit card • Sign in with Google in seconds
            </p>
          </div>
        </div>
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
                {allRecipes.length !== filteredRecipes.length && ` (filtered from ${allRecipes.length})`}
              </p>
            </div>
            <div className="flex gap-2">
              {recipes.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!isPro) {
                        setShowUpgradeDialog(true);
                        return;
                      }
                      setSelectedRecipeIds(new Set());
                      setShowShoppingList(true);
                    }}
                    className="gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">Shopping List</span>
                    {!isPro && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1">
                        <Crown className="h-3 w-3" />
                      </Badge>
                    )}
                    {isPro && selectedRecipeIds.size > 0 && (
                      <span className="ml-1 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {selectedRecipeIds.size}
                      </span>
                    )}
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

              {/* Clear Filters */}
              {(searchQuery || filterTag !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterTag('all');
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

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-6">
          <Button
            variant={activeTab === 'ai' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('ai')}
            className="gap-2"
          >
            <Crown className="h-4 w-4" />
            AI Generated ({recipes.length})
          </Button>
          <Button
            variant={activeTab === 'favorites' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('favorites')}
            className="gap-2"
          >
            <Heart className="h-4 w-4" />
            Favorites ({savedRecipes.length})
          </Button>
        </div>
      </section>

      {allRecipes.length === 0 ? (
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
                    setFilterTag('all');
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
            <UnifiedRecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={recipe.source === 'ai' ? deleteRecipe : undefined}
              onUnsave={recipe.source === 'curated' ? unsaveRecipe : undefined}
            />
          ))}
        </div>
      )}

      <ShoppingListDialog
        selectedRecipes={recipes.filter(r => selectedRecipeIds.has(r.id))}
        allRecipes={recipes}
        isOpen={showShoppingList}
        onClose={() => setShowShoppingList(false)}
        onSelectionChange={setSelectedRecipeIds}
      />

      <FeatureUpgradeDialog
        isOpen={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        featureName="Shopping List"
        featureDescription="Generate smart shopping lists from your recipes with auto-summed quantities. Perfect for grocery shopping!"
        featureIcon={<ShoppingCart className="h-8 w-8 text-white" />}
      />
    </div>
  );
}


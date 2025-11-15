'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Copy, Check, X } from 'lucide-react';
import { SavedRecipe } from '@/firebase/firestore/use-recipes';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

interface ShoppingListDialogProps {
  selectedRecipes: SavedRecipe[];
  isOpen: boolean;
  onClose: () => void;
  allRecipes: SavedRecipe[];
  onSelectionChange: (recipeIds: Set<string>) => void;
}

export function ShoppingListDialog({ selectedRecipes, isOpen, onClose, allRecipes, onSelectionChange }: ShoppingListDialogProps) {
  const [copied, setCopied] = useState(false);
  const [localSelection, setLocalSelection] = useState<Set<string>>(new Set(selectedRecipes.map(r => r.id)));
  const { toast } = useToast();

  const toggleRecipe = (recipeId: string) => {
    const newSelection = new Set(localSelection);
    if (newSelection.has(recipeId)) {
      newSelection.delete(recipeId);
    } else {
      newSelection.add(recipeId);
    }
    setLocalSelection(newSelection);
    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    const allIds = new Set(allRecipes.map(r => r.id));
    setLocalSelection(allIds);
    onSelectionChange(allIds);
  };

  const clearAll = () => {
    setLocalSelection(new Set());
    onSelectionChange(new Set());
  };

  const actualSelectedRecipes = useMemo(() => {
    return allRecipes.filter(r => localSelection.has(r.id));
  }, [allRecipes, localSelection]);

  // Parse and sum ingredients from all selected recipes
  const parseIngredients = () => {
    const ingredientMap = new Map<string, number>();
    const ingredientUnits = new Map<string, string>();
    
    actualSelectedRecipes.forEach((recipe) => {
      if (!recipe.ingredients) return;
      
      const lines = recipe.ingredients.split('\n').filter(line => line.trim());
      lines.forEach((line) => {
        const cleaned = line.trim().replace(/^[-•*]\s*/, '');
        if (cleaned) {
          // Parse: "2 oz Gin" or "1.5 ml Vodka" or "2 dashes Bitters"
          const match = cleaned.match(/^([\d.]+)\s+([a-zA-Z]+)\s+(.+?)(\s*\(.*\))?$/);
          
          if (match) {
            const quantity = parseFloat(match[1]);
            const unit = match[2].toLowerCase();
            let ingredient = match[3].trim();
            
            // Remove any parenthetical content (e.g., brand names)
            ingredient = ingredient.replace(/\s*\(.*?\)\s*/g, '').trim();
            
            // Normalize ingredient name for grouping (lowercase for comparison)
            const normalizedName = ingredient.toLowerCase();
            
            // Track total quantity
            const key = normalizedName;
            if (!ingredientMap.has(key)) {
              ingredientMap.set(key, 0);
              ingredientUnits.set(key, unit);
            }
            
            // Only sum if same unit (oz + oz, ml + ml, etc.)
            if (ingredientUnits.get(key) === unit) {
              ingredientMap.set(key, ingredientMap.get(key)! + quantity);
            } else {
              // Different units - keep separate
              const altKey = `${normalizedName}_${unit}`;
              ingredientMap.set(altKey, (ingredientMap.get(altKey) || 0) + quantity);
              ingredientUnits.set(altKey, unit);
            }
          }
        }
      });
    });

    return Array.from(ingredientMap.entries()).map(([key, total]) => {
      const unit = ingredientUnits.get(key) || '';
      // Get original case ingredient name (use first occurrence)
      const ingredientName = key.replace(/_[a-z]+$/, '');
      const displayName = ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1);
      
      return {
        ingredient: displayName,
        quantity: total,
        unit: unit,
        display: `${total} ${unit} ${displayName}`,
      };
    }).sort((a, b) => a.ingredient.localeCompare(b.ingredient));
  };

  const ingredients = parseIngredients();

  // Group ingredients by category (simple heuristic)
  const categorizeIngredients = () => {
    const spirits = ingredients.filter(i => 
      /gin|vodka|rum|tequila|whiskey|bourbon|scotch|brandy|cognac|liqueur|aperol|campari|vermouth|sake|mezcal|ouzo|absinthe/i.test(i.ingredient)
    );
    const mixers = ingredients.filter(i => 
      /juice|soda|water|tonic|ginger|cola|sprite|syrup|honey|sugar|nectar|puree/i.test(i.ingredient)
    );
    const bitters = ingredients.filter(i =>
      /bitters|bitter/i.test(i.ingredient)
    );
    const garnish = ingredients.filter(i => 
      /peel|twist|cherry|olive|mint|herb|lime|lemon|orange|fruit|flower|leaf|sprig|wheel|wedge/i.test(i.ingredient)
    );
    const other = ingredients.filter(i => 
      !spirits.includes(i) && !mixers.includes(i) && !garnish.includes(i) && !bitters.includes(i)
    );

    return { spirits, mixers, bitters, garnish, other };
  };

  const { spirits, mixers, bitters, garnish, other } = categorizeIngredients();

  const handleCopyList = async () => {
    const shoppingList = `
🛒 Shopping List
${actualSelectedRecipes.length} ${actualSelectedRecipes.length === 1 ? 'Recipe' : 'Recipes'} Selected

${spirits.length > 0 ? `
🥃 SPIRITS & LIQUEURS
${spirits.map(i => `• ${i.display}`).join('\n')}
` : ''}
${mixers.length > 0 ? `
🧃 MIXERS & SYRUPS
${mixers.map(i => `• ${i.display}`).join('\n')}
` : ''}
${bitters.length > 0 ? `
🍶 BITTERS
${bitters.map(i => `• ${i.display}`).join('\n')}
` : ''}
${garnish.length > 0 ? `
🌿 GARNISH & FRESH INGREDIENTS
${garnish.map(i => `• ${i.display}`).join('\n')}
` : ''}
${other.length > 0 ? `
📦 OTHER INGREDIENTS
${other.map(i => `• ${i.display}`).join('\n')}
` : ''}
---
Generated by Elixiary AI 🍸
${window.location.origin}
    `.trim();

    try {
      await navigator.clipboard.writeText(shoppingList);
      setCopied(true);
      toast({
        title: "Shopping List Copied! 📋",
        description: "Your ingredient list has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy shopping list",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl md:max-h-[90vh] md:overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Shopping List Generator
          </DialogTitle>
          <DialogDescription>
            Select recipes to generate a combined shopping list
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 pt-4">
          {/* Left Column: Recipe Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Select Recipes ({localSelection.size} selected)</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear
                </Button>
              </div>
            </div>

            <div className="space-y-2 md:max-h-[50vh] md:overflow-y-auto md:pr-2">
              {allRecipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className={`p-3 cursor-pointer transition-all ${
                    localSelection.has(recipe.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleRecipe(recipe.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                        localSelection.has(recipe.id)
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {localSelection.has(recipe.id) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-1">
                        {recipe.recipeName}
                      </p>
                      {'glassware' in recipe && recipe.glassware && (
                        <p className="text-xs text-muted-foreground">
                          🍸 {recipe.glassware}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column: Shopping List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Shopping List</h3>
              {actualSelectedRecipes.length > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCopyList}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>

            {actualSelectedRecipes.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ShoppingCart className="h-8 w-8 opacity-50" />
                  <p className="text-sm">Select recipes to see ingredients</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4 md:max-h-[50vh] md:overflow-y-auto md:pr-2 bg-muted/20 rounded-lg p-4">
                {spirits.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">🥃 Spirits & Liqueurs</h4>
                    <ul className="space-y-1.5">
                      {spirits.map((item, idx) => (
                        <li key={idx} className="text-sm flex items-baseline gap-2">
                          <span className="text-primary font-semibold">{item.quantity} {item.unit}</span>
                          <span className="font-medium">{item.ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {mixers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">🧃 Mixers & Syrups</h4>
                    <ul className="space-y-1.5">
                      {mixers.map((item, idx) => (
                        <li key={idx} className="text-sm flex items-baseline gap-2">
                          <span className="text-primary font-semibold">{item.quantity} {item.unit}</span>
                          <span className="font-medium">{item.ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {bitters.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">🍶 Bitters</h4>
                    <ul className="space-y-1.5">
                      {bitters.map((item, idx) => (
                        <li key={idx} className="text-sm flex items-baseline gap-2">
                          <span className="text-primary font-semibold">{item.quantity} {item.unit}</span>
                          <span className="font-medium">{item.ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {garnish.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">🌿 Garnish & Fresh</h4>
                    <ul className="space-y-1.5">
                      {garnish.map((item, idx) => (
                        <li key={idx} className="text-sm flex items-baseline gap-2">
                          <span className="text-primary font-semibold">{item.quantity} {item.unit}</span>
                          <span className="font-medium">{item.ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {other.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">📦 Other</h4>
                    <ul className="space-y-1.5">
                      {other.map((item, idx) => (
                        <li key={idx} className="text-sm flex items-baseline gap-2">
                          <span className="text-primary font-semibold">{item.quantity} {item.unit}</span>
                          <span className="font-medium">{item.ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


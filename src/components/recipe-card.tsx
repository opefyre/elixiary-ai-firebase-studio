'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { SavedRecipe } from '@/firebase/firestore/use-recipes';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';

interface RecipeCardProps {
  recipe: SavedRecipe;
  onDelete: (recipeId: string) => Promise<void>;
}

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm(`Delete "${recipe.recipeName}"?`)) return;
    
    setIsDeleting(true);
    try {
      await onDelete(recipe.id);
      toast({
        title: "Recipe Deleted",
        description: "Recipe has been removed from your collection.",
      });
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: "Could not delete recipe. Please try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="border-primary/20 hover:border-primary/40 transition-colors">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold line-clamp-2 flex-1">
            {recipe.recipeName}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {'description' in recipe && recipe.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 italic">
            {recipe.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-xs">
          {'glassware' in recipe && recipe.glassware && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
              🍸 {recipe.glassware}
            </span>
          )}
          {'difficultyLevel' in recipe && recipe.difficultyLevel && (
            <span className="bg-muted px-2 py-1 rounded">
              📊 {recipe.difficultyLevel}
            </span>
          )}
          {recipe.createdAt && (
            <span className="bg-muted px-2 py-1 rounded flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(recipe.createdAt)}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isExpanded && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {recipe.ingredients && (
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                  🧪 Ingredients
                </h4>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground text-xs leading-relaxed">
                    <ReactMarkdown>{recipe.ingredients}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {recipe.instructions && (
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                  📝 Instructions
                </h4>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground text-xs leading-relaxed">
                    <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {recipe.garnish && (
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                  🌿 Garnish
                </h4>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground text-xs leading-relaxed">
                    <ReactMarkdown>{recipe.garnish}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {'tips' in recipe && recipe.tips && (
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                  💡 Pro Tips
                </h4>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground text-xs leading-relaxed">
                    <ReactMarkdown>{recipe.tips}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              View Full Recipe
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}


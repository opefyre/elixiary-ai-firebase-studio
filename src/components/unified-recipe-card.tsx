'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Trash2, 
  Eye, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  Tag, 
  X, 
  Star, 
  FileDown, 
  Image as ImageIcon, 
  Loader2,
  Heart,
  HeartOff,
  Zap
} from 'lucide-react';
import { useRecipes } from '@/firebase/firestore/use-recipes';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { useSubscription } from '@/firebase';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import { exportRecipeToPDF } from '@/lib/pdf-exporter';
import { generateCocktailGradient } from '@/lib/generate-cocktail-gradient';
import { FeatureUpgradeDialog } from '@/components/feature-upgrade-dialog';
import Link from 'next/link';

interface UnifiedRecipeCardProps {
  recipe: {
    id: string;
    source: 'ai' | 'curated';
    // AI recipe fields
    recipeName?: string;
    ingredients?: string;
    instructions?: string;
    garnish?: string;
    tips?: string;
    glassware?: string;
    isFavorite?: boolean;
    imageUrl?: string;
    imagePrompt?: string;
    tags?: string[];
    collection?: string;
    // Curated recipe fields
    name?: string;
    prepTime?: string;
    savedAt?: any;
  };
  onDelete?: (recipeId: string) => Promise<void>;
  onUnsave?: (recipeId: string) => Promise<void>;
}

export function UnifiedRecipeCard({ recipe, onDelete, onUnsave }: UnifiedRecipeCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<{name: string; description: string; icon: React.ReactNode} | null>(null);
  
  const { toast } = useToast();
  const { updateRecipeTags, toggleFavorite, updateRecipeImage } = useRecipes();
  const { isRecipeSaved, saveRecipe, unsaveRecipe } = useSavedRecipes();
  const { isPro } = useSubscription();

  const isAIRecipe = recipe.source === 'ai';
  const isCuratedRecipe = recipe.source === 'curated';
  const isSaved = isCuratedRecipe || (isAIRecipe && recipe.isFavorite);
  const isCuratedSaved = isCuratedRecipe && isRecipeSaved(recipe.id);

  const recipeName = isAIRecipe ? recipe.recipeName : recipe.name;
  const recipeImage = recipe.imageUrl;
  const recipeGlassware = recipe.glassware;

  const handleDelete = async () => {
    if (!confirm(`Delete "${recipeName}"?`)) return;
    
    setIsDeleting(true);
    setIsOpen(false);
    try {
      if (onDelete) {
        await onDelete(recipe.id);
      }
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

  const handleUnsave = async () => {
    if (!confirm(`Remove "${recipeName}" from favorites?`)) return;
    
    try {
      if (isCuratedRecipe && onUnsave) {
        await onUnsave(recipe.id);
      } else if (isAIRecipe) {
        await toggleFavorite(recipe.id, false);
      }
      toast({
        title: "Removed from Favorites",
        description: "Recipe has been removed from your favorites.",
      });
    } catch (err) {
      toast({
        title: "Remove Failed",
        description: "Could not remove recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = async () => {
    if (isCuratedRecipe) {
      if (isCuratedSaved) {
        await unsaveRecipe(recipe.id);
      } else {
        await saveRecipe(recipe.id, recipe);
      }
    } else if (isAIRecipe) {
      await toggleFavorite(recipe.id, !recipe.isFavorite);
    }
  };

  const handleGenerateImage = async () => {
    if (!isPro) {
      setUpgradeFeature({
        name: "AI Image Generation",
        description: "Generate beautiful cocktail images with AI",
        icon: <ImageIcon className="h-8 w-8 text-white" />
      });
      setShowUpgradeDialog(true);
      return;
    }

    setIsGeneratingImage(true);
    try {
      // This would call your image generation API
      toast({
        title: "Image Generation",
        description: "This feature is coming soon!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleExportPDF = async () => {
    if (!isPro) {
      setUpgradeFeature({
        name: "PDF Export",
        description: "Export your recipes as beautiful PDFs",
        icon: <FileDown className="h-8 w-8 text-white" />
      });
      setShowUpgradeDialog(true);
      return;
    }

    try {
      await exportRecipeToPDF({
        recipeName: recipeName || '',
        ingredients: recipe.ingredients || '',
        instructions: recipe.instructions || '',
        garnish: recipe.garnish || '',
        tips: recipe.tips || '',
        glassware: recipeGlassware || '',
        imageUrl: recipeImage
      });
      toast({
        title: "PDF Exported",
        description: "Recipe has been exported to PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/recipes/${recipe.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link Copied",
      description: "Recipe link has been copied to clipboard.",
    });
  };

  const handleCopyRecipe = async () => {
    const recipeText = `${recipeName}\n\nIngredients:\n${recipe.ingredients}\n\nInstructions:\n${recipe.instructions}`;
    await navigator.clipboard.writeText(recipeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Recipe Copied",
      description: "Recipe has been copied to clipboard.",
    });
  };

  const handleAddTag = async () => {
    if (!newTag.trim() || !isAIRecipe) return;
    
    const currentTags = recipe.tags || [];
    if (currentTags.includes(newTag.trim())) {
      toast({
        title: "Tag Exists",
        description: "This tag already exists for this recipe.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateRecipeTags(recipe.id, [...currentTags, newTag.trim()]);
      setNewTag('');
      toast({
        title: "Tag Added",
        description: "Tag has been added to the recipe.",
      });
    } catch (error) {
      toast({
        title: "Add Tag Failed",
        description: "Could not add tag. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!isAIRecipe) return;
    
    const currentTags = recipe.tags || [];
    try {
      await updateRecipeTags(recipe.id, currentTags.filter(tag => tag !== tagToRemove));
      toast({
        title: "Tag Removed",
        description: "Tag has been removed from the recipe.",
      });
    } catch (error) {
      toast({
        title: "Remove Tag Failed",
        description: "Could not remove tag. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">
                {recipeName}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                {recipe.prepTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.prepTime}</span>
                  </div>
                )}
                {recipeGlassware && (
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span>{recipeGlassware}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge variant="outline" className="text-xs">
                {isAIRecipe ? 'AI Generated' : 'Curated'}
              </Badge>
              {isSaved && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Recipe Image */}
          {recipeImage && (
            <div className="relative h-48 rounded-lg overflow-hidden mb-4 border border-primary/20">
              <img 
                src={recipeImage} 
                alt={recipeName} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {recipe.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {recipe.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{recipe.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                View
              </Button>
              
              {isCuratedRecipe ? (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-2"
                >
                  <Link href={`/cocktails/recipe/${recipe.id}`}>
                    <Eye className="h-4 w-4" />
                    Full Recipe
                  </Link>
                </Button>
              ) : null}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className="gap-1"
              >
                {isSaved ? (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
              </Button>
              
              {(isAIRecipe && onDelete) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-700"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              {isCuratedRecipe && onUnsave && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUnsave}
                  className="text-red-500 hover:text-red-700"
                >
                  <HeartOff className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Details Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                🍸
              </div>
              {recipeName}
            </DialogTitle>
            <DialogDescription>
              {isAIRecipe ? 'AI Generated Recipe' : 'Curated Recipe'}
            </DialogDescription>
          </DialogHeader>

          {/* Recipe Image */}
          {recipeImage && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-primary/20">
              <img 
                src={recipeImage} 
                alt={recipeName} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-6 pt-6 border-t">
            {recipe.ingredients && (
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <span className="text-xl">🧪</span> Ingredients
                </h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed">
                    <ReactMarkdown>{recipe.ingredients}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {recipe.instructions && (
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <span className="text-xl">📝</span> Instructions
                </h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed">
                    <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {recipe.garnish && (
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <span className="text-xl">🌿</span> Garnish
                </h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed">
                    <ReactMarkdown>{recipe.garnish}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {recipe.tips && (
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <span className="text-xl">💡</span> Tips
                </h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed">
                    <ReactMarkdown>{recipe.tips}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Share'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyRecipe}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Recipe'}
              </Button>

              {isAIRecipe && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className="gap-2"
                  >
                    {isGeneratingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    Generate Image
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPDF}
                    className="gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    Export PDF
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FeatureUpgradeDialog
        isOpen={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        featureName={upgradeFeature?.name || ''}
        featureDescription={upgradeFeature?.description || ''}
        featureIcon={upgradeFeature?.icon}
      />
    </>
  );
}

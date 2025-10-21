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
  Zap
} from 'lucide-react';
import { useRecipes } from '@/firebase/firestore/use-recipes';
import { useSubscription } from '@/firebase';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import { exportRecipeToPDF } from '@/lib/pdf-exporter';
import { generateCocktailGradient } from '@/lib/generate-cocktail-gradient';
import Image from 'next/image';
import { FeatureUpgradeDialog } from '@/components/feature-upgrade-dialog';

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
  const [shareCopied, setShareCopied] = useState(false);
  const [recipeCopied, setRecipeCopied] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<{name: string; description: string; icon: React.ReactNode} | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnsaveDialog, setShowUnsaveDialog] = useState(false);
  
  const { toast } = useToast();
  const { updateRecipeTags, updateRecipeImage } = useRecipes();
  const { isPro } = useSubscription();

  const isAIRecipe = recipe.source === 'ai';
  const isCuratedRecipe = recipe.source === 'curated';
  const isSaved = isCuratedRecipe;

  const recipeName = isAIRecipe ? recipe.recipeName : recipe.name;
  const recipeImage = recipe.imageUrl;
  const recipeGlassware = recipe.glassware;

  // Helper function to get Google Drive thumbnail
  const getGoogleDriveThumbnail = (url: string) => {
    if (!url) return null;
    
    // Convert Google Drive file URL to optimized image URL
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileId) {
      // Use optimized size for faster loading - w400 for card thumbnails
      return `https://lh3.googleusercontent.com/d/${fileId[1]}=w400-h600-p`;
    }
    return url;
  };

  const handleDelete = async () => {
    setShowDeleteDialog(false);
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
    setShowUnsaveDialog(false);
    setIsDeleting(true);
    setIsOpen(false);
    try {
      if (onUnsave) {
        await onUnsave(recipe.id);
      }
      toast({
        title: "Recipe Unsaved",
        description: "Recipe has been removed from your saved collection.",
      });
    } catch (err) {
      toast({
        title: "Unsave Failed",
        description: "Could not unsave recipe. Please try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };


  const handleGenerateImage = async () => {
    if (!recipeName) {
      toast({
        title: "Error",
        description: "Recipe name is required to generate an image.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      // Generate beautiful gradient image
      const imageDataUrl = generateCocktailGradient({
        name: recipeName,
        ingredients: isAIRecipe ? (recipe.ingredients as string) : (recipe.ingredients as Array<any>).map(i => i.ingredient).join(', '),
        glassware: recipeGlassware || 'Standard glass',
        difficultyLevel: recipe.difficulty || 'Medium',
      });

      // Save image to recipe
      await updateRecipeImage(recipe.id, imageDataUrl);

      toast({
        title: "Image Generated!",
        description: "Your cocktail now has a beautiful visual.",
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
        name: recipeName || '',
        description: recipe.tips || '',
        ingredients: recipe.ingredients || '',
        instructions: recipe.instructions || '',
        garnish: recipe.garnish || '',
        glassware: recipeGlassware || '',
        difficultyLevel: '',
        servingSize: '1 serving',
        tips: recipe.tips || ''
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
    if (!recipe) return;

    // Create the full recipe text for sharing
    const shareText = `🍸 ${recipeName}

${recipe.tips ? `${recipe.tips}\n` : ''}
${recipeGlassware ? `Glass: ${recipeGlassware}` : ''}
${recipeDifficulty ? ` | Difficulty: ${recipeDifficulty}` : ''}
${recipeServingSize ? ` | ${recipeServingSize}` : ''}

🧪 INGREDIENTS
${recipe.ingredients}

📝 INSTRUCTIONS
${recipe.instructions}

🌿 GARNISH
${recipe.garnish}

${recipe.tips ? `💡 PRO TIPS\n${recipe.tips}\n` : ''}
---
Generated by Elixiary AI 🍸✨
${window.location.origin}`.trim();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `🍸 ${recipeName}`,
          text: shareText,
        });
        toast({
          title: "Recipe Shared! 🎉",
          description: "Thanks for sharing your cocktail recipe!",
        });
      } catch (err: any) {
        // User cancelled share
        if (err.name !== 'AbortError') {
          // If error is not cancellation, fall back to copy
          handleCopyRecipe();
        }
      }
    } else {
      // Web Share API not supported, copy to clipboard
      handleCopyRecipe();
    }
  };

  const handleCopyRecipe = async () => {
    const recipeText = `🍸 ${recipeName}

${recipe.tips ? `${recipe.tips}\n` : ''}
${recipeGlassware ? `Glass: ${recipeGlassware}` : ''}
${recipeDifficulty ? ` | Difficulty: ${recipeDifficulty}` : ''}
${recipeServingSize ? ` | ${recipeServingSize}` : ''}

🧪 INGREDIENTS
${recipe.ingredients}

📝 INSTRUCTIONS
${recipe.instructions}

🌿 GARNISH
${recipe.garnish}

${recipe.tips ? `💡 PRO TIPS\n${recipe.tips}\n` : ''}
---
Generated by Elixiary AI 🍸✨
${window.location.origin}`.trim();
    
    await navigator.clipboard.writeText(recipeText);
    setRecipeCopied(true);
    setTimeout(() => setRecipeCopied(false), 2000);
    toast({
      title: "Recipe Copied! 📋",
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

  const handleCardClick = () => {
    if (isCuratedRecipe) {
      window.location.href = `/cocktails/recipe/${recipe.id}`;
    } else if (isAIRecipe) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <Card 
        className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm cursor-pointer h-full"
        onClick={handleCardClick}
      >
        <CardContent className="p-0 h-full flex flex-col">
          {/* Recipe Image */}
          <div className="relative h-80 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden flex-shrink-0">
            {recipeImage ? (
              <Image
                src={getGoogleDriveThumbnail(recipeImage) || recipeImage}
                alt={recipeName || 'Recipe'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.classList.add('hidden');
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="text-6xl">🍸</div>
              </div>
            )}
            
            {/* Source Badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="outline" className="text-xs bg-background/80">
                {isAIRecipe ? 'AI Generated' : 'Curated'}
              </Badge>
            </div>
            
            {/* Favorite Star */}
            {isSaved && (
              <div className="absolute top-3 right-3">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>
            )}
          </div>

          {/* Recipe Info */}
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-semibold text-lg mb-3 line-clamp-2 leading-tight">
              {recipeName}
            </h3>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              {recipe.prepTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs">{recipe.prepTime}</span>
                </div>
              )}
              {recipeGlassware && (
                <div className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  <span className="text-xs">{recipeGlassware}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3 mt-auto">
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
            )}

            {/* Actions - positioned to not interfere with card click */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center justify-center text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span>
                  {isCuratedRecipe ? 'Click to view full recipe' : 'Click to view details'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {(isAIRecipe && onDelete) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    disabled={isDeleting}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUnsaveDialog(true);
                    }}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
              </div>
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
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-primary/20">
              <Image
                src={getGoogleDriveThumbnail(recipeImage) || recipeImage}
                alt={recipeName || 'Recipe'}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.classList.add('hidden');
                }}
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
                {shareCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {shareCopied ? 'Copied!' : 'Share'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyRecipe}
                className="gap-2"
              >
                {recipeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {recipeCopied ? 'Copied!' : 'Copy Recipe'}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipe</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{recipeName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unsave Confirmation Dialog */}
      <Dialog open={showUnsaveDialog} onOpenChange={setShowUnsaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Favorites</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{recipeName}" from your saved recipes?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowUnsaveDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnsave}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

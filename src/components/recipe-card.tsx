'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Trash2, Eye, Clock, Share2, Copy, Check, Tag, X, Star, FileDown, Image as ImageIcon, Loader2 } from 'lucide-react';
import { SavedRecipe, useRecipes } from '@/firebase/firestore/use-recipes';
import { useSubscription } from '@/firebase';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import { exportRecipeToPDF } from '@/lib/pdf-exporter';
import { generateCocktailGradient } from '@/lib/generate-cocktail-gradient';

interface RecipeCardProps {
  recipe: SavedRecipe;
  onDelete: (recipeId: string) => Promise<void>;
}

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();
  const { updateRecipeTags, toggleFavorite, updateRecipeImage } = useRecipes();
  const { isPro } = useSubscription();

  const handleDelete = async () => {
    if (!confirm(`Delete "${recipe.recipeName}"?`)) return;
    
    setIsDeleting(true);
    setIsOpen(false);
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

  const handleGenerateImage = async () => {
    if (!isPro) {
      toast({
        title: 'Pro Feature',
        description: 'Image generation is available for Pro members only.',
        variant: 'destructive',
      });
      return;
    }

    if (recipe.imageUrl) {
      toast({
        title: 'Image Already Generated',
        description: 'This recipe already has an image.',
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      // Generate beautiful gradient image
      const imageDataUrl = generateCocktailGradient({
        name: recipe.recipeName || 'Untitled Recipe',
        ingredients: recipe.ingredients || '',
        glassware: ('glassware' in recipe && recipe.glassware) || 'Standard glass',
        difficultyLevel: ('difficultyLevel' in recipe && recipe.difficultyLevel) || 'Medium',
      });

      // Save image to recipe
      await updateRecipeImage(recipe.id, imageDataUrl);

      toast({
        title: 'Image Generated!',
        description: 'Your cocktail now has a beautiful visual.',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleExportPDF = () => {
    if (!isPro) {
      toast({
        title: 'Pro Feature',
        description: 'PDF export is available for Pro members only.',
        variant: 'destructive',
      });
      return;
    }

    try {
      exportRecipeToPDF({
        name: recipe.recipeName || 'Untitled Recipe',
        description: ('description' in recipe && recipe.description) || '',
        ingredients: recipe.ingredients || '',
        instructions: recipe.instructions || '',
        garnish: recipe.garnish || '',
        glassware: ('glassware' in recipe && recipe.glassware) || 'Standard glass',
        difficultyLevel: ('difficultyLevel' in recipe && recipe.difficultyLevel) || 'Medium',
        servingSize: ('servingSize' in recipe && recipe.servingSize) || '1 cocktail',
        tips: ('tips' in recipe && recipe.tips) || '',
      });

      toast({
        title: 'PDF Exported!',
        description: 'Your recipe has been downloaded as a PDF.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyRecipe = async () => {
    const recipeText = `
🍸 ${recipe.recipeName}

${('description' in recipe && recipe.description) ? `${recipe.description}\n` : ''}
${'glassware' in recipe && recipe.glassware ? `Glass: ${recipe.glassware}` : ''}
${'difficultyLevel' in recipe && recipe.difficultyLevel ? ` | Difficulty: ${recipe.difficultyLevel}` : ''}
${'servingSize' in recipe && recipe.servingSize ? ` | ${recipe.servingSize}` : ''}

🧪 INGREDIENTS
${recipe.ingredients}

📝 INSTRUCTIONS
${recipe.instructions}

🌿 GARNISH
${recipe.garnish}

${'tips' in recipe && recipe.tips ? `💡 PRO TIPS\n${recipe.tips}\n` : ''}
---
Generated by Elixiary AI 🍸✨
${window.location.origin}`.trim();

    try {
      await navigator.clipboard.writeText(recipeText);
      setCopied(true);
      toast({
        title: "Recipe Copied! 📋",
        description: "Recipe has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy recipe to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    const currentTags = recipe.tags || [];
    const tag = newTag.trim().toLowerCase();
    
    if (currentTags.includes(tag)) {
      toast({
        title: "Tag Already Exists",
        description: "This tag is already added to the recipe.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateRecipeTags(recipe.id, [...currentTags, tag]);
      setNewTag('');
      toast({
        title: "Tag Added!",
        description: `Tag "${tag}" added to recipe.`,
      });
    } catch (err) {
      toast({
        title: "Failed to Add Tag",
        description: "Could not add tag. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const currentTags = recipe.tags || [];
    try {
      await updateRecipeTags(recipe.id, currentTags.filter(t => t !== tagToRemove));
      toast({
        title: "Tag Removed",
        description: `Tag "${tagToRemove}" removed.`,
      });
    } catch (err) {
      toast({
        title: "Failed to Remove Tag",
        description: "Could not remove tag.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(recipe.id, !recipe.isFavorite);
    } catch (err) {
      toast({
        title: "Failed to Update",
        description: "Could not update favorite status.",
        variant: "destructive",
      });
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
    <>
      <Card className="group border-primary/20 hover:border-primary/40 transition-all cursor-pointer hover:shadow-lg">
        <div onClick={() => setIsOpen(true)}>
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 mt-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite();
                  }}
                >
                  <Star className={`h-4 w-4 ${recipe.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                </Button>
                <CardTitle className="text-xl font-bold line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                  {recipe.recipeName}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {'description' in recipe && recipe.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 italic leading-relaxed">
                {recipe.description}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2 text-xs">
              {'glassware' in recipe && recipe.glassware && (
                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                  🍸 {recipe.glassware}
                </span>
              )}
              {'difficultyLevel' in recipe && recipe.difficultyLevel && (
                <span className="bg-muted px-2.5 py-1 rounded-full font-medium">
                  📊 {recipe.difficultyLevel}
                </span>
              )}
              {recipe.tags && recipe.tags.length > 0 && recipe.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="bg-accent/50 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
              {recipe.tags && recipe.tags.length > 2 && (
                <span className="bg-accent/50 px-2.5 py-1 rounded-full font-medium">
                  +{recipe.tags.length - 2}
                </span>
              )}
            </div>
            
            {recipe.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
                <Clock className="h-3 w-3" />
                <span>{formatDate(recipe.createdAt)}</span>
        </div>
            )}

            <div className="flex items-center justify-center pt-2 text-sm text-primary/60 group-hover:text-primary transition-colors">
              <Eye className="h-4 w-4 mr-1.5" />
              <span className="font-medium">Click to view full recipe</span>
            </div>
          </CardContent>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 pr-8">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold mb-2">
                  {recipe.recipeName}
                </DialogTitle>
                {'description' in recipe && recipe.description && (
                  <DialogDescription className="text-base italic">
                    {recipe.description}
                  </DialogDescription>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 text-sm pt-2">
              {'glassware' in recipe && recipe.glassware && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  🍸 <span className="font-medium">{recipe.glassware}</span>
                </span>
              )}
              {'difficultyLevel' in recipe && recipe.difficultyLevel && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  📊 <span className="font-medium">{recipe.difficultyLevel}</span>
                </span>
              )}
              {'servingSize' in recipe && recipe.servingSize && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  🥤 <span className="font-medium">{recipe.servingSize}</span>
                </span>
              )}
            </div>

            {/* Tags Section */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTags(!isEditingTags)}
                  className="h-7 text-xs"
                >
                  {isEditingTags ? 'Done' : 'Edit'}
                </Button>
          </div>
          
              <div className="flex flex-wrap gap-2">
                {recipe.tags && recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-accent/50 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5"
                  >
                {tag}
                    {isEditingTags && (
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
                {(!recipe.tags || recipe.tags.length === 0) && !isEditingTags && (
                  <span className="text-xs text-muted-foreground italic">No tags yet</span>
                )}
              </div>

              {isEditingTags && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag (e.g., summer, tequila, party)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddTag}
                    className="h-8"
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyRecipe}
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
              {isPro && !recipe.imageUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="gap-2"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </>
                  )}
                </Button>
              )}
              {isPro && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  PDF
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </DialogHeader>

          {/* Recipe Image */}
          {recipe.imageUrl && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-primary/20">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.recipeName} 
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

            {'tips' in recipe && recipe.tips && (
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <span className="text-xl">💡</span> Pro Tips
                </h4>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed">
                    <ReactMarkdown>{recipe.tips}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


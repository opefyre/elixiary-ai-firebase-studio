"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Dices, Share2, Copy, Check, Save } from "lucide-react";
import type { GenerateCocktailRecipeOutput } from "@/ai/flows/generate-cocktail-recipe";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRecipes, useSubscription, useUser, useFirebase } from "@/firebase";
import { useBadges } from "@/hooks/use-badges";
import { incrementGenerationCount } from "@/firebase/firestore/use-subscription";
import { UpgradeModal } from "@/components/upgrade-modal";
import { CustomizationDialog, type CustomizationOptions } from "@/components/customization-dialog";
import { generateCocktailGradient } from "@/lib/generate-cocktail-gradient";

const formSchema = z.object({
  prompt: z.string().min(1, "Please describe what kind of cocktail you'd like").min(10, "Please provide more details about your desired cocktail (at least 10 characters)"),
});

type FormValues = z.infer<typeof formSchema>;

type RecipeGenerationFormProps = {
  // Removed handleGenerateRecipe prop - will use API route instead
};

const luckyPrompts = [
  "A refreshing gin-based cocktail for a hot summer day.",
  "Something smoky and sophisticated with whiskey.",
  "A spicy and tropical tequila drink.",
  "A non-alcoholic mocktail that's fruity and fun.",
  "Create a unique cocktail using bourbon and pear.",
  "A romantic Valentine's Day cocktail with champagne and strawberries.",
  "An autumn-inspired drink with apple cider and warming spices.",
  "A beachside vacation cocktail with rum and coconut.",
  "A sophisticated martini variation for a dinner party.",
  "A festive holiday drink with cranberry and rosemary.",
  "A coffee-infused cocktail for after dinner.",
  "A low-calorie vodka cocktail that's light and crisp.",
  "A bold mezcal cocktail with smoky and citrus notes.",
  "A floral and elegant cocktail with elderflower and cucumber.",
  "A brunch-perfect cocktail with grapefruit and herbs.",
  "A winter warmer with dark rum and chocolate.",
  "A tiki-style cocktail with multiple rums and tropical fruits.",
  "An Asian-inspired cocktail with sake and ginger.",
  "A Mediterranean cocktail with ouzo and fresh herbs.",
  "A spicy margarita with jalapeño and mango.",
  "A refreshing cucumber and mint cocktail for a spa day.",
  "A dessert cocktail with vanilla and caramel notes.",
  "A smoky scotch cocktail with honey and lemon.",
  "A tropical punch with passion fruit and rum.",
  "A herbal cocktail with fresh basil and gin.",
  "A citrus-forward cocktail with blood orange and vodka.",
  "A warming cocktail with cinnamon and brandy.",
  "A light and bubbly cocktail with prosecco and elderflower.",
  "A bold cocktail with black pepper and bourbon.",
  "A refreshing cocktail with watermelon and tequila.",
  "A sophisticated cocktail with chartreuse and gin.",
  "A festive cocktail with pomegranate and champagne.",
  "A creamy cocktail with coconut milk and rum.",
  "A spicy cocktail with ginger beer and whiskey.",
  "A floral cocktail with lavender and gin.",
  "A tropical cocktail with pineapple and dark rum.",
  "A warming cocktail with hot cider and bourbon.",
  "A refreshing cocktail with cucumber and vodka.",
  "A dessert cocktail with chocolate and coffee liqueur.",
  "A herbal cocktail with rosemary and gin.",
];

export function RecipeGenerationForm({
}: RecipeGenerationFormProps) {
  const [recipe, setRecipe] = useState<GenerateCocktailRecipeOutput | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [customization, setCustomization] = useState<CustomizationOptions | null>(null);
  const { toast } = useToast();
  const { saveRecipe } = useRecipes();
  const { user } = useUser();
  const { firestore, auth } = useFirebase();
  const { canGenerateRecipe, canSaveRecipe, remainingGenerations, remainingSaves, isPro } = useSubscription();
  const { updateBadges } = useBadges();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handleRandomPrompt = () => {
    const randomPrompt = luckyPrompts[Math.floor(Math.random() * luckyPrompts.length)];
    form.setValue("prompt", randomPrompt);
  };

  // Function to format customization options into natural prompt text
  const formatCustomizationText = (customization: CustomizationOptions) => {
    const parts = [];
    
    // Start with a natural flow
    if (customization.occasion && customization.occasion !== '') {
      const occasionLabels = {
        'date-night': 'perfect for a romantic date night',
        'party': 'great for a party',
        'relaxation': 'ideal for relaxation',
        'celebration': 'perfect for celebrations',
        'business': 'suitable for business meetings',
        'brunch': 'perfect for brunch',
        'afternoon': 'ideal for afternoon tea time',
        'nightcap': 'perfect as a nightcap',
        'casual': 'great for casual gatherings'
      };
      parts.push(occasionLabels[customization.occasion as keyof typeof occasionLabels] || `perfect for ${customization.occasion}`);
    }
    
    if (customization.season && customization.season !== '') {
      parts.push(`using ${customization.season} ingredients`);
    }
    
    if (customization.flavorProfile && customization.flavorProfile.length > 0) {
      const flavorText = customization.flavorProfile.length === 1 
        ? `${customization.flavorProfile[0]} flavors`
        : `${customization.flavorProfile.slice(0, -1).join(', ')} and ${customization.flavorProfile.slice(-1)[0]} flavors`;
      parts.push(`with ${flavorText}`);
    }
    
    if (customization.complexity) {
      const complexityLabels = {
        'simple': 'simple and easy to make',
        'moderate': 'moderately complex',
        'complex': 'complex and sophisticated'
      };
      parts.push(`that is ${complexityLabels[customization.complexity]}`);
    }
    
    if (customization.alcoholLevel) {
      const alcoholLabels = {
        'low': 'light and refreshing',
        'medium': 'balanced strength',
        'strong': 'spirit-forward and bold'
      };
      parts.push(`with ${alcoholLabels[customization.alcoholLevel]} alcohol content`);
    }
    
    if (customization.sweetness) {
      const sweetnessLabels = {
        'dry': 'dry with minimal sweetness',
        'balanced': 'balanced sweetness',
        'sweet': 'sweet and dessert-like'
      };
      parts.push(`that is ${sweetnessLabels[customization.sweetness]}`);
    }
    
    if (customization.dietary && customization.dietary.length > 0) {
      const dietaryText = customization.dietary.join(' and ');
      parts.push(`that is ${dietaryText}`);
    }
    
    if (customization.restrictions && customization.restrictions.trim() !== '') {
      parts.push(`keeping in mind: ${customization.restrictions}`);
    }
    
    return parts.length > 0 ? `, ${parts.join(', ')}` : '';
  };

  // Function to handle customization application
  const handleCustomizationApply = (newCustomization: CustomizationOptions) => {
    setCustomization(newCustomization);
    
    // Get current prompt value
    const currentPrompt = form.getValues("prompt");
    
    // Remove any existing customization text (look for the pattern we create)
    const basePrompt = currentPrompt.replace(/,\s*(perfect for|great for|ideal for|suitable for|using|with|that is|keeping in mind).*$/, '').trim();
    
    // Add new customization text
    const customizationText = formatCustomizationText(newCustomization);
    const newPrompt = basePrompt + customizationText;
    
    // Update the form
    form.setValue("prompt", newPrompt);
  };

  // Function to clear customization
  const handleClearCustomization = () => {
    setCustomization(null);
    
    // Get current prompt value and remove customization text
    const currentPrompt = form.getValues("prompt");
    const basePrompt = currentPrompt.replace(/,\s*(perfect for|great for|ideal for|suitable for|using|with|that is|keeping in mind).*$/, '').trim();
    
    // Update the form with just the base prompt
    form.setValue("prompt", basePrompt);
  };

  // Helper function to format text with newlines into proper markdown
  const formatTextWithNewlines = (text: string) => {
    if (!text) return '';
    
    // Split by newlines and format as bullet points
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length <= 1) {
      // If only one line, return as is
      return text;
    }
    
    // Format as bullet points
    return lines.map(line => `- ${line.trim()}`).join('\n');
  };

  const handleCopyRecipe = async () => {
    if (!recipe) return;
    
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
    `.trim();

    try {
      await navigator.clipboard.writeText(recipeText);
      setCopied(true);
      toast({
        title: "Recipe Copied! 📋",
        description: "Recipe has been copied to your clipboard. Share it with friends!",
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

  const handleShare = async () => {
    if (!recipe) return;

    // Create the full recipe text for sharing
    const shareText = `🍸 ${recipe.recipeName}

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
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `🍸 ${recipe.recipeName}`,
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

  const handleSaveRecipe = async () => {
    if (!recipe || !currentPrompt) return;
    
    try {
      // Generate gradient image for manually saved recipe
      let recipeWithImage = recipe;
      if (!recipe.imageUrl) {
        try {
          const gradientImage = generateCocktailGradient({
            name: recipe.recipeName,
            ingredients: recipe.ingredients,
            glassware: recipe.glassware || 'Cocktail Glass',
            difficultyLevel: recipe.difficultyLevel || 'Medium'
          });
          recipeWithImage = { ...recipe, imageUrl: gradientImage };
        } catch (error) {
          // Continue without image if generation fails
          // Error generating gradient image for manual save
        }
      }

      await saveRecipe(recipeWithImage, currentPrompt);
      setIsSaved(true);
      
      // Update badges for recipe saving
      if (isPro) {
        try {
          await updateBadges('recipe_saved');
        } catch (error) {
          // Silent error handling for badge updates
        }
      }
      
      toast({
        title: "Recipe Saved! 💾",
        description: "Recipe has been saved to your collection.",
      });
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Could not save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // Check if user can generate (usage limit)
      if (!canGenerateRecipe) {
        setShowUpgradeModal(true);
        return;
      }

      setIsLoading(true);
      setRecipe(null);
      setError(null);
      setIsSaved(false);
      setCurrentPrompt(data.prompt);
    
    // Prepare request body with customization options
    const requestBody: any = { prompt: data.prompt };
    if (customization) {
      requestBody.customization = customization;
    }
    
    // Get Firebase ID token for authentication
    if (!user || !auth) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate recipes.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const token = await user.getIdToken();
    
    // Call API route with authentication
    const response = await fetch('/api/generate-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      setIsLoading(false);
      return;
    }

    const result = await response.json();
    setRecipe(result.recipe);
    setError(result.error);
    setIsLoading(false);
    
    // Track generation (increment counter) if successful
    if (result.recipe && !result.error && user && firestore) {
      try {
        await incrementGenerationCount(user.uid, firestore);
        
        
      // Update badges for recipe generation
      if (isPro) {
        try {
          await updateBadges('recipe_generated');
        } catch (error) {
          // Silent error handling for badge updates
        }
      }

      // Automatically generate gradient image for the recipe
      if (result.recipe) {
        try {
          const gradientImage = generateCocktailGradient({
            name: result.recipe.recipeName,
            ingredients: result.recipe.ingredients,
            glassware: result.recipe.glassware || 'Cocktail Glass',
            difficultyLevel: result.recipe.difficultyLevel || 'Medium'
          });
          
          // Update the recipe with the generated image
          setRecipe(prev => prev ? { ...prev, imageUrl: gradientImage } : null);
        } catch (error) {
          // Silent error handling for image generation
          // Error generating gradient image
        }
      }
    } catch (err) {
      // Silent error handling for generation tracking
    }
    }
    
    // Auto-save recipe if generation was successful and user can save
    if (result.recipe && !result.error) {
      if (canSaveRecipe) {
        try {
          // Generate gradient image for auto-saved recipe
          let recipeWithImage = result.recipe;
          try {
            const gradientImage = generateCocktailGradient({
              name: result.recipe.recipeName,
              ingredients: result.recipe.ingredients,
              glassware: result.recipe.glassware || 'Cocktail Glass',
              difficultyLevel: result.recipe.difficultyLevel || 'Medium'
            });
            recipeWithImage = { ...result.recipe, imageUrl: gradientImage };
          } catch (error) {
            // Continue without image if generation fails
            // Error generating gradient image for auto-save
          }

          await saveRecipe(recipeWithImage, data.prompt);
          setIsSaved(true);
          
          // Update badges for recipe saving
          if (isPro) {
            try {
              await updateBadges('recipe_saved');
            } catch (error) {
              // Silent error handling for badge updates
            }
          }
          
          toast({
            title: "Recipe Generated & Saved! ✨",
            description: "Your cocktail recipe has been saved to your collection.",
          });
        } catch (err) {
          // Silently fail auto-save, user can manually save if needed
        }
      } else {
        // Can't save due to limit
        toast({
          title: "Recipe Generated! ⚠️",
          description: "You've reached your storage limit (20 recipes). Delete some recipes or upgrade to Pro to save this one.",
          variant: "default",
        });
      }
    }
    } catch (error) {
      console.error('Recipe generation error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="e.g., A refreshing gin-based cocktail for a hot summer day."
                    className="min-h-[100px] resize-none"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Usage indicator for free users */}
          {!isPro && remainingGenerations !== Infinity && (
            <div className="text-center text-sm text-muted-foreground">
              {remainingGenerations > 0 ? (
                <span>
                  {remainingGenerations} of 10 free recipes remaining this month
                </span>
              ) : (
                <span className="text-destructive font-medium">
                  No free recipes remaining. Upgrade to Pro for unlimited!
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center items-center pt-2 gap-3">
            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading || !canGenerateRecipe} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Recipe
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={handleRandomPrompt} aria-label="I'm feeling lucky">
                  <Dices className="h-4 w-4 animate-dice" />
              </Button>
            </div>
            <CustomizationDialog 
              onApply={handleCustomizationApply}
              onClear={handleClearCustomization}
              isPro={isPro}
            />
          </div>
        </form>
      </Form>

      {/* AI Loading Animation */}
      {isLoading && (
        <Card className="mt-8 border-primary/50 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Animated Cocktail Glass */}
              <div className="relative">
                <div className="absolute inset-0 animate-ping opacity-20">
                  <div className="h-24 w-24 rounded-full bg-primary"></div>
                </div>
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <div className="absolute h-20 w-20 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
                  <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary [animation-delay:-0.3s] [animation-direction:reverse]"></div>
                  <Wand2 className="h-10 w-10 animate-pulse text-primary" />
                </div>
              </div>

              {/* AI Thinking Text */}
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold">AI Mixologist at Work</h3>
                <div className="flex items-center justify-center space-x-1 text-muted-foreground">
                  <span className="animate-bounce [animation-delay:-0.3s]">Analyzing</span>
                  <span className="animate-bounce [animation-delay:-0.15s]">flavor</span>
                  <span className="animate-bounce">profiles</span>
                  <span className="inline-block animate-pulse">...</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Crafting your perfect cocktail recipe
                </p>
              </div>

              {/* Loading Bar */}
              <div className="w-full max-w-xs">
                <div className="h-2 w-full overflow-hidden rounded-full bg-primary/20">
                  <div className="h-full animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && !isLoading && (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recipe && recipe.recipeName && (
        <Card className="mt-8 border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-3xl font-bold flex-1">{recipe.recipeName}</CardTitle>
              <div className="flex gap-2">
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
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
            {'description' in recipe && recipe.description && (
              <p className="text-base text-muted-foreground italic">
                {recipe.description}
              </p>
            )}
            <div className="flex gap-4 text-sm">
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
          </CardHeader>
          <CardContent className="space-y-6">
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
                    <ReactMarkdown>{formatTextWithNewlines(recipe.garnish || '')}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
            {recipe.equipment && (
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <span className="text-xl">🔧</span> Equipment Needed
                </h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed">
                    <ReactMarkdown>{formatTextWithNewlines(recipe.equipment || '')}</ReactMarkdown>
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
          </CardContent>
        </Card>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal}
        reason="generation_limit"
      />
    </div>
  );
}

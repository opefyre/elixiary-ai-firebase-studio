import Image from "next/image";
import type { GenerateCocktailRecipeOutput } from "@/ai/flows/generate-cocktail-recipe";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type RecipeCardProps = {
  recipe: GenerateCocktailRecipeOutput;
  image: ImagePlaceholder;
};

// The AI might return a string with items prefixed by "-" or numbers. This handles it.
function formatList(text: string): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((item) => item.trim().replace(/^(-|\d+\.?)\s*/, ""))
    .filter((item) => item.length > 0);
}

export function RecipeCard({ recipe, image }: RecipeCardProps) {
  const ingredientsList = formatList(recipe.ingredients);
  const instructionsList = formatList(recipe.instructions);

  return (
    <article
      aria-label={`Recipe for ${recipe.recipeName}`}
      className="flex flex-col overflow-hidden rounded-lg border border-primary/20 bg-card/50 shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30"
    >
      <div className="relative aspect-video w-full">
        <Image
          src={image.imageUrl}
          alt={recipe.recipeName}
          fill
          className="object-cover"
          data-ai-hint={image.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-lg">
          {recipe.recipeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-0">
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold text-primary">Ingredients</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {ingredientsList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <Separator className="bg-primary/10" />

          <div>
            <h3 className="mb-2 font-semibold text-primary">Instructions</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {instructionsList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>

          {recipe.garnish && (
            <>
              <Separator className="bg-primary/10" />
              <div>
                <h3 className="mb-2 font-semibold text-primary">Garnish</h3>
                <p className="text-sm text-muted-foreground">
                  {recipe.garnish}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </article>
  );
}

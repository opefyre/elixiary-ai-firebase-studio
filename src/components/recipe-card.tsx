import Image from "next/image";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import type { MockRecipe } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, BarChart } from "lucide-react";

type RecipeCardProps = {
  recipe: MockRecipe;
  image: ImagePlaceholder;
};

export function RecipeCard({ recipe, image }: RecipeCardProps) {
  return (
    <article
      aria-label={`Recipe for ${recipe.recipeName}`}
      className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 w-full md:h-auto md:w-[200px] shrink-0">
          <Image
            src={image.imageUrl}
            alt={recipe.recipeName}
            fill
            className="object-cover"
            data-ai-hint={image.imageHint}
          />
        </div>
        <CardContent className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-bold font-headline">{recipe.recipeName}</h3>
          
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{recipe.publishedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart className="h-3.5 w-3.5" />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{recipe.prepTime}</span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[11px] font-normal">
                {tag}
              </Badge>
            ))}
          </div>

        </CardContent>
      </div>
    </article>
  );
}

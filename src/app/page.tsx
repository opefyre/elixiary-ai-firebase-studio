import { handleGenerateRecipe } from "@/app/actions";
import { RecipeGenerationForm } from "@/components/recipe-generation-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 md:py-12 md:pt-28">
      <section className="mb-12">
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="p-0 text-center">
            <CardTitle className="font-headline text-[26px] font-bold md:text-[32px]">
              Craft Your Perfect Elixir
            </CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl text-lg text-muted-foreground">
              Discover and create amazing cocktails. Tell us what you have,
              your mood, and your flavor preferences, and our AI will generate a
              custom recipe for you.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section>
        <RecipeGenerationForm handleGenerateRecipe={handleGenerateRecipe} />
      </section>
    </div>
  );
}

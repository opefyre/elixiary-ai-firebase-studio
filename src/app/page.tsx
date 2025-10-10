import { handleGenerateRecipe } from "@/app/actions";
import { RecipeGenerationForm } from "@/components/recipe-generation-form";

export default function Home() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pt-24 md:py-12 md:pt-28">
      <section className="mb-12 text-center">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Craft Your Perfect Elixir
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
          Describe the ingredients, mood, and flavors you have in mind, and
          our AI will invent a unique cocktail recipe just for you.
        </p>
      </section>

      <section>
        <RecipeGenerationForm handleGenerateRecipe={handleGenerateRecipe} />
      </section>
    </div>
  );
}

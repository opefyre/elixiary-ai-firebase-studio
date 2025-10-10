"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleGenerateRecipe } from "@/app/actions";
import type { GenerateCocktailRecipeOutput } from "@/ai/flows/generate-cocktail-recipe";
import { Wand2 } from "lucide-react";

const formSchema = z.object({
  ingredients: z.string().min(10, {
    message: "Please list at least a few ingredients.",
  }),
  mood: z.string().min(1, { message: "Please select a mood." }),
  flavorProfile: z
    .string()
    .min(1, { message: "Please select a flavor profile." }),
});

type RecipeFormProps = {
  setIsLoading: (isLoading: boolean) => void;
  onNewRecipe: (recipe: GenerateCocktailRecipeOutput) => void;
};

export function RecipeForm({ setIsLoading, onNewRecipe }: RecipeFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: "",
      mood: "",
      flavorProfile: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await handleGenerateRecipe(values);
      if (result.error) {
        throw new Error(result.error);
      }
      if (result.recipe) {
        onNewRecipe(result.recipe);
        form.reset();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mood / Occasion</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mood or occasion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="celebratory">Celebratory</SelectItem>
                    <SelectItem value="relaxing">Relaxing</SelectItem>
                    <SelectItem value="party">Party</SelectItem>
                    <SelectItem value="sophisticated">Sophisticated</SelectItem>
                    <SelectItem value="adventurous">Adventurous</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="flavorProfile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flavor Profile</FormLabel>rolling 
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a flavor profile" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sweet">Sweet</SelectItem>
                    <SelectItem value="tart">Tart</SelectItem>
                    <SelectItem value="smoky">Smoky</SelectItem>
                    <SelectItem value="bitter">Bitter</SelectItem>
                    <SelectItem value="herbal">Herbal</SelectItem>
                    <SelectItem value="spicy">Spicy</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="ingredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Ingredients</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Gin, lime juice, simple syrup, mint leaves..."
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                List the ingredients you have on hand, separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full max-w-sm"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />{" "}
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" /> Generate Cocktail
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

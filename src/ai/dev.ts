import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-ingredient-substitutions.ts';
import '@/ai/flows/generate-cocktail-recipe.ts';
import '@/ai/flows/summarize-recipe-reviews.ts';
import '@/ai/flows/generate-cocktail-image.ts';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { initializeFirebaseServer } from '@/firebase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChefHat,
  Clock,
  Martini,
  Sparkles,
  Wine,
} from 'lucide-react';
import { AppClientProviders } from '@/components/providers/app-client-providers';
import { CocktailBreadcrumbs } from '@/app/cocktails/_components';
import { BreadcrumbStructuredData } from '@/components/seo/structured-data';
import { getCategoryDisplayName, getCategorySlug } from '@/lib/cocktails';
import { RecipeActions } from './recipe-actions';
import { RecipeImage } from '../recipe-image';
import type { CuratedRecipe } from './types';
import type { CocktailCategoryLike } from '@/lib/cocktails';

interface RecipeDetailPageProps {
  params: {
    id: string;
  };
}

const RECIPE_LIMIT = 4;

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getGoogleDriveThumbnail = (url?: string | null) => {
  if (!url) return null;

  const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId[1]}=w800-h1200-p`;
  }

  return url;
};

const formatTagText = (tag: string) => {
  let formatted = tag.replace(/^style\s+/i, '').replace(/_/g, ' ');
  return formatted.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const normalizeInstructions = (instructions: string | string[]) => {
  if (!instructions) {
    return '';
  }

  if (Array.isArray(instructions)) {
    return instructions.join('\n');
  }

  return instructions;
};

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { adminDb } = initializeFirebaseServer();
  const recipeDoc = await adminDb.collection('curated-recipes').doc(params.id).get();

  if (!recipeDoc.exists) {
    notFound();
  }

  const recipe = { id: recipeDoc.id, ...(recipeDoc.data() as Omit<CuratedRecipe, 'id'>) } as CuratedRecipe;

  let categoryData: CocktailCategoryLike | null = null;

  if (recipe.categoryId) {
    const categoryDoc = await adminDb.collection('curated-categories').doc(recipe.categoryId).get();

    if (categoryDoc.exists) {
      categoryData = {
        id: categoryDoc.id,
        ...(categoryDoc.data() as { name?: string | null }),
      };
    }
  }

  const categorySlug = getCategorySlug(categoryData ?? recipe.categoryId ?? recipe.category ?? '');
  const categoryDisplayName = getCategoryDisplayName(categoryData ?? categorySlug);

  const relatedSnapshot = await adminDb
    .collection('curated-recipes')
    .where('categoryId', '==', recipe.categoryId)
    .where('__name__', '!=', recipeDoc.id)
    .limit(RECIPE_LIMIT)
    .get();

  const relatedRecipes = relatedSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<CuratedRecipe, 'id'>),
  })) as CuratedRecipe[];

  const breadcrumbs = [
    { label: 'Cocktails', href: '/cocktails' },
    {
      label: categoryDisplayName,
      href: categorySlug ? `/cocktails/category/${categorySlug}` : undefined,
    },
    { label: recipe.name },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.elixiary.com';
  const structuredDataItems = breadcrumbs.map((item, index) => {
    const href = item.href ?? (index === breadcrumbs.length - 1 ? `/cocktails/recipe/${params.id}` : undefined);
    return {
      name: item.label,
      url: href ? `${baseUrl}${href}` : `${baseUrl}/cocktails`,
    };
  });

  return (
    <>
      <BreadcrumbStructuredData items={structuredDataItems} />
      <AppClientProviders>
        <div className="container mx-auto px-4 py-8 pt-24">
          <CocktailBreadcrumbs items={breadcrumbs} className="mb-6" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]">
            <div className="space-y-4 lg:space-y-6">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[clamp(16rem,40vw,28rem)] overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                {recipe.imageUrl ? (
                  <RecipeImage
                    src={getGoogleDriveThumbnail(recipe.imageUrl) || recipe.imageUrl}
                    alt={recipe.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 35vw, 100vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <Martini className="h-24 w-24 text-primary/30" />
                  </div>
                )}
              </div>

              <RecipeActions recipe={recipe} />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold">
                  <span className="text-4xl">🍸</span>
                  {recipe.name}
                </h1>
                <div className="mb-4 flex items-center gap-4">
                  <Badge className={`${getDifficultyColor(recipe.difficulty)} gap-1`}>
                    <ChefHat className="h-3 w-3" />
                    {recipe.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Wine className="h-4 w-4" />
                    <span className="text-sm">{recipe.glassware}</span>
                  </div>
                </div>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>📂</span>
                  <span>
                    {recipe.category} {recipe.source ? `• ${recipe.source}` : null}
                  </span>
                </p>
              </div>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">🥃</span>
                    Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li
                        key={`${ingredient.name}-${index}`}
                        className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                      >
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="font-mono text-muted-foreground">{ingredient.measure}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">👨‍🍳</span>
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-line rounded-lg bg-muted/20 p-3 text-sm text-muted-foreground">
                    {normalizeInstructions(recipe.instructions)}
                  </div>
                </CardContent>
              </Card>

              {recipe.garnish && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">🌿</span>
                      Garnish
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-muted/20 p-3 text-sm">{recipe.garnish}</div>
                  </CardContent>
                </Card>
              )}

              {recipe.tags?.length ? (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">🏷️</span>
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          <Sparkles className="h-3 w-3" />
                          {formatTagText(tag)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>

          {relatedRecipes.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                <span className="text-2xl">🍹</span>
                More {recipe.category}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedRecipes.map((relatedRecipe) => (
                  <Link key={relatedRecipe.id} href={`/cocktails/recipe/${relatedRecipe.id}`} className="block">
                    <Card className="group relative h-full overflow-hidden rounded-3xl border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                      <CardContent className="relative flex h-full flex-col p-0">
                        <div className="relative flex h-full min-h-[22rem] flex-col">
                          {relatedRecipe.imageUrl ? (
                            <RecipeImage
                              src={
                                getGoogleDriveThumbnail(relatedRecipe.imageUrl) || relatedRecipe.imageUrl
                              }
                              alt={relatedRecipe.name}
                              fill
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/40 to-primary/10 text-white/70">
                              <Martini className="h-10 w-10" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10 transition-opacity duration-300 group-hover:from-black/85 group-hover:via-black/60" />

                          <div className="relative z-10 flex h-full flex-col justify-end p-5">
                            <h3 className="mb-3 line-clamp-2 text-lg font-semibold leading-tight text-white drop-shadow-lg">
                              {relatedRecipe.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/80">
                              <Clock className="h-4 w-4 text-white/70" />
                              <span>{relatedRecipe.prepTime}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </AppClientProviders>
    </>
  );
}

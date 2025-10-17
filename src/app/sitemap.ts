import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ai.elixiary.com';
  const now = new Date();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/cocktails`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/api/docs`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ];

  // Category pages
  const categories = [
    'cat_shot_shooter',
    'cat_highball_long',
    'cat_tiki_tropical',
    'cat_frozen_blended',
    'cat_beer_cocktail',
    'cat_coffee_tea',
    'cat_short_shaken_citrus',
    'cat_short_spirit_forward',
    'cat_spritz_sparkling',
    'cat_soft_zero_proof',
    'cat_digestif_after_dinner',
    'cat_hot',
    'cat_liqueur_cordial',
    'cat_milk_egg_cream',
    'cat_punch_party',
    'cat_smash_julep_swizzle',
    'cat_unknown_other',
    'cat_wine_vermouth_aperitif',
  ];

  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/cocktails/category/${category}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Sample recipe pages (you can expand this with actual recipe IDs)
  const sampleRecipes = [
    'hhk7z9swf',
    'ng6ppzh4w',
    'myotw2ri2',
    'slsrujlgd',
    'yxug61zq5',
  ];

  const recipePages = sampleRecipes.map(recipeId => ({
    url: `${baseUrl}/cocktails/recipe/${recipeId}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...recipePages];
}


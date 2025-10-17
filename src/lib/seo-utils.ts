import { Metadata } from 'next';
import { seoConfig } from './seo-config';

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: any;
}

export function generateMetadata({
  title,
  description,
  keywords,
  canonical,
  ogImage = seoConfig.openGraph.images.default,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  nofollow = false,
  structuredData,
}: GenerateMetadataOptions = {}): Metadata {
  const fullTitle = title 
    ? `${title} | ${seoConfig.site.name}`
    : seoConfig.defaultMetadata.title;

  const fullDescription = description || seoConfig.defaultMetadata.description;
  const fullKeywords = keywords || seoConfig.defaultMetadata.keywords;
  const canonicalUrl = canonical || seoConfig.site.url;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    authors: [{ name: seoConfig.site.name, url: seoConfig.site.url }],
    creator: seoConfig.site.name,
    publisher: seoConfig.site.name,
    applicationName: seoConfig.site.name,
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    colorScheme: 'dark',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#8b5cf6' },
      { media: '(prefers-color-scheme: dark)', color: '#8b5cf6' },
    ],
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
    openGraph: {
      type: ogType,
      locale: seoConfig.openGraph.locale,
      url: canonicalUrl,
      title: fullTitle,
      description: fullDescription,
      siteName: seoConfig.openGraph.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description: fullDescription,
      creator: seoConfig.twitter.creator,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      nocache: false,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: seoConfig.verification,
    alternates: {
      canonical: canonicalUrl,
    },
    category: 'food',
    classification: 'Cocktail Recipe Generator',
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': seoConfig.site.name,
      'mobile-web-app-capable': 'yes',
      'msapplication-TileColor': '#8b5cf6',
      'msapplication-config': '/browserconfig.xml',
    },
  };
}

export function generatePageMetadata(page: keyof typeof seoConfig.pages, overrides: GenerateMetadataOptions = {}) {
  const pageConfig = seoConfig.pages[page];
  
  return generateMetadata({
    title: pageConfig.title,
    description: pageConfig.description,
    keywords: pageConfig.keywords,
    ...overrides,
  });
}

export function generateRecipeMetadata(recipe: {
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  id: string;
}) {
  const title = `${recipe.name} Recipe | ${recipe.category || 'Cocktail'} Recipe`;
  const description = recipe.description || `Learn how to make ${recipe.name} with this detailed cocktail recipe. ${recipe.category ? `Perfect for ${recipe.category.toLowerCase()} lovers.` : ''}`;
  const keywords = [
    recipe.name,
    'cocktail recipe',
    'how to make',
    recipe.category || 'cocktail',
    ...(recipe.tags || []),
  ];

  return generateMetadata({
    title,
    description,
    keywords,
    canonical: `${seoConfig.site.url}/cocktails/recipe/${recipe.id}`,
    ogImage: recipe.imageUrl || seoConfig.openGraph.images.default,
    ogType: 'article',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: recipe.name,
      description,
      image: recipe.imageUrl,
      author: {
        '@type': 'Organization',
        name: seoConfig.site.name,
      },
      recipeCategory: 'Cocktail',
      recipeCuisine: 'International',
      keywords: keywords.join(', '),
    },
  });
}

export function generateCategoryMetadata(category: {
  name: string;
  description: string;
  recipeCount: number;
  id: string;
}) {
  const title = `${category.name} Cocktails | ${category.recipeCount} Recipes`;
  const description = `${category.description} Browse our collection of ${category.recipeCount} ${category.name.toLowerCase()} cocktail recipes.`;

  return generateMetadata({
    title,
    description,
    keywords: [
      category.name,
      'cocktail recipes',
      'cocktail category',
      'mixology',
      'drink recipes',
    ],
    canonical: `${seoConfig.site.url}/cocktails/category/${category.id}`,
  });
}

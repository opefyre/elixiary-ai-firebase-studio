import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cocktail Recipes | 500+ Curated Drinks',
  description: 'Discover 500+ expertly curated cocktail recipes from around the world. Browse by category, difficulty, and ingredients. Find your perfect cocktail recipe today!',
  keywords: [
    'cocktail recipes',
    'curated cocktails',
    'cocktail database',
    'mixology recipes',
    'drink recipes',
    'cocktail collection',
    'bartending recipes',
    'cocktail inspiration',
    'classic cocktails',
    'modern cocktails',
    'cocktail categories',
    'cocktail ingredients',
  ],
  openGraph: {
    title: 'Cocktail Recipes | 500+ Curated Drinks',
    description: 'Discover 500+ expertly curated cocktail recipes from around the world. Browse by category, difficulty, and ingredients.',
    type: 'website',
    images: [
      {
        url: '/opengraph-cocktails.png',
        width: 1200,
        height: 630,
        alt: 'Cocktail Recipes Database - 500+ Curated Recipes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cocktail Recipes | 500+ Curated Drinks',
    description: 'Discover 500+ expertly curated cocktail recipes from around the world.',
  },
};

export default function CocktailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

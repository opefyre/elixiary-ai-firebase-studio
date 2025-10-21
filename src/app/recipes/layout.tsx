import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Recipes | Elixiary AI',
  description: 'View and manage your AI-generated cocktail recipes and saved curated recipes. Organize your personal cocktail collection with advanced filtering and search.',
  keywords: [
    'my recipes',
    'personal cocktail collection',
    'AI generated cocktails',
    'saved recipes',
    'cocktail management',
    'recipe organization',
    'personal mixology',
    'cocktail favorites',
  ],
  openGraph: {
    title: 'My Recipes | Elixiary AI',
    description: 'View and manage your AI-generated cocktail recipes and saved curated recipes.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'My Recipes | Elixiary AI',
    description: 'View and manage your AI-generated cocktail recipes and saved curated recipes.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://elixiary.com'}/recipes`,
  },
  robots: {
    index: false, // This is a user-specific page
    follow: false,
  },
};

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

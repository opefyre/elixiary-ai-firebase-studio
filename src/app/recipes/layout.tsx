import { Metadata } from 'next';
import { AuthGuard } from '@/components/auth-guard';
import { getCanonicalUrl } from '@/lib/config';

export const metadata: Metadata = {
  title: 'My Recipes | Elixiary AI',
  description: 'View and manage your AI-generated cocktail recipes and saved curated recipes. Organize your personal cocktail collection with advanced filtering and search.',
  alternates: {
    canonical: getCanonicalUrl('/recipes'),
  },
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
  robots: {
    index: false, // This is a user-specific page
    follow: true,
  },
};

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}

import { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/config';

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const { category } = params;

  // Convert category from URL format to readable format
  const categoryName = category
    .replace(/^cat_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${categoryName} Cocktails | Elixiary AI`,
    description: `Discover ${categoryName.toLowerCase()} cocktail recipes. Browse our curated collection of ${categoryName.toLowerCase()} drinks with professional recipes and ingredients.`,
    keywords: [
      categoryName.toLowerCase(),
      'cocktail recipes',
      'mixology',
      'drink recipes',
      'cocktail category',
      'curated cocktails',
    ],
    openGraph: {
      title: `${categoryName} Cocktails | Elixiary AI`,
      description: `Discover ${categoryName.toLowerCase()} cocktail recipes from our curated collection.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} Cocktails | Elixiary AI`,
      description: `Discover ${categoryName.toLowerCase()} cocktail recipes.`,
    },
    alternates: {
      canonical: getCanonicalUrl(`/cocktails/category/${category}`),
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

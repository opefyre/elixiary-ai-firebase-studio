import { Metadata } from 'next';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryLayoutProps): Promise<Metadata> {
  const { category } = await params;
  
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
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://elixiary.com'}/cocktails/category/${category}`,
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

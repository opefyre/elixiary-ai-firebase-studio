import { Metadata } from 'next';
import { SearchResultsPage } from '@/components/education/search-results-page';
import { getCanonicalUrl } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Search Articles | Elixiary Education',
  description: 'Search through our comprehensive collection of mixology articles, techniques, and guides.',
  keywords: ['mixology search', 'cocktail articles', 'bartending guides', 'mixology techniques'],
  alternates: {
    canonical: getCanonicalUrl('/education/search'),
  },
  openGraph: {
    title: 'Search Articles | Elixiary Education',
    description: 'Search through our comprehensive collection of mixology articles, techniques, and guides.',
    type: 'website',
    url: getCanonicalUrl('/education/search'),
  },
  twitter: {
    card: 'summary',
    title: 'Search Articles | Elixiary Education',
    description: 'Search through our comprehensive collection of mixology articles, techniques, and guides.',
  },
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    difficulty?: string;
    page?: string;
    sort?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return <SearchResultsPage searchParams={searchParams} />;
}

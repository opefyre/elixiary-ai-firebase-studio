import { Metadata } from 'next';
import { SearchResultsPage } from '@/components/education/search-results-page';
import { getCanonicalUrl } from '@/lib/config';

const baseMetadata: Metadata = {
  title: 'Search Articles | Elixiary Education',
  description:
    'Search through our comprehensive collection of mixology articles, techniques, and guides.',
  keywords: ['mixology search', 'cocktail articles', 'bartending guides', 'mixology techniques'],
  alternates: {
    canonical: getCanonicalUrl('/education/search'),
  },
  openGraph: {
    title: 'Search Articles | Elixiary Education',
    description:
      'Search through our comprehensive collection of mixology articles, techniques, and guides.',
    type: 'website',
    url: getCanonicalUrl('/education/search'),
  },
  twitter: {
    card: 'summary',
    title: 'Search Articles | Elixiary Education',
    description:
      'Search through our comprehensive collection of mixology articles, techniques, and guides.',
  },
};

export function generateMetadata({
  searchParams,
}: {
  searchParams: SearchPageProps['searchParams'];
}): Metadata {
  const hasSearchParams = Object.values(searchParams ?? {}).some((value) => {
    if (value === undefined || value === null) {
      return false;
    }
    return String(value).trim().length > 0;
  });

  if (hasSearchParams) {
    return {
      ...baseMetadata,
      // Keep parameterized search results out of the index so only canonical education hubs rank.
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return baseMetadata;
}

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

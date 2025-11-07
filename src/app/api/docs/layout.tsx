import type { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/config';

export const metadata: Metadata = {
  title: 'API Documentation | Elixiary AI',
  description:
    'Explore the Elixiary AI REST API for accessing curated cocktail recipes, account data, and developer tooling.',
  alternates: {
    canonical: getCanonicalUrl('/api/docs'),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

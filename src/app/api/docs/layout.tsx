import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation | Elixiary AI',
  description:
    'Explore the Elixiary AI REST API for accessing curated cocktail recipes, account data, and developer tooling.',
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

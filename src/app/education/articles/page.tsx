import { Metadata } from 'next';
import { ArticlesArchive } from '@/components/education/articles-archive';

type ArchiveSearchParams = {
  page?: string;
  sort?: string;
  difficulty?: string;
  category?: string;
};

const normalizeParam = (value: string | string[] | undefined) => {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

export const metadata: Metadata = {
  title: 'Education Articles Archive | Elixiary Mixology Library',
  description:
    'Browse the complete archive of Elixiary education articles covering mixology techniques, bar equipment tips, and cocktail inspiration.',
  keywords: [
    'mixology articles',
    'cocktail education',
    'bartending archive',
    'mixology techniques',
    'cocktail tips',
  ],
  openGraph: {
    title: 'Education Articles Archive | Elixiary Mixology Library',
    description:
      'Browse the complete archive of Elixiary education articles covering mixology techniques, bar equipment tips, and cocktail inspiration.',
    type: 'website',
    url: 'https://elixiary.com/education/articles',
    images: [
      {
        url: 'https://elixiary.com/og-education-archive.jpg',
        width: 1200,
        height: 630,
        alt: 'Elixiary Education Articles Archive',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Education Articles Archive | Elixiary Mixology Library',
    description:
      'Browse the complete archive of Elixiary education articles covering mixology techniques, bar equipment tips, and cocktail inspiration.',
    images: ['https://elixiary.com/og-education-archive.jpg'],
  },
};

interface EducationArticlesPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function EducationArticlesPage({ searchParams }: EducationArticlesPageProps) {
  const normalized: ArchiveSearchParams = {
    page: normalizeParam(searchParams.page),
    sort: normalizeParam(searchParams.sort),
    difficulty: normalizeParam(searchParams.difficulty),
    category: normalizeParam(searchParams.category),
  };

  return <ArticlesArchive searchParams={normalized} />;
}

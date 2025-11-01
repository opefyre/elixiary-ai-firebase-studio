import { Metadata } from 'next';
import { ArticlesArchive } from '@/components/education/articles-archive';
import { getCanonicalUrl } from '@/lib/config';

type SortOption = 'newest' | 'oldest' | 'popular' | 'readingTime';
type DifficultyOption = 'beginner' | 'intermediate' | 'advanced';

const DEFAULT_PAGE = 1;
const DEFAULT_SORT: SortOption = 'newest';
const ALLOWED_SORTS = new Set<SortOption>(['newest', 'oldest', 'popular', 'readingTime']);
const ALLOWED_DIFFICULTIES = new Set<DifficultyOption>([
  'beginner',
  'intermediate',
  'advanced',
]);

type ArchiveSearchParams = {
  page?: string;
  sort?: string;
  difficulty?: string;
  category?: string;
};

type NormalizedArchiveParams = {
  page: number;
  sort: SortOption;
  difficulty?: DifficultyOption;
  category?: string;
};

const baseMetadata: Metadata = {
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
  alternates: {
    canonical: getCanonicalUrl('/education/articles'),
  },
  openGraph: {
    title: 'Education Articles Archive | Elixiary Mixology Library',
    description:
      'Browse the complete archive of Elixiary education articles covering mixology techniques, bar equipment tips, and cocktail inspiration.',
    type: 'website',
    url: getCanonicalUrl('/education/articles'),
    images: [
      {
        url: getCanonicalUrl('/og-education-archive.jpg'),
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
    images: [getCanonicalUrl('/og-education-archive.jpg')],
  },
};

function normalizeParam(value: string | string[] | undefined) {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value[0] : value;
}

function normalizeArchiveParams(
  searchParams: Record<string, string | string[] | undefined>
): NormalizedArchiveParams {
  const rawPage = normalizeParam(searchParams.page);
  const parsedPage = rawPage ? Number.parseInt(rawPage, 10) : DEFAULT_PAGE;
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? DEFAULT_PAGE : parsedPage;

  const rawSort = normalizeParam(searchParams.sort);
  const sort = rawSort && ALLOWED_SORTS.has(rawSort as SortOption)
    ? (rawSort as SortOption)
    : DEFAULT_SORT;

  const rawDifficulty = normalizeParam(searchParams.difficulty);
  const difficulty =
    rawDifficulty && ALLOWED_DIFFICULTIES.has(rawDifficulty as DifficultyOption)
      ? (rawDifficulty as DifficultyOption)
      : undefined;

  const rawCategory = normalizeParam(searchParams.category);
  const category = rawCategory?.toString().trim().toLowerCase();
  const sanitizedCategory =
    category && /^[a-z0-9-]+$/.test(category) ? category : undefined;

  return {
    page,
    sort,
    difficulty,
    category: sanitizedCategory,
  };
}

export function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}): Metadata {
  const normalized = normalizeArchiveParams(searchParams);

  const canonicalParams = new URLSearchParams();

  if (normalized.page > DEFAULT_PAGE) {
    canonicalParams.set('page', normalized.page.toString());
  }

  if (normalized.sort !== DEFAULT_SORT) {
    canonicalParams.set('sort', normalized.sort);
  }

  if (normalized.difficulty) {
    canonicalParams.set('difficulty', normalized.difficulty);
  }

  if (normalized.category) {
    canonicalParams.set('category', normalized.category);
  }

  const canonicalPath = canonicalParams.toString()
    ? `/education/articles?${canonicalParams.toString()}`
    : '/education/articles';

  return {
    ...baseMetadata,
    alternates: {
      canonical: getCanonicalUrl(canonicalPath),
    },
    openGraph: {
      ...baseMetadata.openGraph,
      url: getCanonicalUrl(canonicalPath),
    },
    twitter: {
      ...baseMetadata.twitter,
      images: baseMetadata.twitter?.images,
    },
  };
}

interface EducationArticlesPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function EducationArticlesPage({ searchParams }: EducationArticlesPageProps) {
  const normalized = normalizeArchiveParams(searchParams);

  const archiveParams: ArchiveSearchParams = {
    page: normalized.page.toString(),
    sort: normalized.sort,
    difficulty: normalized.difficulty,
    category: normalized.category,
  };

  return <ArticlesArchive searchParams={archiveParams} />;
}

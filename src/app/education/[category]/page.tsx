import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/education/category-page';
import { StructuredData } from '@/components/education/structured-data';
import { initializeFirebaseServer } from '@/firebase/server';
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

function normalizeCategorySearchParams(searchParams: CategoryPageProps['searchParams']) {
  const rawPage = searchParams?.page;
  const parsedPage = rawPage ? Number.parseInt(rawPage, 10) : DEFAULT_PAGE;
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? DEFAULT_PAGE : parsedPage;

  const rawSort = searchParams?.sort;
  const sort = rawSort && ALLOWED_SORTS.has(rawSort as SortOption)
    ? (rawSort as SortOption)
    : DEFAULT_SORT;

  const rawDifficulty = searchParams?.difficulty;
  const difficulty = rawDifficulty && ALLOWED_DIFFICULTIES.has(rawDifficulty as DifficultyOption)
    ? (rawDifficulty as DifficultyOption)
    : undefined;

  return {
    page,
    sort,
    difficulty,
  };
}

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    difficulty?: string;
    page?: string;
    sort?: string;
  };
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  try {
    const { adminDb } = initializeFirebaseServer();
    const categoriesRef = adminDb.collection('education_categories');

    const querySnapshot = await categoriesRef
      .where('slug', '==', params.category)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return {
        title: 'Category Not Found | Elixiary Education',
        description: 'The requested category could not be found.',
      };
    }

    const categoryData = querySnapshot.docs[0].data();

    const normalized = normalizeCategorySearchParams(searchParams);

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

    const canonicalPath = canonicalParams.toString()
      ? `/education/${params.category}?${canonicalParams.toString()}`
      : `/education/${params.category}`;

    const canonicalUrl = getCanonicalUrl(canonicalPath);
    const shouldIndex = canonicalParams.toString().length === 0;

    return {
      title: `${categoryData.name} | Elixiary Education`,
      description: categoryData.description,
      keywords: [categoryData.name, 'mixology', 'cocktails', 'education'],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${categoryData.name} | Elixiary Education`,
        description: categoryData.description,
        type: 'website',
        url: canonicalUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryData.name} | Elixiary Education`,
        description: categoryData.description,
      },
      robots: {
        index: shouldIndex,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for category:', error);
    return {
      title: 'Category | Elixiary Education',
      description: 'Browse articles in this category on Elixiary Education Center.',
    };
  }
}

export default async function CategoryPageRoute({ params, searchParams }: CategoryPageProps) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const categoriesRef = adminDb.collection('education_categories');
    
    const querySnapshot = await categoriesRef
      .where('slug', '==', params.category)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      notFound();
    }

    const categoryData = querySnapshot.docs[0].data();
    
    // Convert Firestore Timestamps to plain objects
    const category = {
      ...categoryData,
      createdAt: categoryData.createdAt?.toDate ? categoryData.createdAt.toDate() : new Date(),
      updatedAt: categoryData.updatedAt?.toDate ? categoryData.updatedAt.toDate() : new Date(),
    };

    return (
      <>
        <StructuredData type="category" data={category} />
        <CategoryPage
          category={category}
          searchParams={searchParams}
        />
      </>
    );
  } catch (error) {
    console.error('Error fetching category:', error);
    notFound();
  }
}

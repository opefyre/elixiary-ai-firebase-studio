import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryPage } from '@/components/education/category-page';
import { StructuredData } from '@/components/education/structured-data';
import { initializeFirebaseServer } from '@/firebase/server';

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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
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

    const category = querySnapshot.docs[0].data();

    return {
      title: `${category.name} | Elixiary Education`,
      description: category.description,
      keywords: [category.name, 'mixology', 'cocktails', 'education'],
      openGraph: {
        title: `${category.name} | Elixiary Education`,
        description: category.description,
        type: 'website',
        url: `https://elixiary.com/education/${params.category}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.name} | Elixiary Education`,
        description: category.description,
      },
      alternates: {
        canonical: `https://elixiary.com/education/${params.category}`,
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

    const category = querySnapshot.docs[0].data();

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

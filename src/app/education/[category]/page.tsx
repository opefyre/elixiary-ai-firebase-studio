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

    const categoryData = querySnapshot.docs[0].data();

    return {
      title: `${categoryData.name} | Elixiary Education`,
      description: categoryData.description,
      keywords: [categoryData.name, 'mixology', 'cocktails', 'education'],
      openGraph: {
        title: `${categoryData.name} | Elixiary Education`,
        description: categoryData.description,
        type: 'website',
        url: `https://elixiary.com/education/${params.category}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryData.name} | Elixiary Education`,
        description: categoryData.description,
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

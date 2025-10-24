import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    
    // Get all categories
    const categoriesSnapshot = await adminDb.collection('education_categories').get();
    const categories = [];
    
    categoriesSnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Check articles for each category
    const categoryStats = [];
    for (const category of categories) {
      const articlesSnapshot = await adminDb.collection('education_articles')
        .where('category', '==', category.slug)
        .where('status', '==', 'published')
        .get();
      
      categoryStats.push({
        name: category.name,
        slug: category.slug,
        articleCount: articlesSnapshot.size,
        needsMore: articlesSnapshot.size < 3
      });
    }
    
    // Get total articles
    const totalArticlesSnapshot = await adminDb.collection('education_articles')
      .where('status', '==', 'published')
      .get();
    
    return NextResponse.json({
      totalCategories: categories.length,
      totalArticles: totalArticlesSnapshot.size,
      categoryStats
    });
    
  } catch (error: any) {
    console.error('Error checking categories:', error);
    return NextResponse.json(
      { error: 'Failed to check categories' },
      { status: 500 }
    );
  }
}

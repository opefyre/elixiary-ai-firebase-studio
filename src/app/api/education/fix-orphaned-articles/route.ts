import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    // Get all articles
    const articlesSnapshot = await adminDb.collection('education_articles').get();
    const totalArticles = articlesSnapshot.size;

    // Get all categories
    const categoriesSnapshot = await adminDb.collection('education_categories').get();
    
    const categories = [];
    categoriesSnapshot.forEach(doc => {
      categories.push({
        id: doc.id,
        slug: doc.data().slug,
        name: doc.data().name,
        articleCount: doc.data().articleCount || 0
      });
    });

    const categorySlugSet = new Set(categories.map(c => c.slug));
    const totalInCategories = categories.reduce((sum, cat) => sum + (cat.articleCount || 0), 0);

    // Find orphaned articles (articles without categories or with invalid categories)
    const orphanedArticles = [];
    const articlesByCategory = {};
    
    articlesSnapshot.forEach(doc => {
      const data = doc.data();
      const category = data.category;
      
      if (!category) {
        orphanedArticles.push({
          id: doc.id,
          title: data.title,
          slug: data.slug,
          category: null,
          issue: 'No category assigned'
        });
      } else if (!categorySlugSet.has(category)) {
        orphanedArticles.push({
          id: doc.id,
          title: data.title,
          slug: data.slug,
          category: category,
          issue: `Invalid category: ${category} (category doesn't exist)`
        });
      } else {
        // Count by category
        if (!articlesByCategory[category]) {
          articlesByCategory[category] = 0;
        }
        articlesByCategory[category]++;
      }
    });

    // Check for mismatches
    const categoryMismatches = categories.map(cat => {
      const actualCount = articlesByCategory[cat.slug] || 0;
      const storedCount = cat.articleCount || 0;
      return {
        slug: cat.slug,
        name: cat.name,
        storedCount,
        actualCount,
        mismatch: storedCount !== actualCount
      };
    }).filter(c => c.mismatch);

    return NextResponse.json({
      summary: {
        totalArticles,
        totalCategories: categories.length,
        totalInCategories,
        difference: totalArticles - totalInCategories,
        orphanedCount: orphanedArticles.length,
        categoryMismatchesCount: categoryMismatches.length
      },
      orphanedArticles,
      categoryMismatches,
      categories: categories.map(c => ({
        slug: c.slug,
        name: c.name,
        articleCount: c.articleCount
      }))
    });
  } catch (error: any) {
    console.error("Error checking articles:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const results = {
      createdCategory: null,
      fixedCategories: [],
      errors: []
    };

    // Step 1: Create the missing "classic-cocktails" category
    try {
      const classicCocktailsCategory = {
        name: "Classic Cocktails",
        slug: "classic-cocktails",
        description: "Learn about the history, preparation, and variations of timeless classic cocktails like the Old Fashioned, Manhattan, Martini, and more.",
        icon: "Martini",
        color: "#B8860B",
        order: 1,
        articleCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await adminDb.collection('education_categories').add(classicCocktailsCategory);
      results.createdCategory = "classic-cocktails";
    } catch (error: any) {
      results.errors.push(`Failed to create classic-cocktails category: ${error.message}`);
    }

    // Step 2: Get all articles and count by category
    const articlesSnapshot = await adminDb.collection('education_articles').get();
    const articlesByCategory = {};
    
    articlesSnapshot.forEach(doc => {
      const category = doc.data().category;
      if (category) {
        articlesByCategory[category] = (articlesByCategory[category] || 0) + 1;
      }
    });

    // Step 3: Get all categories and update counts
    const categoriesSnapshot = await adminDb.collection('education_categories').get();
    
    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryData = categoryDoc.data();
      const slug = categoryData.slug;
      const storedCount = categoryData.articleCount || 0;
      const actualCount = articlesByCategory[slug] || 0;

      if (storedCount !== actualCount) {
        try {
          await adminDb.collection('education_categories').doc(categoryDoc.id).update({
            articleCount: actualCount,
            updatedAt: new Date()
          });
          
          results.fixedCategories.push({
            slug,
            name: categoryData.name,
            oldCount: storedCount,
            newCount: actualCount
          });
        } catch (error: any) {
          results.errors.push(`Failed to update ${slug}: ${error.message}`);
        }
      }
    }

    // Step 4: Calculate final statistics
    const finalCategoriesSnapshot = await adminDb.collection('education_categories').get();
    const finalArticlesSnapshot = await adminDb.collection('education_articles').get();
    
    let totalInCategories = 0;
    finalCategoriesSnapshot.forEach(doc => {
      totalInCategories += doc.data().articleCount || 0;
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalArticles: finalArticlesSnapshot.size,
        totalCategories: finalCategoriesSnapshot.size,
        totalInCategories,
        difference: finalArticlesSnapshot.size - totalInCategories
      },
      actions: {
        createdCategory: results.createdCategory,
        fixedCategoriesCount: results.fixedCategories.length,
        errors: results.errors
      },
      fixedCategories: results.fixedCategories
    });
  } catch (error: any) {
    console.error("Error fixing categories:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

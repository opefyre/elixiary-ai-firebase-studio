import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const results: any[] = [];

    // Step 1: Get all categories
    const categoriesSnapshot = await adminDb.collection('education_categories').get();
    const allCategories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Step 2: Find and fix duplicates (keep the one with most articles)
    const categoryMap = new Map();
    for (const cat of allCategories) {
      const slug = cat.slug;
      if (!categoryMap.has(slug)) {
        categoryMap.set(slug, [cat]);
      } else {
        categoryMap.get(slug).push(cat);
      }
    }

    // Handle duplicates
    for (const [slug, categories] of categoryMap.entries()) {
      if (categories.length > 1) {
        // Sort by articleCount descending, keep the one with most articles
        categories.sort((a: any, b: any) => (b.articleCount || 0) - (a.articleCount || 0));
        const keepCategory = categories[0];
        const duplicates = categories.slice(1);

        // Delete duplicates
        for (const dup of duplicates) {
          await adminDb.collection('education_categories').doc(dup.id).delete();
          results.push({ action: 'deleted_duplicate', category: slug, id: dup.id });
        }
        results.push({ action: 'kept_category', category: slug, id: keepCategory.id, articleCount: keepCategory.articleCount });
      }
    }

    // Step 3: Create missing categories
    const existingSlugs = new Set(Array.from(categoryMap.keys()));
    const missingCategories = [
      { name: "Cocktail Techniques", slug: "cocktail-techniques", description: "Learn advanced cocktail techniques and methods for creating perfect drinks.", icon: "🎯", color: "#8B5CF6", order: 6 },
      { name: "Cocktail History", slug: "cocktail-history", description: "Explore the rich history and evolution of cocktails through the ages.", icon: "📚", color: "#F59E0B", order: 7 },
      { name: "Cocktail Pairing", slug: "cocktail-pairing", description: "Master the art of matching cocktails with food for perfect flavor combinations.", icon: "🍽️", color: "#10B981", order: 8 },
      { name: "Cocktail Presentation", slug: "cocktail-presentation", description: "Learn how to present cocktails beautifully and create visual appeal.", icon: "✨", color: "#EC4899", order: 9 }
    ];

    for (const catData of missingCategories) {
      if (!existingSlugs.has(catData.slug)) {
        const newCategory = {
          ...catData,
          articleCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await adminDb.collection('education_categories').add(newCategory);
        results.push({ action: 'created_category', category: catData.slug });
      }
    }

    // Step 4: Move orphaned articles to proper categories
    const articlesSnapshot = await adminDb.collection('education_articles').get();
    const orphanMap: Record<string, string> = {
      "cocktail-techniques": "cocktail-techniques",
      "cocktail-history": "cocktail-history",
      "cocktail-pairing": "cocktail-pairing"
    };

    for (const doc of articlesSnapshot.docs) {
      const article = doc.data();
      const currentCategory = article.category;
      
      if (orphanMap[currentCategory]) {
        // Update article to use correct category slug
        await doc.ref.update({ category: currentCategory });
        results.push({ action: 'fixed_article', title: article.title, oldCategory: currentCategory, newCategory: currentCategory });
      }
    }

    // Step 5: Add 2-3 articles to home-bar-setup
    const homeBarCategory = allCategories.find((c: any) => c.slug === 'home-bar-setup');
    if (homeBarCategory && homeBarCategory.articleCount < 3) {
      const articlesToAdd = [
        {
          title: "Advanced Home Bar Storage Solutions",
          slug: "advanced-home-bar-storage-solutions",
          excerpt: "Discover innovative storage solutions for maximizing space and efficiency in your home bar setup.",
          content: "# Advanced Home Bar Storage Solutions\n\nLearn efficient storage methods for your home bar.",
          featuredImage: "https://images.unsplash.com/photo-1587223962930-cb7f317f862c?w=800&h=600&fit=crop",
          category: "home-bar-setup",
          difficulty: "intermediate",
          readingTime: 10,
          tags: ["storage", "organization", "home bar"],
          seo: {
            metaDescription: "Advanced storage solutions for home bars",
            keywords: ["home bar storage", "organization"]
          }
        },
        {
          title: "Home Bar Lighting Design for Ambiance and Function",
          slug: "home-bar-lighting-design",
          excerpt: "Learn how to design perfect lighting for your home bar that combines functionality with ambiance.",
          content: "# Home Bar Lighting Design\n\nMaster the art of lighting for your home bar.",
          featuredImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
          category: "home-bar-setup",
          difficulty: "beginner",
          readingTime: 8,
          tags: ["lighting", "design", "ambiance"],
          seo: {
            metaDescription: "Home bar lighting design tips",
            keywords: ["bar lighting", "home bar design"]
          }
        }
      ];

      for (const article of articlesToAdd) {
        const articleData = {
          ...article,
          author: {
            name: "Elixiary Team",
            bio: "Expert mixologists and cocktail enthusiasts dedicated to helping you create amazing drinks at home.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
          },
          publishedAt: new Date(),
          updatedAt: new Date(),
          status: "published",
          stats: { views: 0, likes: 0, shares: 0 }
        };
        await adminDb.collection('education_articles').add(articleData);
        results.push({ action: 'added_article', title: article.title, category: article.category });
      }

      // Update category count
      if (homeBarCategory.id) {
        await adminDb.collection('education_categories').doc(homeBarCategory.id).update({
          articleCount: (homeBarCategory.articleCount || 0) + articlesToAdd.length,
          updatedAt: new Date()
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Categories fixed successfully",
      results 
    });
  } catch (error: any) {
    console.error("Error fixing categories:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

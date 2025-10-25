import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    // Check if bar-equipment category exists
    const categoriesSnapshot = await adminDb.collection('education_categories')
      .where('slug', '==', 'bar-equipment')
      .get();

    let categoryRef;
    let articleCount = 0;
    if (!categoriesSnapshot.empty) {
      categoryRef = categoriesSnapshot.docs[0].ref;
      articleCount = categoriesSnapshot.docs[0].data().articleCount || 0;
      console.log('Using existing bar-equipment category');
    } else {
      // Create the category if it doesn't exist
      const categoryData = {
        name: "Bar Equipment",
        slug: "bar-equipment",
        description: "Essential tools and equipment for creating professional cocktails.",
        icon: "🔧",
        color: "#10B981",
        order: 2,
        articleCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categoryRef = await adminDb.collection('education_categories').add(categoryData);
      console.log('Created bar-equipment category');
    }

    const articles = [
      {
        title: "Essential Bar Tools: A Complete Equipment Guide",
        slug: "essential-bar-tools-complete-equipment-guide",
        excerpt: "Discover the essential bar tools every home bartender needs to create professional-quality cocktails.",
        content: "# Essential Bar Tools\n\nLearn about shakers, strainers, jiggers, and all the essential equipment you need for your home bar.",
        featuredImage: "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=800&h=600&fit=crop",
        category: "bar-equipment",
        difficulty: "beginner",
        readingTime: 10,
        tags: ["bar tools", "equipment", "cocktail tools"],
        seo: {
          metaDescription: "Essential bar tools for professional cocktails",
          keywords: ["bar tools", "cocktail equipment"]
        }
      },
      {
        title: "Choosing the Right Cocktail Shaker",
        slug: "choosing-right-cocktail-shaker",
        excerpt: "Learn about the different types of cocktail shakers and which one is right for you.",
        content: "# Choosing the Right Cocktail Shaker\n\nBoston, Cobbler, and French shakers explained.",
        featuredImage: "https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=800&h=600&fit=crop",
        category: "bar-equipment",
        difficulty: "beginner",
        readingTime: 8,
        tags: ["shaker", "bar tools", "equipment"],
        seo: {
          metaDescription: "How to choose the right cocktail shaker",
          keywords: ["cocktail shaker", "bar equipment"]
        }
      },
      {
        title: "Precision Measurements: The Importance of Jiggers",
        slug: "precision-measurements-jiggers",
        excerpt: "Why precision matters in cocktail making and how to use jiggers correctly.",
        content: "# Precision Measurements\n\nMaster the art of accurate cocktail measurements with jiggers and other measuring tools.",
        featuredImage: "https://images.unsplash.com/photo-1551024739-337eeb4d9b0e?w=800&h=600&fit=crop",
        category: "bar-equipment",
        difficulty: "beginner",
        readingTime: 7,
        tags: ["jigger", "measuring", "precision"],
        seo: {
          metaDescription: "Importance of precise measurements in cocktails",
          keywords: ["jigger", "cocktail measurement"]
        }
      },
      {
        title: "Advanced Bar Equipment for Serious Home Bartenders",
        slug: "advanced-bar-equipment-serious-bartenders",
        excerpt: "Upgrade your home bar with professional-grade equipment for the best cocktails.",
        content: "# Advanced Bar Equipment\n\nDiscover professional-grade tools that will elevate your cocktail game to the next level.",
        featuredImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop",
        category: "bar-equipment",
        difficulty: "intermediate",
        readingTime: 12,
        tags: ["advanced equipment", "professional tools", "upgrade"],
        seo: {
          metaDescription: "Advanced bar equipment for professional results",
          keywords: ["advanced bar tools", "professional equipment"]
        }
      }
    ];

    const results = [];
    for (const article of articles) {
      try {
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
          stats: {
            views: 0,
            likes: 0,
            shares: 0
          }
        };
        const docRef = await adminDb.collection('education_articles').add(articleData);
        results.push({
          id: docRef.id,
          title: article.title,
          category: article.category,
          status: 'success'
        });
      } catch (error: any) {
        results.push({
          title: article.title,
          category: article.category,
          status: 'error',
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    await categoryRef.update({
      articleCount: articleCount + successCount,
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      message: `Added ${successCount} articles to bar-equipment category successfully`, 
      results 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

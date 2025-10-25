import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    // Check if techniques category exists
    const categoriesSnapshot = await adminDb.collection('education_categories')
      .where('slug', '==', 'techniques')
      .get();

    let categoryRef;
    let articleCount = 0;
    if (!categoriesSnapshot.empty) {
      categoryRef = categoriesSnapshot.docs[0].ref;
      articleCount = categoriesSnapshot.docs[0].data().articleCount || 0;
      console.log('Using existing techniques category');
    } else {
      const categoryData = {
        name: "Advanced Techniques",
        slug: "techniques",
        description: "Master advanced mixing techniques and professional cocktail methods.",
        icon: "🎯",
        color: "#8B5CF6",
        order: 3,
        articleCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categoryRef = await adminDb.collection('education_categories').add(categoryData);
      console.log('Created techniques category');
    }

    const articles = [
      {
        title: "The Art of Shaking: Perfect Your Cocktail Technique",
        slug: "art-of-shaking-perfect-cocktail-technique",
        excerpt: "Master the art of shaking cocktails like a professional. Learn proper techniques, timing, and methods for perfect results.",
        content: "# The Art of Shaking\n\nLearn professional shaking techniques for optimal cocktail results.",
        featuredImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
        category: "techniques",
        difficulty: "intermediate",
        readingTime: 10,
        tags: ["shaking", "technique", "professional"],
        seo: {
          metaDescription: "Master the art of shaking cocktails",
          keywords: ["shaking technique", "cocktail method"]
        }
      },
      {
        title: "Stirring vs. Shaking: When to Use Each Method",
        slug: "stirring-vs-shaking-when-to-use",
        excerpt: "Understand the difference between stirring and shaking, and when to use each technique for perfect cocktails.",
        content: "# Stirring vs. Shaking\n\nLearn when to stir and when to shake for the best cocktail results.",
        featuredImage: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&h=600&fit=crop",
        category: "techniques",
        difficulty: "intermediate",
        readingTime: 8,
        tags: ["stirring", "shaking", "comparison"],
        seo: {
          metaDescription: "When to stir vs shake cocktails",
          keywords: ["stir vs shake", "cocktail technique"]
        }
      },
      {
        title: "Advanced Muddling Techniques for Maximum Flavor",
        slug: "advanced-muddling-techniques-maximum-flavor",
        excerpt: "Take your muddling skills to the next level. Learn professional techniques for extracting maximum flavor and aroma.",
        content: "# Advanced Muddling Techniques\n\nMaster the art of muddling for perfect flavor extraction.",
        featuredImage: "https://images.unsplash.com/photo-1551318451-ae45fec9c85a?w=800&h=600&fit=crop",
        category: "techniques",
        difficulty: "intermediate",
        readingTime: 9,
        tags: ["muddling", "technique", "flavor"],
        seo: {
          metaDescription: "Advanced muddling techniques for better cocktails",
          keywords: ["muddling", "cocktail technique"]
        }
      },
      {
        title: "Professional Layering Techniques for Stunning Cocktails",
        slug: "professional-layering-techniques-stunning-cocktails",
        excerpt: "Learn how to create visually stunning layered cocktails with professional techniques.",
        content: "# Professional Layering Techniques\n\nMaster the art of layering for beautiful, impressive cocktails.",
        featuredImage: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&h=600&fit=crop",
        category: "techniques",
        difficulty: "advanced",
        readingTime: 12,
        tags: ["layering", "presentation", "advanced"],
        seo: {
          metaDescription: "Professional layering techniques for cocktails",
          keywords: ["cocktail layering", "layered drinks"]
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
      message: `Added ${successCount} articles to techniques category successfully`, 
      results 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

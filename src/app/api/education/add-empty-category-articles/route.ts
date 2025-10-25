import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const results: any[] = [];

    // Get the empty categories
    const categoriesSnapshot = await adminDb.collection('education_categories')
      .where('articleCount', '==', 0)
      .get();

    const emptyCategories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Articles for each category
    const categoryArticles: Record<string, any[]> = {
      'cocktail-techniques': [
        {
          title: "Mastering the Fine Art of Stirring Cocktails",
          slug: "mastering-stirring-cocktails",
          excerpt: "Learn the professional technique of stirring cocktails to create perfectly balanced, silky-smooth drinks.",
          content: "# Mastering the Fine Art of Stirring Cocktails\n\nLearn professional stirring techniques for perfect cocktails.",
          difficulty: "intermediate",
          readingTime: 10,
          tags: ["stirring", "technique", "professional"]
        },
        {
          title: "The Double Strain Technique for Perfect Cocktails",
          slug: "double-strain-technique-perfect-cocktails",
          excerpt: "Discover why and how to double strain cocktails for the smoothest texture and professional presentation.",
          content: "# The Double Strain Technique\n\nMaster double straining for professional cocktail results.",
          difficulty: "intermediate",
          readingTime: 8,
          tags: ["straining", "technique", "professional"]
        },
        {
          title: "Building Layers in Cocktails: Advanced Techniques",
          slug: "building-layers-cocktails-advanced-techniques",
          excerpt: "Learn how to create visually stunning layered cocktails using density and careful pouring techniques.",
          content: "# Building Layers in Cocktails\n\nMaster the art of creating beautiful layered cocktails.",
          difficulty: "advanced",
          readingTime: 12,
          tags: ["layering", "presentation", "advanced"]
        }
      ],
      'cocktail-history': [
        {
          title: "The Golden Age of Cocktails: Prohibition Era Mixology",
          slug: "golden-age-cocktails-prohibition-era",
          excerpt: "Explore how Prohibition shaped cocktail culture and gave rise to some of the most iconic drinks in history.",
          content: "# The Golden Age of Cocktails\n\nDiscover how Prohibition shaped modern cocktails.",
          difficulty: "beginner",
          readingTime: 10,
          tags: ["history", "prohibition", "cocktails"]
        },
        {
          title: "The Origins of Classic Cocktails",
          slug: "origins-classic-cocktails",
          excerpt: "Learn about the fascinating stories behind classic cocktails like the Martini, Old Fashioned, and Manhattan.",
          content: "# Origins of Classic Cocktails\n\nExplore the history of timeless cocktail recipes.",
          difficulty: "beginner",
          readingTime: 9,
          tags: ["history", "classic cocktails", "origins"]
        },
        {
          title: "Cocktail Evolution: From Punch to Modern Mixology",
          slug: "cocktail-evolution-punch-modern-mixology",
          excerpt: "Trace the evolution of cocktails from simple punches to today's sophisticated craft cocktails.",
          content: "# Cocktail Evolution\n\nLearn how cocktails evolved over centuries.",
          difficulty: "beginner",
          readingTime: 11,
          tags: ["history", "evolution", "mixology"]
        }
      ],
      'cocktail-pairing': [
        {
          title: "Pairing Cocktails with Appetizers and Small Plates",
          slug: "pairing-cocktails-appetizers-small-plates",
          excerpt: "Master the art of matching cocktails with appetizers for the perfect pre-dinner experience.",
          content: "# Pairing Cocktails with Appetizers\n\nLearn to match drinks with small plates.",
          difficulty: "intermediate",
          readingTime: 9,
          tags: ["pairing", "food", "appetizers"]
        },
        {
          title: "Dessert Cocktails: Sweet Pairings for Special Occasions",
          slug: "dessert-cocktails-sweet-pairings",
          excerpt: "Discover how to pair sweet cocktails with desserts for the ultimate indulgent experience.",
          content: "# Dessert Cocktails\n\nMaster sweet cocktail and dessert pairings.",
          difficulty: "intermediate",
          readingTime: 8,
          tags: ["pairing", "desserts", "sweet cocktails"]
        },
        {
          title: "Summer Cocktail Pairings for Outdoor Dining",
          slug: "summer-cocktail-pairings-outdoor-dining",
          excerpt: "Learn which cocktails work best with summer meals and outdoor dining experiences.",
          content: "# Summer Cocktail Pairings\n\nDiscover perfect summer drink and food combinations.",
          difficulty: "beginner",
          readingTime: 10,
          tags: ["pairing", "summer", "outdoor dining"]
        }
      ],
      'cocktail-presentation': [
        {
          title: "Garnish Essentials: Elevating Your Cocktail Presentation",
          slug: "garnish-essentials-elevating-cocktail-presentation",
          excerpt: "Learn essential garnishing techniques that transform ordinary cocktails into visually stunning drinks.",
          content: "# Garnish Essentials\n\nMaster the art of cocktail garnishing.",
          difficulty: "intermediate",
          readingTime: 10,
          tags: ["garnishes", "presentation", "visual appeal"]
        },
        {
          title: "Glassware Selection for Maximum Visual Impact",
          slug: "glassware-selection-visual-impact",
          excerpt: "Discover how choosing the right glassware can dramatically enhance your cocktail's presentation.",
          content: "# Glassware Selection\n\nLearn to choose the perfect glass for each cocktail.",
          difficulty: "beginner",
          readingTime: 9,
          tags: ["glassware", "presentation", "selection"]
        },
        {
          title: "Creating Instagram-Worthy Cocktail Presentations",
          slug: "instagram-worthy-cocktail-presentations",
          excerpt: "Professional tips for creating photogenic cocktails that look as good as they taste.",
          content: "# Instagram-Worthy Cocktails\n\nCreate cocktails that photograph beautifully.",
          difficulty: "intermediate",
          readingTime: 8,
          tags: ["presentation", "social media", "photography"]
        }
      ]
    };

    // Add articles for each empty category
    for (const category of emptyCategories) {
      const slug = category.slug;
      const articles = categoryArticles[slug] || [];

      if (articles.length === 0) {
        results.push({ action: 'skipped', category: slug, reason: 'no articles defined' });
        continue;
      }

      let addedCount = 0;
      for (const article of articles) {
        try {
          const articleData = {
            ...article,
            excerpt: article.excerpt,
            content: article.content,
            featuredImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
            category: slug,
            author: {
              name: "Elixiary Team",
              bio: "Expert mixologists and cocktail enthusiasts dedicated to helping you create amazing drinks at home.",
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            },
            publishedAt: new Date(),
            updatedAt: new Date(),
            status: "published",
            stats: { views: 0, likes: 0, shares: 0 },
            seo: {
              metaDescription: article.excerpt,
              keywords: article.tags
            }
          };
          await adminDb.collection('education_articles').add(articleData);
          addedCount++;
          results.push({ action: 'added_article', category: slug, title: article.title });
        } catch (error: any) {
          results.push({ action: 'error', category: slug, title: article.title, error: error.message });
        }
      }

      // Update category article count
      if (addedCount > 0 && category.id) {
        await adminDb.collection('education_categories').doc(category.id).update({
          articleCount: addedCount,
          updatedAt: new Date()
        });
        results.push({ action: 'updated_category', category: slug, articleCount: addedCount });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Added articles to ${emptyCategories.length} categories`,
      results
    });
  } catch (error: any) {
    console.error("Error adding articles:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

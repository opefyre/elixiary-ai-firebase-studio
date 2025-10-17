import { NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { config } from '@/lib/config';

export async function GET() {
  const baseUrl = config.baseUrl;
  const now = new Date();

  try {
    // Initialize Firebase Admin
    const { adminDb } = await initializeFirebaseServer();

    // Fetch actual curated recipes (limit to 500 for performance)
    const recipesSnapshot = await adminDb
      .collection('curated-recipes')
      .orderBy('createdAt', 'desc')
      .limit(500)
      .get();

    const recipes = recipesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        createdAt: data.createdAt,
        category: data.category,
        tags: data.tags || [],
      };
    });

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${recipes.map(recipe => {
    // Calculate priority based on recipe characteristics
    let priority = 0.6;
    
    // Higher priority for popular categories
    const popularCategories = ['cat_short_shaken_citrus', 'cat_highball_long', 'cat_shot_shooter'];
    if (popularCategories.includes(recipe.category)) {
      priority = 0.7;
    }
    
    // Higher priority for recipes with more tags (more detailed)
    if (recipe.tags && recipe.tags.length > 5) {
      priority += 0.05;
    }

    priority = Math.min(priority, 0.8); // Cap at 0.8

    const lastModified = recipe.createdAt 
      ? new Date(recipe.createdAt.toDate()).toISOString()
      : now.toISOString();

    return `  <url>
    <loc>${baseUrl}/cocktails/recipe/${recipe.id}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
  }).join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });

  } catch (error) {
    console.error('Error generating recipes sitemap:', error);
    
    // Return empty sitemap on error
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    return new NextResponse(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  }
}

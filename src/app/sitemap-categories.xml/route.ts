import { NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function GET() {
  const baseUrl = 'https://ai.elixiary.com';
  const now = new Date().toISOString();

  try {
    // Initialize Firebase Admin
    const { adminDb } = await initializeFirebaseServer();

    // Fetch all categories
    const categoriesSnapshot = await adminDb.collection('curated-categories').get();
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      recipeCount: doc.data().recipeCount || 0,
    }));

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categories.map(category => {
    const priority = category.recipeCount > 50 ? 0.8 : 0.7;
    
    return `  <url>
    <loc>${baseUrl}/cocktails/category/${category.id}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
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
    console.error('Error generating categories sitemap:', error);
    
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

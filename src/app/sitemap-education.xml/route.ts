import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { EducationArticle, EducationCategory } from '@/types/education';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    
    // Fetch categories
    const categoriesSnapshot = await adminDb
      .collection('education_categories')
      .get();
    
    const categories: EducationCategory[] = [];
    categoriesSnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        name: doc.data().name,
        slug: doc.data().slug,
        description: doc.data().description,
        icon: doc.data().icon,
        color: doc.data().color,
        order: doc.data().order,
        articleCount: doc.data().articleCount,
      });
    });

    // Fetch published articles
    const articlesSnapshot = await adminDb
      .collection('education_articles')
      .where('status', '==', 'published')
      .get();
    
    const articles: EducationArticle[] = [];
    articlesSnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        category: data.category,
        difficulty: data.difficulty,
        readingTime: data.readingTime,
        tags: data.tags || [],
        author: data.author,
        publishedAt: data.publishedAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        status: data.status,
        seo: data.seo,
        stats: data.stats || { views: 0, likes: 0, shares: 0 },
      });
    });

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Education Hub -->
  <url>
    <loc>https://elixiary.com/education</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Search Page -->
  <url>
    <loc>https://elixiary.com/education/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Category Pages -->
  ${categories.map((category) => `
  <url>
    <loc>https://elixiary.com/education/${category.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- Article Pages -->
  ${articles.map((article) => `
  <url>
    <loc>https://elixiary.com/education/${article.category}/${article.slug}</loc>
    <lastmod>${article.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating education sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

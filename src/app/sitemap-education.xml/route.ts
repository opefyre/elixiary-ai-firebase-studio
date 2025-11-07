import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { initializeFirebaseServer } from '@/firebase/server';
import { EducationArticle, EducationCategory } from '@/types/education';
import { getCanonicalUrl } from '@/lib/config';

function coerceToDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (typeof (value as { toDate?: () => unknown })?.toDate === 'function') {
    const result = (value as { toDate: () => unknown }).toDate();
    if (result instanceof Date) {
      return result;
    }
    const dateFromResult = new Date(result as string | number | Date);
    return Number.isNaN(dateFromResult.getTime()) ? null : dateFromResult;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    
    const requestTime = new Date();
    const fallbackIso = requestTime.toISOString();

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

      const publishedAt = coerceToDate(data.publishedAt);
      const updatedAt = coerceToDate(data.updatedAt);

      if (!publishedAt && !updatedAt) {
        console.warn('[sitemap-education] Skipping article due to missing timestamps', {
          id: doc.id,
        });
        return;
      }

      const safePublishedAt = publishedAt ?? updatedAt ?? requestTime;
      const safeUpdatedAt = updatedAt ?? publishedAt ?? requestTime;

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
        publishedAt: safePublishedAt,
        updatedAt: safeUpdatedAt,
        status: data.status,
        seo: data.seo,
        stats: data.stats || { views: 0, likes: 0, shares: 0 },
      });
    });

    // Generate sitemap XML
    const now = fallbackIso;

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Education Hub -->
  <url>
    <loc>${getCanonicalUrl('/education')}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Articles Archive -->
  <url>
    <loc>${getCanonicalUrl('/education/articles')}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- Category Pages -->
  ${categories.map((category) => `
  <url>
    <loc>${getCanonicalUrl(`/education/${category.slug}`)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}

  <!-- Article Pages -->
  ${articles.map((article) => {
    const lastModifiedDate = article.updatedAt ?? article.publishedAt;
    const safeLastMod = lastModifiedDate && !Number.isNaN(lastModifiedDate.getTime())
      ? lastModifiedDate.toISOString()
      : fallbackIso;

    return `
  <url>
    <loc>${getCanonicalUrl(`/education/${article.category}/${article.slug}`)}</loc>
    <lastmod>${safeLastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('')}
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

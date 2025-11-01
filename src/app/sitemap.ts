import { MetadataRoute } from 'next';
import { initializeFirebaseServer } from '@/firebase/server';
import { config } from '@/lib/config';
import { isPathBlockedForSitemap } from '@/lib/seo-sitemap-guards';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.baseUrl;
  const now = new Date();

  // Static pages that actually exist. Paths must not be disallowed in robots.ts.
  const staticPageConfigs = [
    {
      path: '/',
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      path: '/cocktails',
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      path: '/pricing',
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      path: '/privacy',
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      path: '/education',
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  const staticPages: MetadataRoute.Sitemap = staticPageConfigs
    .filter(page => !isPathBlockedForSitemap(page.path))
    .map(page => ({
      url: page.path === '/' ? baseUrl : `${baseUrl}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));

  try {
    // Initialize Firebase Admin
    const { adminDb } = await initializeFirebaseServer();

    // Fetch actual curated recipes to include individual recipe pages
    const recipesSnapshot = await adminDb
      .collection('curated-recipes')
      .orderBy('createdAt', 'desc')
      .limit(500) // Reasonable limit for sitemap
      .get();

    const recipePages: MetadataRoute.Sitemap = recipesSnapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt;
      
      // Calculate priority based on recipe characteristics
      let priority = 0.6;
      
      // Higher priority for popular categories
      const popularCategories = ['cat_short_shaken_citrus', 'cat_highball_long', 'cat_shot_shooter'];
      if (popularCategories.includes(data.category)) {
        priority = 0.7;
      }
      
      // Higher priority for recipes with more tags (more detailed)
      if (data.tags && data.tags.length > 5) {
        priority += 0.05;
      }

      priority = Math.min(priority, 0.8); // Cap at 0.8

      // Properly handle different date formats
      let lastModifiedDate = now;
      if (createdAt) {
        try {
          // Check if it's a Firestore Timestamp
          if (createdAt && typeof createdAt.toDate === 'function') {
            lastModifiedDate = new Date(createdAt.toDate());
          } else if (createdAt instanceof Date) {
            lastModifiedDate = createdAt;
          } else if (typeof createdAt === 'string' || typeof createdAt === 'number') {
            lastModifiedDate = new Date(createdAt);
          }
        } catch (error) {
          // Fallback to current date if date parsing fails
          lastModifiedDate = now;
        }
      }

      return {
        url: `${baseUrl}/cocktails/recipe/${doc.id}`,
        lastModified: lastModifiedDate,
        changeFrequency: 'monthly',
        priority,
      };
    });

    const allPages = [...staticPages, ...recipePages];
    return allPages;

  } catch (error) {
    // Fallback to static pages only if database fetch fails
    return staticPages;
  }
}


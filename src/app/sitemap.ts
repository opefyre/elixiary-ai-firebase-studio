import { MetadataRoute } from 'next';
import { initializeFirebaseServer } from '@/firebase/server';
import { config } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.baseUrl;
  const now = new Date();

  // Static pages that actually exist
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cocktails`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/api/docs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

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

      return {
        url: `${baseUrl}/cocktails/recipe/${doc.id}`,
        lastModified: createdAt ? new Date(createdAt.toDate()) : now,
        changeFrequency: 'monthly',
        priority,
      };
    });

    const allPages = [...staticPages, ...recipePages];

    console.log(`Generated sitemap with ${allPages.length} pages`);
    console.log(`- Static pages: ${staticPages.length}`);
    console.log(`- Recipe pages: ${recipePages.length}`);

    return allPages;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static pages only if database fetch fails
    console.log(`Using fallback sitemap with ${staticPages.length} static pages`);
    return staticPages;
  }
}


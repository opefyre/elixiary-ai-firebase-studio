import { MetadataRoute } from 'next';
import { sitemapGenerator } from '@/lib/sitemap-generator';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const allPages = await sitemapGenerator.generateAllPages();
    
    // Convert to Next.js MetadataRoute.Sitemap format
    return allPages.map(page => ({
      url: page.url,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static sitemap if database fetch fails
    const fallbackPages: MetadataRoute.Sitemap = [
      {
        url: 'https://ai.elixiary.com',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: 'https://ai.elixiary.com/cocktails',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: 'https://ai.elixiary.com/pricing',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];

    return fallbackPages;
  }
}


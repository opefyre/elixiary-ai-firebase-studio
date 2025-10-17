import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/cocktails',
          '/cocktails/recipe/*',
          '/pricing',
          '/privacy',
        ],
        disallow: [
          '/login',
          '/account',
          '/api/',
          '/admin/',
          '/_next/',
          '/recipes', // User-specific content
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/cocktails',
          '/cocktails/recipe/*',
          '/pricing',
          '/privacy',
        ],
        disallow: [
          '/login',
          '/account',
          '/api/',
          '/admin/',
          '/_next/',
          '/recipes',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/cocktails',
          '/cocktails/recipe/*',
          '/pricing',
          '/privacy',
        ],
        disallow: [
          '/login',
          '/account',
          '/api/',
          '/admin/',
          '/_next/',
          '/recipes',
        ],
      },
      {
        userAgent: 'Slurp',
        allow: [
          '/',
          '/cocktails',
          '/cocktails/recipe/*',
          '/pricing',
          '/privacy',
        ],
        disallow: [
          '/login',
          '/account',
          '/api/',
          '/admin/',
          '/_next/',
          '/recipes',
        ],
      },
      // Block unwanted bots
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://ai.elixiary.com/sitemap.xml',
    host: 'https://ai.elixiary.com',
    // Add crawl delay for Bing
    crawlDelay: 1,
  };
}


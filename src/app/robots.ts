import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/login',
          '/account',
          '/api/',
          '/admin/',
          '/_next/',
          '/privacy',
          '/recipes', // User-specific content
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/login',
          '/account',
          '/api/',
          '/admin/',
          '/_next/',
          '/privacy',
          '/recipes',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/login',
          '/account',
          '/api/',
          '/admin/',
          '/_next/',
          '/privacy',
          '/recipes',
        ],
      },
      {
        userAgent: 'Slurp',
        allow: '/',
        disallow: [
          '/login',
          '/account',
          '/api/',
          '/admin/',
          '/_next/',
          '/privacy',
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
  };
}


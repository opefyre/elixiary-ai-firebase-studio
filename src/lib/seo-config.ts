import { config } from '@/lib/config';

export const seoConfig = {
  site: {
    name: 'Elixiary AI',
    url: config.baseUrl,
    description: 'AI-Powered Cocktail Recipe Generator',
    logo: `${config.baseUrl}/logo.png`,
    twitter: '@elixiary_ai',
    email: 'hello@elixiary.com',
  },
  
  defaultMetadata: {
    title: 'Elixiary AI - AI-Powered Cocktail Recipe Generator | Free Mixology Tool',
    description: 'Generate unique cocktail recipes with AI! Tell our AI mixologist what you\'re in the mood for, and it will create a custom cocktail recipe just for you. Free cocktail recipe generator powered by Google Gemini. Discover 500+ curated recipes and create unlimited AI cocktails.',
    keywords: [
      'cocktail recipes',
      'AI cocktail generator',
      'mixology',
      'cocktail recipe generator',
      'drink recipes',
      'AI mixologist',
      'free cocktail recipes',
      'custom cocktail creator',
      'bartending',
      'cocktail ideas',
      'cocktail database',
      'mixology app',
      'cocktail inspiration',
      'drink mixing',
      'cocktail ingredients',
      'bartender tools',
      'cocktail collection',
      'alcoholic beverages',
      'cocktail trends',
      'mixology guide',
    ],
  },

  pages: {
    home: {
      title: 'Elixiary AI - AI-Powered Cocktail Recipe Generator | Free Mixology Tool',
      description: 'Generate unique cocktail recipes with AI! Tell our AI mixologist what you\'re in the mood for, and it will create a custom cocktail recipe just for you. Free cocktail recipe generator powered by Google Gemini. Discover 500+ curated recipes and create unlimited AI cocktails.',
      keywords: [
        'cocktail recipes',
        'AI cocktail generator',
        'mixology',
        'free cocktail recipes',
        'cocktail recipe generator',
        'AI mixologist',
        'custom cocktail creator',
        'bartending',
        'cocktail ideas',
      ],
    },
    
    cocktails: {
      title: 'Cocktail Recipes Database | 500+ Curated Cocktail Recipes',
      description: 'Discover 500+ expertly curated cocktail recipes from around the world. Browse by category, difficulty, and ingredients. Find your perfect cocktail recipe today!',
      keywords: [
        'cocktail recipes',
        'curated cocktails',
        'cocktail database',
        'mixology recipes',
        'drink recipes',
        'cocktail collection',
        'bartending recipes',
        'cocktail inspiration',
        'classic cocktails',
        'modern cocktails',
      ],
    },
    
    pricing: {
      title: 'Pricing | Elixiary AI Pro - Unlimited Cocktail Recipes',
      description: 'Upgrade to Elixiary AI Pro for unlimited AI-generated cocktail recipes, advanced features, and premium mixology tools. Start your free trial today!',
      keywords: [
        'elixiary ai pro',
        'cocktail app pricing',
        'mixology subscription',
        'premium cocktail features',
        'unlimited recipes',
        'cocktail app upgrade',
      ],
    },
    
    recipes: {
      title: 'My Recipes | AI Generated & Saved Cocktail Recipes',
      description: 'View and manage your AI-generated cocktail recipes and saved curated recipes. Organize your personal cocktail collection with advanced filtering and search.',
      keywords: [
        'my recipes',
        'personal cocktail collection',
        'AI generated cocktails',
        'saved recipes',
        'cocktail management',
        'recipe organization',
      ],
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Elixiary AI',
    images: {
      default: '/opengraph-image.png',
      cocktails: '/opengraph-cocktails.png',
      pricing: '/opengraph-pricing.png',
    },
  },

  twitter: {
    card: 'summary_large_image',
    creator: '@elixiary_ai',
    site: '@elixiary_ai',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'jJBxd9g_0PuMLy9qlE-KqNfs4hfQVqb8bBWuIjD3p-Q',
    bing: '99FF65807C300F99D988A4FFD56374FE',
  },

  structuredData: {
    organization: {
      '@type': 'Organization',
      name: 'Elixiary AI',
      url: config.baseUrl,
      logo: `${config.baseUrl}/logo.png`,
      description: 'AI-Powered Cocktail Recipe Generator',
      sameAs: [
        'https://twitter.com/elixiary_ai',
        'https://github.com/elixiary-ai',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'hello@elixiary.com',
      },
    },
    
    webApplication: {
      '@type': 'WebApplication',
      name: 'Elixiary AI',
      description: 'AI-Powered Cocktail Recipe Generator',
      url: config.baseUrl,
      applicationCategory: 'Food & Drink',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier available',
      },
      creator: {
        '@type': 'Organization',
        name: 'Elixiary AI',
        url: config.baseUrl,
      },
      featureList: [
        'AI Cocktail Recipe Generation',
        '500+ Curated Cocktail Recipes',
        'Save and Organize Recipes',
        'Shopping List Generation',
        'PDF Export',
        'Mobile Responsive Design',
      ],
    },
  },
};

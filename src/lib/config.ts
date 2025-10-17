// Centralized configuration for the application
export const config = {
  // Base URL configuration
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://ai.elixiary.com',
  domain: process.env.NEXT_PUBLIC_DOMAIN || 'ai.elixiary.com',
  
  // API configuration
  apiBaseUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ai.elixiary.com'}/api/v1`,
  
  // SEO configuration
  siteName: 'Elixiary AI',
  siteDescription: 'AI-Powered Cocktail Recipe Generator',
  siteEmail: 'hello@elixiary.com',
  
  // Social media
  twitter: '@elixiary_ai',
  
  // External services
  supportEmail: 'api@elixiary.com',
  statusUrl: 'https://status.elixiary.com',
} as const;

// Helper functions
export const getCanonicalUrl = (path: string = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${config.baseUrl}${cleanPath}`;
};

export const getApiUrl = (endpoint: string = '') => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${config.apiBaseUrl}${cleanEndpoint}`;
};

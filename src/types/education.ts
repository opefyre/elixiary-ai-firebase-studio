export interface EducationArticle {
  id: string;
  title: string;
  slug: string; // URL-friendly version
  excerpt: string;
  content: string; // Markdown or rich text
  featuredImage: string;
  category: 'mixology-techniques' | 'bar-equipment' | 'cocktail-ingredients' | 'home-bar-setup' | 'classic-cocktails' | 'cocktail-presentation' | 'cocktail-techniques' | 'cocktail-history' | 'cocktail-pairing';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number; // in minutes
  tags: string[];
  author: {
    name: string;
    bio: string;
    avatar: string;
  };
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  seo: {
    metaDescription: string;
    keywords: string[];
  };
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
}

export interface EducationCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  articleCount: number;
}


export interface EducationAnalytics {
  articleViews: {
    articleId: string;
    userId?: string;
    timestamp: Date;
    timeSpent: number;
    completionRate: number;
  };
  
  userInteractions: {
    type: 'like' | 'share' | 'bookmark' | 'comment';
    articleId: string;
    userId?: string;
    timestamp: Date;
  };
  
  searchAnalytics: {
    query: string;
    results: number;
    timestamp: Date;
    userId?: string;
  };
}

export interface SearchFilters {
  category?: string;
  difficulty?: string;
  tags?: string[];
  readingTime?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

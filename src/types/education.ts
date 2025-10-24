export interface EducationArticle {
  id: string;
  title: string;
  slug: string; // URL-friendly version
  excerpt: string;
  content: string; // Markdown or rich text
  featuredImage: string;
  category: 'fundamentals' | 'equipment' | 'techniques' | 'ingredients' | 'classics' | 'trends';
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

export interface EducationVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube or Vimeo
  thumbnail: string;
  duration: number; // in seconds
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  relatedArticles: string[]; // Article IDs
  publishedAt: Date;
}

export interface InteractiveContent {
  id: string;
  type: 'quiz' | 'tool' | 'calculator' | 'challenge';
  title: string;
  description: string;
  content: any; // JSON structure for different types
  category: string;
  difficulty: string;
  publishedAt: Date;
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

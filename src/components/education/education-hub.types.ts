import type { EducationArticle, EducationCategory } from '@/types/education';

export type EducationHubStats = {
  totalArticles: number | null;
  totalCategories: number | null;
  totalStudents: number | null;
  averageRating: number | null;
};

export type EducationHubContent = {
  categories: EducationCategory[];
  latestArticles: EducationArticle[];
  featuredArticles: EducationArticle[];
  stats: EducationHubStats;
  featuredError?: boolean;
  popularTags: string[];
};

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EducationArticle, EducationCategory } from '@/types/education';
import { ArticleCard } from './article-card';
import { CategoryGrid } from './category-grid';
import { SearchInterface } from './search-interface';

type AnalyticsEntry = {
  type?: string;
  userId?: string | null;
  data?: {
    rating?: number;
  };
};

export function EducationHub() {
  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [categories, setCategories] = useState<EducationCategory[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<EducationArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [educationStats, setEducationStats] = useState<{
    totalArticles: number | null;
    totalCategories: number | null;
    totalStudents: number | null;
    averageRating: number | null;
  }>({
    totalArticles: null,
    totalCategories: null,
    totalStudents: null,
    averageRating: null,
  });
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const scrollToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch categories
      const categoriesResponse = await fetch('/api/education/categories');
      if (!categoriesResponse.ok) {
        throw new Error(`Failed to load categories: ${categoriesResponse.status}`);
      }
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData || []);

      // Fetch recent articles
      const articlesResponse = await fetch('/api/education/articles?limit=6&sort=newest');
      if (!articlesResponse.ok) {
        throw new Error(`Failed to load articles: ${articlesResponse.status}`);
      }
      const articlesData = await articlesResponse.json();
      setArticles(articlesData.data || []);

      const categoriesTotal = Array.isArray(categoriesData) ? categoriesData.length : null;
      const articlesTotal =
        typeof articlesData?.pagination?.total === 'number'
          ? articlesData.pagination.total
          : Array.isArray(articlesData?.data)
          ? articlesData.data.length
          : null;

      let totalStudents: number | null = null;
      let averageRating: number | null = null;

      try {
        const analyticsResponse = await fetch('/api/education/analytics');
        if (analyticsResponse.ok) {
          const analyticsData: unknown = await analyticsResponse.json();
          if (Array.isArray(analyticsData)) {
            const viewEvents = (analyticsData as AnalyticsEntry[]).filter((event) => event.type === 'view');
            if (viewEvents.length > 0) {
              const uniqueUserIds = new Set(
                viewEvents
                  .map((event) => event.userId)
                  .filter((id): id is string => Boolean(id))
              );
              totalStudents = uniqueUserIds.size > 0 ? uniqueUserIds.size : viewEvents.length;
            }

            const ratingValues = (analyticsData as AnalyticsEntry[])
              .map((event) => event?.data?.rating)
              .filter((rating): rating is number => typeof rating === 'number');

            if (ratingValues.length > 0) {
              const ratingSum = ratingValues.reduce((sum, rating) => sum + rating, 0);
              averageRating = Number((ratingSum / ratingValues.length).toFixed(1));
            }
          }
        }
      } catch (analyticsError) {
        console.error('Error fetching analytics data:', analyticsError);
      }

      setEducationStats({
        totalArticles: articlesTotal,
        totalCategories: categoriesTotal,
        totalStudents,
        averageRating,
      });

      // Fetch featured articles (most popular)
      const featuredResponse = await fetch('/api/education/articles?limit=3&sort=popular');
      if (!featuredResponse.ok) {
        throw new Error(`Failed to load featured articles: ${featuredResponse.status}`);
      }
      const featuredData = await featuredResponse.json();
      setFeaturedArticles(featuredData.data || []);

    } catch (error) {
      console.error('Error fetching education data:', error);
      // Set empty arrays to prevent crashes
      setCategories([]);
      setArticles([]);
      setFeaturedArticles([]);
      setEducationStats({
        totalArticles: null,
        totalCategories: null,
        totalStudents: null,
        averageRating: null,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSearch = async (query: string) => {
    const normalizedQuery = query.trim();
    setSearchQuery(normalizedQuery);
    if (!normalizedQuery) {
      await fetchInitialData();
      return;
    }

    try {
      const response = await fetch(`/api/education/search?q=${encodeURIComponent(normalizedQuery)}&limit=12`);
      if (!response.ok) {
        throw new Error(`Search request failed: ${response.status}`);
      }
      const data = await response.json();
      setArticles(data.data || []);
    } catch (error) {
      console.error('Error searching articles:', error);
      setArticles([]);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      scrollToResults();
    }
  }, [searchQuery, articles, scrollToResults]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 pt-28">
      {/* Header */}
      <section className="mb-12 text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
          Elevate Your Mixology Practice
        </h1>
        <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          Learn from expert mixologists with a curated library of lessons, guides, and hands-on tutorials.
          Explore techniques, tools, and timeless recipes crafted for every skill level.
        </p>
      </section>

      {/* Search Bar */}
      <section className="mb-12">
        <div className="max-w-2xl mx-auto">
          <SearchInterface onSearch={handleSearch} onSearchApplied={scrollToResults} />
        </div>
      </section>

      {/* Search Results */}
      <section ref={resultsRef} className="mb-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Articles'}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {searchQuery ? `Found ${articles.length} articles` : 'Stay up to date with the latest mixology insights and techniques.'}
            </p>
          </div>
          {!searchQuery && (
            <Button variant="outline" asChild>
              <a href="/education/articles">View All Articles</a>
            </Button>
          )}
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or browse our categories.</p>
          </div>
        )}
      </section>

      {/* Highlight Bar */}
      {!searchQuery && (
        <>
          <section className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                {
                  label: 'Expert Articles',
                  value: educationStats.totalArticles,
                  formatter: (value: number) => value.toLocaleString(),
                },
                {
                  label: 'Categories',
                  value: educationStats.totalCategories,
                  formatter: (value: number) => value.toLocaleString(),
                },
                {
                  label: 'Students',
                  value: educationStats.totalStudents,
                  formatter: (value: number) => value.toLocaleString(),
                },
                {
                  label: 'Average Rating',
                  value: educationStats.averageRating,
                  formatter: (value: number) => value.toFixed(1),
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value === null || Number.isNaN(stat.value)
                      ? '—'
                      : stat.formatter(stat.value)}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Explore by Category
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Browse our carefully curated categories to find content that matches your learning goals and experience level.
              </p>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-8 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <CategoryGrid categories={categories} />
            )}
          </section>

          {featuredArticles.length > 0 && (
            <section className="mb-16">
              <div className="text-center mb-12 space-y-3">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                  Featured Articles
                </h2>
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                  Most popular and highly-rated articles from our community.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="featured" />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

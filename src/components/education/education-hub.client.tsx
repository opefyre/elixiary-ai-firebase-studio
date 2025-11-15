'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { EducationArticle } from '@/types/education';

import { ArticleCard } from './article-card';
import { CategoryGrid } from './category-grid';
import { SearchInterface } from './search-interface';
import type { EducationHubContent, EducationHubStats } from './education-hub.types';

type EducationHubProps = EducationHubContent;

type HighlightStat = {
  label: string;
  value: number | null;
  formatter: (value: number) => string;
};

function createHighlightStats(stats: EducationHubStats): HighlightStat[] {
  return [
    {
      label: 'Expert Articles',
      value: stats.totalArticles,
      formatter: (value) => value.toLocaleString(),
    },
    {
      label: 'Categories',
      value: stats.totalCategories,
      formatter: (value) => value.toLocaleString(),
    },
    {
      label: 'Students',
      value: stats.totalStudents,
      formatter: (value) => value.toLocaleString(),
    },
    {
      label: 'Average Rating',
      value: stats.averageRating,
      formatter: (value) => value.toFixed(1),
    },
  ];
}

export function EducationHub({
  categories,
  latestArticles,
  featuredArticles,
  stats,
  featuredError = false,
  popularTags,
}: EducationHubProps) {
  const initialArticlesRef = useRef<EducationArticle[]>(latestArticles);
  const [articles, setArticles] = useState<EducationArticle[]>(latestArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initialArticlesRef.current = latestArticles;
    setArticles(latestArticles);
  }, [latestArticles]);

  const scrollToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      const normalizedQuery = query.trim();
      setSearchQuery(normalizedQuery);

      if (!normalizedQuery) {
        setArticles(initialArticlesRef.current);
        return;
      }

      setIsSearching(true);

      try {
        const response = await fetch(`/api/education/search?q=${encodeURIComponent(normalizedQuery)}&limit=12`);

        if (!response.ok) {
          throw new Error(`Search request failed: ${response.status}`);
        }

        const data = await response.json();
        const normalizedArticles: EducationArticle[] = Array.isArray(data?.data) ? data.data : [];
        setArticles(normalizedArticles);
      } catch (error) {
        console.error('Error searching articles:', error);
        setArticles([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  useEffect(() => {
    if (searchQuery) {
      scrollToResults();
    }
  }, [searchQuery, scrollToResults]);

  const highlightStats = useMemo(() => createHighlightStats(stats), [stats]);
  const shouldShowFeatured = featuredArticles.length > 0 || featuredError;

  return (
    <div className="container mx-auto px-4 py-10 pt-safe md:pt-28">
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
          <SearchInterface
            onSearch={handleSearch}
            onSearchApplied={scrollToResults}
            popularTags={popularTags}
          />
        </div>
      </section>

      {/* Search Results */}
      <section ref={resultsRef} className="mb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Articles'}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {searchQuery
                ? isSearching
                  ? 'Searching articles...'
                  : `Found ${articles.length} articles`
                : 'Stay up to date with the latest mixology insights and techniques.'}
            </p>
          </div>
          {!searchQuery && (
            <Button variant="outline" asChild>
              <a href="/education/articles">View All Articles</a>
            </Button>
          )}
        </div>

        {isSearching ? (
          <div className="text-center py-12 text-muted-foreground">Searching for articles...</div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="minimal" />
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
              {highlightStats.map((stat) => (
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
            <CategoryGrid categories={categories} />
          </section>

          {shouldShowFeatured && (
            <section className="mb-16">
              <div className="text-center mb-12 space-y-3">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                  Featured Articles
                </h2>
                <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                  Most popular and highly-rated articles from our community.
                </p>
              </div>
              {featuredError ? (
                <div className="border border-dashed border-muted rounded-lg bg-muted/40 p-6 text-center text-sm text-muted-foreground">
                  Featured articles are unavailable right now. Please check back soon.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="featured" />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export type { EducationHubProps };

'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EducationArticle, EducationCategory } from '@/types/education';
import { ArticleCard } from './article-card';
import { CategoryGrid } from './category-grid';
import { SearchInterface } from './search-interface';

export function EducationHub() {
  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [categories, setCategories] = useState<EducationCategory[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<EducationArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const categoriesResponse = await fetch('/api/education/categories');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData || []);

      // Fetch recent articles
      const articlesResponse = await fetch('/api/education/articles?limit=6&sort=newest');
      const articlesData = await articlesResponse.json();
      setArticles(articlesData.data || []);

      // Fetch featured articles (most popular)
      const featuredResponse = await fetch('/api/education/articles?limit=3&sort=popular');
      const featuredData = await featuredResponse.json();
      setFeaturedArticles(featuredData.data || []);

    } catch (error) {
      console.error('Error fetching education data:', error);
      // Set empty arrays to prevent crashes
      setCategories([]);
      setArticles([]);
      setFeaturedArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchInitialData();
      return;
    }

    try {
      const response = await fetch(`/api/education/search?q=${encodeURIComponent(query)}&limit=12`);
      const data = await response.json();
      setArticles(data.data);
    } catch (error) {
      console.error('Error searching articles:', error);
    }
  };

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
          <SearchInterface onSearch={handleSearch} />
        </div>
      </section>

      {/* Highlight Bar */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-8 rounded-2xl border border-border bg-muted/40 px-6 py-5 text-sm md:text-base text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground/80">
            <span className="font-semibold text-foreground">50+</span>
            Expert articles curated by industry mentors
          </div>
          <div className="hidden md:block h-4 w-px bg-border" aria-hidden="true" />
          <div className="flex items-center gap-2 text-foreground/80">
            <span className="font-semibold text-foreground">6</span>
            Learning paths tailored to your goals
          </div>
          <div className="hidden md:block h-4 w-px bg-border" aria-hidden="true" />
          <div className="flex items-center gap-2 text-foreground/80">
            <span className="font-semibold text-foreground">4.9</span>
            Community-rated experience
          </div>
        </div>
      </section>

      {/* Categories Section */}
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

      {/* Featured Articles */}
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

      {/* Recent Articles */}
      <section className="mb-16">
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
    </div>
  );
}

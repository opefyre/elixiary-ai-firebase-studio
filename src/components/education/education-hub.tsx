'use client';

import { useState, useEffect } from 'react';
import { Search, BookOpen, Users, TrendingUp, Star, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'intermediate':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'advanced':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
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
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl mb-4">
          Master the Art of Mixology
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
          Learn from expert mixologists with our comprehensive education center. 
          From cocktail fundamentals to advanced techniques, we've got you covered.
        </p>
      </section>

      {/* Search Bar */}
      <section className="mb-12">
        <div className="max-w-2xl mx-auto">
          <SearchInterface onSearch={handleSearch} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Expert Articles</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">6</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10k+</div>
            <div className="text-sm text-muted-foreground">Students</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">4.9</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl font-bold mb-4">
            Explore by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold mb-4">
              Featured Articles
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
            <h2 className="font-headline text-3xl font-bold mb-4">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Articles'}
            </h2>
            <p className="text-muted-foreground">
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

      {/* CTA Section */}
      <section className="text-center py-12">
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Ready to Start Your Mixology Journey? 🎯
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
            Join thousands of aspiring mixologists who are already learning with us.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
            📚 Expert guides
          </span>
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
            🎓 All skill levels
          </span>
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
            💡 Pro tips
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-6">
          <Button 
            asChild 
            size="lg"
            className="rounded-full px-10 py-6 text-base font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            <a href="/education/categories/fundamentals" className="gap-2">
              Start Learning
              <span className="text-lg">→</span>
            </a>
          </Button>
        </div>

        {/* Trust signal */}
        <p className="text-xs text-muted-foreground/60 mt-4">
          Free access • Expert content • No sign-up required
        </p>
      </section>
    </div>
  );
}

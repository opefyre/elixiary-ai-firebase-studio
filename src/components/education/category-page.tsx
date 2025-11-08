'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Filter, SortAsc, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EducationArticle, EducationCategory, PaginatedResponse } from '@/types/education';
import { ArticleCard } from './article-card';
import Link from 'next/link';

interface CategoryPageProps {
  category: EducationCategory;
  searchParams: {
    difficulty?: string;
    page?: string;
    sort?: string;
  };
}

export function CategoryPage({ category, searchParams }: CategoryPageProps) {
  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginatedResponse<EducationArticle>['pagination'] | null>(null);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page || '1'));
  const [currentDifficulty, setCurrentDifficulty] = useState(searchParams.difficulty || '');
  const [currentSort, setCurrentSort] = useState(searchParams.sort || 'newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchArticles();
  }, [currentPage, currentDifficulty, currentSort]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        sort: currentSort,
      });
      
      if (currentDifficulty) {
        params.append('difficulty', currentDifficulty);
      }

      const response = await fetch(`/api/education/categories/${category.slug}/articles?${params}`);
      const data = await response.json();
      
      setArticles(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching category articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultyFilter = (difficulty: string) => {
    setCurrentDifficulty(difficulty === currentDifficulty ? '' : difficulty);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (categorySlug: string) => {
    switch (categorySlug) {
      case 'fundamentals':
        return '📚';
      case 'equipment':
        return '🔧';
      case 'techniques':
        return '🎯';
      case 'ingredients':
        return '🥃';
      case 'classics':
        return '🍸';
      case 'trends':
        return '✨';
      default:
        return '📖';
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
            <div className="h-8 bg-muted rounded mb-8"></div>
            <div className="h-32 bg-muted rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-8">
            <Link href="/education">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Education
              </Button>
            </Link>
          </div>
          <div className="text-6xl mb-4">{getCategoryIcon(category.slug)}</div>
          <h1 className="font-headline text-4xl font-bold mb-4 text-blue-400">
            {category.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {category.description}
          </p>
          <div className="mt-4">
            <Badge variant="secondary" className="text-sm">
              {pagination?.total || 0} articles
            </Badge>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          {/* Difficulty Filter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Difficulty:</span>
            <div className="flex space-x-2">
              {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={currentDifficulty === difficulty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleDifficultyFilter(difficulty)}
                  className="capitalize"
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <SortAsc className="w-4 h-4 text-muted-foreground" />
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="readingTime">Reading Time</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-1 border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant={viewMode === 'list' ? 'compact' : 'minimal'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              {currentDifficulty 
                ? `No ${currentDifficulty} articles found in this category.`
                : 'No articles found in this category yet.'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

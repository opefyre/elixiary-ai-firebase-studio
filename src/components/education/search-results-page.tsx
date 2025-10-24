'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, Grid, List, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EducationArticle, EducationCategory, PaginatedResponse } from '@/types/education';
import { ArticleCard } from './article-card';
import { SearchInterface } from './search-interface';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchResultsPageProps {
  searchParams: {
    q?: string;
    category?: string;
    difficulty?: string;
    page?: string;
    sort?: string;
  };
}

export function SearchResultsPage({ searchParams }: SearchResultsPageProps) {
  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [categories, setCategories] = useState<EducationCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginatedResponse<EducationArticle>['pagination'] | null>(null);
  const [currentQuery, setCurrentQuery] = useState(searchParams.q || '');
  const [currentCategory, setCurrentCategory] = useState(searchParams.category || '');
  const [currentDifficulty, setCurrentDifficulty] = useState(searchParams.difficulty || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page || '1'));
  const [currentSort, setCurrentSort] = useState(searchParams.sort || 'newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    if (currentQuery) {
      fetchSearchResults();
    }
  }, [currentQuery, currentCategory, currentDifficulty, currentPage, currentSort]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/education/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        q: currentQuery,
        page: currentPage.toString(),
        sort: currentSort,
      });
      
      if (currentCategory) {
        params.append('category', currentCategory);
      }
      
      if (currentDifficulty) {
        params.append('difficulty', currentDifficulty);
      }

      const response = await fetch(`/api/education/search?${params}`);
      const data = await response.json();
      
      setArticles(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setCurrentQuery(query);
    setCurrentPage(1);
    updateURL({ q: query, page: '1' });
  };

  const handleCategoryFilter = (category: string) => {
    setCurrentCategory(category === currentCategory ? '' : category);
    setCurrentPage(1);
    updateURL({ 
      category: category === currentCategory ? '' : category, 
      page: '1' 
    });
  };

  const handleDifficultyFilter = (difficulty: string) => {
    setCurrentDifficulty(difficulty === currentDifficulty ? '' : difficulty);
    setCurrentPage(1);
    updateURL({ 
      difficulty: difficulty === currentDifficulty ? '' : difficulty, 
      page: '1' 
    });
  };

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    setCurrentPage(1);
    updateURL({ sort, page: '1' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateURL = (params: Record<string, string>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    router.push(url.pathname + url.search, { scroll: false });
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fundamentals':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'equipment':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'techniques':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'ingredients':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'classics':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'trends':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Search Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-8">
            <Link href="/education">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Education
              </Button>
            </Link>
          </div>
          <h1 className="font-headline text-4xl font-bold mb-4 text-blue-400">
            Search Articles
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Find the perfect mixology content for your learning journey
          </p>
          
          {/* Search Interface */}
          <div className="max-w-2xl mx-auto">
            <SearchInterface onSearch={handleSearch} />
          </div>
        </div>

        {/* Results Section */}
        {currentQuery && (
          <>
            {/* Results Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
              <div>
                     <h2 className="font-headline text-2xl font-bold mb-2 text-blue-400">
                       Search Results for "{currentQuery}"
                     </h2>
                <p className="text-muted-foreground">
                  {pagination ? `${pagination.total} articles found` : 'Searching...'}
                </p>
              </div>

              {/* View Controls */}
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

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Category:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={currentCategory === category.slug ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleCategoryFilter(category.slug)}
                      className="capitalize"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center space-x-2">
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
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {articles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find what you're looking for.
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
          </>
        )}

        {/* No Search Query State */}
        {!currentQuery && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium mb-2">Start Your Search</h3>
            <p className="text-muted-foreground">
              Enter a search term above to find articles, techniques, and guides.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

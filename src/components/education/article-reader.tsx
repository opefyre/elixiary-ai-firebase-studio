'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, User, Eye, Heart, Share2, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EducationArticle } from '@/types/education';
import { ArticleCard } from './article-card';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface ArticleReaderProps {
  article: EducationArticle;
}

export function ArticleReader({ article }: ArticleReaderProps) {
  const [relatedArticles, setRelatedArticles] = useState<EducationArticle[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showTOC, setShowTOC] = useState(false);
  const [tocItems, setTocItems] = useState<Array<{ id: string; text: string; level: number }>>([]);

  useEffect(() => {
    fetchRelatedArticles();
    trackView();
    generateTOC();
    
    // Track reading progress
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight - element.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [article]);

  const fetchRelatedArticles = async () => {
    try {
      const response = await fetch(`/api/education/articles?category=${article.category}&limit=3&sort=popular`);
      const data = await response.json();
      setRelatedArticles(data.data.filter((a: EducationArticle) => a.id !== article.id));
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  const trackView = async () => {
    try {
      await fetch('/api/education/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'view',
          articleId: article.id,
        }),
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const generateTOC = () => {
    const headings = contentRef.current?.querySelectorAll('h2, h3, h4');
    if (headings) {
      const toc = Array.from(headings).map((heading, index) => ({
        id: `heading-${index}`,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      }));
      setTocItems(toc);
    }
  };

  const handleLike = async () => {
    setIsLiked(!isLiked);
    try {
      await fetch('/api/education/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'interaction',
          articleId: article.id,
          data: { action: 'like', value: !isLiked },
        }),
      });
    } catch (error) {
      console.error('Error tracking like:', error);
    }
  };

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    try {
      await fetch('/api/education/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'interaction',
          articleId: article.id,
          data: { action: 'bookmark', value: !isBookmarked },
        }),
      });
    } catch (error) {
      console.error('Error tracking bookmark:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fundamentals':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'equipment':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'techniques':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ingredients':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'classics':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'trends':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/education">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Education
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? 'text-red-500' : ''}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={isBookmarked ? 'text-blue-500' : ''}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Badge className={getCategoryColor(article.category)}>
                {article.category}
              </Badge>
              <Badge className={getDifficultyColor(article.difficulty)}>
                {article.difficulty}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {article.author.name}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {article.readingTime} min read
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {article.stats.views} views
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {article.publishedAt.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-8">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  <div
                    ref={contentRef}
                    className="prose prose-lg max-w-none"
                    style={{ maxHeight: '70vh', overflowY: 'auto' }}
                  >
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Table of Contents */}
                {tocItems.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Table of Contents</h3>
                      <div className="space-y-2">
                        {tocItems.map((item, index) => (
                          <button
                            key={index}
                            className={`block text-left text-sm text-blue-600 hover:text-blue-800 ${
                              item.level === 3 ? 'ml-4' : item.level === 4 ? 'ml-8' : ''
                            }`}
                            onClick={() => {
                              const element = document.getElementById(`heading-${index}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                          >
                            {item.text}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reading Progress */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Reading Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${readingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {Math.round(readingProgress)}% complete
                    </p>
                  </CardContent>
                </Card>

                {/* Tags */}
                {article.tags.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.id} article={relatedArticle} variant="compact" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

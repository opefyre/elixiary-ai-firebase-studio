'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, User, Eye, Heart, Share2, Bookmark, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
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
  const [tocItems, setTocItems] = useState<Array<{ id: string; text: string; level: number; children?: Array<{ id: string; text: string; level: number }> }>>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
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
      const toc: Array<{ id: string; text: string; level: number; children?: Array<{ id: string; text: string; level: number }> }> = [];
      
      Array.from(headings).forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || '';
        const id = `heading-${index}`;
        
        heading.id = id;
        
        if (level === 2) {
          toc.push({ id, text, level, children: [] });
        } else if (level === 3 && toc.length > 0) {
          const lastParent = toc[toc.length - 1];
          if (lastParent.children) {
            lastParent.children.push({ id, text, level });
          }
        }
      });
      
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

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
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
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
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
                  className={isLiked ? 'text-destructive' : ''}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={isBookmarked ? 'text-primary' : ''}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Badge className={getCategoryColor(article.category)}>
                {article.category}
              </Badge>
              <Badge className={getDifficultyColor(article.difficulty)}>
                {article.difficulty}
              </Badge>
            </div>
            
            <h1 className="font-headline text-4xl font-bold mb-4 text-blue-400">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
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
              
              <div className="text-sm text-muted-foreground">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-fit">
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardContent className="p-8 h-full">
                  <div
                    ref={contentRef}
                    className="prose prose-lg max-w-none h-full overflow-y-auto"
                  >
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 h-fit">
                {/* Table of Contents */}
                {tocItems.length > 0 && (
                  <Card className="h-fit">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 text-sm text-foreground">Table of Contents</h3>
                      <div className="space-y-1">
                        {tocItems.map((item, index) => (
                          <div key={item.id}>
                            <button
                              className={`flex items-center justify-between w-full text-left text-xs text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded ${
                                item.children && item.children.length > 0 ? 'font-medium' : ''
                              }`}
                              onClick={() => {
                                const element = document.getElementById(item.id);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                            >
                              <span className="truncate">{item.text}</span>
                              {item.children && item.children.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSection(item.id);
                                  }}
                                  className="ml-2 p-1 hover:bg-muted rounded"
                                >
                                  {expandedSections.has(item.id) ? (
                                    <ChevronDown className="w-3 h-3" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </button>
                            {item.children && item.children.length > 0 && expandedSections.has(item.id) && (
                              <div className="ml-4 space-y-1 mt-1">
                                {item.children.map((child) => (
                                  <button
                                    key={child.id}
                                    className="block text-left text-xs text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded truncate"
                                    onClick={() => {
                                      const element = document.getElementById(child.id);
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }}
                                  >
                                    {child.text}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reading Progress */}
                <Card className="h-fit">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 text-sm text-foreground">Reading Progress</h3>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${readingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {Math.round(readingProgress)}% complete
                    </p>
                  </CardContent>
                </Card>

                {/* Tags */}
                {article.tags.length > 0 && (
                  <Card className="h-fit">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 text-sm text-foreground">Tags</h3>
                      <div className="flex flex-wrap gap-1">
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
              <h2 className="font-headline text-2xl font-bold mb-8 text-blue-400">Related Articles</h2>
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

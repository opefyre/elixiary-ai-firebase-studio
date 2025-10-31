'use client';

import { Clock, Eye, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EducationArticle } from '@/types/education';
import Link from 'next/link';

interface ArticleCardProps {
  article: EducationArticle;
  variant?: 'default' | 'featured' | 'compact';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'border border-border/60 bg-muted/30 text-foreground/80';
      case 'intermediate':
        return 'border border-border/60 bg-muted/30 text-foreground/80';
      case 'advanced':
        return 'border border-border/60 bg-muted/30 text-foreground/80';
      default:
        return 'border border-border/60 bg-muted/30 text-foreground/70';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fundamentals':
        return 'border border-border/60 bg-muted/30 text-foreground/80';
      case 'equipment':
        return 'border border-border/60 bg-muted/30 text-foreground/80';
      case 'techniques':
        return 'border border-border/60 bg-muted/30 text-foreground/80';
      case 'ingredients':
        return 'border border-border/60 bg-muted/30 text-foreground/80';
      case 'classics':
        return 'border border-border/60 bg-muted/30 text-foreground/80';
      case 'trends':
        return 'border border-border/60 bg-muted/30 text-foreground/80';
      default:
        return 'border border-border/60 bg-muted/30 text-foreground/70';
    }
  };

  if (variant === 'compact') {
    return (
      <Link href={`/education/${article.category}/${article.slug}`}>
        <Card className="border border-border/60 bg-background/80 hover:border-border cursor-pointer transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-foreground truncate">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={`text-xs ${getDifficultyColor(article.difficulty)}`}>
                    {article.difficulty}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {article.readingTime}m
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/education/${article.category}/${article.slug}`}>
        <Card className="group border border-border/60 bg-muted/30 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:border-border">
          <div className="relative">
            {article.featuredImage && (
              <div className="aspect-video rounded-t-lg overflow-hidden bg-muted">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className="bg-background/90 text-foreground border border-border/60 shadow-sm">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          </div>
          <CardHeader className="pb-3 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`capitalize ${getCategoryColor(article.category)}`}>
                {article.category}
              </Badge>
              <Badge className={`capitalize ${getDifficultyColor(article.difficulty)}`}>
                {article.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-lg font-semibold group-hover:text-foreground/90 transition-colors">
              {article.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 leading-relaxed">
              {article.excerpt}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readingTime}m
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {article.stats.views}
                </div>
              </div>
              <div className="hidden md:flex items-center text-xs uppercase tracking-wide text-foreground/60">
                Editorial pick
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/education/${article.category}/${article.slug}`}>
      <Card className="group border border-border/60 bg-background/80 transition-transform duration-200 hover:-translate-y-0.5 hover:border-border cursor-pointer">
        <div className="relative">
          {article.featuredImage && (
            <div className="aspect-video rounded-t-lg overflow-hidden bg-muted">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>
        <CardHeader className="pb-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`capitalize ${getCategoryColor(article.category)}`}>
              {article.category}
            </Badge>
            <Badge className={`capitalize ${getDifficultyColor(article.difficulty)}`}>
              {article.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold group-hover:text-foreground transition-colors line-clamp-2">
            {article.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 leading-relaxed">
            {article.excerpt}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {article.readingTime}m
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {article.stats.views}
              </div>
            </div>
            <div className="hidden md:flex items-center text-xs uppercase tracking-wide text-foreground/60">
              Read &amp; save later
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

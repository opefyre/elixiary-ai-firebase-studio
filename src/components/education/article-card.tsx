'use client';

import { Clock, User, Eye, Heart, Share2, BookOpen, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  if (variant === 'compact') {
    return (
      <Link href={`/education/${article.category}/${article.slug}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 truncate">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
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
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 bg-card/50 backdrop-blur-sm">
          <div className="relative">
            {article.featuredImage && (
              <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg overflow-hidden">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className="bg-white text-gray-900 border-0 shadow-sm">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          </div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <Badge className={getCategoryColor(article.category)}>
                {article.category}
              </Badge>
              <Badge className={getDifficultyColor(article.difficulty)}>
                {article.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {article.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {article.excerpt}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-sm text-gray-600">
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
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/education/${article.category}/${article.slug}`}>
      <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group">
        <div className="relative">
          {article.featuredImage && (
            <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg overflow-hidden">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <Badge className={getCategoryColor(article.category)}>
              {article.category}
            </Badge>
            <Badge className={getDifficultyColor(article.difficulty)}>
              {article.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {article.excerpt}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-gray-600">
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
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

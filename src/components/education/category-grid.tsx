'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EducationCategory } from '@/types/education';
import Link from 'next/link';

interface CategoryGridProps {
  categories: EducationCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
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

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'fundamentals':
        return 'Master the basics of mixology, from understanding spirits to building your first cocktails.';
      case 'equipment':
        return 'Learn about essential bar tools, glassware, and equipment every mixologist needs.';
      case 'techniques':
        return 'Advanced mixing techniques, garnishing, and presentation skills for professional results.';
      case 'ingredients':
        return 'Deep dive into spirits, liqueurs, bitters, and how to use them effectively in cocktails.';
      case 'classics':
        return 'Timeless cocktail recipes that every mixologist should know and master.';
      case 'trends':
        return 'Modern mixology trends, innovative techniques, and contemporary cocktail culture.';
      default:
        return 'Explore this category to learn more about mixology.';
    }
  };

  if (categories.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/education/${category.slug}`}>
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200">
            <CardHeader className="text-center pb-4">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {getCategoryIcon(category.slug)}
              </div>
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                {category.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {getCategoryDescription(category.slug)}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <span>{category.articleCount} articles</span>
                <span>•</span>
                <span>All levels</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

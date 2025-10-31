'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { EducationCategory } from '@/types/education';
import Link from 'next/link';

interface CategoryGridProps {
  categories: EducationCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const getCategoryCaption = (category: string) => {
    switch (category) {
      case 'fundamentals':
        return 'Essential skills';
      case 'equipment':
        return 'Tools & setup';
      case 'techniques':
        return 'Hands-on methods';
      case 'ingredients':
        return 'Spirits & flavors';
      case 'classics':
        return 'Timeless recipes';
      case 'trends':
        return 'Modern movements';
      default:
        return 'Explore the essentials';
    }
  };

  if (categories.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={`skeleton-${i}`} className="animate-pulse border border-border/50 bg-background/70">
            <CardHeader className="space-y-2">
              <div className="h-5 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={`category-${category.id}`} href={`/education/${category.slug}`}>
          <Card className="group h-full border border-border/60 bg-background/80 transition-colors duration-200 hover:border-foreground/40 hover:bg-background">
            <CardHeader className="space-y-1 py-6">
              <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                {category.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {getCategoryCaption(category.slug)} · {category.articleCount} articles
              </p>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

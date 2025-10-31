'use client';

import { BookOpen, Wrench, Wand2, FlaskConical, Martini, Sparkles } from 'lucide-react';
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
        return BookOpen;
      case 'equipment':
        return Wrench;
      case 'techniques':
        return Wand2;
      case 'ingredients':
        return FlaskConical;
      case 'classics':
        return Martini;
      case 'trends':
        return Sparkles;
      default:
        return BookOpen;
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
          <Card key={`skeleton-${i}`} className="animate-pulse">
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={`category-${category.id}`} href={`/education/${category.slug}`}>
          <Card className="group border border-border/60 bg-background/80 transition-colors duration-200 hover:border-border cursor-pointer h-full">
            <CardHeader className="text-center pb-4 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-foreground/80">
                {(() => {
                  const Icon = getCategoryIcon(category.slug);
                  return <Icon className="h-6 w-6" strokeWidth={1.5} />;
                })()}
              </div>
              <div className="space-y-2">
                <CardTitle className="text-lg font-semibold text-foreground group-hover:text-foreground">
                  {category.name}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed line-clamp-3 text-muted-foreground">
                  {getCategoryDescription(category.slug)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wide text-foreground/60">
                <span>{category.articleCount} articles</span>
                <span aria-hidden="true">•</span>
                <span>All levels</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { EducationCategory } from '@/types/education';

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

  const gridClasses = cn(
    'grid gap-3 sm:gap-4',
    '[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]'
  );

  if (categories.length === 0) {
    return (
      <div className={gridClasses}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={`skeleton-${i}`}
            className="animate-pulse rounded-xl border border-border/60 bg-background/80 p-4 sm:p-5"
          >
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 shrink-0 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={gridClasses}>
      {categories.map((category) => (
        <Link key={`category-${category.id}`} href={`/education/${category.slug}`}>
          <div className="group relative flex h-full items-center gap-4 rounded-xl border border-border/60 bg-background/80 p-4 transition-colors duration-200 hover:border-foreground/40 hover:bg-background sm:p-5">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted/80 text-xl"
              style={{ color: category.color || 'inherit' }}
              aria-hidden="true"
            >
              <span className="leading-none">{category.icon || '📚'}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h3 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
                  {category.name}
                </h3>
                <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {getCategoryCaption(category.slug)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

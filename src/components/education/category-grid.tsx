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
    'grid gap-2.5 sm:gap-3',
    '[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]'
  );

  if (categories.length === 0) {
    return (
      <div className={gridClasses}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={`skeleton-${i}`}
            className="animate-pulse overflow-hidden rounded-full border border-border/50 bg-background/60 px-3 py-1.5 sm:px-4 sm:py-2"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-2/3 rounded bg-muted" />
                <div className="h-2 w-1/2 rounded bg-muted" />
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
        <Link
          key={`category-${category.id}`}
          href={`/education/${category.slug}`}
          className="group relative flex h-full items-center gap-3 overflow-hidden rounded-full border border-border/50 bg-background/60 px-3 py-1.5 transition-colors duration-200 hover:border-foreground/30 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-4 sm:py-2"
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted/60 text-lg"
            style={{
              color: category.color || 'inherit',
              borderColor: category.color || undefined,
            }}
            aria-hidden="true"
          >
            <span className="leading-none">{category.icon || '📚'}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                {category.name}
              </span>
              <span className="ml-auto shrink-0 text-[11px] font-medium text-muted-foreground/70">
                {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground/80">
              {getCategoryCaption(category.slug)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

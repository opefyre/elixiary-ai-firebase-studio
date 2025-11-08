'use client';

import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { EducationCategory } from '@/types/education';

type IconLookup = Record<string, LucideIcon | undefined>;

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
    'grid gap-3 sm:gap-3.5',
    '[grid-template-columns:repeat(auto-fit,minmax(268px,1fr))]'
  );

  const normaliseIconName = (icon: string) =>
    icon
      .trim()
      .replace(/[-_\s]+/g, ' ')
      .replace(/(?:^|\s)(\p{L})/gu, (match) => match.trim().toUpperCase())
      .replace(/\s+/g, '');

  const renderIcon = (icon?: string) => {
    if (!icon) {
      return null;
    }

    const iconSet = LucideIcons as unknown as IconLookup;
    const IconComponent = iconSet[icon] ?? iconSet[normaliseIconName(icon)];
    if (IconComponent) {
      return <IconComponent className="h-5 w-5" aria-hidden="true" />;
    }

    const hasEmoji = /\p{Extended_Pictographic}/u.test(icon);
    if (hasEmoji) {
      return <span aria-hidden="true">{icon}</span>;
    }

    return null;
  };

  const skeletonPlaceholders = Array.from({ length: 6 }, (_, index) => index + 1);

  if (categories.length === 0) {
    return (
      <div className={gridClasses}>
        {skeletonPlaceholders.map((i) => (
          <div
            key={`skeleton-${i}`}
            className="animate-pulse overflow-hidden rounded-full border border-border/50 bg-background/60 px-4 py-2"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 shrink-0 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-3/4 rounded bg-muted" />
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
          className="group relative flex h-full items-center gap-3.5 overflow-hidden rounded-full border border-border/50 bg-background/60 px-4 py-2 transition-colors duration-200 hover:border-foreground/30 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted/60 text-lg"
            style={{
              color: category.color || 'inherit',
              borderColor: category.color || undefined,
            }}
            aria-hidden="true"
          >
            {renderIcon(category.icon) ?? <span className="leading-none">📚</span>}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                {category.name}
              </span>
              <span className="ml-auto shrink-0 text-[12px] font-medium text-muted-foreground/70">
                {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[12px] text-muted-foreground/80">
              {getCategoryCaption(category.slug)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

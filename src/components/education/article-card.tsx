'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EducationArticle } from '@/types/education';

interface ArticleCardProps {
  article: EducationArticle;
  variant?: 'default' | 'featured' | 'compact' | 'minimal';
}

const overlayVariants = {
  featured: {
    card: 'hover:-translate-y-1.5 hover:border-border/70',
    aspect: 'aspect-video',
    overlay: 'p-5 sm:p-6',
    title: 'text-xl sm:text-2xl',
    category: 'text-xs uppercase tracking-wide text-white/80',
  },
  compact: {
    card: 'hover:-translate-y-0.5 hover:border-border',
    aspect: 'aspect-[3/2]',
    overlay: 'p-3 sm:p-4',
    title: 'text-sm sm:text-base',
    category: 'text-[11px] uppercase tracking-wide text-white/60',
  },
  default: {
    card: 'hover:-translate-y-1 hover:border-border/80',
    aspect: 'aspect-[4/3]',
    overlay: 'p-4 sm:p-5',
    title: 'text-lg sm:text-xl',
    category: 'text-xs uppercase tracking-wide text-white/70',
  },
} as const;

const toTitleCase = (value: string) =>
  value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatDifficulty = (difficulty: EducationArticle['difficulty']) => toTitleCase(difficulty);
const formatCategory = (category: EducationArticle['category']) => toTitleCase(category);

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'featured' || variant === 'compact') {
    const { aspect, card, overlay, title, category } =
      overlayVariants[variant] ?? overlayVariants.default;

    return (
      <Link href={`/education/${article.category}/${article.slug}`}>
        <Card
          className={cn(
            'group relative overflow-hidden border border-border/60 bg-background/60 transition-transform duration-300 ease-out',
            card
          )}
        >
          <div className={cn('relative', aspect)}>
            <div className="absolute inset-0 overflow-hidden">
              {article.featuredImage ? (
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader
              className={cn(
                'pointer-events-none absolute inset-x-0 bottom-0 flex flex-col space-y-1.5',
                overlay
              )}
            >
              {article.category && (
                <span className={cn('truncate font-medium text-white', category)}>{article.category}</span>
              )}
              <CardTitle className={cn('text-balance font-semibold text-white drop-shadow-sm', title)}>
                {article.title}
              </CardTitle>
            </CardHeader>
          </div>
        </Card>
      </Link>
    );
  }

  const tags = Array.isArray(article.tags) ? article.tags.slice(0, 2) : [];

  return (
    <Link href={`/education/${article.category}/${article.slug}`}>
      <Card className="group flex h-full flex-col overflow-hidden border border-border/60 bg-background/70 shadow-sm transition-transform duration-300 ease-out hover:-translate-y-1 hover:border-border/80">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {article.featuredImage ? (
            <img
              src={article.featuredImage}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
        <CardContent className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          {article.category && (
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="rounded-full bg-muted/70 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground"
              >
                {formatCategory(article.category)}
              </Badge>
            </div>
          )}
          <h3 className="text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full border-border/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {`${article.readingTime} min read`}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-border/60 px-2.5 py-0.5 text-[11px] font-medium capitalize text-muted-foreground"
            >
              {formatDifficulty(article.difficulty)}
            </Badge>
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-border/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

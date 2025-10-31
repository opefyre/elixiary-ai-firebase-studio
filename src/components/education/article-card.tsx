'use client';

import Link from 'next/link';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { EducationArticle } from '@/types/education';

interface ArticleCardProps {
  article: EducationArticle;
  variant?: 'default' | 'featured' | 'compact';
}

const variantConfig = {
  default: {
    card: 'hover:-translate-y-1 hover:border-border/80',
    aspect: 'aspect-[4/3]',
    overlay: 'p-4 sm:p-5',
    title: 'text-lg sm:text-xl',
    category: 'text-xs uppercase tracking-wide text-white/70',
  },
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
} as const;

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const { aspect, card, overlay, title, category } = variantConfig[variant];

  return (
    <Link href={`/education/${article.category}/${article.slug}`}>
      <Card
        className={`group relative overflow-hidden border border-border/60 bg-background/60 transition-transform duration-300 ease-out ${card}`}
      >
        <div className={`relative ${aspect}`}>
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
            className={`pointer-events-none absolute inset-x-0 bottom-0 flex flex-col space-y-1.5 ${overlay}`}
          >
            {article.category && (
              <span className={`truncate font-medium text-white ${category}`}>{article.category}</span>
            )}
            <CardTitle className={`text-balance font-semibold text-white drop-shadow-sm ${title}`}>
              {article.title}
            </CardTitle>
          </CardHeader>
        </div>
      </Card>
    </Link>
  );
}

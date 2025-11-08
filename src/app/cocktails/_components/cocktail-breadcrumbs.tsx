import Link from 'next/link';
import { cn } from '@/lib/utils';

export type CocktailBreadcrumbItem = {
  label: string;
  href?: string;
};

export interface CocktailBreadcrumbsProps {
  items: CocktailBreadcrumbItem[];
  className?: string;
  separator?: string;
}

export function CocktailBreadcrumbs({
  items,
  className,
  separator = '/'
}: CocktailBreadcrumbsProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
      <ol
        className={cn(
          'inline-flex items-center gap-1 overflow-hidden rounded-full border border-white/10',
          'bg-gradient-to-r from-primary/10 via-background/80 to-primary/10 p-1 text-sm shadow-sm backdrop-blur'
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const content = item.href && !isLast ? (
            <Link
              href={item.href}
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
                'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                isLast
                  ? 'bg-background/90 text-foreground shadow'
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </span>
          );

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {index > 0 && (
                <span className="mx-1 text-xs text-muted-foreground/60">{separator}</span>
              )}
              {content}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

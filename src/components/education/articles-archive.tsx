import Link from 'next/link';
import { headers } from 'next/headers';
import { ArrowLeft, BookOpen, CalendarClock } from 'lucide-react';
import { ArticleCard } from './article-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EducationArticle, PaginatedResponse } from '@/types/education';

interface ArticlesArchiveProps {
  searchParams: {
    page?: string;
    sort?: string;
    difficulty?: string;
    category?: string;
    cursor?: string;
    direction?: 'next' | 'prev';
  };
}

interface ArticlesResponse extends PaginatedResponse<EducationArticle> {}

function getBaseUrl() {
  const headersList = headers();
  const protocol =
    headersList.get('x-forwarded-proto') || (process.env.VERCEL ? 'https' : 'http');
  const host =
    headersList.get('x-forwarded-host') ||
    headersList.get('host') ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    'localhost:3000';

  if (host.startsWith('http')) {
    return host;
  }

  return `${protocol}://${host}`;
}

async function fetchArticles(searchParams: ArticlesArchiveProps['searchParams']) {
  const baseUrl = getBaseUrl();
  const params = new URLSearchParams();

  const page = Number.parseInt(searchParams.page || '1', 10);
  const validPage = Number.isNaN(page) || page < 1 ? 1 : page;

  params.set('page', validPage.toString());
  params.set('limit', '12');

  if (searchParams.sort) {
    params.set('sort', searchParams.sort);
  }

  if (searchParams.difficulty) {
    params.set('difficulty', searchParams.difficulty);
  }

  if (searchParams.category) {
    params.set('category', searchParams.category);
  }

  if (searchParams.cursor) {
    params.set('cursor', searchParams.cursor);
  }

  if (searchParams.direction) {
    params.set('direction', searchParams.direction);
  }

  const response = await fetch(`${baseUrl}/api/education/articles?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }

  const data = (await response.json()) as ArticlesResponse;
  return data;
}

function PaginationControls({
  pagination,
  searchParams,
}: {
  pagination: PaginatedResponse<EducationArticle>['pagination'];
  searchParams: ArticlesArchiveProps['searchParams'];
}) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const baseParams = new URLSearchParams();

  if (searchParams.sort) {
    baseParams.set('sort', searchParams.sort);
  }

  if (searchParams.difficulty) {
    baseParams.set('difficulty', searchParams.difficulty);
  }

  if (searchParams.category) {
    baseParams.set('category', searchParams.category);
  }

  const buildHref = (page: number, direction: 'next' | 'prev', cursor: string | null | undefined) => {
    const params = new URLSearchParams(baseParams);
    params.set('page', page.toString());

    if (cursor) {
      params.set('cursor', cursor);
      params.set('direction', direction);
    } else {
      params.delete('cursor');
      params.delete('direction');
    }

    return `?${params.toString()}`;
  };

  const showPrev = pagination.hasPrev && Boolean(pagination.prevCursor);
  const showNext = pagination.hasNext && Boolean(pagination.nextCursor);

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <div className="text-sm text-muted-foreground">
        Page {pagination.page} of {pagination.totalPages}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          asChild={showPrev}
          variant="outline"
          size="sm"
          disabled={!showPrev}
        >
          {showPrev ? (
            <Link href={buildHref(pagination.page - 1, 'prev', pagination.prevCursor ?? undefined)}>
              Previous
            </Link>
          ) : (
            <>Previous</>
          )}
        </Button>

        <Button
          asChild={showNext}
          variant="outline"
          size="sm"
          disabled={!showNext}
        >
          {showNext ? (
            <Link href={buildHref(pagination.page + 1, 'next', pagination.nextCursor ?? undefined)}>
              Next
            </Link>
          ) : (
            <>Next</>
          )}
        </Button>
      </div>
    </div>
  );
}

export async function ArticlesArchive({ searchParams }: ArticlesArchiveProps) {
  let data: ArticlesResponse | null = null;
  let error: Error | null = null;

  try {
    data = await fetchArticles(searchParams);
  } catch (err) {
    error = err as Error;
    console.error('Error loading articles archive:', error);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-semibold mb-2">Unable to load articles</h1>
            <p className="text-muted-foreground">
              Please refresh the page or try again in a few moments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const articles = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/education">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Education Hub
            </Link>
          </Button>

          {pagination && (
            <Badge variant="secondary" className="text-sm">
              {pagination.total} articles
            </Badge>
          )}
        </div>

        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4 text-blue-400">
            <BookOpen className="h-12 w-12" />
          </div>
          <h1 className="font-headline text-4xl font-bold mb-4 text-blue-400">
            Education Article Archive
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore every mixology guide, technique deep dive, and educational resource in one place.
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="minimal" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold mb-2">No articles found</h2>
            <p className="text-muted-foreground">
              Check back soon — new lessons and cocktail knowledge are added regularly.
            </p>
          </div>
        )}

        {pagination && articles.length > 0 && (
          <div className="mt-12 border-t border-border pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
            </div>
            <PaginationControls pagination={pagination} searchParams={searchParams} />
          </div>
        )}
      </div>
    </div>
  );
}

import { headers } from 'next/headers';
import { CuratedCocktailsClient } from './curated-client';
import { Category, CuratedRecipe, Tag } from './types';

interface InitialCocktailsData {
  recipes: CuratedRecipe[];
  categories: Category[];
  tags: Tag[];
  hasMore: boolean;
  error?: string;
}

function resolveBaseUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  let headerList: ReturnType<typeof headers> | null = null;
  try {
    headerList = headers();
  } catch (error) {
    // headers() can throw during static generation. We'll fall back to localhost below.
    console.warn('Falling back to localhost for cocktails base URL', error);
  }

  if (headerList) {
    const forwardedProto = headerList.get('x-forwarded-proto');
    const forwardedHost = headerList.get('x-forwarded-host');
    const host = headerList.get('host');

    if (forwardedHost) {
      return `${forwardedProto ?? 'https'}://${forwardedHost}`.replace(/\/$/, '');
    }

    if (host) {
      return `${forwardedProto ?? 'https'}://${host}`.replace(/\/$/, '');
    }
  }

  return 'http://localhost:3000';
}

async function loadInitialCocktailsData(): Promise<InitialCocktailsData> {
  try {
    const baseUrl = resolveBaseUrl();
    const recipesUrl = new URL('/api/curated-recipes', baseUrl);
    recipesUrl.searchParams.set('limit', '20');
    recipesUrl.searchParams.set('page', '1');
    const categoriesUrl = new URL('/api/curated-categories', baseUrl);
    const tagsUrl = new URL('/api/curated-tags', baseUrl);
    const [recipesRes, categoriesRes, tagsRes] = await Promise.all([
      fetch(recipesUrl, {
        cache: 'no-store'
      }),
      fetch(categoriesUrl, {
        cache: 'no-store'
      }),
      fetch(tagsUrl, {
        cache: 'no-store'
      })
    ]);

    if (!recipesRes.ok || !categoriesRes.ok || !tagsRes.ok) {
      throw new Error('Failed to load curated cocktails');
    }

    const [recipesData, categoriesData, tagsData] = await Promise.all([
      recipesRes.json(),
      categoriesRes.json(),
      tagsRes.json()
    ]);

    return {
      recipes: recipesData.recipes || [],
      categories: categoriesData.categories || [],
      tags: tagsData.tags || [],
      hasMore: recipesData.pagination?.hasNext ?? false
    };
  } catch (error) {
    console.error('Error loading curated cocktails', error);
    return {
      recipes: [],
      categories: [],
      tags: [],
      hasMore: false,
      error: 'Unable to load curated cocktail data at this time.'
    };
  }
}

export default async function CuratedPage() {
  const initialData = await loadInitialCocktailsData();

  return (
    <CuratedCocktailsClient
      initialRecipes={initialData.recipes}
      initialCategories={initialData.categories}
      initialTags={initialData.tags}
      initialHasMore={initialData.hasMore}
      initialError={initialData.error}
    />
  );
}

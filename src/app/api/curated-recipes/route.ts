import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { CacheManager } from '@/lib/redis';
import RequestDeduplicator from '@/lib/request-deduplicator';

const CACHE_PREFIX = 'curated-recipes:';
const CACHE_VERSION = 'v2';
let curatedRecipesCacheCleared = false;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    if (!curatedRecipesCacheCleared) {
      await CacheManager.deleteByPrefix(CACHE_PREFIX);
      curatedRecipesCacheCleared = true;
    }

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    // Create cache key
    const cacheKey = `${CACHE_PREFIX}${CACHE_VERSION}:${JSON.stringify({
      page,
      limit,
      category,
      difficulty,
      search,
      tags
    })}`;

    // Check cache first
    const cached = await CacheManager.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Use request deduplication to prevent duplicate processing
    const deduplicator = RequestDeduplicator.getInstance();
    const dedupKey = RequestDeduplicator.createCacheKey('curated-recipes', {
      cacheVersion: CACHE_VERSION,
      page,
      limit,
      category,
      difficulty,
      search,
      tags
    });

    const response = await deduplicator.deduplicate(dedupKey, async () => {
      const { adminDb } = await initializeFirebaseServer();

      const filteredTags = tags?.filter(Boolean) ?? [];
      const tagsForQuery = filteredTags.slice(0, 10);

      const buildBaseQuery = (orderByDocumentId = false, useLegacyCategoryField = false) => {
        let query = adminDb.collection('curated-recipes');

        if (category) {
          const categoryField = useLegacyCategoryField ? 'category' : 'categoryId';
          query = query.where(categoryField, '==', category);
        }

        if (difficulty) {
          query = query.where('difficulty', '==', difficulty);
        }

        if (tagsForQuery.length > 0) {
          query = query.where('tags', 'array-contains-any', tagsForQuery);
        }

        if (orderByDocumentId) {
          return query.orderBy('__name__');
        }

        return query.orderBy('name', 'asc');
      };

      const offset = (page - 1) * limit;

      const fetchRecipes = async (orderByDocumentId = false, useLegacyCategoryField = false) => {
        const baseQuery = buildBaseQuery(orderByDocumentId, useLegacyCategoryField);
        const paginatedQuery = baseQuery.offset(offset).limit(limit);

        const [pageSnapshot, totalSnapshot] = await Promise.all([
          paginatedQuery.get(),
          buildBaseQuery(orderByDocumentId, useLegacyCategoryField).get()
        ]);

        const recipes = pageSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        return {
          recipes,
          total: totalSnapshot.size
        };
      };

      const applySearchAndTagFilters = (recipes: any[]) => {
        let filtered = recipes;

        if (filteredTags.length > 0) {
          filtered = filtered.filter(recipe =>
            filteredTags.some(tag => recipe.tags && recipe.tags.includes(tag))
          );
        }

        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(recipe => {
            const name = recipe.name?.toLowerCase() || '';
            const ingredients = recipe.ingredients?.map((ing: any) => ing.name?.toLowerCase()).join(' ') || '';
            const tags = recipe.tags?.join(' ').toLowerCase() || '';
            const category = recipe.category?.toLowerCase() || '';

            const searchText = `${name} ${ingredients} ${tags} ${category}`;
            return searchText.includes(searchLower);
          });
        }

        return filtered;
      };

      const buildResponse = (recipes: any[], total: number) => ({
        recipes: recipes.map(recipe => ({
          id: recipe.id,
          name: recipe.name,
          prepTime: recipe.prepTime,
          glassware: recipe.glassware,
          difficulty: recipe.difficulty,
          tags: recipe.tags || [],
          imageUrl: recipe.imageUrl ?? null
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });

      const isMissingIndexError = (error: any) =>
        error?.code === 9 || error?.message?.includes('requires an index');

      let useLegacyCategoryField = false;

      try {
        let { recipes, total } = await fetchRecipes(false);

        if (category && total === 0) {
          useLegacyCategoryField = true;
          ({ recipes, total } = await fetchRecipes(false, true));
        }

        const filteredRecipes = applySearchAndTagFilters(recipes);
        const response = buildResponse(filteredRecipes, total);

        await CacheManager.set(cacheKey, JSON.stringify(response), 300);

        return response;
      } catch (error: any) {
        if (!isMissingIndexError(error) || tagsForQuery.length === 0) {
          throw error;
        }

        let fallbackQuery = buildBaseQuery(true, useLegacyCategoryField);
        let fallbackSnapshot = await fallbackQuery.get();
        let totalMatches = fallbackSnapshot.size;

        if (category && totalMatches === 0 && !useLegacyCategoryField) {
          useLegacyCategoryField = true;
          fallbackQuery = buildBaseQuery(true, true);
          fallbackSnapshot = await fallbackQuery.get();
          totalMatches = fallbackSnapshot.size;
        }

        const allRecipes = fallbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const filteredRecipes = applySearchAndTagFilters(allRecipes).sort((a, b) => {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });

        const paginatedRecipes = filteredRecipes.slice(offset, offset + limit);
        const response = buildResponse(paginatedRecipes, totalMatches);

        await CacheManager.set(cacheKey, JSON.stringify(response), 300);

        return response;
      }
    });

    return NextResponse.json(response);

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}
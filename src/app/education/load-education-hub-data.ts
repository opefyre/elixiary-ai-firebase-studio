import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

import type { EducationHubContent, EducationHubStats } from '@/components/education/education-hub.types';
import { initializeFirebaseServer } from '@/firebase/server';
import type { EducationArticle, EducationCategory } from '@/types/education';

const DEFAULT_STATS: EducationHubStats = {
  totalArticles: null,
  totalCategories: null,
  totalStudents: null,
  averageRating: null,
};

const POPULAR_TAG_SAMPLE_LIMIT = 200;
const POPULAR_TAG_RESULT_LIMIT = 20;

type AnalyticsEntry = {
  type?: string;
  userId?: string | null;
  data?: {
    rating?: number | null;
  } | null;
};

function isMissingIndexError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const firestoreError = error as { code?: unknown; message?: unknown };

  return (
    firestoreError.code === 9 ||
    (typeof firestoreError.message === 'string' &&
      firestoreError.message.toLowerCase().includes('requires an index'))
  );
}

function toDate(value: unknown): Date {
  if (value && typeof value === 'object' && 'toDate' in (value as Record<string, unknown>)) {
    const candidate = (value as { toDate: () => Date }).toDate();
    if (!Number.isNaN(candidate.getTime())) {
      return candidate;
    }
  }

  if (value instanceof Date) {
    return value;
  }

  const date = new Date(value as any);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function mapCategorySnapshot(doc: QueryDocumentSnapshot): EducationCategory {
  const data = doc.data();

  return {
    id: doc.id,
    name: data.name ?? '',
    slug: data.slug ?? '',
    description: data.description ?? '',
    icon: data.icon ?? '',
    color: data.color ?? '',
    order: typeof data.order === 'number' ? data.order : 0,
    articleCount: typeof data.articleCount === 'number' ? data.articleCount : 0,
  };
}

function mapArticleSnapshot(doc: QueryDocumentSnapshot): EducationArticle {
  const data = doc.data();
  const stats = data.stats ?? {};

  return {
    id: doc.id,
    title: data.title ?? '',
    slug: data.slug ?? '',
    excerpt: data.excerpt ?? '',
    content: data.content ?? '',
    featuredImage: data.featuredImage ?? '',
    category: data.category ?? '',
    difficulty: data.difficulty ?? 'beginner',
    readingTime: typeof data.readingTime === 'number' ? data.readingTime : 0,
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author ?? { name: '', bio: '', avatar: '' },
    publishedAt: toDate(data.publishedAt),
    updatedAt: toDate(data.updatedAt ?? data.publishedAt),
    status: data.status ?? 'draft',
    seo: data.seo ?? { metaDescription: '', keywords: [] },
    stats: {
      views: typeof stats.views === 'number' ? stats.views : 0,
      likes: typeof stats.likes === 'number' ? stats.likes : 0,
      shares: typeof stats.shares === 'number' ? stats.shares : 0,
    },
  };
}

export async function loadEducationHubData(): Promise<EducationHubContent | null> {
  let adminDb;

  try {
    ({ adminDb } = initializeFirebaseServer());
  } catch (error) {
    console.error('Failed to initialize Firebase Admin for education hub page:', error);
    return null;
  }

  const stats: EducationHubStats = { ...DEFAULT_STATS };

  let categories: EducationCategory[] = [];
  try {
    const categoriesSnapshot = await adminDb.collection('education_categories').orderBy('order', 'asc').get();
    categories = categoriesSnapshot.docs.map((doc) => mapCategorySnapshot(doc));
    stats.totalCategories = categories.length;
  } catch (error) {
    console.error('Error loading education categories for hub:', error);
    categories = [];
    stats.totalCategories = null;
  }

  let latestArticles: EducationArticle[] = [];
  try {
    const latestSnapshot = await adminDb
      .collection('education_articles')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(6)
      .get();
    latestArticles = latestSnapshot.docs.map((doc) => mapArticleSnapshot(doc));
  } catch (error) {
    console.error('Error loading latest education articles for hub:', error);
    if (isMissingIndexError(error)) {
      try {
        const fallbackSnapshot = await adminDb
          .collection('education_articles')
          .where('status', '==', 'published')
          .get();

        latestArticles = fallbackSnapshot.docs
          .map((doc) => mapArticleSnapshot(doc))
          .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
          .slice(0, 6);
      } catch (fallbackError) {
        console.error('Fallback loading latest education articles for hub failed:', fallbackError);
        latestArticles = [];
      }
    } else {
      latestArticles = [];
    }
  }

  try {
    const countSnapshot = await adminDb
      .collection('education_articles')
      .where('status', '==', 'published')
      .count()
      .get();
    const count = countSnapshot.data().count;
    stats.totalArticles = typeof count === 'number' ? count : null;
  } catch (error) {
    console.warn('Falling back to in-memory article total for education hub:', error);
    stats.totalArticles = latestArticles.length > 0 ? latestArticles.length : null;
  }

  let featuredArticles: EducationArticle[] = [];
  let featuredError = false;
  try {
    const featuredSnapshot = await adminDb
      .collection('education_articles')
      .where('status', '==', 'published')
      .orderBy('stats.views', 'desc')
      .orderBy('publishedAt', 'desc')
      .limit(3)
      .get();
    featuredArticles = featuredSnapshot.docs.map((doc) => mapArticleSnapshot(doc));
  } catch (error) {
    console.error('Error loading featured education articles for hub:', error);
    if (isMissingIndexError(error)) {
      try {
        const fallbackSnapshot = await adminDb
          .collection('education_articles')
          .where('status', '==', 'published')
          .get();

        featuredArticles = fallbackSnapshot.docs
          .map((doc) => mapArticleSnapshot(doc))
          .sort((a, b) => {
            const viewDifference = (b.stats?.views ?? 0) - (a.stats?.views ?? 0);
            if (viewDifference !== 0) {
              return viewDifference;
            }

            return b.publishedAt.getTime() - a.publishedAt.getTime();
          })
          .slice(0, 3);
        featuredError = false;
      } catch (fallbackError) {
        console.error('Fallback loading featured education articles for hub failed:', fallbackError);
        featuredArticles = [];
        featuredError = true;
      }
    } else {
      featuredArticles = [];
      featuredError = true;
    }
  }

  let popularTags: string[] = [];
  try {
    const tagsSnapshot = await adminDb
      .collection('education_articles')
      .where('status', '==', 'published')
      .limit(POPULAR_TAG_SAMPLE_LIMIT)
      .get();

    const tagFrequency = new Map<string, { count: number; latestPublishedAt: number }>();

    tagsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const tags = Array.isArray(data.tags) ? data.tags : [];
      const publishedAt = toDate(data.publishedAt).getTime();

      tags
        .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
        .filter((tag) => tag.length > 0)
        .forEach((tag) => {
          const existing = tagFrequency.get(tag);
          if (existing) {
            existing.count += 1;
            existing.latestPublishedAt = Math.max(existing.latestPublishedAt, publishedAt);
            tagFrequency.set(tag, existing);
          } else {
            tagFrequency.set(tag, { count: 1, latestPublishedAt: publishedAt });
          }
        });
    });

    popularTags = Array.from(tagFrequency.entries())
      .sort((a, b) => {
        const countDifference = b[1].count - a[1].count;
        if (countDifference !== 0) {
          return countDifference;
        }

        const recencyDifference = b[1].latestPublishedAt - a[1].latestPublishedAt;
        if (recencyDifference !== 0) {
          return recencyDifference;
        }

        return a[0].localeCompare(b[0]);
      })
      .slice(0, POPULAR_TAG_RESULT_LIMIT)
      .map(([tag]) => tag);
  } catch (error) {
    console.error('Error computing popular education tags for hub:', error);
    popularTags = [];
  }

  try {
    const analyticsStart = new Date();
    analyticsStart.setDate(analyticsStart.getDate() - 90);

    const analyticsSnapshot = await adminDb
      .collection('education_analytics')
      .where('timestamp', '>=', analyticsStart)
      .get();

    const analyticsEntries = analyticsSnapshot.docs.map((doc) => doc.data() as AnalyticsEntry);

    const viewEvents = analyticsEntries.filter((entry) => entry?.type === 'view');
    if (viewEvents.length > 0) {
      const uniqueUserIds = new Set(
        viewEvents
          .map((event) => event?.userId)
          .filter((id): id is string => typeof id === 'string' && id.length > 0)
      );

      stats.totalStudents = uniqueUserIds.size > 0 ? uniqueUserIds.size : viewEvents.length;
    }

    const ratingValues = analyticsEntries
      .map((entry) => entry?.data?.rating)
      .filter((rating): rating is number => typeof rating === 'number' && !Number.isNaN(rating));

    if (ratingValues.length > 0) {
      const ratingSum = ratingValues.reduce((sum, rating) => sum + rating, 0);
      stats.averageRating = Number((ratingSum / ratingValues.length).toFixed(1));
    }
  } catch (error) {
    console.error('Error loading education analytics for hub:', error);
  }

  return {
    categories,
    latestArticles,
    featuredArticles,
    stats,
    featuredError,
    popularTags,
  };
}

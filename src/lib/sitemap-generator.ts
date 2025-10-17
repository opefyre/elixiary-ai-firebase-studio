import { initializeFirebaseServer } from '@/firebase/server';
import { config } from '@/lib/config';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SitemapGenerator {
  private baseUrl = config.baseUrl;
  private cache: Map<string, SitemapEntry[]> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private setCache(key: string, data: SitemapEntry[]): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  private getCache(key: string): SitemapEntry[] | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key) || null;
    }
    return null;
  }

  async generateStaticPages(): Promise<SitemapEntry[]> {
    const cacheKey = 'static-pages';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const staticPages: SitemapEntry[] = [
      {
        url: this.baseUrl,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${this.baseUrl}/cocktails`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${this.baseUrl}/pricing`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${this.baseUrl}/login`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${this.baseUrl}/privacy`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.3,
      },
      {
        url: `${this.baseUrl}/api/docs`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      },
    ];

    this.setCache(cacheKey, staticPages);
    return staticPages;
  }

  async generateCategoryPages(): Promise<SitemapEntry[]> {
    const cacheKey = 'category-pages';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { adminDb } = await initializeFirebaseServer();
      const categoriesSnapshot = await adminDb.collection('curated-categories').get();
      
      const now = new Date();
      const categoryPages: SitemapEntry[] = categoriesSnapshot.docs.map(doc => {
        const data = doc.data();
        const recipeCount = data.recipeCount || 0;
        
        return {
          url: `${this.baseUrl}/cocktails/category/${doc.id}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: recipeCount > 50 ? 0.8 : 0.7,
        };
      });

      this.setCache(cacheKey, categoryPages);
      return categoryPages;
    } catch (error) {
      console.error('Error generating category pages:', error);
      return [];
    }
  }

  async generateRecipePages(limit = 1000): Promise<SitemapEntry[]> {
    const cacheKey = `recipe-pages-${limit}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const { adminDb } = await initializeFirebaseServer();
      const recipesSnapshot = await adminDb
        .collection('curated-recipes')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const now = new Date();
      const recipePages: SitemapEntry[] = recipesSnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt;
        
        // Calculate priority based on recipe characteristics
        let priority = 0.6;
        
        // Higher priority for popular categories
        const popularCategories = ['cat_short_shaken_citrus', 'cat_highball_long', 'cat_shot_shooter'];
        if (popularCategories.includes(data.category)) {
          priority = 0.7;
        }
        
        // Higher priority for recipes with more tags (more detailed)
        if (data.tags && data.tags.length > 5) {
          priority += 0.05;
        }

        priority = Math.min(priority, 0.8); // Cap at 0.8

        return {
          url: `${this.baseUrl}/cocktails/recipe/${doc.id}`,
          lastModified: createdAt ? new Date(createdAt.toDate()) : now,
          changeFrequency: 'monthly',
          priority,
        };
      });

      this.setCache(cacheKey, recipePages);
      return recipePages;
    } catch (error) {
      console.error('Error generating recipe pages:', error);
      return [];
    }
  }

  generateTagPages(): SitemapEntry[] {
    const cacheKey = 'tag-pages';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const popularTags = [
      'flavor_citrus',
      'style_contemporary_classic',
      'strength_moderate',
      'flavor_fruity',
      'style_classic',
      'serve_up',
      'serve_long',
      'season_summer',
      'occ_party',
      'flavor_sweet',
    ];

    const tagPages: SitemapEntry[] = popularTags.map(tag => ({
      url: `${this.baseUrl}/cocktails?tag=${tag}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    this.setCache(cacheKey, tagPages);
    return tagPages;
  }

  generateSearchPages(): SitemapEntry[] {
    const cacheKey = 'search-pages';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const popularSearches = [
      'margarita',
      'mojito',
      'martini',
      'old fashioned',
      'cosmopolitan',
      'daiquiri',
      'whiskey sour',
      'gin and tonic',
      'bloody mary',
      'pina colada',
    ];

    const searchPages: SitemapEntry[] = popularSearches.map(search => ({
      url: `${this.baseUrl}/cocktails?search=${encodeURIComponent(search)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    }));

    this.setCache(cacheKey, searchPages);
    return searchPages;
  }

  generateDifficultyPages(): SitemapEntry[] {
    const cacheKey = 'difficulty-pages';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const difficulties = ['Easy', 'Medium', 'Hard'];

    const difficultyPages: SitemapEntry[] = difficulties.map(difficulty => ({
      url: `${this.baseUrl}/cocktails?difficulty=${encodeURIComponent(difficulty)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    }));

    this.setCache(cacheKey, difficultyPages);
    return difficultyPages;
  }

  async generateAllPages(): Promise<SitemapEntry[]> {
    const [
      staticPages,
      categoryPages,
      recipePages,
      tagPages,
      searchPages,
      difficultyPages,
    ] = await Promise.all([
      this.generateStaticPages(),
      this.generateCategoryPages(),
      this.generateRecipePages(),
      Promise.resolve(this.generateTagPages()),
      Promise.resolve(this.generateSearchPages()),
      Promise.resolve(this.generateDifficultyPages()),
    ]);

    const allPages = [
      ...staticPages,
      ...categoryPages,
      ...recipePages,
      ...tagPages,
      ...searchPages,
      ...difficultyPages,
    ];

    console.log(`Generated sitemap with ${allPages.length} pages`);
    console.log(`- Static pages: ${staticPages.length}`);
    console.log(`- Category pages: ${categoryPages.length}`);
    console.log(`- Recipe pages: ${recipePages.length}`);
    console.log(`- Tag pages: ${tagPages.length}`);
    console.log(`- Search pages: ${searchPages.length}`);
    console.log(`- Difficulty pages: ${difficultyPages.length}`);

    return allPages;
  }

  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

export const sitemapGenerator = new SitemapGenerator();

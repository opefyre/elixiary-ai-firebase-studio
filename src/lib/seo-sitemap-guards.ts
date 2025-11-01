/**
 * Prefixes that must remain excluded from the sitemap because they are
 * explicitly blocked for crawlers in src/app/robots.ts.
 *
 * Keep this list in sync with the disallow rules in robots.ts so future
 * changes don't accidentally reintroduce blocked URLs into the sitemap.
 */
export const SITEMAP_BLOCKED_PATH_PREFIXES = [
  '/login',
  '/account',
  '/api',
  '/admin',
  '/_next',
  '/recipes',
] as const;

/**
 * Returns `true` when the provided path (with or without leading slash)
 * resolves to a URL segment that is disallowed for indexing.
 */
export function isPathBlockedForSitemap(path: string): boolean {
  const [rawPathname] = path.split('?');
  const normalizedPath = rawPathname.startsWith('/')
    ? rawPathname
    : `/${rawPathname}`;

  return SITEMAP_BLOCKED_PATH_PREFIXES.some(prefix => {
    if (normalizedPath === prefix) {
      return true;
    }

    return normalizedPath.startsWith(`${prefix}/`);
  });
}

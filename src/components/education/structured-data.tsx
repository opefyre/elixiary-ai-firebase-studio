import { EducationArticle, EducationCategory } from '@/types/education';
import { config, getCanonicalUrl } from '@/lib/config';

interface StructuredDataProps {
  type: 'article' | 'category' | 'breadcrumb' | 'organization';
  data?: EducationArticle | EducationCategory;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function StructuredData({ type, data, breadcrumbs }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'article':
        if (!data || !('title' in data)) return null;
        const article = data as EducationArticle;
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.seo.metaDescription || article.excerpt,
          image: article.featuredImage,
          author: {
            '@type': 'Person',
            name: article.author.name,
            description: article.author.bio,
            image: article.author.avatar,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Elixiary',
            logo: {
              '@type': 'ImageObject',
              url: getCanonicalUrl('/logo.png'),
            },
          },
          datePublished: article.publishedAt.toISOString(),
          dateModified: article.updatedAt.toISOString(),
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': getCanonicalUrl(`/education/${article.category}/${article.slug}`),
          },
          articleSection: article.category,
          keywords: article.seo.keywords?.join(', ') || article.tags.join(', '),
          wordCount: article.content.split(' ').length,
          timeRequired: `PT${article.readingTime}M`,
          difficulty: article.difficulty,
          about: {
            '@type': 'Thing',
            name: 'Mixology',
            description: 'The art and science of mixing drinks',
          },
        };

      case 'category':
        if (!data || !('name' in data)) return null;
        const category = data as EducationCategory;
        return {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: category.name,
          description: category.description,
          url: getCanonicalUrl(`/education/${category.slug}`),
          mainEntity: {
            '@type': 'ItemList',
            name: `${category.name} Articles`,
            description: category.description,
            numberOfItems: category.articleCount,
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: config.baseUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Education',
                item: getCanonicalUrl('/education'),
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: category.name,
                item: getCanonicalUrl(`/education/${category.slug}`),
              },
            ],
          },
        };

      case 'breadcrumb':
        if (!breadcrumbs) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
          })),
        };

      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Elixiary',
          description: 'Learn the art of mixology with our comprehensive education center',
          url: config.baseUrl,
          logo: getCanonicalUrl('/logo.png'),
          sameAs: [
            'https://twitter.com/elixiary',
            'https://instagram.com/elixiary',
            'https://facebook.com/elixiary',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'support@elixiary.com',
          },
          offers: {
            '@type': 'Offer',
            name: 'Mixology Education',
            description: 'Comprehensive mixology education and cocktail recipes',
            category: 'Education',
          },
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

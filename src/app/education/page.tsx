import { Metadata } from 'next';

import { EducationHub } from '@/components/education/education-hub';
import { StructuredData } from '@/components/education/structured-data';
import { getCanonicalUrl } from '@/lib/config';

import { loadEducationHubData } from './load-education-hub-data';

const FALLBACK_ARTICLES = [
  {
    title: 'Build Your Foundation',
    description: 'Understand the core techniques every home bartender should master before mixing signature drinks.',
  },
  {
    title: 'Essential Tools Checklist',
    description: 'Learn which shakers, strainers, and glassware deserve a place on your bar cart.',
  },
  {
    title: 'Balance & Flavor Basics',
    description: 'Explore how sweetness, acidity, and bitterness shape the flavor profile of every cocktail.',
  },
];

const FALLBACK_CATEGORIES = [
  {
    name: 'Mixology Fundamentals',
    description: 'Step-by-step tutorials that demystify shaking, stirring, and muddling.',
  },
  {
    name: 'Home Bar Setup',
    description: 'Practical guidance for stocking bottles, tools, and garnishes without wasting budget.',
  },
  {
    name: 'Classic Cocktails',
    description: 'Discover evergreen recipes with tips for dialing them in to your taste.',
  },
];

export const metadata: Metadata = {
  title: 'Education Center | Learn Mixology & Cocktail Crafting',
  description:
    'Master the art of mixology with our comprehensive education center. Learn cocktail techniques, equipment guides, ingredient knowledge, and classic recipes from expert mixologists.',
  keywords: ['mixology education', 'cocktail techniques', 'bar equipment', 'ingredient guides', 'classic cocktails', 'bartending skills'],
  alternates: {
    canonical: getCanonicalUrl('/education'),
  },
  openGraph: {
    title: 'Education Center | Learn Mixology & Cocktail Crafting',
    description:
      'Master the art of mixology with our comprehensive education center. Learn cocktail techniques, equipment guides, ingredient knowledge, and classic recipes from expert mixologists.',
    type: 'website',
    url: getCanonicalUrl('/education'),
    images: [
      {
        url: getCanonicalUrl('/og-education.jpg'),
        width: 1200,
        height: 630,
        alt: 'Elixiary Education Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Education Center | Learn Mixology & Cocktail Crafting',
    description:
      'Master the art of mixology with our comprehensive education center. Learn cocktail techniques, equipment guides, ingredient knowledge, and classic recipes from expert mixologists.',
    images: [getCanonicalUrl('/og-education.jpg')],
  },
};

function EducationFallback() {
  return (
    <div className="container mx-auto px-4 pt-safe pb-10 md:pt-28">
      <section className="mb-12 text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">Elevate Your Mixology Practice</h1>
        <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          Our learning hub is temporarily unavailable, but you can still explore the building blocks of great cocktails.
          Revisit the fundamentals below while we restore full access.
        </p>
      </section>

      <section className="mb-16">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Start with the Essentials</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            A quick refresher on the core concepts that underpin every excellent drink.
          </p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FALLBACK_ARTICLES.map((article) => (
            <li key={article.title} className="rounded-xl border border-border/60 bg-background/80 p-6 text-left">
              <h3 className="text-lg font-semibold text-foreground mb-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{article.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Explore Foundational Topics</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            These themes guide our curriculum and can inspire your next mixing session.
          </p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FALLBACK_CATEGORIES.map((category) => (
            <li key={category.name} className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-6 text-left">
              <h3 className="text-lg font-semibold text-foreground mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{category.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default async function EducationPage() {
  const educationData = await loadEducationHubData();

  return (
    <>
      <StructuredData type="organization" />
      {educationData ? (
        <EducationHub
          categories={educationData.categories}
          latestArticles={educationData.latestArticles}
          featuredArticles={educationData.featuredArticles}
          stats={educationData.stats}
          featuredError={educationData.featuredError}
          popularTags={educationData.popularTags}
        />
      ) : (
        <EducationFallback />
      )}
    </>
  );
}

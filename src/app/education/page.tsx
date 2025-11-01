import { Metadata } from 'next';
import { EducationHub } from '@/components/education/education-hub';
import { StructuredData } from '@/components/education/structured-data';
import { getCanonicalUrl } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Education Center | Learn Mixology & Cocktail Crafting',
  description: 'Master the art of mixology with our comprehensive education center. Learn cocktail techniques, equipment guides, ingredient knowledge, and classic recipes from expert mixologists.',
  keywords: ['mixology education', 'cocktail techniques', 'bar equipment', 'ingredient guides', 'classic cocktails', 'bartending skills'],
  alternates: {
    canonical: getCanonicalUrl('/education'),
  },
  openGraph: {
    title: 'Education Center | Learn Mixology & Cocktail Crafting',
    description: 'Master the art of mixology with our comprehensive education center. Learn cocktail techniques, equipment guides, ingredient knowledge, and classic recipes from expert mixologists.',
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
    description: 'Master the art of mixology with our comprehensive education center. Learn cocktail techniques, equipment guides, ingredient knowledge, and classic recipes from expert mixologists.',
    images: [getCanonicalUrl('/og-education.jpg')],
  },
};

export default function EducationPage() {
  return (
    <>
      <StructuredData type="organization" />
      <EducationHub />
    </>
  );
}

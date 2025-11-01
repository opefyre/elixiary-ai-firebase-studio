import { Metadata } from 'next';
import { EducationHub } from '@/components/education/education-hub';
import { StructuredData } from '@/components/education/structured-data';

export const metadata: Metadata = {
  title: 'Education Center | Learn Mixology & Cocktail Crafting',
  description: 'Master the art of mixology with our comprehensive education center. Learn cocktail techniques, equipment guides, ingredient knowledge, and classic recipes from expert mixologists.',
  keywords: ['mixology education', 'cocktail techniques', 'bar equipment', 'ingredient guides', 'classic cocktails', 'bartending skills'],
  openGraph: {
    title: 'Education Center | Learn Mixology & Cocktail Crafting',
    description: 'Master the art of mixology with our comprehensive education center. Learn cocktail techniques, equipment guides, ingredient knowledge, and classic recipes from expert mixologists.',
    type: 'website',
    url: 'https://elixiary.com/education',
    images: [
      {
        url: 'https://elixiary.com/og-education.jpg',
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
    images: ['https://elixiary.com/og-education.jpg'],
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

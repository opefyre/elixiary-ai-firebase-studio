import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | Elixiary AI Pro - Unlimited Cocktail Recipes',
  description: 'Upgrade to Elixiary AI Pro for unlimited AI-generated cocktail recipes, advanced features, and premium mixology tools. Start your free trial today!',
  keywords: [
    'elixiary ai pro',
    'cocktail app pricing',
    'mixology subscription',
    'premium cocktail features',
    'unlimited recipes',
    'cocktail app upgrade',
    'pro mixology tools',
    'cocktail generator premium',
  ],
  openGraph: {
    title: 'Pricing | Elixiary AI Pro - Unlimited Cocktail Recipes',
    description: 'Upgrade to Elixiary AI Pro for unlimited AI-generated cocktail recipes and advanced features.',
    type: 'website',
    images: [
      {
        url: '/opengraph-pricing.png',
        width: 1200,
        height: 630,
        alt: 'Elixiary AI Pro Pricing - Unlimited Cocktail Recipes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | Elixiary AI Pro - Unlimited Cocktail Recipes',
    description: 'Upgrade to Elixiary AI Pro for unlimited AI-generated cocktail recipes and advanced features.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://elixiary.com'}/pricing`,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

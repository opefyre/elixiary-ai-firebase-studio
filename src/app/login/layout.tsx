import { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Login | Elixiary AI',
  description: 'Sign in to your Elixiary AI account to access your cocktail recipes and AI-powered mixology tools.',
  alternates: {
    canonical: getCanonicalUrl('/login'),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Elixiary AI',
  description: 'Sign in to your Elixiary AI account to access your cocktail recipes and AI-powered mixology tools.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

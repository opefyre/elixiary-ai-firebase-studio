import { Metadata } from 'next';
import { AuthGuard } from '@/components/auth-guard';
import { AppClientProviders } from '@/components/providers/app-client-providers';
import { getCanonicalUrl } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Account | Elixiary AI',
  description: 'Manage your Elixiary AI account, view subscription details, API keys, and personal statistics.',
  alternates: {
    canonical: getCanonicalUrl('/account'),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppClientProviders>
      <AuthGuard>{children}</AuthGuard>
    </AppClientProviders>
  );
}

import { Metadata } from 'next';
import { AuthGuard } from '@/components/auth-guard';

export const metadata: Metadata = {
  title: 'Account | Elixiary AI',
  description: 'Manage your Elixiary AI account, view subscription details, API keys, and personal statistics.',
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
  return <AuthGuard>{children}</AuthGuard>;
}

'use client';

import { useUser } from '@/firebase';
import { EmailVerificationPrompt } from '@/components/email-verification-prompt';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return <>{children}</>;
  }

  // If user is logged in but email is not verified, show verification prompt
  if (user && !user.emailVerified) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <EmailVerificationPrompt />
      </div>
    );
  }

  // If user is verified or not logged in, show normal content
  return <>{children}</>;
}

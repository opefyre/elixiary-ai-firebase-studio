'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function EmailVerificationPrompt() {
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (user) {
      setIsVerified(user.emailVerified);
    }
  }, [user]);

  const handleResendVerification = async () => {
    if (!user) return;
    
    setIsSending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: 'Verification email sent',
        description: 'Please check your email and click the verification link.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send verification email.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleRefreshVerification = () => {
    if (user) {
      user.reload().then(() => {
        setIsVerified(user.emailVerified);
        if (user.emailVerified) {
          toast({
            title: 'Email verified!',
            description: 'Your account has been verified successfully.',
          });
        }
      });
    }
  };

  // Don't show if user is verified or not logged in
  if (!user || isVerified) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
          <Mail className="h-6 w-6 text-orange-600" />
        </div>
        <CardTitle className="text-xl">Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            We've sent a verification email to <strong>{user.email}</strong>. 
            Please check your inbox and click the verification link to activate your account.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button 
            onClick={handleResendVerification}
            disabled={isSending}
            className="w-full"
            variant="outline"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </>
            )}
          </Button>

          <Button 
            onClick={handleRefreshVerification}
            variant="ghost"
            className="w-full"
          >
            I've verified my email
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>Can't find the email? Check your spam folder.</p>
          <p>Verification emails are sent from <strong>noreply@elixiary.com</strong></p>
        </div>
      </CardContent>
    </Card>
  );
}

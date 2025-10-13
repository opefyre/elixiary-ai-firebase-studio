'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
} from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/firebase';
import { Loader2, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character.' }),
  confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

export function AuthForm() {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  // Check for verification success in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
      setSuccessMessage('Email verified successfully! You can now sign in.');
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    
    // Force account selection and show consent screen
    provider.setCustomParameters({
      prompt: 'select_account consent',
      hd: '', // Don't restrict to specific domain
    });
    
    // Add scopes explicitly
    provider.addScope('email');
    provider.addScope('profile');
    
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user (first time sign-in)
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      if (isNewUser) {
        // Send welcome email for new Google users
        try {
          await fetch('/api/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: result.user.email,
              displayName: result.user.displayName || result.user.email?.split('@')[0]
            }),
          });
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail sign-in if welcome email fails
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignInSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Send email verification with custom action URL
      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/login?verified=true`
      });
      
      // Send welcome email
      try {
        await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            displayName: userCredential.user.displayName || data.email.split('@')[0]
          }),
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail sign-up if welcome email fails
      }
      
      // Show verification success page instead of signing out
      setUserEmail(data.email);
      setShowVerificationSuccess(true);
      
      // Clear the form
      signUpForm.reset();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const GoogleSignInButton = () => (
    <Button
      variant="outline"
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 10.32C34.553 6.477 29.623 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          />
          <path
            fill="#FF3D00"
            d="M6.306 14.691c-1.332 2.65-2.074 5.631-2.074 8.815C4.232 26.964 5.32 30.04 7.18 32.571l6.19-4.845C11.776 26.494 11 25.286 11 24s.776-2.494 2.37-3.726l-6.254-4.892z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-4.845A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.28-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 4.845C41.758 35.215 44 30.022 44 24c0-1.341-.138-2.65-.389-3.917z"
          />
        </svg>
      )}
      Sign in with Google
    </Button>
  );

  const VerificationSuccessCard = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Check Your Email!</h2>
        
        <div className="space-y-4 mb-6">
          <p className="text-muted-foreground">
            We've sent a verification email to:
          </p>
          <p className="font-semibold text-lg">{userEmail}</p>
          <p className="text-sm text-muted-foreground">
            Please check your inbox and click the verification link to activate your account.
          </p>
        </div>

        <Alert className="mb-6">
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <strong>Can't find the email?</strong> Check your spam folder. 
            Verification emails are sent from <strong>noreply@elixiary.com</strong>
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button 
            onClick={() => setShowVerificationSuccess(false)}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
          
          <p className="text-xs text-muted-foreground">
            After verifying your email, you can sign in and start creating cocktails!
          </p>
        </div>
      </CardContent>
    </Card>
  );

  // Show verification success page if user just signed up
  if (showVerificationSuccess) {
    return <VerificationSuccessCard />;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4 mt-6">
            <GoogleSignInButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {error && (
              <div className="pt-4">
                <Alert variant="destructive">
                  <AlertTitle>Authentication Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            <Form {...signInForm}>
              <form
                onSubmit={signInForm.handleSubmit(onSignInSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <GoogleSignInButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {error && (
              <div className="pt-4">
                <Alert variant="destructive">
                  <AlertTitle>Authentication Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {successMessage && (
              <div className="pt-4">
                <Alert>
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              </div>
            )}

            <Form {...signUpForm}>
              <form
                onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="At least 8 chars, upper, lower, number, special"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="text-xs text-muted-foreground">
                          Password must contain: 8+ characters, uppercase, lowercase, number, and special character
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign Up
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Users, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Elixiary AI - How we collect, use, and protect your data",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <Shield className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground text-lg">
          Simple, transparent privacy policy. We respect your data.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              What We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">When You Sign In</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Your email address and name (from Google)</li>
                <li>Your profile picture (optional)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">When You Use the App</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Cocktail recipes you create and save</li>
                <li>How many recipes you've generated (for usage limits)</li>
                <li>Basic usage stats (like which pages you visit)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">If You Upgrade to Pro</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Payment information (handled by Stripe, not us)</li>
                <li>Subscription status and billing dates</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              How We Use Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">To Provide Our Service</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Generate cocktail recipes using AI</li>
                <li>Save your favorite recipes</li>
                <li>Track your usage limits (Free vs Pro)</li>
                <li>Process payments for Pro subscriptions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">To Improve the App</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Fix bugs and improve performance</li>
                <li>Understand how people use the app</li>
                <li>Make the AI better at generating recipes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How We Protect Your Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>All data is encrypted when stored and transmitted</li>
                <li>We use Google's secure authentication system</li>
                <li>Only you can access your recipes</li>
                <li>We don't store your payment information (Stripe handles that)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How Long We Keep Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Your account data: Until you delete your account</li>
                <li>Your recipes: Until you delete them or your account</li>
                <li>Usage stats: Anonymized after 2 years</li>
                <li>Payment records: As required by law</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Who We Work With</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Google:</strong> For sign-in and AI recipe generation</li>
                <li><strong>Firebase:</strong> For storing your data securely</li>
                <li><strong>Stripe:</strong> For processing Pro subscription payments</li>
                <li><strong>Vercel:</strong> For hosting the app</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">We Don't Share Your Data</h3>
              <p className="text-muted-foreground">
                We don't sell, rent, or share your personal information with anyone else. 
                The only exception is sharing your recipe prompts with Google's AI to generate recipes.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">You Can Always</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>View and download your saved recipes</li>
                <li>Delete any recipe you've saved</li>
                <li>Delete your entire account and all data</li>
                <li>Cancel your Pro subscription anytime</li>
                <li>Contact us with any privacy questions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Questions about your privacy? We're here to help.
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> privacy@elixiary.com</p>
              <p><strong>Website:</strong> <a href="https://ai.elixiary.com" className="text-primary hover:underline">ai.elixiary.com</a></p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If we make changes to this policy, we'll update the date above. 
              We'll notify you of any significant changes by email or through the app.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

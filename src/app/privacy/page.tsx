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
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Account Information (Google OAuth)</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Email address</li>
                <li>Display name</li>
                <li>Profile picture URL</li>
                <li>Firebase User ID (unique identifier)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recipe Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Cocktail recipes you generate (name, ingredients, instructions)</li>
                <li>User prompts you enter for recipe generation</li>
                <li>Recipe tags and favorites</li>
                <li>Recipe creation timestamps</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Usage Tracking</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Number of recipes generated per month</li>
                <li>Number of recipes saved</li>
                <li>Subscription tier (Free/Pro)</li>
                <li>Account creation date</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Subscription Data (Pro Users Only)</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Stripe customer ID</li>
                <li>Stripe subscription ID</li>
                <li>Subscription status and billing dates</li>
                <li>Early bird status (if applicable)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Analytics Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Page views and navigation (Google Analytics)</li>
                <li>Recipe generation events</li>
                <li>Recipe sharing and copying events</li>
                <li>Sign-in/sign-out events</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Service Provision</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Generate personalized cocktail recipes using Google Gemini AI</li>
                <li>Save and organize your favorite recipes</li>
                <li>Track usage limits for Free vs Pro tiers</li>
                <li>Process subscription payments (Pro users)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Service Improvement</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Monitor app performance and fix bugs</li>
                <li>Analyze usage patterns to improve features</li>
                <li>Track recipe generation success rates</li>
                <li>Ensure service reliability and security</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Analytics & Insights</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Track page views and user engagement (Google Analytics)</li>
                <li>Monitor recipe generation and sharing events</li>
                <li>Understand user behavior to improve the app</li>
                <li>Generate anonymized usage statistics</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Data Security & Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Security Measures</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>All data is encrypted in transit and at rest</li>
                <li>Secure authentication through Google OAuth</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and employee training</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Retention</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Account data: Retained while your account is active</li>
                <li>Recipe data: Retained until you delete your account or individual recipes</li>
                <li>Usage tracking: Retained for subscription management and monthly limits</li>
                <li>Analytics data: Anonymized and retained for up to 2 years</li>
                <li>Subscription data: Retained as required by law for billing records</li>
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
              <h3 className="font-semibold mb-2">Service Providers</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Google:</strong> Authentication (OAuth), AI services (Gemini), Analytics</li>
                <li><strong>Firebase:</strong> Database storage, user authentication, hosting</li>
                <li><strong>Vercel:</strong> Application hosting and content delivery</li>
                <li><strong>Stripe:</strong> Payment processing (Pro subscriptions only)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Sharing</h3>
              <p className="text-muted-foreground">
                We do not sell, rent, or share your personal information with third parties except as described above. 
                We may share anonymized, aggregated data for research and analytics purposes. 
                Your recipe content is not shared with third parties except for AI processing through Google Gemini.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Your Rights & Choices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Account Control</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>View and download your saved recipes</li>
                <li>Delete individual recipes or your entire account</li>
                <li>Manage your subscription and billing preferences</li>
                <li>Update your account information through Google</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Rights</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Request a copy of your data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of analytics tracking (disable cookies)</li>
                <li>Contact us with privacy concerns</li>
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
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> privacy@elixiary.com</p>
              <p><strong>Website:</strong> <a href="https://ai.elixiary.com" className="text-primary hover:underline">ai.elixiary.com</a></p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We will respond to your inquiry within 30 days.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              Your continued use of our service after any modifications constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

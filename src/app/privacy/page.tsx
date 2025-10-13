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
              <h3 className="font-semibold mb-2">Account Information</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Email address (when you sign in with Google)</li>
                <li>Display name and profile picture (from Google account)</li>
                <li>Account creation date and last login time</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Usage Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Cocktail recipes you generate and save</li>
                <li>Recipe generation count and usage patterns</li>
                <li>Subscription status and billing information (Pro users)</li>
                <li>App interactions and feature usage</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Technical Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Device information and browser type</li>
                <li>IP address and general location</li>
                <li>App performance and error logs</li>
                <li>Cookies and similar tracking technologies</li>
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
                <li>Generate personalized cocktail recipes using AI</li>
                <li>Save and organize your favorite recipes</li>
                <li>Provide shopping lists and recipe customization</li>
                <li>Manage your subscription and billing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Service Improvement</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Analyze usage patterns to improve our AI models</li>
                <li>Fix bugs and enhance app performance</li>
                <li>Develop new features based on user needs</li>
                <li>Monitor service reliability and security</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Communication</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Send important service updates and notifications</li>
                <li>Provide customer support when requested</li>
                <li>Share promotional offers (with your consent)</li>
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
                <li>Recipe data: Retained until you delete your account</li>
                <li>Usage analytics: Anonymized after 2 years</li>
                <li>Billing data: Retained as required by law</li>
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
                <li><strong>Google:</strong> Authentication, AI services (Gemini), Analytics</li>
                <li><strong>Firebase:</strong> Database, hosting, and backend services</li>
                <li><strong>Vercel:</strong> Application hosting and CDN</li>
                <li><strong>Stripe:</strong> Payment processing (Pro users only)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Sharing</h3>
              <p className="text-muted-foreground">
                We do not sell, rent, or share your personal information with third parties except as described in this policy. 
                We may share anonymized, aggregated data for research and analytics purposes.
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
                <li>Access and download your recipe data</li>
                <li>Update your account information</li>
                <li>Delete individual recipes or your entire account</li>
                <li>Manage your subscription and billing preferences</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Privacy Controls</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Opt out of promotional communications</li>
                <li>Request data portability</li>
                <li>Object to certain data processing</li>
                <li>Withdraw consent where applicable</li>
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

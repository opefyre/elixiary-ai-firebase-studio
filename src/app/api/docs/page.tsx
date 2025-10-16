'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Key, Mail, ExternalLink, Code, BookOpen, Globe, Shield, Clock } from 'lucide-react';
import Link from 'next/link';

export default function APIDocsPage() {
  const { user, isUserLoading } = useFirebase();
  const [apiKey, setApiKey] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (user) {
      setUserEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    setIsConfigured(!!(apiKey && userEmail));
  }, [apiKey, userEmail]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast here if needed
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 pt-24 md:py-12 md:pt-28">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative text-6xl">🔑</div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground text-center mb-6">
              Please sign in to access the API documentation.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pt-20 md:py-12 md:pt-24">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="font-headline text-3xl font-bold md:text-4xl mb-4">
          🍸 API Documentation
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Professional cocktail recipe API for Pro users. Access curated recipes, user data, and more with our comprehensive REST API.
        </p>
      </div>

      {/* API Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Base URL</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-mono">https://ai.elixiary.com/api/v1</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Authentication</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">API Key + Email</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Rate Limits</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">100/hour, 1K/day, 10K/month</p>
          </CardContent>
        </Card>
      </div>

      {/* API Configuration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(apiKey, 'API Key')}
                  disabled={!apiKey}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">User Email</Label>
              <div className="flex gap-2">
                <Input
                  id="user-email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(userEmail, 'Email')}
                  disabled={!userEmail}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          {isConfigured && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✅ API credentials configured! You can now test the endpoints.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">API Endpoints</h2>
        
        {/* Recipes Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recipes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    GET
                  </Badge>
                  <div>
                    <code className="font-mono text-sm">/recipes</code>
                    <p className="text-sm text-muted-foreground">Get all curated cocktail recipes</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="#recipes" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Try it
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    GET
                  </Badge>
                  <div>
                    <code className="font-mono text-sm">/recipes/{`{id}`}</code>
                    <p className="text-sm text-muted-foreground">Get a specific recipe by ID</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="#recipe-by-id" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Try it
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories & Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Categories & Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    GET
                  </Badge>
                  <div>
                    <code className="font-mono text-sm">/categories</code>
                    <p className="text-sm text-muted-foreground">Get all available categories</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="#categories" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Try it
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    GET
                  </Badge>
                  <div>
                    <code className="font-mono text-sm">/tags</code>
                    <p className="text-sm text-muted-foreground">Get all available tags</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="#tags" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Try it
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              User Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    GET
                  </Badge>
                  <div>
                    <code className="font-mono text-sm">/user/recipes</code>
                    <p className="text-sm text-muted-foreground">Get user's saved recipes</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="#user-recipes" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Try it
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    GET
                  </Badge>
                  <div>
                    <code className="font-mono text-sm">/user/badges</code>
                    <p className="text-sm text-muted-foreground">Get user's achievement badges</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="#user-badges" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Try it
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example Request */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Example Request</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">cURL Example</h4>
              <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
{`curl -X GET "https://ai.elixiary.com/api/v1/recipes" \\
  -H "x-api-key: ${apiKey || 'your_api_key_here'}" \\
  -H "x-user-email: ${userEmail || 'your_email@example.com'}" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">JavaScript Example</h4>
              <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
{`const response = await fetch('https://ai.elixiary.com/api/v1/recipes', {
  headers: {
    'x-api-key': '${apiKey || 'your_api_key_here'}',
    'x-user-email': '${userEmail || 'your_email@example.com'}',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="text-sm">Contact us at </span>
            <a href="mailto:hello@elixiary.com" className="text-primary hover:underline">
              hello@elixiary.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Key, Mail, Copy, Code, BookOpen, Globe, Shield, Clock, ChevronDown, ChevronRight, ExternalLink, Info, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function APIDocsPage() {
  const { user, isUserLoading } = useFirebase();
  const [apiKey, setApiKey] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      setUserEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    setIsConfigured(!!(apiKey && userEmail));
  }, [apiKey, userEmail]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`${label} copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    <div className="container mx-auto max-w-6xl px-4 py-8 pt-20 md:py-12 md:pt-24">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="font-headline text-3xl font-bold md:text-4xl mb-4">
          🍸 Elixiary AI API Documentation
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Comprehensive REST API for accessing curated cocktail recipes, user data, and more. 
          Built for developers who want to integrate cocktail recipes into their applications.
        </p>
      </div>

      {/* API Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Format</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">JSON REST API</p>
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
                  title="Copy API Key"
                >
                  <Copy className="w-4 h-4" />
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
                  title="Copy Email"
                >
                  <Copy className="w-4 h-4" />
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

      {/* Main Documentation */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="errors">Error Handling</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Elixiary AI API provides programmatic access to our curated cocktail recipe database, 
                user management features, and achievement system. All endpoints return JSON responses and 
                require authentication via API key and email headers.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Access to 495+ curated cocktail recipes</li>
                    <li>• Advanced filtering and search capabilities</li>
                    <li>• User-specific data and saved recipes</li>
                    <li>• Achievement badge system</li>
                    <li>• Rate limiting and usage tracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Response Format</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-xs font-mono">
{`{
  "success": true,
  "data": { ... },
  "pagination": { ... }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                All API requests require two headers for authentication:
              </p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Required Headers</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">x-api-key</code>
                      <span className="text-sm text-muted-foreground">Your API key (starts with elx_live_)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">x-user-email</code>
                      <span className="text-sm text-muted-foreground">Your registered email address</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Getting Your API Key</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        API keys are available to Pro users only. Visit your account page to generate and manage your API keys.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          {/* Recipes Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recipes Endpoints
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('recipes')}
                >
                  {expandedSections.recipes ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            {expandedSections.recipes && (
              <CardContent className="space-y-6">
                {/* GET /recipes */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      GET
                    </Badge>
                    <code className="font-mono text-lg">/recipes</code>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    Retrieve all curated cocktail recipes with optional filtering, sorting, and pagination.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold mb-2">Query Parameters</h5>
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <code className="bg-muted px-2 py-1 rounded">category</code>
                            <p className="text-muted-foreground text-xs mt-1">Filter by category (Beer Cocktails, Cocktails, Shots & Shooters, Mocktails)</p>
                          </div>
                          <div>
                            <code className="bg-muted px-2 py-1 rounded">difficulty</code>
                            <p className="text-muted-foreground text-xs mt-1">Filter by difficulty (Easy, Medium, Hard)</p>
                          </div>
                          <div>
                            <code className="bg-muted px-2 py-1 rounded">search</code>
                            <p className="text-muted-foreground text-xs mt-1">Search in recipe names and descriptions</p>
                          </div>
                          <div>
                            <code className="bg-muted px-2 py-1 rounded">tags</code>
                            <p className="text-muted-foreground text-xs mt-1">Filter by tags (comma-separated)</p>
                          </div>
                          <div>
                            <code className="bg-muted px-2 py-1 rounded">limit</code>
                            <p className="text-muted-foreground text-xs mt-1">Number of recipes to return (max 100, default 20)</p>
                          </div>
                          <div>
                            <code className="bg-muted px-2 py-1 rounded">offset</code>
                            <p className="text-muted-foreground text-xs mt-1">Number of recipes to skip (default 0)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">Response Schema</h5>
                      <div className="bg-muted p-3 rounded-lg">
                        <pre className="text-xs font-mono overflow-x-auto">
{`{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "string",
        "name": "string",
        "category": "string",
        "difficulty": "string",
        "glassware": "string",
        "ingredients": ["string"],
        "instructions": "string",
        "tags": ["string"],
        "imageUrl": "string",
        "createdAt": "2025-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 495,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GET /recipes/{id} */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      GET
                    </Badge>
                    <code className="font-mono text-lg">/recipes/{`{id}`}</code>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    Retrieve a specific recipe by its unique identifier.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold mb-2">Path Parameters</h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded">id</code>
                          <span className="text-sm text-muted-foreground">Recipe ID (required)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">Response Schema</h5>
                      <div className="bg-muted p-3 rounded-lg">
                        <pre className="text-xs font-mono overflow-x-auto">
{`{
  "success": true,
  "data": {
    "id": "recipe_123",
    "name": "Classic Margarita",
    "category": "Cocktails",
    "difficulty": "Easy",
    "glassware": "Margarita Glass",
    "ingredients": [
      "2 oz Tequila",
      "1 oz Lime Juice",
      "1 oz Triple Sec"
    ],
    "instructions": "Shake all ingredients with ice and strain into a chilled glass.",
    "tags": ["classic", "citrus", "refreshing"],
    "imageUrl": "https://example.com/margarita.jpg",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Categories & Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Categories & Tags
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('categories')}
                >
                  {expandedSections.categories ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            {expandedSections.categories && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        GET
                      </Badge>
                      <code className="font-mono">/categories</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Get all available recipe categories</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      Returns: ["Beer Cocktails", "Cocktails", "Shots & Shooters", "Mocktails"]
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        GET
                      </Badge>
                      <code className="font-mono">/tags</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Get all available recipe tags</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      Returns: ["classic", "citrus", "refreshing", "strong", "sweet"]
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* User Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  User Data
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('user')}
                >
                  {expandedSections.user ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            {expandedSections.user && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        GET
                      </Badge>
                      <code className="font-mono">/user/recipes</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Get user's saved recipes</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      Returns array of saved recipe objects
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        GET
                      </Badge>
                      <code className="font-mono">/user/badges</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Get user's achievement badges</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      Returns badges array with stats
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">cURL Example</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm font-mono overflow-x-auto">
{`curl -X GET "https://ai.elixiary.com/api/v1/recipes?category=Cocktails&limit=5" \\
  -H "x-api-key: ${apiKey || 'your_api_key_here'}" \\
  -H "x-user-email: ${userEmail || 'your_email@example.com'}" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">JavaScript Example</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm font-mono overflow-x-auto">
{`const response = await fetch('https://ai.elixiary.com/api/v1/recipes', {
  method: 'GET',
  headers: {
    'x-api-key': '${apiKey || 'your_api_key_here'}',
    'x-user-email': '${userEmail || 'your_email@example.com'}',
    'Content-Type': 'application/json'
  }
});

if (response.ok) {
  const data = await response.json();
  console.log('Recipes:', data.data.recipes);
} else {
  console.error('Error:', response.status);
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Python Example</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm font-mono overflow-x-auto">
{`import requests

headers = {
    'x-api-key': '${apiKey || 'your_api_key_here'}',
    'x-user-email': '${userEmail || 'your_email@example.com'}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://ai.elixiary.com/api/v1/recipes',
    headers=headers,
    params={'category': 'Cocktails', 'limit': 5}
)

if response.status_code == 200:
    data = response.json()
    print(f"Found {len(data['data']['recipes'])} recipes")
else:
    print(f"Error: {response.status_code}")`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                All API responses follow a consistent error format. Check the status code and error message for details.
              </p>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Error Response Format</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-xs font-mono overflow-x-auto">
{`{
  "success": false,
  "error": "Error message describing what went wrong",
  "statusCode": 400,
  "timestamp": "2025-01-15T10:30:00Z"
}`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Common Error Codes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">400</code>
                        <span className="font-medium">Bad Request</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Invalid parameters or malformed request</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">401</code>
                        <span className="font-medium">Unauthorized</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Invalid API key or email</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">404</code>
                        <span className="font-medium">Not Found</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Resource not found</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">429</code>
                        <span className="font-medium">Too Many Requests</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Rate limit exceeded</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
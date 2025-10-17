'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Key, Mail, Copy, Code, BookOpen, Globe, Shield, Clock, ChevronDown, ChevronRight, ExternalLink, Info, AlertCircle, Users, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { config, getApiUrl } from '@/lib/config';

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
          Complete REST API for accessing curated cocktail recipes, user data, and management features. 
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
            <p className="text-xs text-muted-foreground mt-1 font-mono">{config.apiBaseUrl}</p>
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="filtering">Filtering & Pagination</TabsTrigger>
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
                  <h4 className="font-semibold mb-3">Available Endpoints</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Recipes:</strong> GET /recipes, GET /recipes/{`{id}`}</li>
                    <li>• <strong>Categories:</strong> GET /categories</li>
                    <li>• <strong>Tags:</strong> GET /tags</li>
                    <li>• <strong>User Data:</strong> GET /user/recipes, GET /user/badges</li>
                    <li>• <strong>API Management:</strong> GET/POST /keys, DELETE/POST /keys/{`{id}`}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Response Format</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-xs font-mono">
{`{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_123...",
    "timestamp": "2025-01-15T10:30:00Z",
    "rateLimit": { ... }
  }
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
                All API requests require two headers for authentication. API keys are only available to Pro users.
              </p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Required Headers</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">x-api-key</code>
                      <span className="text-sm text-muted-foreground">Your API key (starts with elx_live_, min 40 chars)</span>
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
                    Retrieve curated cocktail recipes with advanced filtering, search, and pagination capabilities.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold mb-2">Query Parameters</h5>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded text-sm">category</code>
                              <span className="text-xs text-muted-foreground">string (optional)</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Filter by category: "Beer Cocktails", "Cocktails", "Shots & Shooters", "Mocktails"</p>
                          </div>
                          <div className="space-y-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm">difficulty</code>
                            <span className="text-xs text-muted-foreground">enum (optional)</span>
                            <p className="text-xs text-muted-foreground">Filter by difficulty: "Easy", "Medium", "Hard"</p>
                          </div>
                          <div className="space-y-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm">search</code>
                            <span className="text-xs text-muted-foreground">string (optional, max 100 chars)</span>
                            <p className="text-xs text-muted-foreground">Search in recipe names, ingredients, tags, and categories</p>
                          </div>
                          <div className="space-y-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm">tags</code>
                            <span className="text-xs text-muted-foreground">string (optional, max 200 chars)</span>
                            <p className="text-xs text-muted-foreground">Filter by tags (comma-separated): "classic,citrus,refreshing"</p>
                          </div>
                          <div className="space-y-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm">page</code>
                            <span className="text-xs text-muted-foreground">integer (optional, 1-100, default: 1)</span>
                            <p className="text-xs text-muted-foreground">Page number for pagination</p>
                          </div>
                          <div className="space-y-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm">limit</code>
                            <span className="text-xs text-muted-foreground">integer (optional, 1-20, default: 10)</span>
                            <p className="text-xs text-muted-foreground">Number of recipes per page</p>
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
        "ingredients": ["string"],
        "instructions": "string",
        "glassware": "string",
        "garnish": "string",
        "difficulty": "Easy|Medium|Hard",
        "category": "string",
        "tags": ["string"],
        "imageUrl": "string",
        "createdAt": "2025-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 495,
      "totalPages": 50,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "meta": {
    "requestId": "req_123...",
    "timestamp": "2025-01-15T10:30:00Z",
    "rateLimit": { ... }
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
                          <span className="text-sm text-muted-foreground">Recipe ID (required, string)</span>
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
    "ingredients": [
      "2 oz Tequila",
      "1 oz Lime Juice", 
      "1 oz Triple Sec"
    ],
    "instructions": "Shake all ingredients with ice and strain into a chilled glass.",
    "glassware": "Margarita Glass",
    "garnish": "Lime wheel",
    "difficulty": "Easy",
    "category": "Cocktails",
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
                    <p className="text-sm text-muted-foreground mb-3">Get all available recipe categories with metadata</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      Returns: [{`{"id": "cat1", "name": "Cocktails", "displayName": "Cocktails", "description": "...", "recipeCount": 150}`}]
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        GET
                      </Badge>
                      <code className="font-mono">/tags</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Get all available recipe tags with usage counts</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      Returns: [{`{"id": "tag1", "name": "classic", "displayName": "Classic", "recipeCount": 45}`}]
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
                  <Users className="h-5 w-5" />
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
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        GET
                      </Badge>
                      <code className="font-mono">/user/recipes</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Get user's saved recipes with filtering and pagination</p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Query Parameters:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><code className="bg-muted px-1 rounded">source</code> - "curated" or "ai"</div>
                        <div><code className="bg-muted px-1 rounded">category</code> - Filter by category</div>
                        <div><code className="bg-muted px-1 rounded">difficulty</code> - Filter by difficulty</div>
                        <div><code className="bg-muted px-1 rounded">page</code> - Page number (1-100)</div>
                        <div><code className="bg-muted px-1 rounded">limit</code> - Results per page (1-20)</div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        POST
                      </Badge>
                      <code className="font-mono">/user/recipes</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Save a curated recipe to user's collection</p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Request Body:</p>
                      <div className="bg-muted p-2 rounded text-xs font-mono">
                        {"{ \"recipeId\": \"recipe_123\" }"}
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        DELETE
                      </Badge>
                      <code className="font-mono">/user/recipes/{`{id}`}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Remove a saved recipe from user's collection</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        GET
                      </Badge>
                      <code className="font-mono">/user/badges</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Get user's achievement badges and stats</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      Returns: {"{ \"badges\": [...], \"totalBadges\": 5, \"user\": {...} }"}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* API Key Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Key Management
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('keys')}
                >
                  {expandedSections.keys ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            {expandedSections.keys && (
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        GET
                      </Badge>
                      <code className="font-mono">/keys</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">List all user's API keys with usage stats</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        POST
                      </Badge>
                      <code className="font-mono">/keys</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Create a new API key</p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Request Body:</p>
                      <div className="bg-muted p-2 rounded text-xs font-mono">
                        {"{ \"name\": \"My API Key\" }"}
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        POST
                      </Badge>
                      <code className="font-mono">/keys/{`{keyId}`}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Rotate (regenerate) an existing API key</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        DELETE
                      </Badge>
                      <code className="font-mono">/keys/{`{keyId}`}</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Revoke (delete) an API key</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="filtering" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtering & Pagination Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Advanced Filtering</h4>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Category Filtering</h5>
                    <p className="text-sm text-muted-foreground mb-2">Filter recipes by category using exact matches:</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      GET /recipes?category=Cocktails
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Available categories: "Beer Cocktails", "Cocktails", "Shots & Shooters", "Mocktails"</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Difficulty Filtering</h5>
                    <p className="text-sm text-muted-foreground mb-2">Filter by difficulty level:</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      GET /recipes?difficulty=Easy
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Available difficulties: "Easy", "Medium", "Hard"</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Search Functionality</h5>
                    <p className="text-sm text-muted-foreground mb-2">Search across multiple fields (case-insensitive):</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      GET /recipes?search=margarita
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Searches in: recipe name, ingredients, tags, category</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Tag Filtering</h5>
                    <p className="text-sm text-muted-foreground mb-2">Filter by multiple tags (comma-separated):</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      GET /recipes?tags=classic,citrus,refreshing
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Returns recipes that have ANY of the specified tags</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Combined Filtering</h5>
                    <p className="text-sm text-muted-foreground mb-2">Combine multiple filters for precise results:</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      GET /recipes?category=Cocktails&difficulty=Easy&tags=classic&search=gin
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">All filters are applied with AND logic</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Pagination System</h4>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Basic Pagination</h5>
                    <p className="text-sm text-muted-foreground mb-2">Control page size and navigation:</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      GET /recipes?page=2&limit=20
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>• <strong>page:</strong> Page number (1-100, default: 1)</p>
                      <p>• <strong>limit:</strong> Results per page (1-20, default: 10)</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Pagination Response</h5>
                    <p className="text-sm text-muted-foreground mb-2">Every paginated response includes pagination metadata:</p>
                    <div className="bg-muted p-3 rounded">
                      <pre className="text-xs font-mono">
{`{
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 495,
    "totalPages": 25,
    "hasNext": true,
    "hasPrev": true
  }
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Performance Tips</h5>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Use specific filters to reduce result set before pagination</p>
                      <p>• Smaller page sizes (5-10) for better performance</p>
                      <p>• Cache results when possible to reduce API calls</p>
                      <p>• Use search instead of loading all data for client-side filtering</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Basic Recipe Retrieval</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">cURL</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <pre className="text-sm font-mono overflow-x-auto">
{`curl -X GET "${config.apiBaseUrl}/recipes?category=Cocktails&limit=5" \\
  -H "x-api-key: ${apiKey || 'your_api_key_here'}" \\
  -H "x-user-email: ${userEmail || 'your_email@example.com'}" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">JavaScript (Fetch API)</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <pre className="text-sm font-mono overflow-x-auto">
{`const response = await fetch('${config.apiBaseUrl}/recipes?category=Cocktails&limit=5', {
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
  console.log('Pagination:', data.data.pagination);
} else {
  console.error('Error:', response.status, await response.text());
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Python (requests)</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <pre className="text-sm font-mono overflow-x-auto">
{`import requests

headers = {
    'x-api-key': '${apiKey || 'your_api_key_here'}',
    'x-user-email': '${userEmail || 'your_email@example.com'}',
    'Content-Type': 'application/json'
}

response = requests.get(
    '${config.apiBaseUrl}/recipes',
    headers=headers,
    params={
        'category': 'Cocktails',
        'difficulty': 'Easy',
        'limit': 5
    }
)

if response.status_code == 200:
    data = response.json()
    print(f"Found {len(data['data']['recipes'])} recipes")
    for recipe in data['data']['recipes']:
        print(f"- {recipe['name']} ({recipe['difficulty']})")
else:
    print(f"Error: {response.status_code} - {response.text}")`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Advanced Filtering Example</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <pre className="text-sm font-mono overflow-x-auto">
{`// Search for classic gin cocktails that are easy to make
const response = await fetch('${config.apiBaseUrl}/recipes?' + new URLSearchParams({
  search: 'gin',
  category: 'Cocktails',
  difficulty: 'Easy',
  tags: 'classic,refreshing',
  page: '1',
  limit: '10'
}), {
  headers: {
    'x-api-key': '${apiKey || 'your_api_key_here'}',
    'x-user-email': '${userEmail || 'your_email@example.com'}'
  }
});`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">User Data Management</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Save a Recipe</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <pre className="text-sm font-mono overflow-x-auto">
{`// Save a recipe to user's collection
const response = await fetch('${config.apiBaseUrl}/user/recipes', {
  method: 'POST',
  headers: {
    'x-api-key': '${apiKey || 'your_api_key_here'}',
    'x-user-email': '${userEmail || 'your_email@example.com'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipeId: 'recipe_123'
  })
});`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Get User's Saved Recipes</p>
                    <div className="bg-muted p-3 rounded-lg">
                      <pre className="text-sm font-mono overflow-x-auto">
{`// Get user's saved recipes with filtering
const response = await fetch('${config.apiBaseUrl}/user/recipes?source=curated&page=1&limit=20', {
  headers: {
    'x-api-key': '${apiKey || 'your_api_key_here'}',
    'x-user-email': '${userEmail || 'your_email@example.com'}'
  }
});`}
                      </pre>
                    </div>
                  </div>
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
  "error": {
    "error": "Error type",
    "message": "Detailed error message",
    "statusCode": 400,
    "timestamp": "2025-01-15T10:30:00Z",
    "requestId": "req_123..."
  }
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
                      <p className="text-sm text-muted-foreground">Invalid parameters, malformed request, or validation errors</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">401</code>
                        <span className="font-medium">Unauthorized</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Invalid API key, email, or missing authentication headers</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">403</code>
                        <span className="font-medium">Forbidden</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Insufficient permissions or Pro subscription required</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">404</code>
                        <span className="font-medium">Not Found</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Resource not found (recipe, user, etc.)</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">409</code>
                        <span className="font-medium">Conflict</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Resource already exists (e.g., recipe already saved)</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">413</code>
                        <span className="font-medium">Payload Too Large</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Request size exceeds 1MB limit</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">429</code>
                        <span className="font-medium">Too Many Requests</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Rate limit exceeded (100/hour, 1K/day, 10K/month)</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">500</code>
                        <span className="font-medium">Internal Server Error</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Server error or database issues</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Error Handling Best Practices</p>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                        <li>• Always check the response status code before processing data</li>
                        <li>• Implement exponential backoff for 429 (rate limit) errors</li>
                        <li>• Log request IDs for debugging server-side issues</li>
                        <li>• Handle network errors and timeouts gracefully</li>
                        <li>• Validate API key format before making requests</li>
                      </ul>
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
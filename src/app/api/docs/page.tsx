'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, ExternalLink, Key, Mail, Globe, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function APIDocsPage() {
  const [apiKey, setApiKey] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has API keys configured
    const checkAPIKeys = async () => {
      try {
        const response = await fetch('/api/account/api-keys', {
          headers: {
            'Authorization': `Bearer ${await (await import('firebase/auth')).getAuth().currentUser?.getIdToken()}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.length > 0) {
            setApiKey(data.data[0].id);
            setIsConfigured(true);
          }
        }
      } catch (error) {
        console.log('No API keys found or user not authenticated');
      }
    };

    checkAPIKeys();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const generateCurlExample = (endpoint: string, method: string = 'GET', body?: any) => {
    const headers = [
      `"x-api-key: ${apiKey || 'elx_live_your_api_key_here'}"`,
      `"x-user-email: ${userEmail || 'your-email@example.com'}"`,
      '"Content-Type: application/json"'
    ];

    let curl = `curl -X ${method} "https://ai.elixiary.com/api/v1${endpoint}" \\\n`;
    headers.forEach((header, index) => {
      curl += `  -H ${header}`;
      if (index < headers.length - 1) curl += ' \\';
      curl += '\n';
    });

    if (body && method !== 'GET') {
      curl += `  -d '${JSON.stringify(body)}'`;
    }

    return curl;
  };

  const generateJSExample = (endpoint: string, method: string = 'GET', body?: any) => {
    const js = `const response = await fetch('https://ai.elixiary.com/api/v1${endpoint}', {
  method: '${method}',
  headers: {
    'x-api-key': '${apiKey || 'elx_live_your_api_key_here'}',
    'x-user-email': '${userEmail || 'your-email@example.com'}',
    'Content-Type': 'application/json'
  }${body ? `,\n  body: JSON.stringify(${JSON.stringify(body)})` : ''}
});

const data = await response.json();
console.log(data);`;

    return js;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl font-bold md:text-4xl mb-4">
            🍸 Elixiary AI API
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-6">
            Professional cocktail recipe API for Pro users
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-sm">
              <Globe className="w-4 h-4 mr-1" />
              Base URL: https://ai.elixiary.com/api/v1
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Shield className="w-4 h-4 mr-1" />
              API Key Authentication
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Clock className="w-4 h-4 mr-1" />
              Rate Limited
            </Badge>
          </div>
        </div>

        {/* API Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure your API credentials to test endpoints interactively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
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
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            {apiKey && userEmail && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✅ API credentials configured! You can now test the endpoints below.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="user">User Data</TabsTrigger>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Learn how to authenticate and make your first API call
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Get Your API Key</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    Go to your Account page and create an API key in the "API Keys" section.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/account" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Go to Account
                    </a>
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2. Make Your First Request</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                    All requests require these headers:
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg font-mono text-sm">
                    <div>x-api-key: elx_live_your_api_key_here</div>
                    <div>x-user-email: your-email@example.com</div>
                    <div>Content-Type: application/json</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Rate Limits</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">100</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">per hour</div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">1,000</div>
                      <div className="text-sm text-green-700 dark:text-green-300">per day</div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">10,000</div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">per month</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Endpoints</CardTitle>
                <CardDescription>
                  Browse and search cocktail recipes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Get All Recipes */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">GET</Badge>
                    <code className="text-sm font-mono">/recipes</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Get all cocktail recipes with optional filtering and pagination
                  </p>
                  
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs font-semibold">Query Parameters:</Label>
                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <div>• <code>category</code> - Filter by category (string)</div>
                        <div>• <code>difficulty</code> - Filter by difficulty (Easy, Medium, Hard)</div>
                        <div>• <code>search</code> - Search in name, ingredients, tags (string)</div>
                        <div>• <code>tags</code> - Filter by tags, comma-separated (string)</div>
                        <div>• <code>page</code> - Page number, 1-100 (default: 1)</div>
                        <div>• <code>limit</code> - Results per page, 1-20 (default: 10)</div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                      <div className="text-xs font-semibold mb-2">Example Request:</div>
                      <pre className="text-xs font-mono overflow-x-auto">
                        {generateCurlExample('/recipes?category=Beer%20Cocktails&limit=5')}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Get Specific Recipe */}
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">GET</Badge>
                    <code className="text-sm font-mono">/recipes/{'{id}'}</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Get a specific cocktail recipe by ID
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs font-semibold mb-2">Example Request:</div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {generateCurlExample('/recipes/hhk7z9swf')}
                    </pre>
                  </div>
                </div>

                {/* Get Categories */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">GET</Badge>
                    <code className="text-sm font-mono">/categories</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Get all available recipe categories
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs font-semibold mb-2">Example Request:</div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {generateCurlExample('/categories')}
                    </pre>
                  </div>
                </div>

                {/* Get Tags */}
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">GET</Badge>
                    <code className="text-sm font-mono">/tags</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Get all available tags
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs font-semibold mb-2">Example Request:</div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {generateCurlExample('/tags')}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Data Tab */}
          <TabsContent value="user" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User-Specific Endpoints</CardTitle>
                <CardDescription>
                  Manage user data, saved recipes, and badges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Get User Recipes */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">GET</Badge>
                    <code className="text-sm font-mono">/user/recipes</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Get user's saved recipes with optional filtering
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs font-semibold mb-2">Example Request:</div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {generateCurlExample('/user/recipes?source=curated&limit=10')}
                    </pre>
                  </div>
                </div>

                {/* Save Recipe */}
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">POST</Badge>
                    <code className="text-sm font-mono">/user/recipes</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Save a recipe to user collection
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs font-semibold mb-2">Example Request:</div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {generateCurlExample('/user/recipes', 'POST', { recipeId: 'hhk7z9swf' })}
                    </pre>
                  </div>
                </div>

                {/* Delete Recipe */}
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700">DELETE</Badge>
                    <code className="text-sm font-mono">/user/recipes/{'{id}'}</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Remove saved recipe from user collection
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs font-semibold mb-2">Example Request:</div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {generateCurlExample('/user/recipes/NeHIddPDqYCq0t9578x9', 'DELETE')}
                    </pre>
                  </div>
                </div>

                {/* Get User Badges */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">GET</Badge>
                    <code className="text-sm font-mono">/user/badges</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Get user's earned badges
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs font-semibold mb-2">Example Request:</div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {generateCurlExample('/user/badges')}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Key Management</CardTitle>
                <CardDescription>
                  Manage your API keys programmatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* List Keys */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">GET</Badge>
                    <code className="text-sm font-mono">/keys</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    List all API keys for the authenticated user
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs font-semibold mb-2">Example Request:</div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {generateCurlExample('/keys')}
                    </pre>
                  </div>
                </div>

                {/* Create Key */}
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">POST</Badge>
                    <code className="text-sm font-mono">/keys</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Create a new API key
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs font-semibold mb-2">Example Request:</div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {generateCurlExample('/keys', 'POST', { name: 'My Application Key' })}
                    </pre>
                  </div>
                </div>

                {/* Delete Key */}
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700">DELETE</Badge>
                    <code className="text-sm font-mono">/keys/{'{keyId}'}</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Revoke an API key
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs font-semibold mb-2">Example Request:</div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {generateCurlExample('/keys/elx_live_abc123', 'DELETE')}
                    </pre>
                  </div>
                </div>

                {/* Rotate Key */}
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">POST</Badge>
                    <code className="text-sm font-mono">/keys/{'{keyId}'}/rotate</code>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Generate a new API key to replace the existing one
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <div className="text-xs font-semibold mb-2">Example Request:</div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {generateCurlExample('/keys/elx_live_abc123/rotate', 'POST')}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>
                  Ready-to-use code examples in multiple languages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="javascript" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="php">PHP</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="javascript" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Get All Recipes</h4>
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                        <pre className="text-sm font-mono overflow-x-auto">
{`const API_BASE = 'https://ai.elixiary.com/api/v1';
const API_KEY = '${apiKey || 'elx_live_your_api_key_here'}';
const USER_EMAIL = '${userEmail || 'your-email@example.com'}';

async function getRecipes(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(\`\${API_BASE}/recipes?\${params}\`, {
    headers: {
      'x-api-key': API_KEY,
      'x-user-email': USER_EMAIL,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  return await response.json();
}

// Usage
getRecipes({ category: 'Beer Cocktails', limit: 5 })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="python" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Get All Recipes</h4>
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                        <pre className="text-sm font-mono overflow-x-auto">
{`import requests

API_BASE = 'https://ai.elixiary.com/api/v1'
API_KEY = '${apiKey || 'elx_live_your_api_key_here'}'
USER_EMAIL = '${userEmail || 'your-email@example.com'}'

headers = {
    'x-api-key': API_KEY,
    'x-user-email': USER_EMAIL,
    'Content-Type': 'application/json'
}

def get_recipes(filters=None):
    if filters is None:
        filters = {}
    
    response = requests.get(f'{API_BASE}/recipes', headers=headers, params=filters)
    response.raise_for_status()
    return response.json()

# Usage
try:
    recipes = get_recipes({'category': 'Beer Cocktails', 'limit': 5})
    print(f"Found {len(recipes['data']['recipes'])} recipes")
except requests.exceptions.RequestException as e:
    print(f'Error: {e}')`}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="php" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Get All Recipes</h4>
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                        <pre className="text-sm font-mono overflow-x-auto">
{`<?php
$apiBase = 'https://ai.elixiary.com/api/v1';
$apiKey = '${apiKey || 'elx_live_your_api_key_here'}';
$userEmail = '${userEmail || 'your-email@example.com'}';

$headers = [
    'x-api-key: ' . $apiKey,
    'x-user-email: ' . $userEmail,
    'Content-Type: application/json'
];

function getRecipes($filters = []) {
    global $apiBase, $headers;
    
    $url = $apiBase . '/recipes';
    if (!empty($filters)) {
        $url .= '?' . http_build_query($filters);
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        throw new Exception("HTTP error: $httpCode");
    }
    
    return json_decode($response, true);
}

// Usage
try {
    $recipes = getRecipes(['category' => 'Beer Cocktails', 'limit' => 5]);
    echo "Found " . count($recipes['data']['recipes']) . " recipes\\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\\n";
}
?>`}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Handling</CardTitle>
                <CardDescription>
                  Understanding API errors and status codes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">HTTP Status Codes</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>200</span>
                        <span className="text-green-600">Success</span>
                      </div>
                      <div className="flex justify-between">
                        <span>400</span>
                        <span className="text-yellow-600">Bad Request</span>
                      </div>
                      <div className="flex justify-between">
                        <span>401</span>
                        <span className="text-red-600">Unauthorized</span>
                      </div>
                      <div className="flex justify-between">
                        <span>403</span>
                        <span className="text-red-600">Forbidden</span>
                      </div>
                      <div className="flex justify-between">
                        <span>404</span>
                        <span className="text-red-600">Not Found</span>
                      </div>
                      <div className="flex justify-between">
                        <span>429</span>
                        <span className="text-orange-600">Rate Limited</span>
                      </div>
                      <div className="flex justify-between">
                        <span>500</span>
                        <span className="text-red-600">Server Error</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Common Error Messages</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-300">
                        <code>API key must start with elx_live_ and be at least 40 characters long</code>
                      </div>
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-300">
                        <code>x-api-key and x-user-email headers are required</code>
                      </div>
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-300">
                        <code>Pro subscription required. Current tier: free</code>
                      </div>
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-orange-700 dark:text-orange-300">
                        <code>Rate limit exceeded. Try again later.</code>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Error Response Format</h4>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <pre className="text-sm font-mono overflow-x-auto">
{`{
  "success": false,
  "error": "Error message describing what went wrong",
  "statusCode": 400,
  "timestamp": "2025-10-16T19:36:54.370Z"
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

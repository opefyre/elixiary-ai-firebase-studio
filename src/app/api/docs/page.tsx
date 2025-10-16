'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Key, Globe, Shield, Clock, Code, BookOpen, User, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function APIDocsPage() {
  const { user, isUserLoading } = useFirebase();
  const [apiKey, setApiKey] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userApiKeys, setUserApiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      fetchUserAPIKeys();
    } else if (!isUserLoading && !user) {
      setApiKey('');
      setUserEmail('');
      setLoadingKeys(false);
    }
  }, [user, isUserLoading]);

  const fetchUserAPIKeys = async () => {
    setLoadingKeys(true);
    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch('/api/account/api-keys', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUserApiKeys(data.data);
        if (data.data.length > 0) {
          const activeKey = data.data.find((key: any) => key.status === 'active');
          if (activeKey) {
            setApiKey(activeKey.id);
            setUserEmail(activeKey.email);
          }
        }
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: `Failed to fetch API keys: ${error.message}`, variant: 'destructive' });
    } finally {
      setLoadingKeys(false);
    }
  };

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
    if (body) {
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
  }${body ? ',\n  body: JSON.stringify(' + JSON.stringify(body) + ')' : ''}
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

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                API Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Elixiary AI API provides access to curated cocktail recipes and user-specific data for Pro subscribers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    All requests require an API key and user email in headers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Rate Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    100 requests/hour, 1,000/day, 10,000/month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipes Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">GET /recipes</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Get all curated cocktail recipes with optional filtering.
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                  <pre className="text-sm font-mono overflow-x-auto">
{generateCurlExample('/recipes')}
                  </pre>
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
            <CardContent>
              <Tabs defaultValue="javascript" className="space-y-4">
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
{generateJSExample('/recipes')}
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

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Responses</CardTitle>
            </CardHeader>
            <CardContent>
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
  );
}
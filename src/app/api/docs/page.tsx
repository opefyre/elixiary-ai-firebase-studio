'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Shield, Clock, Key, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Import Swagger UI components
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function APIDocsPage() {
  const { user, isUserLoading } = useFirebase();
  const [apiKey, setApiKey] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (user) {
      setUserEmail(user.email || '');
    }
  }, [user]);

  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Elixiary AI API',
      description: 'Professional cocktail recipe API for Pro users',
      version: '1.0.0',
      contact: {
        name: 'Elixiary AI Support',
        email: 'hello@elixiary.com'
      }
    },
    servers: [
      {
        url: 'https://ai.elixiary.com/api/v1',
        description: 'Production server'
      }
    ],
    security: [
      {
        ApiKeyAuth: []
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API key for authentication'
        }
      },
      schemas: {
        Recipe: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            category: { type: 'string' },
            difficulty: { type: 'string' },
            glassware: { type: 'string' },
            ingredients: { type: 'array', items: { type: 'string' } },
            instructions: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            imageUrl: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            statusCode: { type: 'integer' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    paths: {
      '/recipes': {
        get: {
          summary: 'Get all recipes',
          description: 'Retrieve all curated cocktail recipes with optional filtering',
          parameters: [
            {
              name: 'category',
              in: 'query',
              description: 'Filter by category',
              schema: { type: 'string' }
            },
            {
              name: 'difficulty',
              in: 'query',
              description: 'Filter by difficulty',
              schema: { type: 'string' }
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Number of recipes to return',
              schema: { type: 'integer', default: 20 }
            },
            {
              name: 'offset',
              in: 'query',
              description: 'Number of recipes to skip',
              schema: { type: 'integer', default: 0 }
            }
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          recipes: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Recipe' }
                          },
                          total: { type: 'integer' },
                          limit: { type: 'integer' },
                          offset: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/recipes/{id}': {
        get: {
          summary: 'Get recipe by ID',
          description: 'Retrieve a specific recipe by its ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Recipe ID',
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/Recipe' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Recipe not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/categories': {
        get: {
          summary: 'Get all categories',
          description: 'Retrieve all available recipe categories',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/tags': {
        get: {
          summary: 'Get all tags',
          description: 'Retrieve all available recipe tags',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/user/recipes': {
        get: {
          summary: 'Get user saved recipes',
          description: 'Retrieve recipes saved by the authenticated user',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Recipe' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/user/badges': {
        get: {
          summary: 'Get user badges',
          description: 'Retrieve achievement badges for the authenticated user',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          badges: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string' },
                                name: { type: 'string' },
                                description: { type: 'string' },
                                icon: { type: 'string' },
                                unlockedAt: { type: 'string', format: 'date-time' }
                              }
                            }
                          },
                          stats: {
                            type: 'object',
                            properties: {
                              totalBadges: { type: 'integer' },
                              unlockedBadges: { type: 'integer' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 pt-24">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 pt-24">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="h-12 w-12 text-muted-foreground mb-4" />
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
    <div className="container mx-auto max-w-6xl px-4 py-8 pt-24">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">🍸 Elixiary AI API</h1>
        <p className="text-lg text-muted-foreground mb-6">
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
              <label className="text-sm font-medium">API Key</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(apiKey)}
                  disabled={!apiKey}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">User Email</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(userEmail)}
                  disabled={!userEmail}
                >
                  Copy
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

      {/* Swagger UI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Interactive API Documentation
          </CardTitle>
          <CardDescription>
            Test API endpoints directly in your browser with live examples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="swagger-ui-container">
            <SwaggerUI 
              spec={openApiSpec}
              docExpansion="list"
              defaultModelsExpandDepth={1}
              defaultModelExpandDepth={1}
              tryItOutEnabled={true}
              requestInterceptor={(request) => {
                if (apiKey) {
                  request.headers['x-api-key'] = apiKey;
                }
                if (userEmail) {
                  request.headers['x-user-email'] = userEmail;
                }
                return request;
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
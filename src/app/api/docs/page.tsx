'use client';

import { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
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
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to access the API documentation.</div>;
  }

  return (
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
  );
}
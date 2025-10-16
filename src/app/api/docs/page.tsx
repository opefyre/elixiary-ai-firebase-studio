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
      docExpansion="full"
      defaultModelsExpandDepth={2}
      defaultModelExpandDepth={2}
      tryItOutEnabled={true}
      filter={true}
      showRequestHeaders={true}
      showCommonExtensions={true}
      showExtensions={true}
      showMutatedRequest={true}
      supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch']}
      requestInterceptor={(request) => {
        if (apiKey) {
          request.headers['x-api-key'] = apiKey;
        }
        if (userEmail) {
          request.headers['x-user-email'] = userEmail;
        }
        return request;
      }}
      responseInterceptor={(response) => {
        return response;
      }}
      onComplete={() => {
        // Add custom styling and features after Swagger UI loads
        const style = document.createElement('style');
        style.textContent = `
          .swagger-ui .topbar { display: none; }
          .swagger-ui .info { margin: 20px 0; }
          .swagger-ui .info .title { font-size: 2.5rem; color: #3b82f6; }
          .swagger-ui .info .description { font-size: 1.1rem; color: #6b7280; }
          .swagger-ui .opblock { margin: 10px 0; border-radius: 8px; }
          .swagger-ui .opblock .opblock-summary { border-radius: 8px; }
          .swagger-ui .opblock.opblock-get { border-color: #10b981; }
          .swagger-ui .opblock.opblock-get .opblock-summary { border-color: #10b981; background: #f0fdf4; }
          .swagger-ui .opblock.opblock-post { border-color: #3b82f6; }
          .swagger-ui .opblock.opblock-post .opblock-summary { border-color: #3b82f6; background: #eff6ff; }
          .swagger-ui .opblock.opblock-put { border-color: #f59e0b; }
          .swagger-ui .opblock.opblock-put .opblock-summary { border-color: #f59e0b; background: #fffbeb; }
          .swagger-ui .opblock.opblock-delete { border-color: #ef4444; }
          .swagger-ui .opblock.opblock-delete .opblock-summary { border-color: #ef4444; background: #fef2f2; }
          .swagger-ui .btn { border-radius: 6px; font-weight: 500; }
          .swagger-ui .btn.execute { background: #3b82f6; border-color: #3b82f6; }
          .swagger-ui .btn.execute:hover { background: #2563eb; }
          .swagger-ui .response-col_status { font-weight: 600; }
          .swagger-ui .response-col_description__inner { font-size: 0.9rem; }
          .swagger-ui .model { font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; }
          .swagger-ui .model-title { color: #374151; font-weight: 600; }
          .swagger-ui .prop-name { color: #059669; font-weight: 500; }
          .swagger-ui .prop-type { color: #7c3aed; }
          .swagger-ui .parameter__name { font-weight: 600; color: #374151; }
          .swagger-ui .parameter__type { color: #7c3aed; font-weight: 500; }
          .swagger-ui .parameter__deprecated { color: #ef4444; }
          .swagger-ui .auth-container { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .swagger-ui .auth-container h4 { color: #374151; margin: 0 0 8px 0; }
          .swagger-ui .auth-container p { color: #6b7280; margin: 0; font-size: 0.9rem; }
          .swagger-ui .scheme-container { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .swagger-ui .scheme-container h4 { color: #374151; margin: 0 0 8px 0; }
          .swagger-ui .scheme-container p { color: #6b7280; margin: 0; font-size: 0.9rem; }
          .swagger-ui .opblock-description-wrapper p { color: #4b5563; line-height: 1.6; }
          .swagger-ui .opblock-external-docs-wrapper p { color: #6b7280; }
          .swagger-ui .opblock-external-docs-wrapper a { color: #3b82f6; text-decoration: none; }
          .swagger-ui .opblock-external-docs-wrapper a:hover { text-decoration: underline; }
          .swagger-ui .response-col_links { display: none; }
          .swagger-ui .opblock-section-header { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
          .swagger-ui .opblock-section-header h4 { color: #374151; font-weight: 600; }
          .swagger-ui .opblock-section-header .btn { background: #3b82f6; border-color: #3b82f6; color: white; }
          .swagger-ui .opblock-section-header .btn:hover { background: #2563eb; }
          .swagger-ui .opblock-section-header .btn.cancel { background: #6b7280; border-color: #6b7280; }
          .swagger-ui .opblock-section-header .btn.cancel:hover { background: #4b5563; }
          .swagger-ui .opblock-section-header .btn-group { margin: 0; }
          .swagger-ui .opblock-section-header .btn-group .btn { margin: 0 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:first-child { margin-left: 0; }
          .swagger-ui .opblock-section-header .btn-group .btn:last-child { margin-right: 0; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:last-child) { margin-right: 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:first-child) { margin-left: 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:last-child):not(:first-child) { margin: 0 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:last-child):not(:first-child):not(:nth-child(2)) { margin: 0 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:last-child):not(:first-child):not(:nth-child(2)):not(:nth-child(3)) { margin: 0 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:last-child):not(:first-child):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4)) { margin: 0 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:last-child):not(:first-child):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4)):not(:nth-child(5)) { margin: 0 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:last-child):not(:first-child):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4)):not(:nth-child(5)):not(:nth-child(6)) { margin: 0 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:last-child):not(:first-child):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4)):not(:nth-child(5)):not(:nth-child(6)):not(:nth-child(7)) { margin: 0 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:last-child):not(:first-child):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4)):not(:nth-child(5)):not(:nth-child(6)):not(:nth-child(7)):not(:nth-child(8)) { margin: 0 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:last-child):not(:first-child):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4)):not(:nth-child(5)):not(:nth-child(6)):not(:nth-child(7)):not(:nth-child(8)):not(:nth-child(9)) { margin: 0 4px; }
          .swagger-ui .opblock-section-header .btn-group .btn:not(:last-child):not(:first-child):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4)):not(:nth-child(5)):not(:nth-child(6)):not(:nth-child(7)):not(:nth-child(8)):not(:nth-child(9)):not(:nth-child(10)) { margin: 0 4px; }
        `;
        document.head.appendChild(style);
      }}
    />
  );
}
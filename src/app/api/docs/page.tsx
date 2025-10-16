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
      description: 'Professional cocktail recipe API for Pro users. Access curated recipes, user data, and more with our comprehensive REST API.',
      version: '1.0.0',
      contact: {
        name: 'Elixiary AI Support',
        email: 'hello@elixiary.com',
        url: 'https://ai.elixiary.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
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
          description: 'Your API key for authentication'
        },
        UserEmailAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-email',
          description: 'Your registered email address'
        }
      },
      schemas: {
        Recipe: {
          type: 'object',
          required: ['id', 'name', 'category', 'difficulty', 'ingredients', 'instructions'],
          properties: {
            id: { 
              type: 'string',
              description: 'Unique identifier for the recipe',
              example: 'recipe_123'
            },
            name: { 
              type: 'string',
              description: 'Name of the cocktail',
              example: 'Classic Margarita'
            },
            category: { 
              type: 'string',
              description: 'Category of the cocktail',
              example: 'Beer Cocktails',
              enum: ['Beer Cocktails', 'Cocktails', 'Shots & Shooters', 'Mocktails']
            },
            difficulty: { 
              type: 'string',
              description: 'Difficulty level',
              example: 'Easy',
              enum: ['Easy', 'Medium', 'Hard']
            },
            glassware: { 
              type: 'string',
              description: 'Recommended glassware',
              example: 'Margarita Glass'
            },
            ingredients: { 
              type: 'array',
              items: { type: 'string' },
              description: 'List of ingredients',
              example: ['2 oz Tequila', '1 oz Lime Juice', '1 oz Triple Sec']
            },
            instructions: { 
              type: 'string',
              description: 'Step-by-step instructions',
              example: 'Shake all ingredients with ice and strain into a chilled glass.'
            },
            tags: { 
              type: 'array',
              items: { type: 'string' },
              description: 'Recipe tags',
              example: ['classic', 'citrus', 'refreshing']
            },
            imageUrl: { 
              type: 'string',
              format: 'uri',
              description: 'URL to recipe image',
              example: 'https://example.com/margarita.jpg'
            },
            createdAt: { 
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2025-01-15T10:30:00Z'
            }
          }
        },
        Error: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: { 
              type: 'boolean',
              example: false,
              description: 'Indicates if the request was successful'
            },
            error: { 
              type: 'string',
              description: 'Error message describing what went wrong',
              example: 'Invalid API key provided'
            },
            statusCode: { 
              type: 'integer',
              description: 'HTTP status code',
              example: 401
            },
            timestamp: { 
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the error occurred',
              example: '2025-01-15T10:30:00Z'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer', description: 'Total number of items' },
            limit: { type: 'integer', description: 'Number of items per page' },
            offset: { type: 'integer', description: 'Number of items skipped' },
            hasMore: { type: 'boolean', description: 'Whether there are more items' }
          }
        }
      }
    },
    paths: {
      '/recipes': {
        get: {
          tags: ['Recipes'],
          summary: 'Get all recipes',
          description: 'Retrieve all curated cocktail recipes with optional filtering, sorting, and pagination.',
          operationId: 'getRecipes',
          parameters: [
            {
              name: 'category',
              in: 'query',
              description: 'Filter by category',
              schema: { 
                type: 'string',
                enum: ['Beer Cocktails', 'Cocktails', 'Shots & Shooters', 'Mocktails']
              },
              example: 'Cocktails'
            },
            {
              name: 'difficulty',
              in: 'query',
              description: 'Filter by difficulty level',
              schema: { 
                type: 'string',
                enum: ['Easy', 'Medium', 'Hard']
              },
              example: 'Easy'
            },
            {
              name: 'tags',
              in: 'query',
              description: 'Filter by tags (comma-separated)',
              schema: { type: 'string' },
              example: 'classic,citrus'
            },
            {
              name: 'search',
              in: 'query',
              description: 'Search in recipe names and descriptions',
              schema: { type: 'string' },
              example: 'margarita'
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Number of recipes to return (max 100)',
              schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
              example: 20
            },
            {
              name: 'offset',
              in: 'query',
              description: 'Number of recipes to skip',
              schema: { type: 'integer', minimum: 0, default: 0 },
              example: 0
            },
            {
              name: 'sort',
              in: 'query',
              description: 'Sort order',
              schema: { 
                type: 'string',
                enum: ['name', 'createdAt', 'difficulty'],
                default: 'name'
              },
              example: 'name'
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
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          recipes: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Recipe' }
                          },
                          pagination: { $ref: '#/components/schemas/Pagination' }
                        }
                      }
                    }
                  },
                  example: {
                    success: true,
                    data: {
                      recipes: [
                        {
                          id: 'recipe_123',
                          name: 'Classic Margarita',
                          category: 'Cocktails',
                          difficulty: 'Easy',
                          glassware: 'Margarita Glass',
                          ingredients: ['2 oz Tequila', '1 oz Lime Juice', '1 oz Triple Sec'],
                          instructions: 'Shake all ingredients with ice and strain into a chilled glass.',
                          tags: ['classic', 'citrus', 'refreshing'],
                          imageUrl: 'https://example.com/margarita.jpg',
                          createdAt: '2025-01-15T10:30:00Z'
                        }
                      ],
                      pagination: {
                        total: 495,
                        limit: 20,
                        offset: 0,
                        hasMore: true
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Bad Request - Invalid parameters',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            '401': {
              description: 'Unauthorized - Invalid API key or email',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            '429': {
              description: 'Too Many Requests - Rate limit exceeded',
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
          tags: ['Recipes'],
          summary: 'Get recipe by ID',
          description: 'Retrieve a specific recipe by its unique identifier.',
          operationId: 'getRecipeById',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Recipe ID',
              schema: { type: 'string' },
              example: 'recipe_123'
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
                      success: { type: 'boolean', example: true },
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
          tags: ['Categories'],
          summary: 'Get all categories',
          description: 'Retrieve all available recipe categories.',
          operationId: 'getCategories',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Beer Cocktails', 'Cocktails', 'Shots & Shooters', 'Mocktails']
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
          tags: ['Tags'],
          summary: 'Get all tags',
          description: 'Retrieve all available recipe tags.',
          operationId: 'getTags',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['classic', 'citrus', 'refreshing', 'strong', 'sweet']
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
          tags: ['User'],
          summary: 'Get user saved recipes',
          description: 'Retrieve recipes saved by the authenticated user.',
          operationId: 'getUserRecipes',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
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
          tags: ['User'],
          summary: 'Get user badges',
          description: 'Retrieve achievement badges for the authenticated user.',
          operationId: 'getUserBadges',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          badges: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', example: 'badge_123' },
                                name: { type: 'string', example: 'Recipe Master' },
                                description: { type: 'string', example: 'Generated 10 recipes' },
                                icon: { type: 'string', example: '🏆' },
                                unlockedAt: { type: 'string', format: 'date-time' }
                              }
                            }
                          },
                          stats: {
                            type: 'object',
                            properties: {
                              totalBadges: { type: 'integer', example: 15 },
                              unlockedBadges: { type: 'integer', example: 8 }
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading API Documentation...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2>Authentication Required</h2>
        <p>Please sign in to access the API documentation.</p>
        <a 
          href="/login" 
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            marginTop: '20px',
            display: 'inline-block'
          }}
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <SwaggerUI 
      spec={openApiSpec}
      docExpansion="list"
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
        // Enhanced styling for better developer experience
        const style = document.createElement('style');
        style.textContent = `
          .swagger-ui .topbar { display: none; }
          
          /* Header styling */
          .swagger-ui .info { 
            margin: 20px 0 40px 0; 
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            color: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .swagger-ui .info .title { 
            font-size: 3rem; 
            color: white; 
            margin-bottom: 10px;
            font-weight: 700;
          }
          .swagger-ui .info .description { 
            font-size: 1.2rem; 
            color: rgba(255,255,255,0.9); 
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .swagger-ui .info .contact { color: rgba(255,255,255,0.8); }
          .swagger-ui .info .contact a { color: #ffd700; }
          
          /* Authentication section */
          .swagger-ui .auth-container { 
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border: none; 
            border-radius: 12px; 
            padding: 25px; 
            margin: 20px 0;
            color: white;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          .swagger-ui .auth-container h4 { 
            color: white; 
            margin: 0 0 15px 0; 
            font-size: 1.3rem;
            font-weight: 600;
          }
          .swagger-ui .auth-container p { 
            color: rgba(255,255,255,0.9); 
            margin: 0 0 10px 0; 
            font-size: 1rem;
            line-height: 1.5;
          }
          .swagger-ui .auth-container .wrapper { margin: 15px 0; }
          .swagger-ui .auth-container input { 
            border-radius: 8px; 
            border: 2px solid rgba(255,255,255,0.3);
            padding: 12px 16px;
            font-size: 14px;
            background: rgba(255,255,255,0.1);
            color: white;
          }
          .swagger-ui .auth-container input::placeholder { color: rgba(255,255,255,0.7); }
          .swagger-ui .auth-container input:focus { 
            border-color: #ffd700; 
            outline: none;
            background: rgba(255,255,255,0.2);
          }
          .swagger-ui .auth-container .btn { 
            background: #ffd700; 
            color: #333; 
            border: none; 
            border-radius: 8px;
            padding: 12px 24px;
            font-weight: 600;
            margin-top: 10px;
          }
          .swagger-ui .auth-container .btn:hover { 
            background: #ffed4e; 
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255,215,0,0.3);
          }
          
          /* Operation blocks */
          .swagger-ui .opblock { 
            margin: 15px 0; 
            border-radius: 12px; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            border: none;
            overflow: hidden;
          }
          .swagger-ui .opblock .opblock-summary { 
            border-radius: 12px; 
            padding: 20px;
            transition: all 0.3s ease;
          }
          .swagger-ui .opblock .opblock-summary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          
          /* HTTP method colors */
          .swagger-ui .opblock.opblock-get { 
            border-left: 5px solid #10b981; 
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          }
          .swagger-ui .opblock.opblock-get .opblock-summary { 
            border-color: #10b981; 
            background: transparent;
          }
          .swagger-ui .opblock.opblock-get .opblock-summary .opblock-summary-method {
            background: #10b981;
            color: white;
            font-weight: 700;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .swagger-ui .opblock.opblock-post { 
            border-left: 5px solid #3b82f6; 
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          }
          .swagger-ui .opblock.opblock-post .opblock-summary { 
            border-color: #3b82f6; 
            background: transparent;
          }
          .swagger-ui .opblock.opblock-post .opblock-summary .opblock-summary-method {
            background: #3b82f6;
            color: white;
            font-weight: 700;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .swagger-ui .opblock.opblock-put { 
            border-left: 5px solid #f59e0b; 
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          }
          .swagger-ui .opblock.opblock-put .opblock-summary { 
            border-color: #f59e0b; 
            background: transparent;
          }
          .swagger-ui .opblock.opblock-put .opblock-summary .opblock-summary-method {
            background: #f59e0b;
            color: white;
            font-weight: 700;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .swagger-ui .opblock.opblock-delete { 
            border-left: 5px solid #ef4444; 
            background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
          }
          .swagger-ui .opblock.opblock-delete .opblock-summary { 
            border-color: #ef4444; 
            background: transparent;
          }
          .swagger-ui .opblock.opblock-delete .opblock-summary .opblock-summary-method {
            background: #ef4444;
            color: white;
            font-weight: 700;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          /* Operation titles */
          .swagger-ui .opblock .opblock-summary-path {
            font-size: 1.1rem;
            font-weight: 600;
            color: #374151;
            margin-left: 15px;
          }
          .swagger-ui .opblock .opblock-summary-description {
            color: #6b7280;
            font-size: 0.95rem;
            margin-left: 15px;
            margin-top: 5px;
          }
          
          /* Buttons */
          .swagger-ui .btn { 
            border-radius: 8px; 
            font-weight: 600; 
            padding: 10px 20px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
          }
          .swagger-ui .btn.execute { 
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          }
          .swagger-ui .btn.execute:hover { 
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
          }
          .swagger-ui .btn.try-out__btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          }
          .swagger-ui .btn.try-out__btn:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
          }
          
          /* Response styling */
          .swagger-ui .response-col_status { 
            font-weight: 700; 
            font-size: 0.9rem;
          }
          .swagger-ui .response-col_description__inner { 
            font-size: 0.9rem; 
            line-height: 1.5;
          }
          
          /* Code blocks */
          .swagger-ui .model { 
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace; 
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
          }
          .swagger-ui .model-title { 
            color: #374151; 
            font-weight: 700; 
            font-size: 1.1rem;
            margin-bottom: 10px;
          }
          .swagger-ui .prop-name { 
            color: #059669; 
            font-weight: 600; 
          }
          .swagger-ui .prop-type { 
            color: #7c3aed; 
            font-weight: 600;
          }
          
          /* Parameters */
          .swagger-ui .parameter__name { 
            font-weight: 700; 
            color: #374151; 
            font-size: 0.95rem;
          }
          .swagger-ui .parameter__type { 
            color: #7c3aed; 
            font-weight: 600; 
            font-size: 0.9rem;
          }
          .swagger-ui .parameter__deprecated { 
            color: #ef4444; 
            font-weight: 600;
          }
          
          /* Section headers */
          .swagger-ui .opblock-section-header { 
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-bottom: 2px solid #e2e8f0; 
            padding: 20px;
          }
          .swagger-ui .opblock-section-header h4 { 
            color: #374151; 
            font-weight: 700; 
            font-size: 1.2rem;
            margin: 0;
          }
          
          /* Filter box */
          .swagger-ui .filter-container { 
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }
          .swagger-ui .filter-container input { 
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 16px;
            width: 100%;
            transition: all 0.3s ease;
          }
          .swagger-ui .filter-container input:focus { 
            border-color: #3b82f6; 
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          /* Tags */
          .swagger-ui .opblock-tag { 
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            margin: 10px 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }
          .swagger-ui .opblock-tag .opblock-tag-section { 
            padding: 20px;
          }
          .swagger-ui .opblock-tag .opblock-tag-section h4 { 
            color: #374151;
            font-weight: 700;
            font-size: 1.3rem;
            margin: 0;
          }
          
          /* Scrollbar styling */
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
          ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
        `;
        document.head.appendChild(style);
      }}
    />
  );
}
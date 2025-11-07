import { NextRequest, NextResponse } from 'next/server';
import { APIAuthenticator, APIError } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const authenticator = new APIAuthenticator();
    const { user, rateLimit } = await authenticator.authenticateRequest(request);
    
    const documentation = {
      title: 'Elixiary AI API',
      version: '1.0.0',
      description: 'Professional cocktail recipe API for Pro users',
      baseUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.elixiary.com'}/api/v1`,
      authentication: {
        type: 'API Key',
        header: 'x-api-key',
        emailHeader: 'x-user-email',
        format: 'elx_live_[32_characters]'
      },
      rateLimits: {
        requestsPerHour: 100,
        requestsPerDay: 1000,
        requestsPerMonth: 10000,
        burstLimit: 20
      },
      endpoints: {
        recipes: {
          'GET /recipes': {
            description: 'Get cocktail recipes with filtering and pagination',
            parameters: {
              category: 'Filter by category (string)',
              difficulty: 'Filter by difficulty (Easy, Medium, Hard)',
              search: 'Search in name, ingredients, tags (string)',
              tags: 'Filter by tags (comma-separated)',
              page: 'Page number (1-100, default: 1)',
              limit: 'Results per page (1-20, default: 10)'
            },
            example: 'GET /recipes?category=cocktails&difficulty=Easy&page=1&limit=10'
          },
          'GET /recipes/{id}': {
            description: 'Get specific recipe by ID',
            parameters: {
              id: 'Recipe ID (string)'
            },
            example: 'GET /recipes/abc123'
          }
        },
        categories: {
          'GET /categories': {
            description: 'Get all available categories',
            example: 'GET /categories'
          }
        },
        tags: {
          'GET /tags': {
            description: 'Get all available tags',
            example: 'GET /tags'
          }
        },
        user: {
          'GET /user/recipes': {
            description: 'Get user\'s saved recipes',
            parameters: {
              source: 'Filter by source (curated, ai)',
              category: 'Filter by category',
              difficulty: 'Filter by difficulty',
              page: 'Page number',
              limit: 'Results per page'
            },
            example: 'GET /user/recipes?source=curated&page=1&limit=10'
          },
          'POST /user/recipes': {
            description: 'Save a recipe to user collection',
            body: {
              recipeId: 'Recipe ID to save (string)'
            },
            example: 'POST /user/recipes { "recipeId": "abc123" }'
          },
          'DELETE /user/recipes/{id}': {
            description: 'Remove saved recipe from user collection',
            parameters: {
              id: 'Saved recipe ID (string)'
            },
            example: 'DELETE /user/recipes/xyz789'
          },
          'GET /user/badges': {
            description: 'Get user\'s earned badges',
            example: 'GET /user/badges'
          }
        },
        keys: {
          'GET /keys': {
            description: 'Get user\'s API keys',
            example: 'GET /keys'
          },
          'POST /keys': {
            description: 'Create new API key',
            body: {
              name: 'API key name (string)'
            },
            example: 'POST /keys { "name": "My API Key" }'
          },
          'DELETE /keys/{keyId}': {
            description: 'Revoke API key',
            parameters: {
              keyId: 'API key ID (string)'
            },
            example: 'DELETE /keys/elx_live_abc123'
          },
          'POST /keys/{keyId}/rotate': {
            description: 'Rotate API key (generate new key)',
            parameters: {
              keyId: 'API key ID to rotate (string)'
            },
            example: 'POST /keys/elx_live_abc123/rotate'
          }
        }
      },
      responseFormat: {
        success: {
          success: true,
          data: 'Response data',
          meta: {
            requestId: 'Unique request ID',
            timestamp: 'ISO timestamp',
            rateLimit: 'Rate limit information'
          }
        },
        error: {
          success: false,
          error: 'Error message',
          statusCode: 'HTTP status code',
          timestamp: 'ISO timestamp'
        }
      },
      examples: {
        curl: {
          getRecipes: `curl -X GET "${process.env.NEXT_PUBLIC_APP_URL || 'https://www.elixiary.com'}/api/v1/recipes?category=cocktails&limit=5" \\
  -H "x-api-key: elx_live_your_api_key_here" \\
  -H "x-user-email: user@example.com"`,
          saveRecipe: `curl -X POST "${process.env.NEXT_PUBLIC_APP_URL || 'https://www.elixiary.com'}/api/v1/user/recipes" \\
  -H "x-api-key: elx_live_your_api_key_here" \\
  -H "x-user-email: user@example.com" \\
  -H "Content-Type: application/json" \\
  -d '{"recipeId": "abc123"}'`
        },
        javascript: {
          getRecipes: `const response = await fetch('${process.env.NEXT_PUBLIC_APP_URL || 'https://www.elixiary.com'}/api/v1/recipes?category=cocktails&limit=5', {
  headers: {
    'x-api-key': 'elx_live_your_api_key_here',
    'x-user-email': 'user@example.com'
  }
});
const data = await response.json();`
        },
        python: {
          getRecipes: `import requests

headers = {
    'x-api-key': 'elx_live_your_api_key_here',
    'x-user-email': 'user@example.com'
}

response = requests.get('${process.env.NEXT_PUBLIC_APP_URL || 'https://www.elixiary.com'}/api/v1/recipes?category=cocktails&limit=5', headers=headers)
data = response.json()`
        }
      },
      errorCodes: {
        400: 'Bad Request - Invalid parameters',
        401: 'Unauthorized - Invalid API key or email',
        403: 'Forbidden - Insufficient permissions',
        404: 'Not Found - Resource not found',
        409: 'Conflict - Resource already exists',
        413: 'Payload Too Large - Request size exceeds limit',
        429: 'Too Many Requests - Rate limit exceeded',
        500: 'Internal Server Error - Server error'
      },
      support: {
        email: 'api@elixiary.com',
        documentation: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.elixiary.com'}/api/v1/docs`,
        status: 'https://status.elixiary.com'
      }
    };
    
    return NextResponse.json(authenticator.createSuccessResponse(documentation, rateLimit));
    
  } catch (error: any) {
    console.error('Error fetching API documentation:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documentation' },
      { status: 500 }
    );
  }
}

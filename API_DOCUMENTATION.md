# 🍸 Elixiary AI - Open API Documentation

**Version**: 1.1.0  
**Base URL**: `https://www.elixiary.com/api/v1`
**Last Updated**: January 2025

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Rate Limits](#rate-limits)
4. [Endpoints](#endpoints)
5. [Response Format](#response-format)
6. [Error Handling](#error-handling)
7. [Examples](#examples)
8. [SDKs & Libraries](#sdks--libraries)

---

## 🌟 Overview

The Elixiary AI API provides programmatic access to our comprehensive cocktail recipe database, user management features, and AI-powered recipe generation capabilities. This API is designed for Pro subscribers who want to integrate cocktail data into their own applications.

### Key Features
- **495+ Curated Cocktail Recipes** with detailed ingredients and instructions
- **Advanced Filtering** by category, difficulty, tags, and search terms
- **User Recipe Management** for saving and organizing favorites
- **Gamification System** with badges and achievements
- **Real-time Rate Limiting** with usage tracking
- **Comprehensive Documentation** with interactive examples

---

## 🔐 Authentication

### API Key Format
```
elx_live_[32_characters]
```

### Required Headers
All API requests must include these headers:

```http
x-api-key: elx_live_your_api_key_here
x-user-email: your-email@example.com
Content-Type: application/json
```

### Getting API Keys
1. Sign up for a Pro subscription at [www.elixiary.com](https://www.elixiary.com)
2. Go to your Account page
3. Navigate to the "API Keys" section
4. Create a new API key with a descriptive name
5. Copy the key immediately (it's only shown once)

### Security Best Practices
- **Never expose API keys** in client-side code
- **Use environment variables** to store keys securely
- **Rotate keys regularly** for enhanced security (use the rotate endpoint)
- **Monitor usage** through the account dashboard
- **Revoke unused keys** to minimize attack surface

### Enhanced Security Features (January 2025)
- **IP Address Validation**: Strict validation prevents IP spoofing attacks
- **Request Size Limits**: 1MB maximum payload size enforced
- **Timing Attack Protection**: Constant-time cryptographic comparisons
- **NoSQL Injection Prevention**: Comprehensive input sanitization
- **Brute Force Protection**: Automatic blocking after failed attempts
- **Rate Limit Bypass Detection**: Advanced monitoring for suspicious patterns
- **Security Headers**: Full CORS, CSP, HSTS, and other security headers
- **Audit Logging**: Complete security event tracking and monitoring

---

## ⚡ Rate Limits

### Limits per API Key
- **Hourly**: 100 requests
- **Daily**: 1,000 requests  
- **Monthly**: 10,000 requests
- **Burst**: 20 requests per minute

### Rate Limit Headers
Every response includes rate limit information:

```json
{
  "meta": {
    "rateLimit": {
      "requestsPerHour": 45,
      "requestsPerDay": 234,
      "requestsPerMonth": 1234,
      "remainingHourly": 55,
      "remainingDaily": 766,
      "remainingMonthly": 8766,
      "resetTimeHourly": "2025-10-16T20:00:00.000Z",
      "resetTimeDaily": "2025-10-17T00:00:00.000Z",
      "resetTimeMonthly": "2025-11-01T00:00:00.000Z"
    }
  }
}
```

### Exceeding Limits
When rate limits are exceeded, you'll receive a `429 Too Many Requests` response:

```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again later.",
  "retryAfter": 3600
}
```

---

## 🛠️ Endpoints

### 📚 Recipe Endpoints

#### Get All Recipes
```http
GET /recipes
```

**Query Parameters:**
- `category` (string, optional): Filter by category
- `difficulty` (string, optional): Filter by difficulty (Easy, Medium, Hard)
- `search` (string, optional): Search in name, ingredients, tags
- `tags` (string, optional): Filter by tags (comma-separated)
- `page` (number, optional): Page number (1-100, default: 1)
- `limit` (number, optional): Results per page (1-20, default: 10)

**Example:**
```bash
curl -X GET "https://www.elixiary.com/api/v1/recipes?category=Beer%20Cocktails&difficulty=Easy&limit=5" \
  -H "x-api-key: elx_live_your_api_key_here" \
  -H "x-user-email: your-email@example.com"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "hhk7z9swf",
        "name": "110 in the shade",
        "ingredients": [
          {
            "name": "Lager",
            "measure": "16 oz",
            "amount": 16,
            "unit": "oz",
            "ingredient": ""
          },
          {
            "name": "Tequila",
            "measure": "1.5 oz",
            "amount": 1.5,
            "unit": "oz",
            "ingredient": ""
          }
        ],
        "instructions": [
          "Pour 1.5 oz of tequila into a beer glass, then fill with 16 oz of lager."
        ],
        "glassware": "Beer Glass",
        "garnish": "",
        "difficulty": "Easy",
        "category": "Beer Cocktails",
        "tags": ["style_new_era", "flavor_fruity", "strength_moderate", "serve_long", "setting_beach"],
        "imageUrl": "https://drive.google.com/file/d/1meIOQgGSsCAZFwMec3u241rhmrU_GzMg/view?usp=drivesdk",
        "createdAt": "2025-10-13T19:41:48.314Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 17,
      "totalPages": 4,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "meta": {
    "requestId": "req_1760643414370_gwsknhs8z",
    "timestamp": "2025-10-16T19:36:54.370Z",
    "rateLimit": { /* rate limit info */ }
  }
}
```

#### Get Specific Recipe
```http
GET /recipes/{id}
```

**Example:**
```bash
curl -X GET "https://www.elixiary.com/api/v1/recipes/hhk7z9swf" \
  -H "x-api-key: elx_live_your_api_key_here" \
  -H "x-user-email: your-email@example.com"
```

### 🏷️ Category & Tag Endpoints

#### Get All Categories
```http
GET /categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_beer_cocktail",
      "name": "Beer Cocktails",
      "description": "Discover 17 beer cocktails recipes",
      "recipeCount": 17
    },
    {
      "id": "cat_coffee_tea",
      "name": "Coffee & Tea Cocktails",
      "description": "Discover 41 coffee & tea cocktails recipes",
      "recipeCount": 41
    }
  ]
}
```

#### Get All Tags
```http
GET /tags
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "style_classic",
      "name": "Classic",
      "recipeCount": 0
    },
    {
      "id": "flavor_fruity",
      "name": "Fruity",
      "recipeCount": 0
    }
  ]
}
```

### 👤 User-Specific Endpoints

#### Get User's Saved Recipes
```http
GET /user/recipes
```

**Query Parameters:**
- `source` (string, optional): Filter by source (curated, ai)
- `category` (string, optional): Filter by category
- `difficulty` (string, optional): Filter by difficulty
- `page` (number, optional): Page number (1-100, default: 1)
- `limit` (number, optional): Results per page (1-20, default: 10)

**Example:**
```bash
curl -X GET "https://www.elixiary.com/api/v1/user/recipes?source=curated&limit=10" \
  -H "x-api-key: elx_live_your_api_key_here" \
  -H "x-user-email: your-email@example.com"
```

#### Save Recipe to User Collection
```http
POST /user/recipes
```

**Request Body:**
```json
{
  "recipeId": "hhk7z9swf"
}
```

**Example:**
```bash
curl -X POST "https://www.elixiary.com/api/v1/user/recipes" \
  -H "x-api-key: elx_live_your_api_key_here" \
  -H "x-user-email: your-email@example.com" \
  -H "Content-Type: application/json" \
  -d '{"recipeId": "hhk7z9swf"}'
```

#### Remove Saved Recipe
```http
DELETE /user/recipes/{id}
```

**Example:**
```bash
curl -X DELETE "https://www.elixiary.com/api/v1/user/recipes/NeHIddPDqYCq0t9578x9" \
  -H "x-api-key: elx_live_your_api_key_here" \
  -H "x-user-email: your-email@example.com"
```

#### Get User's Badges
```http
GET /user/badges
```

**Example:**
```bash
curl -X GET "https://www.elixiary.com/api/v1/user/badges" \
  -H "x-api-key: elx_live_your_api_key_here" \
  -H "x-user-email: your-email@example.com"
```

### 🔑 API Key Management

#### List User's API Keys
```http
GET /keys
```

**Example:**
```bash
curl -X GET "https://www.elixiary.com/api/v1/keys" \
  -H "x-api-key: elx_live_your_api_key_here" \
  -H "x-user-email: your-email@example.com"
```

#### Create New API Key
```http
POST /keys
```

**Request Body:**
```json
{
  "name": "My Application Key"
}
```

**Example:**
```bash
curl -X POST "https://www.elixiary.com/api/v1/keys" \
  -H "x-api-key: elx_live_your_api_key_here" \
  -H "x-user-email: your-email@example.com" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Application Key"}'
```

#### Revoke API Key
```http
DELETE /keys/{keyId}
```

**Example:**
```bash
curl -X DELETE "https://www.elixiary.com/api/v1/keys/elx_live_abc123" \
  -H "x-api-key: elx_live_your_api_key_here" \
  -H "x-user-email: your-email@example.com"
```

#### Rotate API Key
```http
POST /keys/{keyId}/rotate
```

**Example:**
```bash
curl -X POST "https://www.elixiary.com/api/v1/keys/elx_live_abc123/rotate" \
  -H "x-api-key: elx_live_your_api_key_here" \
  -H "x-user-email: your-email@example.com"
```

### 📖 Documentation Endpoint

#### Get API Documentation
```http
GET /docs
```

**Example:**
```bash
curl -X GET "https://www.elixiary.com/api/v1/docs" \
  -H "x-api-key: elx_live_your_api_key_here" \
  -H "x-user-email: your-email@example.com"
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "requestId": "req_1760643414370_gwsknhs8z",
    "timestamp": "2025-10-16T19:36:54.370Z",
    "rateLimit": {
      "requestsPerHour": 45,
      "requestsPerDay": 234,
      "requestsPerMonth": 1234,
      "remainingHourly": 55,
      "remainingDaily": 766,
      "remainingMonthly": 8766,
      "resetTimeHourly": "2025-10-16T20:00:00.000Z",
      "resetTimeDaily": "2025-10-17T00:00:00.000Z",
      "resetTimeMonthly": "2025-11-01T00:00:00.000Z"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "statusCode": 400,
  "timestamp": "2025-10-16T19:36:54.370Z"
}
```

---

## ❌ Error Handling

### HTTP Status Codes

| Code | Description | Common Causes |
|------|-------------|---------------|
| `200` | Success | Request completed successfully |
| `400` | Bad Request | Invalid parameters or malformed request |
| `401` | Unauthorized | Invalid or missing API key/email |
| `403` | Forbidden | Pro subscription required |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Resource already exists |
| `413` | Payload Too Large | Request size exceeds limit |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |

### Common Error Messages

```json
// Invalid API key (generic for security)
{
  "success": false,
  "error": "Authentication failed"
}

// Missing headers
{
  "success": false,
  "error": "Request failed"
}

// Pro subscription required
{
  "success": false,
  "error": "Request failed"
}

// Rate limit exceeded (with enhanced protection)
{
  "success": false,
  "error": "Rate limit exceeded. Try again later.",
  "retryAfter": 3600
}

// Resource not found
{
  "success": false,
  "error": "Request failed"
}

// Request too large (security enhancement)
{
  "success": false,
  "error": "Request payload too large"
}

// CSRF protection (for state-changing operations)
{
  "success": false,
  "error": "Invalid request origin"
}
```

### Security-Enhanced Error Responses (January 2025)
For security reasons, error messages are now generic to prevent information disclosure. The API returns standardized error responses that don't expose internal system details while maintaining proper HTTP status codes for your application to handle appropriately.

---

## 💡 Examples

### JavaScript/Node.js

```javascript
const API_BASE = 'https://www.elixiary.com/api/v1';
const API_KEY = 'elx_live_your_api_key_here';
const USER_EMAIL = 'your-email@example.com';

// Get all recipes with filtering
async function getRecipes(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE}/recipes?${params}`, {
    headers: {
      'x-api-key': API_KEY,
      'x-user-email': USER_EMAIL,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Save a recipe
async function saveRecipe(recipeId) {
  const response = await fetch(`${API_BASE}/user/recipes`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'x-user-email': USER_EMAIL,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recipeId })
  });
  
  return await response.json();
}

// Usage examples
getRecipes({ category: 'Beer Cocktails', limit: 5 })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

saveRecipe('hhk7z9swf')
  .then(data => console.log('Recipe saved:', data))
  .catch(error => console.error('Error:', error));
```

### Python

```python
import requests
import json

API_BASE = 'https://www.elixiary.com/api/v1'
API_KEY = 'elx_live_your_api_key_here'
USER_EMAIL = 'your-email@example.com'

headers = {
    'x-api-key': API_KEY,
    'x-user-email': USER_EMAIL,
    'Content-Type': 'application/json'
}

# Get all recipes with filtering
def get_recipes(filters=None):
    if filters is None:
        filters = {}
    
    response = requests.get(f'{API_BASE}/recipes', headers=headers, params=filters)
    response.raise_for_status()
    return response.json()

# Save a recipe
def save_recipe(recipe_id):
    data = {'recipeId': recipe_id}
    response = requests.post(f'{API_BASE}/user/recipes', headers=headers, json=data)
    response.raise_for_status()
    return response.json()

# Usage examples
try:
    recipes = get_recipes({'category': 'Beer Cocktails', 'limit': 5})
    print(f"Found {len(recipes['data']['recipes'])} recipes")
    
    result = save_recipe('hhk7z9swf')
    print('Recipe saved successfully')
except requests.exceptions.RequestException as e:
    print(f'Error: {e}')
```

### PHP

```php
<?php
$apiBase = 'https://www.elixiary.com/api/v1';
$apiKey = 'elx_live_your_api_key_here';
$userEmail = 'your-email@example.com';

$headers = [
    'x-api-key: ' . $apiKey,
    'x-user-email: ' . $userEmail,
    'Content-Type: application/json'
];

// Get all recipes with filtering
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

// Save a recipe
function saveRecipe($recipeId) {
    global $apiBase, $headers;
    
    $data = json_encode(['recipeId' => $recipeId]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiBase . '/user/recipes');
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        throw new Exception("HTTP error: $httpCode");
    }
    
    return json_decode($response, true);
}

// Usage examples
try {
    $recipes = getRecipes(['category' => 'Beer Cocktails', 'limit' => 5]);
    echo "Found " . count($recipes['data']['recipes']) . " recipes\n";
    
    $result = saveRecipe('hhk7z9swf');
    echo "Recipe saved successfully\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
```

---

## 📚 SDKs & Libraries

### Official SDKs
Currently, we don't provide official SDKs, but the API is designed to work with standard HTTP libraries in any language.

### Community Libraries
If you create a library for the Elixiary AI API, please let us know so we can list it here!

### Postman Collection
You can import our API collection into Postman for easy testing:

1. Download the collection file
2. Import into Postman
3. Set your API key and email in the collection variables
4. Start making requests!

---

## 🆘 Support

### Getting Help
- **Documentation**: This page and the interactive docs at `/api/v1/docs`
- **Email**: api@elixiary.com
- **Status Page**: https://status.elixiary.com

### Reporting Issues
When reporting issues, please include:
- Your API key (masked: `elx_live_***`)
- The exact request you made
- The response you received
- Any error messages
- Your application environment

### Feature Requests
We welcome feature requests! Please email us at api@elixiary.com with:
- Description of the feature
- Use case and benefits
- Any implementation suggestions

---

## 📄 License

This API is provided as part of your Elixiary AI Pro subscription. Usage is subject to our Terms of Service and Privacy Policy.

---

**Last Updated**: October 2025  
**API Version**: 1.0.0  
**Documentation Version**: 1.0.0

# Firebase Service Account Setup for Vercel

## Required Environment Variables

You need to add these environment variables to your Vercel project:

### Option 1: Complete Service Account JSON (Recommended)
```bash
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"studio-1063505923-cbb37","private_key_id":"417c9e9c01","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@studio-1063505923-cbb37.iam.gserviceaccount.com","client_id":"YOUR_CLIENT_ID","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40studio-1063505923-cbb37.iam.gserviceaccount.com"}
```

### Option 2: Individual Variables
```bash
FIREBASE_PROJECT_ID=studio-1063505923-cbb37
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@studio-1063505923-cbb37.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n
```

## How to Add to Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the variables above
3. Make sure to set them for "Production" environment
4. Redeploy your project

## Quick Test:

After adding the environment variables, you can test the API endpoints:
- https://ai.elixiary.com/api/curated-categories
- https://ai.elixiary.com/api/curated-tags
- https://ai.elixiary.com/api/curated-recipes

These should return JSON data instead of 500 errors.

# Elixiary AI Project Information

## Project Details
- **Project Name**: Elixiary AI - Cocktail Recipe Generator
- **Purpose**: AI-powered cocktail recipe generation app with user authentication

## Cloud Infrastructure
- **GCP Project ID**: `studio-1063505923-cbb37`
- **Firebase Project ID**: `studio-1063505923-cbb37`
- **Account Email**: `opefyre@gmail.com`

## GitHub Repository
- **Repository**: https://github.com/opefyre/elixiary-ai-firebase-studio
- **Account**: `opefyre@gmail.com`
- **Authorization**: Already authorized for CLI operations

## App Architecture (Post-Cleanup)
- **Frontend**: Next.js 15.3.3 with React 18
- **Backend**: Next.js Server Actions
- **AI**: Google Genkit with Gemini 1.0 Pro
- **Authentication**: Firebase Auth (email/password + Google OAuth)
- **Database**: None (stateless app)
- **Hosting**: Ready for Firebase App Hosting or Vercel

## Core Features
1. User authentication (sign up/sign in)
2. AI-powered cocktail recipe generation
3. Random prompt suggestions
4. Responsive UI with modern design

## Tech Stack
- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **Forms**: React Hook Form + Zod validation
- **AI**: Google Genkit + Gemini API
- **Auth**: Firebase Authentication
- **Icons**: Lucide React

## Development Commands
- `npm run dev` - Development server (port 9002)
- `npm run build` - Production build
- `npm run typecheck` - TypeScript validation
- `npm run lint` - ESLint validation

## Deployment Status
- ✅ **Live on Vercel**: https://elixiary-ai-firebase-studio.vercel.app/
- ✅ Automatic deployments from GitHub main branch
- ✅ Cleaned up codebase (60%+ reduction in files)
- ✅ Removed unused dependencies
- ✅ Simplified Firebase configuration (Auth only)
- ✅ TypeScript compilation passes
- ✅ Production build successful
- ✅ No linting errors

## Environment Variables
- **GEMINI_API_KEY**: Google Gemini API key for AI recipe generation
  - Get free key at: https://aistudio.google.com/
  - Free tier: 15 requests/min, 1,500 requests/day
  - Set in Vercel: Project Settings → Environment Variables
- Firebase configuration - Automatically loaded from `src/firebase/config.ts`

## Deployment Platform
- **Platform**: Vercel (Free tier)
- **Framework**: Next.js 15.3.3 with full server-side support
- **Auto-deploy**: Every push to `main` branch triggers automatic deployment
- **Custom domains**: Can be added in Vercel dashboard

## Notes
- App is stateless - no database required
- All recipe generation happens in real-time via AI
- Perfect for free-tier deployment on Vercel
- Automatic CI/CD via Vercel (no GitHub Actions needed)
- Server Actions fully supported for AI functionality

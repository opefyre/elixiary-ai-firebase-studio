# 🍸 Elixiary AI

**AI-Powered Cocktail Recipe Generator**

Generate unique, personalized cocktail recipes with AI. Tell our AI mixologist what you're in the mood for, and it will create a custom cocktail recipe just for you.

🌐 **Live App**: [elixiary.com](https://elixiary.com)

---

## ✨ Features

### 🆓 **Free Tier**
- Generate 10 cocktail recipes per month
- Save up to 20 favorite recipes
- Recipe search and filtering
- Share recipes via copy/share API
- Basic recipe customization

### 👑 **Pro Tier** ($2.49/month or $1.99/month billed annually)
- **Unlimited** recipe generation
- **Unlimited** recipe saves
- **PDF Export** - Beautiful recipe downloads
- **Advanced Customization** - Control complexity, alcohol level, sweetness, dietary preferences
- **Shopping List Generator** - Smart ingredient lists with quantity summing
- **Customer Portal** - Self-service billing management
- **Gamified Badge System** - Earn achievements for your cocktail journey

---

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google OAuth)
- **Payments**: Stripe (subscriptions)
- **AI**: Google Gemini 2.5 Flash
- **Email**: Brevo (Sendinblue)
- **Deployment**: Vercel
- **Analytics**: Google Analytics

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase private key here\n-----END PRIVATE KEY-----\n"

# Next.js Public Variables
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (Brevo)
BREVO_API_KEY=xkeys-your-brevo-api-key

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Security (REQUIRED for API key generation)
API_KEY_SECRET=your-64-character-hex-secret-for-api-key-hashing

# Development
NODE_ENV=development
```

**Important**: The `API_KEY_SECRET` is required for API key generation. Generate a secure 64-character hex string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- Stripe account
- Google AI API key
- Brevo account (for email services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/opefyre/elixiary-ai-firebase-studio.git
   cd elixiary-ai-firebase-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create `.env.local` with your Firebase, Stripe, Google AI, and Brevo credentials.

4. **Run development server**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes (Stripe, badges, recipes)
│   ├── account/           # User account dashboard
│   ├── cocktails/         # Curated recipes pages
│   ├── curated/           # Curated recipes (legacy)
│   ├── pricing/           # Subscription pricing
│   ├── privacy/           # Privacy policy & terms
│   └── recipes/           # User's saved recipes
├── components/            # React components
│   ├── layout/            # Header, footer
│   ├── ui/                # Reusable UI components
│   └── ...                # Feature components
├── firebase/              # Firebase configuration
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (PDF export, badges, etc.)
├── types/                 # TypeScript definitions
└── ai/                    # Google Gemini AI flows
```

---

## 🔐 Security

- **Firebase Security Rules**: Users can only access their own data
- **Stripe Webhook Verification**: All webhooks verified with signatures
- **Environment Variables**: All secrets stored securely in Vercel
- **Authentication**: Google OAuth with Firebase Auth
- **API Protection**: All routes require authentication

---

## 🚀 Deployment

The app is automatically deployed to Vercel on every push to `main` branch.

**Production URL**: https://elixiary.com

---

## 📝 License

This project is private and proprietary. All rights reserved.

---

## 🤝 Support

- **Email**: hello@elixiary.com
- **Website**: [elixiary.com](https://elixiary.com)

---

**Built with ❤️ for cocktail enthusiasts**
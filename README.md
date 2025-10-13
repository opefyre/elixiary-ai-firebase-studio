# 🍸 Elixiary AI

**AI-Powered Cocktail Recipe Generator**

Generate unique, personalized cocktail recipes with AI. Tell our AI mixologist what you're in the mood for, and it will create a custom cocktail recipe just for you.

🌐 **Live App**: [ai.elixiary.com](https://ai.elixiary.com)

---

## ✨ Features

### 🆓 **Free Tier**
- Generate 10 cocktail recipes per month
- Save up to 20 favorite recipes
- Recipe search and filtering
- Share recipes via copy/share API
- Basic recipe customization

### 👑 **Pro Tier** ($4.99/month)
- **Unlimited** recipe generation
- **Unlimited** recipe saves
- **PDF Export** - Beautiful recipe downloads
- **Advanced Customization** - Control complexity, alcohol level, sweetness, dietary preferences
- **Shopping List Generator** - Smart ingredient lists with quantity summing
- **Customer Portal** - Self-service billing management

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google OAuth)
- **Payments**: Stripe (subscriptions)
- **AI**: Google Gemini 2.5 Flash
- **Deployment**: Vercel
- **Analytics**: Google Analytics

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Stripe account
- Google AI API key

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
   Create `.env.local`:
   ```bash
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Google AI
   GOOGLE_AI_API_KEY=your_gemini_api_key
   
   # Stripe (Test Mode)
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # Stripe Price IDs (Test)
   STRIPE_EARLY_BIRD_MONTHLY_PRICE_ID=price_test_...
   STRIPE_EARLY_BIRD_ANNUAL_PRICE_ID=price_test_...
   STRIPE_PRO_MONTHLY_PRICE_ID=price_test_...
   STRIPE_PRO_ANNUAL_PRICE_ID=price_test_...
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

---

## 🔧 Production Setup

### Stripe Live Mode

1. **Complete Stripe account setup** (business info, bank details, verification)
2. **Get live API keys** from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. **Create live products** using `scripts/setup-stripe-live.ts`:
   ```bash
   export STRIPE_SECRET_KEY=sk_live_your_key_here
   npx tsx scripts/setup-stripe-live.ts
   ```
4. **Update Vercel environment variables** with live keys and price IDs
5. **Configure live webhook** pointing to `https://ai.elixiary.com/api/stripe/webhook`
6. **Redeploy** the application

### Firebase Setup

1. **Deploy Firestore rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Configure authorized domains** in Firebase Console:
   - `ai.elixiary.com`
   - `localhost` (for development)

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/stripe/        # Stripe webhook & checkout
│   ├── account/          # User account dashboard
│   ├── pricing/          # Subscription pricing
│   ├── privacy/          # Privacy policy & terms
│   └── recipes/          # User's saved recipes
├── components/            # React components
│   ├── layout/           # Header, footer
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── firebase/             # Firebase configuration
├── lib/                  # Utilities (PDF export, analytics)
└── types/                # TypeScript definitions
```

---

## 🔐 Security

- **Firebase Security Rules**: Users can only access their own data
- **Stripe Webhook Verification**: All webhooks verified with signatures
- **Environment Variables**: All secrets stored securely in Vercel
- **Authentication**: Google OAuth with Firebase Auth
- **API Protection**: All routes require authentication

---

## 📊 Analytics & Monitoring

- **Google Analytics**: Page views, user interactions
- **Custom Events**: Recipe generation, subscriptions, feature usage
- **Stripe Dashboard**: Payment monitoring, subscription analytics
- **Firebase Console**: User data, error monitoring
- **Vercel Analytics**: Performance, deployment monitoring

---

## 🚀 Deployment

The app is automatically deployed to Vercel on every push to `main` branch.

**Production URL**: https://ai.elixiary.com

---

## 📝 License

This project is private and proprietary. All rights reserved.

---

## 🤝 Support

- **Email**: hello@elixiary.com
- **Website**: [ai.elixiary.com](https://ai.elixiary.com)

---

**Built with ❤️ for cocktail enthusiasts**
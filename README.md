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
   Create `.env.local` with your Firebase, Stripe, and Google AI credentials.

4. **Run development server**
   ```bash
   npm run dev
   ```

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
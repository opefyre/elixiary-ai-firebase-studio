# Elixiary AI 🍸

**AI-powered cocktail recipe generator** - Create unique, personalized cocktail recipes with artificial intelligence.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://ai.elixiary.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 🌐 [Try it Live →](https://ai.elixiary.com/)

Generate custom cocktail recipes by describing what you're in the mood for. Our AI mixologist will create unique recipes with detailed instructions, ingredient lists, and professional tips.

## ✨ Features

### 🆓 Free Tier
- 🤖 **AI Recipe Generation** - 10 recipes/month powered by Google Gemini 2.5
- 💾 **Save Recipes** - Store up to 20 recipes
- 🔍 **Search & Filter** - Find recipes by ingredients or tags
- 🏷️ **Custom Tags** - Organize recipes your way
- ⭐ **Favorites** - Star your best recipes
- 📤 **Share & Copy** - Share recipes instantly

### 💎 Pro Tier
- ✨ **Unlimited Recipes** - Generate & save as many as you want
- 🛒 **Smart Shopping Lists** - Auto-sum ingredients from multiple recipes
- 📄 **PDF Export** - Beautiful formatted recipe cards
- 🎨 **Advanced Customization** - Fine-tune complexity & flavors
- 🖼️ **Recipe Visuals** - Unique gradient visuals for each cocktail
- 🎯 **Priority Support** - Get help faster

### 🔥 Special Offer
**70% OFF for first 50 users!** 
- Monthly: $1.49/month (reg. $4.99)
- Annual: $14.99/year (reg. $49)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **AI**: Google Genkit + Gemini 2.5 Flash
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Payments**: Stripe
- **Hosting**: Vercel
- **Analytics**: Google Analytics

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/opefyre/elixiary-ai-firebase-studio.git
cd elixiary-ai-firebase-studio

# Install dependencies
npm install

# Set environment variables
# Create .env.local with:
# - GEMINI_API_KEY=SECRET
# - Firebase config
# - Stripe keys (for Pro features)

# Run development server
npm run dev
```

Visit `http://localhost:9002`

## 🏗️ Project Structure

```
src/
├── ai/              # Google Genkit AI flows
├── app/             # Next.js App Router pages
├── components/      # React components
├── firebase/        # Firebase configuration & hooks
├── lib/             # Utility functions
└── types/           # TypeScript type definitions
```

## 🔐 Environment Variables

```env
# Required
GEMINI_API_KEY=SECRET

# Firebase (required)
NEXT_PUBLIC_FIREBASE_CONFIG=SECRET

# Stripe (optional - for Pro features)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_EARLY_BIRD_MONTHLY_PRICE_ID=price_...
STRIPE_EARLY_BIRD_ANNUAL_PRICE_ID=price_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-...
```

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## 🔒 Security

- Firebase Authentication for secure user management
- Firestore security rules for data protection
- Stripe webhook signature verification
- Server-side subscription validation
- No sensitive data in client-side code

## 📄 License

MIT License - feel free to use this project as you like.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

- **Website**: [ai.elixiary.com](https://ai.elixiary.com)
- **Issues**: [GitHub Issues](https://github.com/opefyre/elixiary-ai-firebase-studio/issues)

---

Made with ❤️ using Next.js, Firebase, Stripe, and AI

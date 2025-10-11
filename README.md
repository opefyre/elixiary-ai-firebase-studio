# Elixiary AI - AI-Powered Cocktail Recipe Generator 🍸

Generate unique cocktail recipes with AI! Tell our AI mixologist what you're in the mood for, and it will create a custom cocktail recipe just for you.

## 🌐 Live Demo
**Visit the app**: [https://elixiary-ai-firebase-studio.vercel.app/](https://elixiary-ai-firebase-studio.vercel.app/)

## ✨ Features
- 🤖 **AI-Powered Recipe Generation** - Uses Google Gemini to create unique cocktail recipes
- 🔐 **User Authentication** - Email/password and Google OAuth sign-in
- 🎲 **Random Suggestions** - Get inspiration with pre-made prompt suggestions
- 🎨 **Modern UI** - Clean, responsive design with dark mode
- ⚡ **Real-time Generation** - No database needed, all recipes generated on-demand

## 🛠️ Tech Stack
- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **AI**: Google Genkit + Gemini 1.0 Pro
- **Auth**: Firebase Authentication
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Gemini API key ([Get one here](https://aistudio.google.com/))

### Installation
```bash
# Clone the repository
git clone https://github.com/opefyre/elixiary-ai-firebase-studio.git
cd elixiary-ai-firebase-studio

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
# GEMINI_API_KEY=your_gemini_api_key_here

# Run development server
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002) to see the app.

## 📦 Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type checking with TypeScript

## 🌍 Deployment
This app is deployed on Vercel with automatic deployments from the `main` branch.

## 📄 License
MIT

## 👤 Author
**opefyre** - [GitHub](https://github.com/opefyre)

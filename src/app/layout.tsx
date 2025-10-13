import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OfflineWarning } from "@/components/offline-warning";
import { FirebaseClientProvider } from "@/firebase";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { AuthGuard } from "@/components/auth-guard";
import { Citrus, GlassWater, Martini, Sprout } from "lucide-react";

export const metadata: Metadata = {
  metadataBase: new URL('https://ai.elixiary.com'),
  title: {
    default: 'Elixiary AI - AI-Powered Cocktail Recipe Generator',
    template: '%s | Elixiary AI',
  },
  description: 'Generate unique cocktail recipes with AI! Tell our AI mixologist what you\'re in the mood for, and it will create a custom cocktail recipe just for you. Free cocktail recipe generator powered by Google Gemini.',
  keywords: [
    'cocktail recipes',
    'AI cocktail generator',
    'mixology',
    'cocktail recipe generator',
    'drink recipes',
    'AI mixologist',
    'free cocktail recipes',
    'custom cocktail creator',
    'bartending',
    'cocktail ideas',
  ],
  authors: [{ name: 'Elixiary AI' }],
  creator: 'Elixiary AI',
  publisher: 'Elixiary AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai.elixiary.com',
    title: 'Elixiary AI - AI-Powered Cocktail Recipe Generator',
    description: 'Generate unique cocktail recipes with AI! Free cocktail recipe generator powered by Google Gemini.',
    siteName: 'Elixiary AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elixiary AI - AI-Powered Cocktail Recipe Generator',
    description: 'Generate unique cocktail recipes with AI!',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'jJBxd9g_0PuMLy9qlE-KqNfs4hfQVqb8bBWuIjD3p-Q',
    other: {
      'msvalidate.01': '99FF65807C300F99D988A4FFD56374FE',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <GoogleAnalytics />
        <FirebaseClientProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <div className="relative min-h-screen flex flex-col">
            <div className="absolute top-1/4 left-1/4 h-32 w-32 animate-float text-primary/10 [animation-delay:-2s]">
              <Martini className="h-full w-full" />
            </div>
            <div className="absolute bottom-1/4 right-1/4 h-24 w-24 animate-float text-primary/10 [animation-delay:-4s]">
              <Citrus className="h-full w-full" />
            </div>
            <div className="absolute bottom-1/3 left-[15%] h-20 w-20 animate-float text-primary/10 [animation-delay:-6s]">
              <GlassWater className="h-full w-full" />
            </div>
            <div className="absolute top-1/3 right-[20%] h-28 w-28 animate-float text-primary/10">
              <Sprout className="h-full w-full" />
            </div>
            <main id="main-content" className="relative z-10 flex-1">
              <AuthGuard>{children}</AuthGuard>
            </main>
            <Footer />
          </div>
          <Toaster />
          <OfflineWarning />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

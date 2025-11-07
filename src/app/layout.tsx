import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "../styles/mobile-pwa.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/layout/footer";
import { OfflineWarning } from "@/components/offline-warning";
import { FirebaseClientProvider } from "@/firebase";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/google-tag-manager";
import { Citrus, GlassWater, Martini, Sprout } from "lucide-react";
import { config } from "@/lib/config";
import { getNonce } from "@/lib/nonce";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(config.baseUrl),
  alternates: {
    canonical: config.baseUrl,
  },
  title: {
    default: 'Elixiary AI - Free AI Cocktail Generator',
    template: '%s | Elixiary AI',
  },
  description: 'Generate unique cocktail recipes with AI! Tell our AI mixologist what you\'re in the mood for, and it will create a custom cocktail recipe just for you. Free cocktail recipe generator powered by Google Gemini. Discover 500+ curated recipes and create unlimited AI cocktails.',
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
    'cocktail database',
    'mixology app',
    'cocktail inspiration',
    'drink mixing',
    'cocktail ingredients',
    'bartender tools',
    'cocktail collection',
    'alcoholic beverages',
    'cocktail trends',
    'mixology guide',
  ],
  authors: [{ name: 'Elixiary AI', url: config.baseUrl }],
  creator: 'Elixiary AI',
  publisher: 'Elixiary AI',
  applicationName: 'Elixiary AI',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.baseUrl,
    title: 'Elixiary AI - Free AI Cocktail Generator',
    description: 'Generate unique cocktail recipes with AI! Free cocktail recipe generator powered by Google Gemini. Discover 500+ curated recipes and create unlimited AI cocktails.',
    siteName: 'Elixiary AI',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Elixiary AI - AI-Powered Cocktail Recipe Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elixiary AI - Free AI Cocktail Generator',
    description: 'Generate unique cocktail recipes with AI! Free cocktail recipe generator powered by Google Gemini.',
    creator: '@elixiary_ai',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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
  category: 'food',
  classification: 'Cocktail Recipe Generator',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Elixiary',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#8b5cf6',
    'msapplication-config': '/browserconfig.xml',
    'format-detection': 'telephone=no',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8b5cf6' },
    { media: '(prefers-color-scheme: dark)', color: '#8b5cf6' },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = await getNonce();
  return (
    <html
      lang="en"
      className={cn("dark", inter.variable, plusJakartaSans.variable)}
    >
      <head>
        {/* Nonce for CSP */}
        <meta name="nonce" content={nonce} />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* iOS PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Elixiary" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-orientations" content="portrait" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://drive.google.com" />
        <link rel="dns-prefetch" href="https://drive.google.com" />
        <link
          rel="preconnect"
          href="https://lh3.googleusercontent.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Elixiary AI",
              "description": "AI-Powered Cocktail Recipe Generator",
              "url": config.baseUrl,
              "applicationCategory": "Food & Drink",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free tier available"
              },
              "creator": {
                "@type": "Organization",
                "name": "Elixiary AI",
                "url": config.baseUrl
              },
              "featureList": [
                "AI Cocktail Recipe Generation",
                "500+ Curated Cocktail Recipes",
                "Save and Organize Recipes",
                "Shopping List Generation",
                "PDF Export",
                "Mobile Responsive Design"
              ]
            })
          }}
        />
        <GoogleTagManager nonce={nonce} />
      </head>
      <body className={cn(inter.className, "font-body antialiased")}>
        <GoogleTagManagerNoScript />
        <GoogleAnalytics nonce={nonce} />
        <FirebaseClientProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          
          {/* Desktop Header */}
          <div className="hidden md:block">
            <Header />
          </div>
          
          <div className="relative min-h-screen flex flex-col ios-viewport-fix mobile-content-container">
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
            <main id="main-content" className="relative z-10 flex-1 mobile-body-padding">
              {children}
            </main>
            
            {/* Desktop Footer */}
            <div className="hidden md:block">
              <Footer />
            </div>
            
            {/* Mobile Bottom Navigation */}
            <div className="md:hidden">
              <BottomNav />
            </div>
          </div>
          <Toaster />
          <OfflineWarning />
        </FirebaseClientProvider>
        
        {/* Mobile Viewport Height Fix */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              // Fix for mobile viewport height issues (especially iOS)
              const updateViewportHeight = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', vh + 'px');
              };

              let scheduled = false;
              const scheduleViewportUpdate = () => {
                if (scheduled) {
                  return;
                }

                scheduled = true;
                requestAnimationFrame(() => {
                  scheduled = false;
                  updateViewportHeight();
                });
              };

              // Set initial viewport height
              updateViewportHeight();

              // Update on resize and orientation change
              window.addEventListener('resize', scheduleViewportUpdate, { passive: true });
              window.addEventListener('orientationchange', () => {
                scheduled = false;
                setTimeout(scheduleViewportUpdate, 100);
              });

              // Fix for iOS PWA status bar
              if (window.navigator.standalone === true) {
                document.documentElement.classList.add('ios-pwa');
              }

              // Also detect iOS PWA by checking for specific iOS features
              if (/iPad|iPhone|iPod/.test(navigator.userAgent) && window.navigator.standalone !== false) {
                document.documentElement.classList.add('ios-pwa');
              }
            `,
          }}
        />
        
        {/* Service Worker Registration */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      // Service Worker registered successfully
                    })
                    .catch(function(error) {
                      // Service Worker registration failed
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
// Build trigger Mon Oct 20 22:09:56 WEST 2025
// Deployment test Mon Oct 20 22:39:44 WEST 2025

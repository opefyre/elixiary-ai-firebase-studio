import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { OfflineWarning } from "@/components/offline-warning";
import { FirebaseClientProvider } from "@/firebase";
import { Citrus, GlassWater, Martini, Sprout } from "lucide-react";

export const metadata: Metadata = {
  title: "Elixiary",
  description: "AI-powered cocktail recipe discovery.",
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
        <FirebaseClientProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <div className="relative">
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
            <main id="main-content" className="relative z-10">{children}</main>
          </div>
          <Toaster />
          <OfflineWarning />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

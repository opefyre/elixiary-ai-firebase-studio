import Link from "next/link";
import { Martini, Heart, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Martini className="h-6 w-6 text-primary" />
              <span className="font-headline text-lg font-bold">Elixiary AI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your AI-powered cocktail companion. Craft unique recipes, discover new flavors, and become your own mixologist.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Generate Recipes
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-primary transition-colors">
                  My Recipes
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy & Terms
                </Link>
              </li>
              <li>
                <a href="mailto:support@elixiary.com" className="hover:text-primary transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="mailto:feedback@elixiary.com" className="hover:text-primary transition-colors">
                  Send Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/elixiaryai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/opefyre/elixiary-ai-firebase-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="View source on GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@elixiary.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Send us an email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} Elixiary AI. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-current" />
              <span>for cocktail enthusiasts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

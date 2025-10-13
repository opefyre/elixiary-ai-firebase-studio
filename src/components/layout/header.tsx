import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { AuthButton } from "@/components/auth-button";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Logo className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold leading-none font-headline">Elixiary</h1>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/curated">Curated Recipes</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pricing" className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="hidden sm:inline">Pricing</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/privacy">Privacy & Terms</Link>
          </Button>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

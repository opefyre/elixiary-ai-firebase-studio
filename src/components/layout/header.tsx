import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { AuthButton } from "@/components/auth-button";
import { BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold leading-none font-headline">Elixiary</h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/recipes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">My Recipes</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </Link>
          </Button>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

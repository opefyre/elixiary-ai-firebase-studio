import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { GraduationCap, Wine } from "lucide-react";

export function HeaderFallback() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b bg-background/80 backdrop-blur-md mobile-navbar-fix">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo width={24} height={24} className="h-6 w-6" />
          <span className="text-lg font-bold leading-none font-headline">Elixiary</span>
        </Link>

        <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cocktails">
              <Wine className="mr-2 h-4 w-4" />
              Cocktails
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/education">
              <GraduationCap className="mr-2 h-4 w-4" />
              Education
            </Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-2 text-muted-foreground">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cocktails">
              <Wine className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/education">
              <GraduationCap className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}


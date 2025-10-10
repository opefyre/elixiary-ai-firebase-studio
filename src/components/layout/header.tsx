import Link from "next/link";
import { Moon, Search, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/icons/logo";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold leading-none font-headline">Elixiary</h1>
            <p className="text-[0.75rem] font-semibold uppercase tracking-widest text-primary/80">
              AI Assistant
            </p>
          </div>
        </Link>
        <div className="flex flex-1 justify-end items-center gap-2 md:gap-4">
          <div className="relative w-full max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
                type="search"
                placeholder="Search recipes..."
                className="h-10 w-full rounded-full bg-muted pl-10 pr-10 text-base md:text-sm"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full text-base">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { Logo } from "@/components/icons/logo";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-[1.5rem] font-bold leading-none font-headline">Elixiary</h1>
            <p className="text-[0.75rem] font-semibold uppercase tracking-widest text-primary/80">
              AI Assistant
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

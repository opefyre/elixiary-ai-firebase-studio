import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { AuthButton } from "@/components/auth-button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold leading-none font-headline">Elixiary</h1>
        </Link>
        <AuthButton />
      </div>
    </header>
  );
}

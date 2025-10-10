import { Logo } from "@/components/icons/logo";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-center text-center sm:justify-start">
        <div className="flex items-center gap-4">
          <Logo className="h-10 w-10 text-primary" />
          <div>
            <h1 className="font-headline text-2xl font-bold text-primary">
              Elixiary
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
              AI Assistant
            </p>          
          </div>
        </div>
      </div>
    </header>
  );
}

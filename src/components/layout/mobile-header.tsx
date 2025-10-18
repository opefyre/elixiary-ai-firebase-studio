'use client';

import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useUser } from "@/firebase";
import { useSubscription } from "@/firebase/firestore/use-subscription";

export function MobileHeader() {
  const { user } = useUser();
  const { subscription } = useSubscription();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border mobile-header">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Logo className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold leading-none font-headline">Elixiary</h1>
        </Link>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Search className="h-4 w-4" />
          </Button>
          {user && (
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/firebase";
import { useSubscription } from "@/firebase/firestore/use-subscription";
import {
  Home,
  Wine,
  BookOpen,
  Code,
  GraduationCap,
  BadgeDollarSign,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNavClient() {
  const pathname = usePathname();
  const { user } = useUser();
  const { subscription } = useSubscription();

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/cocktails",
      icon: Wine,
      label: "Cocktails",
      active: pathname.startsWith("/cocktails"),
    },
    {
      href: "/recipes",
      icon: BookOpen,
      label: "My Recipes",
      active: pathname.startsWith("/recipes"),
      requireAuth: true,
    },
    {
      href: "/education",
      icon: GraduationCap,
      label: "Education",
      active: pathname.startsWith("/education"),
    },
    {
      href: "/api/docs",
      icon: Code,
      label: "API",
      active: pathname.startsWith("/api/docs"),
      requireAuth: true,
      requirePro: true,
    },
    {
      href: "/pricing",
      icon: BadgeDollarSign,
      label: "Pricing",
      active: pathname.startsWith("/pricing"),
    },
    {
      href: user ? "/account" : "/login",
      icon: User,
      label: user ? "Account" : "Sign In",
      active: pathname.startsWith("/account") || pathname.startsWith("/login"),
    },
  ];

  const visibleItems = navItems.filter((item) => {
    if (item.requireAuth && !user) return false;
    if (item.requirePro && subscription?.tier !== "pro") return false;
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border bottom-nav">
      <div className="flex items-center justify-around px-2 py-3 h-full">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1 h-full",
                item.active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


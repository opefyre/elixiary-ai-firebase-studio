import { Suspense } from "react";
import { HeaderFallback } from "@/components/layout/header";
import { BottomNavFallback } from "@/components/layout/bottom-nav";
import { AppChromeClientBoundary } from "@/components/layout/app-chrome-boundary.client";

export function AppChrome() {
  return (
    <Suspense
      fallback={
        <>
          <div className="hidden md:block">
            <HeaderFallback />
          </div>
          <div className="md:hidden">
            <BottomNavFallback />
          </div>
        </>
      }
    >
      <AppChromeClientBoundary />
    </Suspense>
  );
}


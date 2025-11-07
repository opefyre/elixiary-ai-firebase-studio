import dynamic from "next/dynamic";
import { Suspense } from "react";
import { HeaderFallback } from "@/components/layout/header";
import { BottomNavFallback } from "@/components/layout/bottom-nav";

const AppChromeClient = dynamic(
  () => import("@/components/layout/app-chrome.client").then((mod) => mod.AppChromeClient),
  { ssr: false }
);

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
      <AppChromeClient />
    </Suspense>
  );
}


'use client';

import dynamic from "next/dynamic";

const AppChromeClient = dynamic(
  () => import("@/components/layout/app-chrome.client").then((mod) => mod.AppChromeClient),
  { ssr: false }
);

export function AppChromeClientBoundary() {
  return <AppChromeClient />;
}

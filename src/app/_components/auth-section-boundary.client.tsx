'use client';

import dynamic from "next/dynamic";

const AuthSectionWithProvider = dynamic(
  () => import("./auth-section.with-provider.client").then((mod) => mod.AuthSectionWithProvider),
  { ssr: false }
);

export function AuthSectionClientBoundary() {
  return <AuthSectionWithProvider />;
}

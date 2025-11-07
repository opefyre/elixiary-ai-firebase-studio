import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AuthSectionFallback } from "./auth-section-fallback";

const AuthSectionClientBoundary = dynamic(
  () => import("./auth-section.with-provider.client").then((mod) => mod.AuthSectionWithProvider),
  { ssr: false }
);

export function AuthSection() {
  return (
    <Suspense fallback={<AuthSectionFallback />}>
      <AuthSectionClientBoundary />
    </Suspense>
  );
}


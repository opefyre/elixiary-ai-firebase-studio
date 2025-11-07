import { Suspense } from "react";
import { AuthSectionFallback } from "./auth-section-fallback";
import { AuthSectionClientBoundary } from "./auth-section-boundary.client";

export function AuthSection() {
  return (
    <Suspense fallback={<AuthSectionFallback />}>
      <AuthSectionClientBoundary />
    </Suspense>
  );
}


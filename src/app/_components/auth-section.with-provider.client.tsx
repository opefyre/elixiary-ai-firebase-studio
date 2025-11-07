'use client';

import { AppClientProviders } from "@/components/providers/app-client-providers";
import { AuthSection } from "./auth-section.client";

export function AuthSectionWithProvider() {
  return (
    <AppClientProviders>
      <AuthSection />
    </AppClientProviders>
  );
}


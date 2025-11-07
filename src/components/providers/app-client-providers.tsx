'use client';

import { ReactNode } from "react";
import { FirebaseClientProvider } from "@/firebase";

interface AppClientProvidersProps {
  children: ReactNode;
}

export function AppClientProviders({ children }: AppClientProvidersProps) {
  return <FirebaseClientProvider>{children}</FirebaseClientProvider>;
}


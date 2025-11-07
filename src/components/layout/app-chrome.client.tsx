'use client';

import { Fragment } from "react";
import { AppClientProviders } from "@/components/providers/app-client-providers";
import { HeaderClient } from "@/components/layout/header";
import { BottomNavClient } from "@/components/layout/bottom-nav";

export function AppChromeClient() {
  return (
    <AppClientProviders>
      <Fragment>
        <div className="hidden md:block">
          <HeaderClient />
        </div>
        <div className="md:hidden">
          <BottomNavClient />
        </div>
      </Fragment>
    </AppClientProviders>
  );
}


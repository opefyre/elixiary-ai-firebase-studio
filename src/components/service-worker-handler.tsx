'use client';

import { useEffect } from 'react';

export function ServiceWorkerHandler() {
  useEffect(() => {
    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'FORCE_RELOAD') {
          // Force reload to get fresh JavaScript
          window.location.reload();
        }
      });
    }
  }, []);

  return null; // This component doesn't render anything
}

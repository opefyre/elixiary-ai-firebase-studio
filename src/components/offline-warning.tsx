"use client";

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineWarning() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Check on mount
    if (typeof window !== 'undefined' && 'onLine' in navigator) {
      setIsOffline(!navigator.onLine);
    }
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div
      role="alert"
      className="offline-warning-safe-area fixed z-[100] flex items-center gap-3 rounded-lg bg-destructive py-4 pl-4 text-destructive-foreground shadow-lg"
    >
      <WifiOff className="h-5 w-5" />
      <div className="text-sm font-medium">
        <p>You are currently offline.</p>
        <p className="text-xs opacity-80">Some features may be unavailable.</p>
      </div>
    </div>
  );
}

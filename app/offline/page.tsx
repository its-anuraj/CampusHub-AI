'use client';

import { WifiOff, RefreshCw, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflineFallbackPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="p-4 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
        <WifiOff className="w-16 h-16" />
      </div>

      <div className="max-w-md space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          You are currently offline
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          It looks like your internet connection was interrupted. Check your campus Wi-Fi or mobile data network to sync live university updates.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Retry Connection
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-foreground text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
        >
          <Home className="w-4 h-4" /> Return to CampusHub Home
        </Link>
      </div>
    </div>
  );
}

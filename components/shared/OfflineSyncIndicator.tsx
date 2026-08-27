'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { offlineSyncEngine } from '@/lib/offlineSync';

export function OfflineSyncIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const checkState = () => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      setQueueCount(offlineSyncEngine.getQueue().length);
    }
  };

  useEffect(() => {
    checkState();
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(checkState, 8000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const triggerSync = async () => {
    setSyncing(true);
    try {
      await offlineSyncEngine.syncQueue();
      checkState();
    } finally {
      setSyncing(false);
    }
  };

  if (isOnline && queueCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xl backdrop-blur-xl border transition ${
          !isOnline
            ? 'bg-amber-950/90 text-amber-300 border-amber-500/40'
            : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
        }`}
      >
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Offline Mode ({queueCount} changes queued)</span>
          </>
        ) : (
          <>
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>Online • Syncing {queueCount} changes...</span>
            <button
              onClick={triggerSync}
              disabled={syncing}
              className="ml-1 p-1 bg-emerald-800/60 hover:bg-emerald-700 rounded text-white"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

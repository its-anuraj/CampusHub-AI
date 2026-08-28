'use client';

import React, { useState, useEffect } from 'react';
import { campusEventBus, CampusLiveEvent } from '@/lib/eventBus';
import { Radio, X, Bell, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

export function LiveEventStreamWidget() {
  const [latestEvent, setLatestEvent] = useState<CampusLiveEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = campusEventBus.subscribe('ALL', (event) => {
      setLatestEvent(event);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(timer);
    });

    // Auto trigger initial heartbeat
    const interval = setInterval(() => {
      campusEventBus.publish({
        id: `ev-${Date.now()}`,
        type: 'IOT_TELEMETRY',
        title: 'Campus Solar Micro-Grid',
        description: 'Generating 742 kW clean rooftop solar power right now.',
        timestamp: new Date().toLocaleTimeString(),
        severity: 'SUCCESS'
      });
    }, 45000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  if (!visible || !latestEvent) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 border border-indigo-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5">
            <Radio className="w-4 h-4 animate-pulse text-indigo-400" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1">
              Live Campus Stream • {latestEvent.timestamp}
            </div>
            <div className="text-xs font-bold text-white">{latestEvent.title}</div>
            <p className="text-[11px] text-slate-300 leading-snug">{latestEvent.description}</p>
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

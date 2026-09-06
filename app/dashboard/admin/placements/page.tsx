'use client';

import { Sparkles, Construction } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="text-center max-w-md w-full bg-slate-900/90 border-2 border-amber-500/70 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden ring-4 ring-amber-500/10">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20 text-slate-950">
          <Construction className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Feature In Development</span>
        </div>
        <h2 className="text-white font-black text-2xl mb-2 tracking-tight">Coming Soon</h2>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          This module is under active development and scheduled for upcoming deployment.<br />Check back soon!
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  Keyboard,
  Command,
  Search,
  Sparkles,
  Printer,
  Moon,
  Bell,
  PanelLeft,
  X,
  Laptop,
  Apple
} from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS = [
  {
    group: 'Navigation & Search',
    items: [
      { mac: '⌘ + K', win: 'Ctrl + K', desc: 'Open Command Palette & Global Omni Search' },
      { mac: '⌘ + B', win: 'Ctrl + B', desc: 'Toggle Left Collapsible Sidebar' },
      { mac: 'Shift + ?', win: 'Shift + ?', desc: 'Display Keyboard Shortcuts Cheat Sheet' },
      { mac: 'Esc', win: 'Esc', desc: 'Dismiss Active Modal / Drawer Overlay' }
    ]
  },
  {
    group: 'AI & Productivity',
    items: [
      { mac: '⌘ + J', win: 'Ctrl + J', desc: 'Trigger CampusHub AI Study Copilot' },
      { mac: '⌘ + P', win: 'Ctrl + P', desc: 'Print High-Res Marksheet & Digital ID Badge' },
      { mac: '⌘ + N', win: 'Ctrl + N', desc: 'Open Global Notification Center Drawer' }
    ]
  }
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const platform = window.navigator?.platform || window.navigator?.userAgent || '';
      setIsMac(/Mac|iPhone|iPad|iPod/i.test(platform));
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Keyboard Shortcuts & Hotkeys</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Power navigation shortcuts for maximum productivity</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* OS helper info banner */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="font-medium">Current Platform:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {isMac ? 'Apple macOS (⌘ Command)' : 'Windows / Linux (Ctrl Key)'}
            </span>
          </div>
          <button
            onClick={() => setIsMac(!isMac)}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Switch to {isMac ? 'Windows (Ctrl)' : 'Mac (⌘)'}
          </button>
        </div>

        <div className="space-y-4">
          {SHORTCUT_GROUPS.map((grp) => (
            <div key={grp.group} className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {grp.group}
              </span>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {grp.items.map((item, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{item.desc}</span>
                    <kbd className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-xs">
                      {isMac ? item.mac : item.win}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] text-slate-400">
            💡 Symbol <strong className="text-slate-700 dark:text-slate-300">⌘</strong> = Mac Command key (<strong className="text-slate-700 dark:text-slate-300">Ctrl</strong> on Windows)
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
          >
            Got it, continue
          </button>
        </div>
      </div>
    </div>
  );
}

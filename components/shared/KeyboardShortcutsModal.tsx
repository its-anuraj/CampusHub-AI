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
  X
} from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS = [
  {
    group: 'Navigation & Search',
    items: [
      { key: '⌘ + K', desc: 'Open Command Palette & Global Omni Search' },
      { key: '⌘ + B', desc: 'Toggle Left Collapsible Sidebar' },
      { key: 'Shift + ?', desc: 'Display Keyboard Shortcuts Cheat Sheet' },
      { key: 'Esc', desc: 'Dismiss Active Modal / Drawer Overlay' }
    ]
  },
  {
    group: 'AI & Productivity',
    items: [
      { key: '⌘ + J', desc: 'Trigger CampusHub AI Study Copilot' },
      { key: '⌘ + P', desc: 'Print High-Res Marksheet & Digital ID Badge' },
      { key: '⌘ + T', desc: 'Open Custom Theme & Color Palette Switcher' },
      { key: '⌘ + N', desc: 'Open Global Notification Center Drawer' }
    ]
  }
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Keyboard Shortcuts & Hotkeys</h3>
              <p className="text-xs text-muted-foreground">Power navigation shortcuts for maximum productivity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {SHORTCUT_GROUPS.map((grp) => (
            <div key={grp.group} className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                {grp.group}
              </span>
              <div className="divide-y divide-border/60 bg-muted/30 rounded-xl border border-border overflow-hidden">
                {grp.items.map((item, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs">
                    <span className="text-foreground">{item.desc}</span>
                    <kbd className="px-2 py-1 bg-card border border-border rounded-md font-mono text-[11px] font-bold text-foreground shadow-2xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
          >
            Got it, continue
          </button>
        </div>
      </div>
    </div>
  );
}

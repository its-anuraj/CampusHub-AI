'use client';

import { useState, useEffect } from 'react';
import {
  Eye,
  Type,
  Maximize2,
  Minimize2,
  Sparkles,
  RotateCcw,
  Check,
  X,
  Volume2,
  Sliders,
  SunMoon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function AccessibilityToolbar() {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('campushub_a11y_prefs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fontSizeScale) setFontSizeScale(parsed.fontSizeScale);
        if (parsed.highContrast !== undefined) setHighContrast(parsed.highContrast);
        if (parsed.dyslexicFont !== undefined) setDyslexicFont(parsed.dyslexicFont);
        if (parsed.reducedMotion !== undefined) setReducedMotion(parsed.reducedMotion);
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Apply font scale
    document.documentElement.style.fontSize = `${(fontSizeScale / 100) * 16}px`;

    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Save preferences
    try {
      localStorage.setItem(
        'campushub_a11y_prefs',
        JSON.stringify({ fontSizeScale, highContrast, dyslexicFont, reducedMotion })
      );
    } catch {}
  }, [fontSizeScale, highContrast, dyslexicFont, reducedMotion]);

  const resetAll = () => {
    setFontSizeScale(100);
    setHighContrast(false);
    setDyslexicFont(false);
    setReducedMotion(false);
    document.documentElement.style.fontSize = '16px';
    document.documentElement.classList.remove('high-contrast');
    addToast({
      title: 'Accessibility Preferences Reset',
      message: 'Standard visual defaults restored.',
      type: 'info'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl hover:scale-105 transition-all flex items-center justify-center cursor-pointer group"
          title="Accessibility Toolbar (High Contrast, Text Sizer)"
          aria-label="Open Accessibility Toolbar"
        >
          <Eye className="w-5 h-5 text-yellow-300" />
        </button>
      )}

      {/* Floating Settings Panel */}
      {isOpen && (
        <div className="bg-card border border-border rounded-3xl p-5 shadow-2xl w-80 space-y-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-foreground">Accessibility Suite</h4>
                <p className="text-[10px] text-muted-foreground">Universal Design Tools</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Font Size Adjuster */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" /> Text Size Scaler
              </span>
              <span className="font-mono font-bold text-foreground">{fontSizeScale}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSizeScale((prev) => Math.max(85, prev - 5))}
                className="flex-1 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold transition"
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeScale(100)}
                className="px-3 py-1.5 rounded-xl border border-border text-[11px] font-semibold hover:bg-muted transition"
              >
                Default
              </button>
              <button
                onClick={() => setFontSizeScale((prev) => Math.min(130, prev + 5))}
                className="flex-1 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold transition"
              >
                A+
              </button>
            </div>
          </div>

          {/* Toggles List */}
          <div className="space-y-2 pt-2 border-t border-border text-xs">
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={cn(
                "w-full p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer",
                highContrast
                  ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <span className="flex items-center gap-2">
                <SunMoon className="w-3.5 h-3.5" /> High Contrast Mode
              </span>
              {highContrast && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>

            <button
              onClick={() => setDyslexicFont(!dyslexicFont)}
              className={cn(
                "w-full p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer",
                dyslexicFont
                  ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <span className="flex items-center gap-2">
                <Type className="w-3.5 h-3.5" /> Dyslexic-Friendly Spacing
              </span>
              {dyslexicFont && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>

            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={cn(
                "w-full p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer",
                reducedMotion
                  ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <span className="flex items-center gap-2">
                <Minimize2 className="w-3.5 h-3.5" /> Reduce Animation Motion
              </span>
              {reducedMotion && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
          </div>

          {/* Reset All Footer */}
          <div className="pt-2 border-t border-border flex justify-between items-center text-[11px]">
            <button
              onClick={resetAll}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset Preferences
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

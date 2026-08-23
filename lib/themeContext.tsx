'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CampusAccent = 'blue' | 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber';
export type FontSizePreference = 'normal' | 'large';

interface ThemeContextType {
  accent: CampusAccent;
  setAccent: (accent: CampusAccent) => void;
  fontSize: FontSizePreference;
  setFontSize: (size: FontSizePreference) => void;
  isCompactMode: boolean;
  setIsCompactMode: (compact: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<CampusAccent>('blue');
  const [fontSize, setFontSizeState] = useState<FontSizePreference>('normal');
  const [isCompactMode, setIsCompactModeState] = useState(false);

  useEffect(() => {
    try {
      const savedAccent = localStorage.getItem('campushub_accent') as CampusAccent;
      if (savedAccent) setAccentState(savedAccent);

      const savedSize = localStorage.getItem('campushub_fontsize') as FontSizePreference;
      if (savedSize) setFontSizeState(savedSize);

      const savedCompact = localStorage.getItem('campushub_compact');
      if (savedCompact !== null) setIsCompactModeState(savedCompact === 'true');
    } catch {
      // ignore SSR or localStorage access issues
    }
  }, []);

  const setAccent = (newAccent: CampusAccent) => {
    setAccentState(newAccent);
    try {
      localStorage.setItem('campushub_accent', newAccent);
    } catch {}
  };

  const setFontSize = (newSize: FontSizePreference) => {
    setFontSizeState(newSize);
    try {
      localStorage.setItem('campushub_fontsize', newSize);
    } catch {}
  };

  const setIsCompactMode = (compact: boolean) => {
    setIsCompactModeState(compact);
    try {
      localStorage.setItem('campushub_compact', String(compact));
    } catch {}
  };

  return (
    <ThemeContext.Provider
      value={{
        accent,
        setAccent,
        fontSize,
        setFontSize,
        isCompactMode,
        setIsCompactMode,
      }}
    >
      <div className={fontSize === 'large' ? 'text-[15px]' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

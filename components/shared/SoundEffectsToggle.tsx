'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '@/lib/soundEffects';

export function SoundEffectsToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(soundEngine.isEnabled());
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    soundEngine.setEnabled(next);
    if (next) soundEngine.playSuccess();
  };

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-center ${
        enabled
          ? 'bg-slate-900 border-slate-800 text-indigo-400 hover:text-indigo-300'
          : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-400'
      }`}
      title={enabled ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Effects Muted (Click to Unmute)'}
    >
      {enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  );
}

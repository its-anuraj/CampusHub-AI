'use client';

import { useState } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  ShieldCheck,
  X,
  Compass,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampusWeatherProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CampusWeatherWidget({ isOpen, onClose }: CampusWeatherProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Campus Microclimate & Air Quality</h3>
              <p className="text-xs text-muted-foreground">Smart IoT Weather Station 01 (Central Quad)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Temperature Display */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-5 text-white flex items-center justify-between shadow-md">
          <div>
            <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">Partly Sunny • Moderate Breeze</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black font-mono">27°C</span>
              <span className="text-sm text-blue-200 font-mono">/ 80.6°F</span>
            </div>
            <p className="text-xs text-blue-100 mt-1">Feels like 29°C with 58% humidity</p>
          </div>
          <Sun className="w-14 h-14 text-yellow-300 animate-spin-slow opacity-90" />
        </div>

        {/* Environmental Sensors Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" /> Relative Humidity
            </span>
            <p className="text-base font-bold text-foreground font-mono">58%</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Comfortable</span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Air Quality (AQI)
            </span>
            <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">38 - Clean</p>
            <span className="text-[10px] text-muted-foreground">PM2.5: 8.4 µg/m³</span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-cyan-500" /> Wind Velocity
            </span>
            <p className="text-base font-bold text-foreground font-mono">14 km/h</p>
            <span className="text-[10px] text-muted-foreground">North-East 45°</span>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-500" /> UV Index
            </span>
            <p className="text-base font-bold text-amber-600 font-mono">4 (Moderate)</p>
            <span className="text-[10px] text-muted-foreground">Safe for outdoor labs</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-blue-500 shrink-0" />
          <span>No rain predicted for the next 6 hours. Perfect weather for sports ground practice.</span>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
          >
            Close Weather Radar
          </button>
        </div>
      </div>
    </div>
  );
}

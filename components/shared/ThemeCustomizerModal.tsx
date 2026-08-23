'use client';

import { useTheme, CampusAccent, FontSizePreference } from '@/lib/themeContext';
import { Palette, Check, X, Type, LayoutGrid } from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENT_COLORS: { id: CampusAccent; name: string; bgClass: string; ringClass: string }[] = [
  { id: 'blue', name: 'Campus Blue', bgClass: 'bg-blue-600', ringClass: 'ring-blue-500' },
  { id: 'indigo', name: 'Royal Indigo', bgClass: 'bg-indigo-600', ringClass: 'ring-indigo-500' },
  { id: 'emerald', name: 'Emerald Green', bgClass: 'bg-emerald-600', ringClass: 'ring-emerald-500' },
  { id: 'violet', name: 'Deep Violet', bgClass: 'bg-violet-600', ringClass: 'ring-violet-500' },
  { id: 'rose', name: 'Crimson Rose', bgClass: 'bg-rose-600', ringClass: 'ring-rose-500' },
  { id: 'amber', name: 'Solar Amber', bgClass: 'bg-amber-600', ringClass: 'ring-amber-500' },
];

export default function ThemeCustomizerModal({ isOpen, onClose }: ThemeModalProps) {
  const { accent, setAccent, fontSize, setFontSize, isCompactMode, setIsCompactMode } = useTheme();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSelectAccent = (colorId: CampusAccent, name: string) => {
    setAccent(colorId);
    toast.success(`Theme palette updated to ${name}`, 'Theme Changed');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Campus Experience Customizer</h3>
              <p className="text-[11px] text-slate-500">Personalize theme accents and accessibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-5">
          {/* Accent Color Palette */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2.5">
              Brand Accent Color
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {ACCENT_COLORS.map((color) => {
                const isSelected = accent === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => handleSelectAccent(color.id, color.name)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${color.bgClass} flex items-center justify-center flex-shrink-0`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    <span className="text-xs font-medium text-slate-800 truncate">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Scale */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-slate-400" /> Reading Comfort & Text Size
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setFontSize('normal');
                  toast.info('Standard typography enabled');
                }}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  fontSize === 'normal'
                    ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-xs">Standard (14px)</span>
              </button>
              <button
                onClick={() => {
                  setFontSize('large');
                  toast.info('Large high-readability typography enabled');
                }}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  fontSize === 'large'
                    ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-sm font-semibold">Large (16px)</span>
              </button>
            </div>
          </div>

          {/* Compact View Switch */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-900">Dense Data Mode</p>
                <p className="text-[10px] text-slate-500">Tighten table and card padding for wide screens</p>
              </div>
            </div>
            <button
              onClick={() => setIsCompactMode(!isCompactMode)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                isCompactMode ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isCompactMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

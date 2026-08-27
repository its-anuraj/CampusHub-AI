'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UtensilsCrossed, 
  Heart, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Save,
  AlertCircle
} from 'lucide-react';

export default function ParentMessPage() {
  const [data, setData] = useState<any>(null);
  const [pref, setPref] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/parent/mess')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
          setPref(json.data.dietaryPreferences.studentPreference);
          setNotes(json.data.dietaryPreferences.specialDietaryNotes);
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/parent/mess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preference: pref, notes })
    });
    const json = await res.json();
    if (json.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-orange-900/40 via-amber-900/30 to-slate-900/40 p-6 rounded-2xl border border-orange-500/20 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-orange-400 mb-1">
            <Link href="/dashboard/parent" className="flex items-center gap-1 hover:underline text-xs">
              <ArrowLeft className="w-3 h-3" /> Back to Parent Desk
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Hostel Nutrition & Dining</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-orange-400" />
            Hostel Dining Nutrition & Dietary Health Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Inspect daily mess menus, review calorie and allergen charts, and communicate special dietary requirements to the dining committee.
          </p>
        </div>
      </div>

      {data && (
        <>
          {/* Top Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Current Dining Facility</span>
              <div className="text-base font-bold text-white">{data.messHall}</div>
              <span className="text-[11px] text-emerald-400 font-medium">
                {data.hygieneAuditScore}
              </span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Student Diet Configuration</span>
              <div className="text-base font-bold text-amber-400">{data.dietaryPreferences.studentPreference}</div>
              <span className="text-[11px] text-slate-400">Allergen Monitoring: None Recorded</span>
            </div>
          </div>

          {/* Meals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Menu Feed */}
            <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-orange-400" /> Today&apos;s Nutrition Menu Schedule
              </h3>

              <div className="space-y-4">
                {data.meals.map((m: any) => (
                  <div key={m.mealType} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{m.mealType}</h4>
                      <span className="text-xs font-mono font-bold text-amber-400">{m.calories} kcal</span>
                    </div>

                    <p className="text-xs text-slate-300">{m.items}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <div className="flex items-center gap-1">
                        <span>Allergens:</span>
                        {m.allergens.map((a: string, i: number) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-medium">
                            {a}
                          </span>
                        ))}
                      </div>
                      <span className="text-emerald-400 font-medium">★ {m.parentHealthRating} Health Index</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Preference Form */}
            <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-orange-400" /> Customize Student Meal Plan
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Meal Preference</label>
                  <select
                    value={pref}
                    onChange={e => setPref(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Vegetarian (High Protein)">Vegetarian (High Protein)</option>
                    <option value="Non-Vegetarian Regular">Non-Vegetarian Regular</option>
                    <option value="Jain Meal (No Onion/Garlic)">Jain Meal (No Onion/Garlic)</option>
                    <option value="Vegan Plan">Vegan Plan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Special Dietary / Medical Notes</label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Provide any dietary instructions or allergy notices for the mess manager..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                {saved && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Dietary preferences successfully submitted to Warden!
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs rounded-xl transition shadow-lg shadow-orange-600/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" /> Update Kitchen Roster
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

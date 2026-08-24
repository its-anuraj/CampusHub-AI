'use client';

import { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, Building2, Compass, Sparkles, CheckCircle2, Shield, Bus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

const CAMPUS_BUILDINGS = [
  {
    id: 'b-cse',
    name: 'Turing Block (Computer Science & AI Hub)',
    code: 'CSE-BLK',
    category: 'ACADEMIC',
    coords: { x: 32, y: 28 },
    floors: 'G + 4 Floors',
    timing: '08:00 AM – 09:00 PM',
    facilities: ['AI GPU Cluster Lab', 'Robotics Innovation Center', 'Dean Office', 'Smart Lecture Halls 101-112'],
    contact: '+91 98765 11001',
    description: 'Main flagship academic block housing Department of CSE, Information Technology, and Advanced AI Research Lab.'
  },
  {
    id: 'b-lib',
    name: 'Central Knowledge Resource Center (Library)',
    code: 'CENTRAL-LIB',
    category: 'LIBRARY',
    coords: { x: 55, y: 35 },
    floors: 'G + 3 Floors',
    timing: '24/7 (Exam Season) • 08:00 AM – 11:00 PM',
    facilities: ['Digital Research Commons', '250+ Computer Terminals', 'Silent Study Pods', 'Cafe Barista'],
    contact: '+91 98765 11002',
    description: 'Central library with over 120,000 physical volumes, IEEE Xplore subscription access, and individual study cabins.'
  },
  {
    id: 'b-hostel',
    name: 'Everest & Nilgiri Residential Hostels',
    code: 'HOSTEL-NORTH',
    category: 'RESIDENTIAL',
    coords: { x: 78, y: 22 },
    floors: '8 Floors with Elevators',
    timing: 'Gate Curfew: 10:00 PM',
    facilities: ['Dining Hall A', 'Gymnasium', 'Table Tennis Arena', 'Laundry Station'],
    contact: '+91 98765 11003',
    description: 'Undergraduate residential quarters equipped with high-speed optical fiber Wi-Fi and 24/7 security guard post.'
  },
  {
    id: 'b-audi',
    name: 'Kalam Grand Auditorium & Convention Center',
    code: 'AUDI-MAIN',
    category: 'EVENTS',
    coords: { x: 42, y: 65 },
    floors: '2,500 Seater Capacity',
    timing: 'Event Specific',
    facilities: ['Dolby 7.1 Audio Stage', 'Acoustic Wall Panels', 'Green Rooms', 'VIP Lounge'],
    contact: '+91 98765 11004',
    description: 'Premier venue for national hackathons, cultural fest inaugurations, international research symposiums, and convocation.'
  },
  {
    id: 'b-sports',
    name: 'Olympic Sports Arena & Aquatic Complex',
    code: 'SPORTS-COMPLEX',
    category: 'SPORTS',
    coords: { x: 80, y: 70 },
    floors: 'Indoor + Outdoor Stadium',
    timing: '06:00 AM – 08:30 PM',
    facilities: ['50m Olympic Swimming Pool', 'Badminton Courts', 'Cricket Ground with Floodlights', 'Squash Courts'],
    contact: '+91 98765 11005',
    description: 'World-class athletic training ground hosting inter-university championships and collegiate sports fests.'
  },
  {
    id: 'b-cafe',
    name: 'Central Food Court & Nescafe Hub',
    code: 'FOOD-COURT',
    category: 'AMENITY',
    coords: { x: 25, y: 68 },
    floors: '2 Floors',
    timing: '07:30 AM – 11:30 PM',
    facilities: ['6 Specialized Cuisines', 'Juice Bar', 'Outdoor Lawn Seating', 'ATM Kiosk'],
    contact: '+91 98765 11006',
    description: 'Multi-stall culinary center offering diverse breakfast, meal, and beverage options for students and faculty.'
  }
];

export default function CampusMapPage() {
  const { addToast } = useToast();
  const [selectedBuilding, setSelectedBuilding] = useState<any>(CAMPUS_BUILDINGS[0]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [walkingRoute, setWalkingRoute] = useState<string | null>(null);

  const handleStartNavigation = (b: any) => {
    setWalkingRoute(`From Current Location (Gate 1) to ${b.name}: Approx. 4 mins walk (320 meters via central lawn walkway)`);
    addToast({
      title: 'GPS Route Active',
      message: `Turn-by-turn walking route computed to ${b.name}.`,
      type: 'info'
    });
  };

  const filteredBuildings = CAMPUS_BUILDINGS.filter(b => filterCategory === 'ALL' || b.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Interactive 2D Campus Map & Facility Guide</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Explore campus buildings, academic blocks, research labs, sports arenas, and walking navigation paths</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MapPin className="w-3.5 h-3.5" /> 180 Acre Smart Campus
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'ALL', label: 'All Campus Buildings' },
          { id: 'ACADEMIC', label: 'Academic & Labs' },
          { id: 'LIBRARY', label: 'Library' },
          { id: 'RESIDENTIAL', label: 'Hostels' },
          { id: 'SPORTS', label: 'Sports Complex' },
          { id: 'AMENITY', label: 'Dining & Cafeteria' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap',
              filterCategory === cat.id ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive 2D Vector Campus Canvas */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative min-h-[480px] overflow-hidden flex flex-col justify-between">
          {/* Subtle Grid Roads & Grass Layout */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

          {/* Decorative Campus Walkways SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            <line x1="32%" y1="28%" x2="55%" y2="35%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="55%" y1="35%" x2="42%" y2="65%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="55%" y1="35%" x2="78%" y2="22%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="42%" y1="65%" x2="25%" y2="68%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="42%" y1="65%" x2="80%" y2="70%" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
          </svg>

          {/* Header Map Legend */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-sky-400 bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
              CAMPUS GPS NAVIGATOR • 28.5355° N, 77.3910° E
            </span>
            <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md">Click pins to inspect</span>
          </div>

          {/* Interactive Building Markers */}
          <div className="relative z-10 w-full h-full min-h-[380px]">
            {filteredBuildings.map(b => {
              const isSelected = selectedBuilding?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBuilding(b)}
                  style={{ left: `${b.coords.x}%`, top: `${b.coords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                >
                  <div className={cn(
                    'p-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-lg backdrop-blur-md border',
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400 ring-4 ring-blue-500/30 scale-110'
                      : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700 hover:scale-105'
                  )}>
                    <MapPin className={cn('w-4 h-4', isSelected ? 'text-white' : 'text-sky-400')} />
                    <span className="text-xs font-bold whitespace-nowrap">{b.code}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Navigation Route Banner */}
          {walkingRoute && (
            <div className="relative z-10 p-3 rounded-xl bg-blue-950/80 border border-blue-500/50 text-xs text-blue-200 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>{walkingRoute}</span>
            </div>
          )}
        </div>

        {/* Right Building Inspector Card */}
        <div className="lg:col-span-4 space-y-4">
          {selectedBuilding && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase border border-blue-100">
                  {selectedBuilding.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 leading-snug">{selectedBuilding.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedBuilding.code} • {selectedBuilding.floors}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{selectedBuilding.description}</p>

              <div className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{selectedBuilding.timing}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Emergency Desk: {selectedBuilding.contact}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-900">Key Facilities & Labs:</p>
                <div className="space-y-1">
                  {selectedBuilding.facilities.map((fac: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => handleStartNavigation(selectedBuilding)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" /> Navigate to Building
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

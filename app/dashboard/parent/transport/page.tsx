'use client';

import { useState, useEffect } from 'react';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Radio,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  User,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface RouteStop {
  id: string;
  name: string;
  scheduledTime: string;
  status: 'PASSED' | 'CURRENT' | 'UPCOMING';
  landmark: string;
}

const ROUTE_12_STOPS: RouteStop[] = [
  { id: 's1', name: 'Campus Main Gate Bus Terminal', scheduledTime: '04:30 PM', status: 'PASSED', landmark: 'Admin Gate 1' },
  { id: 's2', name: 'Tech Park Crossing', scheduledTime: '04:45 PM', status: 'PASSED', landmark: 'Cyber Tower Metro' },
  { id: 's3', name: 'Sector 62 Commercial Hub', scheduledTime: '05:00 PM', status: 'CURRENT', landmark: 'Near Fortis Hospital' },
  { id: 's4', name: 'Botanical Garden Metro Interchange', scheduledTime: '05:15 PM', status: 'UPCOMING', landmark: 'Gate 2 Pickup Zone' },
  { id: 's5', name: 'South City Residential Enclave', scheduledTime: '05:35 PM', status: 'UPCOMING', landmark: 'Central Clubhouse' },
];

export default function ParentTransportPage() {
  const { toast } = useToast();
  const [selectedRoute, setSelectedRoute] = useState('Route 12');
  const [stops, setStops] = useState<RouteStop[]>(ROUTE_12_STOPS);
  const [speed, setSpeed] = useState(38);
  const [alertEnabled, setAlertEnabled] = useState(true);

  const busInfo = {
    vehicleNo: 'DL-01-EA-9824',
    model: 'Tata Marcopolo AC Electric Bus',
    driverName: 'Suresh Kumar',
    driverPhone: '+91 98765 00124',
    attendant: 'Mohan Lal (+91 98765 00125)',
    capacity: '42 / 45 Seats Occupied',
    etaHomeStop: '25 Minutes',
  };

  const handleCallDriver = () => {
    toast.info(`Calling Bus Driver ${busInfo.driverName} (${busInfo.driverPhone})...`, 'Emergency Call');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Live Campus Bus & GPS Tracking</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" /> Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time GPS bus location, live stop alerts, driver emergency contact, and estimated home arrival
          </p>
        </div>

        <button
          onClick={handleCallDriver}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <Phone className="w-4 h-4" /> Call Driver Hotline
        </button>
      </div>

      {/* Live Telemetry Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-blue-300">
            <Bus className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">{selectedRoute}</span>
              <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-white">{busInfo.vehicleNo}</span>
            </div>
            <h2 className="text-base font-black text-white mt-1">South City Residential Express</h2>
            <p className="text-xs text-blue-200/80 mt-0.5">Currently approaching Sector 62 Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10 text-center">
          <div>
            <span className="text-[10px] text-blue-200 uppercase font-semibold block">Live Speed</span>
            <strong className="text-xl font-mono text-emerald-300 font-bold">{speed} km/h</strong>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <span className="text-[10px] text-blue-200 uppercase font-semibold block">ETA Home Stop</span>
            <strong className="text-xl font-mono text-amber-300 font-bold">{busInfo.etaHomeStop}</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Stops Timeline */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" /> Route Checkpoints & Live Timeline
            </h3>
            <span className="text-xs text-slate-500">5 Registered Stops</span>
          </div>

          <div className="space-y-6 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {stops.map((stop) => (
              <div key={stop.id} className="relative">
                {/* Dot marker */}
                <div
                  className={`absolute -left-[27px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    stop.status === 'PASSED'
                      ? 'bg-emerald-500 border-white text-white'
                      : stop.status === 'CURRENT'
                      ? 'bg-blue-600 border-white text-white animate-bounce'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {stop.status === 'PASSED' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : stop.status === 'CURRENT' ? (
                    <Radio className="w-3.5 h-3.5" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{stop.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{stop.landmark}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-800">{stop.scheduledTime}</span>
                    <span
                      className={`block text-[9px] font-bold uppercase mt-0.5 ${
                        stop.status === 'PASSED'
                          ? 'text-emerald-600'
                          : stop.status === 'CURRENT'
                          ? 'text-blue-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {stop.status === 'CURRENT' ? 'Approaching Now' : stop.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Driver Info & Safety Guardrails */}
        <div className="lg:col-span-5 space-y-6">
          {/* Driver Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Crew Details
            </h3>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                SK
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{busInfo.driverName}</h4>
                <p className="text-[11px] text-slate-500">Licensed Heavy Vehicle Specialist (Badge #4892)</p>
                <p className="text-[10px] text-blue-600 font-mono mt-0.5">{busInfo.driverPhone}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Bus Attendant</span>
                <span className="font-semibold text-slate-800">{busInfo.attendant}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Seat Occupancy</span>
                <span className="font-semibold text-slate-800">{busInfo.capacity}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">CCTV Surveillance</span>
                <span className="font-bold text-emerald-700">4 Active Live Cameras</span>
              </div>
            </div>
          </div>

          {/* Proximity SMS Alert Toggle */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-950">Stop Proximity Alert</p>
                <p className="text-[11px] text-blue-800/80">Send SMS when bus is 2 km from your stop</p>
              </div>
              <button
                onClick={() => {
                  setAlertEnabled(!alertEnabled);
                  toast.success(alertEnabled ? 'Proximity alerts paused.' : 'Proximity alerts enabled for your mobile number.');
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  alertEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    alertEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

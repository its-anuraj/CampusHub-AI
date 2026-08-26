'use client';

import { useState, useEffect } from 'react';
import { Bus, MapPin, Clock, Phone, Navigation, ShieldCheck, Radio, Sparkles, CheckCircle2, AlertTriangle, RefreshCw, QrCode, Bell, Compass, HelpCircle, Send, X, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentTransportPage() {
  const { addToast } = useToast();
  const [transitData, setTransitData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRouteId, setSelectedRouteId] = useState('ROUTE-01');
  const [passModal, setPassModal] = useState(false);
  const [passDetails, setPassDetails] = useState<any>(null);
  const [renewing, setRenewing] = useState(false);
  const [arrivalAlertEnabled, setArrivalAlertEnabled] = useState(true);
  const [lostFoundModal, setLostFoundModal] = useState(false);
  const [lostItemDesc, setLostItemDesc] = useState('');

  useEffect(() => {
    async function loadRoutes() {
      try {
        const res = await fetch('/api/transport');
        if (res.ok) {
          const json = await res.json();
          setTransitData(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRoutes();
  }, []);

  const currentRoute = transitData?.routes?.find((r: any) => r.routeId === selectedRouteId) || transitData?.routes?.[0];

  const handleRenewPass = async () => {
    setRenewing(true);
    try {
      const res = await fetch('/api/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RENEW_PASS',
          routeId: selectedRouteId,
          studentName: 'Alex Kumar',
          rollNumber: '23CSE042'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPassDetails(data.data);
        addToast({
          title: 'Pass Renewed!',
          message: 'Your Digital Shuttle Pass is valid for this semester.',
          type: 'success'
        });
      }
    } catch {
      addToast({
        title: 'Error',
        message: 'Could not renew pass. Try again.',
        type: 'error'
      });
    } finally {
      setRenewing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-green-300 animate-pulse" /> Live Telemetry GPS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Campus Shuttle & Bus Transit Radar</h1>
          <p className="text-white/90 text-sm sm:text-base">
            Track daily university shuttle routes in real-time, view live ETA arrival estimates, access driver emergency lines, and manage your digital semester pass.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Active Fleet Vehicles</p>
          <p className="text-2xl font-bold text-foreground mt-1 flex items-center gap-2">
            <Bus className="w-5 h-5 text-blue-500" /> {transitData?.activeVehicles || 3} Buses
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">On-Time Punctuality</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> {transitData?.onTimeRate || '98.4%'}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-xs text-muted-foreground font-medium">Selected Shuttle Status</p>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> {currentRoute?.status || 'RUNNING'}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border flex flex-col justify-between">
          <p className="text-xs text-muted-foreground font-medium">Digital Bus Pass</p>
          <button
            onClick={() => setPassModal(true)}
            className="mt-1 w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition"
          >
            <QrCode className="w-3.5 h-3.5" /> View Pass
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Selector & Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Bus className="w-4 h-4 text-blue-500" /> Select Shuttle Route
            </h3>
            <div className="space-y-2">
              {transitData?.routes?.map((route: any) => (
                <button
                  key={route.routeId}
                  onClick={() => setSelectedRouteId(route.routeId)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all duration-200",
                    selectedRouteId === route.routeId
                      ? "border-blue-500 bg-blue-500/10 text-foreground"
                      : "border-border hover:bg-muted text-muted-foreground"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{route.routeId}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{route.vehicleNo}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mt-1">{route.routeName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Capacity: {route.occupancy} / {route.capacity} seats</p>
                </button>
              ))}
            </div>
          </div>

          {currentRoute && (
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 text-xs">
              <h4 className="font-bold text-sm text-foreground">Driver & Telemetry Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Driver Name</span>
                  <span className="font-semibold text-foreground">{currentRoute.driver}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Emergency Contact</span>
                  <a href={`tel:${currentRoute.driverPhone}`} className="font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {currentRoute.driverPhone}
                  </a>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Current Cruising Speed</span>
                  <span className="font-semibold text-foreground">{currentRoute.speedKmH} km/h</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Bus Type</span>
                  <span className="font-semibold text-foreground">{currentRoute.type}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Route Timeline & Map Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-card border border-border space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
              <div>
                <h3 className="font-bold text-lg text-foreground">{currentRoute?.routeName}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Current Position: {currentRoute?.currentLocation}
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5" /> Next Stop ETA: {currentRoute?.etaNextStop}
              </div>
            </div>

            {/* Live GPS Radar Graphic Simulation */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-inner relative overflow-hidden">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold flex items-center gap-1.5 text-blue-400">
                  <Compass className="w-4 h-4 animate-spin" /> Live Spatial Telemetry
                </span>
                <span className="font-mono text-[10px] text-slate-400">GPS: 28.5450° N, 77.1926° E</span>
              </div>

              {/* Waypoint Track Visual */}
              <div className="py-6 px-4 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between relative">
                <div className="absolute left-6 right-6 top-1/2 h-1 bg-slate-700 -translate-y-1/2 rounded" />
                <div className="absolute left-6 right-1/2 top-1/2 h-1 bg-blue-500 -translate-y-1/2 rounded" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                  <span className="text-[10px] text-slate-300 font-semibold mt-1">Terminal</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-blue-500/40 animate-bounce">
                    <Bus className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] text-blue-400 font-bold mt-1">Bus #{currentRoute?.vehicleNo}</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-slate-700 ring-4 ring-slate-800" />
                  <span className="text-[10px] text-slate-400 font-semibold mt-1">Campus Hub</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs">
                <button
                  onClick={() => {
                    setArrivalAlertEnabled(!arrivalAlertEnabled);
                    addToast({
                      title: arrivalAlertEnabled ? 'Alerts Muted' : 'Arrival Alert Set 🔔',
                      message: arrivalAlertEnabled ? 'Proximity chime disabled.' : `You will be alerted 5 mins before stop arrival.`,
                      type: 'info'
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                >
                  <Bell className={cn("w-3.5 h-3.5", arrivalAlertEnabled ? "text-yellow-400" : "text-slate-400")} />
                  {arrivalAlertEnabled ? 'Arrival Alert Active' : 'Enable Proximity Alert'}
                </button>

                <button
                  onClick={() => setLostFoundModal(true)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 underline transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Report Lost Item in Bus
                </button>
              </div>
            </div>

            {/* Timeline Stops */}
            <div className="space-y-6 pl-2 relative">
              <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-border" />
              {currentRoute?.stops?.map((stop: any, idx: number) => {
                const isDeparted = stop.status === 'DEPARTED';
                const isApproaching = stop.status === 'APPROACHING';
                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-transform",
                      isDeparted ? "bg-emerald-500 text-white" :
                      isApproaching ? "bg-blue-600 text-white ring-4 ring-blue-500/20 animate-pulse" :
                      "bg-muted text-muted-foreground border border-border"
                    )}>
                      {isDeparted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1 p-3.5 rounded-xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{stop.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Scheduled Arrival: {stop.time}</p>
                      </div>
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium self-start sm:self-auto",
                        isDeparted ? "bg-emerald-500/10 text-emerald-600" :
                        isApproaching ? "bg-blue-500/10 text-blue-600 font-semibold" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {stop.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lost and Found Modal */}
      {lostFoundModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Report Lost Item in Shuttle</h3>
              <button onClick={() => setLostFoundModal(false)} className="p-1 rounded text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setLostFoundModal(false);
                setLostItemDesc('');
                addToast({
                  title: 'Lost Item Report Dispatched 🔍',
                  message: 'Bus depot supervisor & driver have been notified.',
                  type: 'success'
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Item Description & Seat Location</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Blue HP Laptop bag left on row 4 window seat..."
                  value={lostItemDesc}
                  onChange={(e) => setLostItemDesc(e.target.value)}
                  className="w-full p-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLostFoundModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Pass Modal */}
      {passModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="inline-flex p-3 rounded-full bg-blue-500/10 text-blue-600 mb-2">
                <Bus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Digital Transit Pass</h3>
              <p className="text-xs text-muted-foreground">Present to Campus Bus Conductor upon boarding</p>
            </div>

            <div className="p-4 rounded-xl bg-muted border border-border text-center space-y-3">
              <div className="p-3 bg-white rounded-lg inline-block shadow-xs">
                <QrCode className="w-32 h-32 text-slate-900 mx-auto" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-foreground">PASS-CHUB-2026-9821</p>
                <p className="text-xs text-muted-foreground mt-1">Student: Alex Kumar (23CSE042)</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Active • Valid till Dec 2026</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRenewPass}
                disabled={renewing}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", renewing && "animate-spin")} /> Renew Semester Pass
              </button>
              <button
                onClick={() => setPassModal(false)}
                className="py-2 px-4 rounded-xl border border-border hover:bg-accent text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

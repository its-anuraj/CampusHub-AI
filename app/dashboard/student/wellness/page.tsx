'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Phone, Calendar, Sparkles, CheckCircle2, AlertTriangle, Smile, Frown, Meh, Zap, X, Wind, MessageCircle, Send, ThumbsUp, Play, Pause, Flame, Bot, ArrowRight, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentWellnessPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState('CALM');
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState<any>(null);

  // 4-7-8 Breathing states
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)'>('Inhale (4s)');
  const [breathTimer, setBreathTimer] = useState(4);

  // Peer support posts
  const [peerPosts, setPeerPosts] = useState([
    {
      id: 'p1',
      author: 'Anonymous Panda 🐼',
      time: '15 mins ago',
      content: 'Midsem exams are daunting, but remember your grades do not define your whole life! Take 15-min walks.',
      likes: 12,
      tag: 'Motivation'
    },
    {
      id: 'p2',
      author: 'Anonymous Falcon 🦅',
      time: '1 hour ago',
      content: 'Anyone else felt overwhelmed by back-to-back lab vivas? We got this batch of 2027!',
      likes: 8,
      tag: 'Exam Stress'
    }
  ]);
  const [newPeerPost, setNewPeerPost] = useState('');

  // Handle breathing timer
  useEffect(() => {
    let interval: any;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'Inhale (4s)') {
              setBreathPhase('Hold (7s)');
              return 7;
            } else if (breathPhase === 'Hold (7s)') {
              setBreathPhase('Exhale (8s)');
              return 8;
            } else {
              setBreathPhase('Inhale (4s)');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  const handlePostPeerNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeerPost.trim()) return;
    const post = {
      id: `p-${Date.now()}`,
      author: `Anonymous ${['Koala 🐨', 'Lion 🦁', 'Fox 🦊', 'Otter 🦦'][Math.floor(Math.random() * 4)]}`,
      time: 'Just now',
      content: newPeerPost.trim(),
      likes: 1,
      tag: 'Peer Support'
    };
    setPeerPosts([post, ...peerPosts]);
    setNewPeerPost('');
    addToast({
      title: 'Peer Encouragement Shared 🌸',
      message: 'Your anonymous message is posted to the student support wall.',
      type: 'success'
    });
  };

  useEffect(() => {
    async function fetchWellness() {
      try {
        const res = await fetch('/api/wellness');
        if (res.ok) {
          const json = await res.json();
          setData(json.data || json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchWellness();
  }, []);

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    try {
      await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LOG_MOOD', mood })
      });
      addToast({
        title: 'Check-in Recorded',
        message: `Your mood has been logged as ${mood.toLowerCase()}. Take care of yourself!`,
        type: 'success'
      });
    } catch {
      // fallback
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      addToast({ title: 'Select Slot', message: 'Please choose an available appointment slot.', type: 'warning' });
      return;
    }
    try {
      const res = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'BOOK_COUNSELING',
          counselor: selectedCounselor.name,
          slot: selectedSlot,
          isAnonymous
        })
      });
      if (res.ok) {
        const json = await res.json();
        setBookingConfirmed(json.data || json);
        setSelectedCounselor(null);
        setSelectedSlot('');
        addToast({
          title: 'Session Confirmed 🌿',
          message: 'Your 100% confidential wellness appointment is scheduled.',
          type: 'success'
        });
      }
    } catch {
      addToast({ title: 'Error', message: 'Failed to book session', type: 'error' });
    }
  };

  const counselors = data?.counselors || [];
  const helplines = data?.helplines || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shadow-xs">
              <Heart className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Health & Wellness Sanctuary</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Confidential psychological counseling, campus medical clinic, mood check-in, and 24/7 SOS hotlines</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Confidential & Anonymous
          </span>
        </div>
      </div>

      {/* 1:1 Student AI Well-Being Feature Banner (Coming Soon) */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-indigo-500/10 p-6 shadow-lg shadow-amber-500/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> ✨ COMING SOON
              </span>
              <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-md">
                Bi-Weekly 5-10 Min Check-in
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" /> 1:1 Confidential Student & AI Well-Being Agent Session
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              An empathetic 5–10 min conversation twice a month to check if you feel lonely, stressed by low marks, or overwhelmed. Generates a confidential mentor report so your faculty coordinator can reach out gently and resolve issues you may hesitate to voice directly.
            </p>
          </div>
          <Link
            href="/dashboard/student/wellness/ai-session"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] shrink-0"
          >
            Launch Interactive Session <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Mood Check-in Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">How are you feeling today?</h3>
            <p className="text-xs text-slate-500">Track your daily wellness score and academic stress balance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { id: 'CALM', label: 'Calm & Balanced', icon: Smile, color: 'text-emerald-600', bg: 'hover:bg-emerald-50' },
            { id: 'FOCUSED', label: 'Focused & Productive', icon: Zap, color: 'text-blue-600', bg: 'hover:bg-blue-50' },
            { id: 'STRESSED', label: 'Academic Stress', icon: Meh, color: 'text-amber-600', bg: 'hover:bg-amber-50' },
            { id: 'OVERWHELMED', label: 'Need Support', icon: Frown, color: 'text-rose-600', bg: 'hover:bg-rose-50' },
          ].map(m => {
            const Icon = m.icon;
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                className={cn(
                  'p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1.5 shadow-xs',
                  isSelected ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20' : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                )}
              >
                <Icon className={cn('w-6 h-6', m.color)} />
                <span className="text-xs font-semibold text-slate-800">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 24/7 Emergency Helplines SOS Box */}
      <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" /> 24/7 Rapid Emergency Helplines & SOS Dispatch
          </div>
          <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">Toll-Free</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {helplines.map((h: any, idx: number) => (
            <div key={idx} className="bg-white border border-rose-200/60 rounded-2xl p-4 shadow-xs space-y-1">
              <p className="text-xs font-bold text-slate-900">{h.name}</p>
              <p className="text-sm font-mono font-bold text-rose-600 flex items-center gap-1.5">
                <Phone className="w-4 h-4" /> {h.phone}
              </p>
              <p className="text-[11px] text-slate-500">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mindful 4-7-8 Breathing & Anonymous Peer Forum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 4-7-8 Breathing Timer */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-3xl p-6 shadow-card space-y-4 text-center flex flex-col justify-between">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1 w-fit mx-auto">
              <Wind className="w-3.5 h-3.5" /> MINDFUL DECOMPRESSION
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-2">4-7-8 Neuro-Calm Breathing</h3>
            <p className="text-xs text-slate-600">Scientifically proven to lower exam anxiety & pulse rate in 60s</p>
          </div>

          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <div
              className={cn(
                "absolute inset-0 rounded-full bg-teal-400/20 transition-all duration-1000",
                breathingActive ? "scale-110 animate-pulse" : "scale-100"
              )}
            />
            <div className="w-28 h-28 rounded-full bg-teal-600 text-white flex flex-col items-center justify-center shadow-lg transition-transform">
              <span className="text-2xl font-bold font-mono">{breathTimer}s</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase opacity-90">{breathPhase}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setBreathingActive(!breathingActive)}
              className={cn(
                "w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition",
                breathingActive ? "bg-slate-800 hover:bg-slate-900 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"
              )}
            >
              {breathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {breathingActive ? 'Pause Exercise' : 'Start 4-7-8 Breathing'}
            </button>
          </div>
        </div>

        {/* Anonymous Peer Encouragement Wall */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-rose-500" /> Anonymous Peer Support Wall
              </h3>
              <p className="text-xs text-slate-500">Kind messages & exam empathy from fellow batchmates</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Safe Space Moderated
            </span>
          </div>

          <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
            {peerPosts.map((post) => (
              <div key={post.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-900">{post.author}</span>
                  <span className="text-slate-400">{post.time}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">&ldquo;{post.content}&rdquo;</p>
              </div>
            ))}
          </div>

          <form onSubmit={handlePostPeerNote} className="flex gap-2 pt-1 border-t border-slate-100">
            <input
              type="text"
              required
              placeholder="Leave an encouraging anonymous note for a fellow student..."
              value={newPeerPost}
              onChange={(e) => setNewPeerPost(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-400"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Post
            </button>
          </form>
        </div>
      </div>

      {/* Counselors List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Book 1-on-1 Confidential Guidance Session</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {counselors.map((c: any) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card flex flex-col justify-between space-y-4 hover:border-rose-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{c.name}</h4>
                    <p className="text-xs text-rose-600 font-semibold">{c.role}</p>
                    <p className="text-[11px] text-slate-500">Experience: {c.experience}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <p className="text-xs font-semibold text-slate-700">Specialization Focus:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.specialties.map((spec: string, i: number) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedCounselor(c)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Private Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <button onClick={() => setSelectedCounselor(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                100% Confidential
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Book with {selectedCounselor.name}</h3>
              <p className="text-xs text-slate-500">Room 204 • Campus Wellness Suite</p>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">Select Appointment Time</label>
                <div className="space-y-2">
                  {selectedCounselor.availableSlots.map((slot: string) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        'w-full p-2.5 rounded-xl border text-left font-medium text-xs flex items-center justify-between cursor-pointer transition-all',
                        selectedSlot === slot ? 'bg-rose-50 border-rose-400 text-rose-800 font-semibold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <span>{slot}</span>
                      {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="anon" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Book anonymously (Mask student identity in records)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

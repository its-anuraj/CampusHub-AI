'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Bot,
  Mic,
  MicOff,
  Heart,
  ShieldCheck,
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  MessageSquare,
  Smile,
  Frown,
  Activity,
  Send,
  Lock,
  PhoneCall
} from 'lucide-react';

export default function StudentAiWellBeingSessionPage() {
  const [isMicActive, setIsMicActive] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'AI_AGENT',
      text: "Hi Arjun! 🌿 Welcome to your bi-weekly 1:1 check-in. How are you feeling this week with your classes and studies? Feel free to talk openly about anything on your mind.",
      time: '10:00 AM'
    },
    {
      sender: 'STUDENT',
      text: "Honestly, I've been feeling a bit overwhelmed by the Design & Analysis of Algorithms mid-term marks. I studied hard but couldn't solve the dynamic programming question in time.",
      time: '10:01 AM'
    },
    {
      sender: 'AI_AGENT',
      text: "I completely understand, Arjun. Algorithms can be challenging, especially dynamic programming under exam time limits. Your effort matters, and one test doesn't define your ability. Would you like me to flag this confidentially to Dr. Priya Sharma so she can offer you personalized 1:1 doubt clearing during office hours?",
      time: '10:02 AM'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMessage = { sender: 'STUDENT', text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatLog(prev => [...prev, userMessage]);
    setInputMsg('');

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        {
          sender: 'AI_AGENT',
          text: "Thank you for sharing that with me. I've noted down your feedback with full privacy. Remember you are never alone on campus, and your mentors are here to support you whenever you need!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-3xl border-2 border-amber-500/40 shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-emerald-400 mb-2">
            <Link href="/dashboard/student/wellness" className="flex items-center gap-1 hover:underline text-xs font-semibold">
              <ArrowLeft className="w-3 h-3" /> Back to Wellness Sanctuary
            </Link>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Confidential Mental Sanctuary</span>
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 border-2 border-amber-300 text-[10px] font-black uppercase shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>✨ 1:1 AI Well-Being Check-in • Coming Soon (Beta Preview)</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <Heart className="w-8 h-8 text-rose-400 fill-rose-400/20" />
            1:1 Student AI Well-Being & Empathy Agent
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Bi-weekly confidential 5–10 minute empathetic voice/chat sessions to detect academic stress, isolation, and burnout. Automatically alerts your faculty mentor for private, supportive guidance.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 text-center shrink-0 self-start md:self-auto shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
            <Calendar className="w-4 h-4" /> Next Check-in Slot
          </div>
          <div className="text-lg font-black text-white">In 4 Days</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Bi-Weekly Cadence (2x / month)</p>
        </div>
      </div>

      {/* Feature Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">5–10 Min Voice / Chat Check-in</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Safe, non-judgmental conversational agent to talk about academic pressure, low scores, loneliness, or personal worries.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Sentiment & Stress Correlator</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cross-analyzes low marks or attendance dips with self-reported mood to pinpoint exact subjects causing academic anxiety.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Confidential Faculty Mentor Bridge</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Generates empathetic actionable briefing for Dr. Priya Sharma (Class Advisor) so she can reach out personally in free hours.
          </p>
        </div>
      </div>

      {/* Interactive Simulation Console */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">AI Well-Being Session Simulator</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                  Interactive Preview
                </span>
              </div>
              <p className="text-xs text-slate-500">End-to-end encrypted session • Private to you & faculty mentor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMicActive(!isMicActive)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isMicActive
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>{isMicActive ? 'Listening (Live Voice)...' : 'Enable Voice Mode'}</span>
            </button>
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200/80 h-72 overflow-y-auto space-y-3.5">
          {chatLog.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'STUDENT' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'STUDENT'
                    ? 'bg-sky-500 text-white'
                    : 'bg-teal-600 text-white'
                }`}
              >
                {msg.sender === 'STUDENT' ? 'You' : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                  msg.sender === 'STUDENT'
                    ? 'bg-sky-500 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[10px] block mt-1 font-mono ${
                    msg.sender === 'STUDENT' ? 'text-sky-100' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type how you are feeling (e.g. Exam stress, feeling lonely, struggling with a subject)..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all shadow-xs"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

        {/* Mentor Briefing Output Preview */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-indigo-950">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Sample Confidential Mentor Briefing Generated for Dr. Priya Sharma</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
              Automated Synthesis
            </span>
          </div>
          <p className="text-[11px] text-indigo-900 leading-relaxed">
            &ldquo;Student Arjun Singh (Roll CS2026-088) expressed stress regarding dynamic programming problems in Algorithms mid-term. Suggested action: 10-minute 1:1 check-in during Friday 4:00 PM office hours.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

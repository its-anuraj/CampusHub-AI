'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Bot,
  Brain,
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
  PhoneCall,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Compass,
  Lightbulb,
  Radio,
  BookOpen,
  Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toastContext';

export default function StudentPsychologistPage() {
  const { addToast } = useToast();
  const [isMicActive, setIsMicActive] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<string>('Academic Stress');
  const [inputMsg, setInputMsg] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'PSYCHOLOGIST',
      text: "Namaste Arjun! 🌸 I am your personal 1:1 AI Student Psychologist & Mind Companion. I'm here to listen to whatever is on your mind—exam stress, low marks, loneliness, hostel life, or anything you can't say openly. How have you been feeling lately?",
      time: '10:00 AM'
    },
    {
      sender: 'STUDENT',
      text: "Sir/Ma'am, I am feeling very stressed because my midsem marks in Data Structures were low. I feel like I'm falling behind everyone else in my batch.",
      time: '10:01 AM'
    },
    {
      sender: 'PSYCHOLOGIST',
      text: "I hear you, Arjun, and it's completely normal to feel disheartened after a tough exam. Low marks in one test do NOT define your intelligence or future. I've prepared a gentle, confidential note for your mentor Dr. Priya Sharma so she can guide you personally without any embarrassment. Would you like some quick relaxation breathing exercises right now?",
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
      let aiReply = "Thank you for sharing your thoughts with me. You are doing great, and recognizing how you feel is the first big step. Your mental well-being is always our top priority! 🌿";
      if (inputMsg.toLowerCase().includes('lonely') || inputMsg.toLowerCase().includes('alone')) {
        aiReply = "Feeling alone in campus or hostel can be hard. Remember there are campus clubs, peer buddies, and faculty mentors who care. I've noted this to ensure your mentor reaches out for a relaxed chat.";
      } else if (inputMsg.toLowerCase().includes('marks') || inputMsg.toLowerCase().includes('exam') || inputMsg.toLowerCase().includes('fail')) {
        aiReply = "Exam pressure is tough, but grades can always be improved with the right strategy. We'll connect you with peer study circles and personalized faculty guidance!";
      }

      setChatLog(prev => [
        ...prev,
        {
          sender: 'PSYCHOLOGIST',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      addToast({
        title: 'AI Psychologist Response',
        message: 'Empathy score logged & confidential mentor note synthesized.',
        type: 'info'
      });
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Back Link & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="space-y-1">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
              <Brain className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  AI Student Psychologist & Mind Companion
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> ✨ COMING SOON
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Confidential 1:1 Voice & Text Therapy Session (5–10 min bi-weekly check-in) for student well-being & academic stress relief
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Confidential • Zero Judgment
          </span>
        </div>
      </div>

      {/* Feature Explainer Banner: What It Does / Kya Karega Ye Feature */}
      <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-500/10 via-sky-500/10 to-indigo-500/10 p-6 md:p-8 shadow-xl shadow-amber-500/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-400 mb-2">
              🌟 New Upcoming Core Feature • Coming Soon
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              Why CampusHub AI Psychologist? (Ye Feature Kya Karega?)
            </h2>
            <p className="text-sm text-slate-700 mt-1 max-w-3xl leading-relaxed">
              Bahut se students marks kam aane par, loneliness feel karne par, ya exam pressure me kisi se direct baat karne me jhijhakte (hesitate) hain. 
              Ye feature har student ko ek <strong>safe, 100% private AI psychologist space</strong> deta hai jo unki mental health ko protect karta hai.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-amber-200 rounded-2xl p-4 shrink-0 shadow-sm space-y-1 text-center md:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Session Frequency</span>
            <div className="text-lg font-black text-indigo-700">2 Times A Month</div>
            <span className="text-[10px] text-slate-500">5 to 10 Minutes Voice/Chat</span>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2 hover:border-indigo-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">1:1 Friendly Conversation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              5–10 min ka casual aur supportive conversation jisme student bina kisi dar ya hesitation ke apna dukh/pareshani bata sakta hai.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2 hover:border-sky-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Mental Stress & Loneliness Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI NLP analyze karega ki student low marks ki wajah se depressed to nahi hai, ya hostel me akela (lonely) mehsoos to nahi kar raha.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">100% Privacy & Zero Shame</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student ka raw chat kabhi leak nahi hota. AI sirf ek gentle behavioral synthesis summary create karta hai.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2 hover:border-amber-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Faculty Mentor Bridge</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Faculty mentor ko report jati hai jisse teacher student se personally aur pyaar se baat karke unki problem solve kar sake.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulation / Live Test Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Chat Simulator */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-card flex flex-col overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Dr. Maya AI (Campus Psychologist)</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    BETA SIMULATION
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Bi-Weekly Session 1 of 2 • Scheduled 10 Mins</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMicActive(!isMicActive)}
                className={cn(
                  'p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer',
                  isMicActive
                    ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                )}
              >
                {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMicActive ? 'Mic Listening...' : 'Voice Mode'}</span>
              </button>
            </div>
          </div>

          {/* Quick Feeling Topic Selectors */}
          <div className="px-4 py-2.5 bg-slate-50/50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Current Focus:</span>
            {['Academic Stress', 'Low Midsem Marks', 'Feeling Isolated', 'Lab Viva Anxiety', 'Hostel Life'].map(topic => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedFeeling(topic)}
                className={cn(
                  'px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer',
                  selectedFeeling === topic
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                )}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Chat Bubble Scroll Area */}
          <div className="p-6 space-y-4 flex-1 min-h-[340px] max-h-[420px] overflow-y-auto bg-slate-50/30">
            {chatLog.map((msg, i) => {
              const isAi = msg.sender === 'PSYCHOLOGIST';
              return (
                <div key={i} className={cn('flex gap-3', isAi ? 'justify-start' : 'justify-end')}>
                  {isAi && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                      AI
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-1 shadow-xs',
                      isAi
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white font-medium'
                    )}
                  >
                    <p>{msg.text}</p>
                    <span className={cn('block text-[9px]', isAi ? 'text-slate-400' : 'text-sky-100 text-right')}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              placeholder="Type your feelings, exam worries, or thoughts here..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>

        {/* Right Col: Mentor Briefing Synthesis Preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Mentor Briefing Preview</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                Confidential
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Ye summary student ki identity protect karte hue unke mentor <strong>Dr. Priya Sharma</strong> ke dashboard par send hoti hai:
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-800">Arjun Singh (CS2023045 - Sec A)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Stress Category:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Midsem Exam Anxiety</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Well-Being Index:</span>
                <span className="font-bold text-blue-600">6.8 / 10 (Moderate Strain)</span>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI Recommendation for Faculty:</span>
                <p className="text-[11px] text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                  &quot;Student expressed self-doubt after Algorithms midsem. Recommended: Have a 5-minute encouraging conversation during free office hours to boost confidence in Dynamic Programming.&quot;
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Faculty will reach out gently without making the student feel singled out or stressed.
              </span>
            </div>
          </div>

          {/* Quick Schedule Opt-in */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" /> Bi-Weekly Automated Sync
            </div>
            <h4 className="text-sm font-bold text-white">Next Scheduled Session</h4>
            <p className="text-xs text-slate-300">
              Thursday, 18th Sep • 04:30 PM (Post-Lecture Window). A notification will be sent on web & mobile app.
            </p>
            <button
              type="button"
              onClick={() => addToast({ title: 'Reminder Set', message: 'You will receive a 10-min notification before the session.', type: 'success' })}
              className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              Set Bi-Weekly Calendar Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

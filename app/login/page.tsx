'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Users,
  Shield,
  Loader2,
  ArrowRight,
  Check,
  Briefcase,
  Calculator,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react';
import { authenticateUser, getDashboardRoute } from '@/lib/auth';

interface DemoCred {
  id: string;
  role: string;
  category: 'LEADERSHIP' | 'ACADEMIC';
  title: string;
  email: string;
  password: string;
  icon: any;
  desc: string;
  badge: string;
  badgeColor: string;
}

const DEMO_CREDENTIALS: DemoCred[] = [
  {
    id: 'director',
    category: 'LEADERSHIP',
    role: 'ADMIN',
    title: 'College Director',
    email: 'ajsinghindolia@gmail.com',
    password: '001234',
    icon: Crown,
    desc: 'Anuraj Singh • Chief Executive Admin & Governance',
    badge: '👑 Director Desk',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'tpo',
    category: 'LEADERSHIP',
    role: 'ADMIN',
    title: 'Placement Officer (TPO)',
    email: 'suresh.tpo@kcc.campushub.edu.in',
    password: 'Admin@123',
    icon: Briefcase,
    desc: 'Suresh Sharma • Amazon & TCS Drives, CTC Analytics',
    badge: '💼 Admin Staff',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 'academic_admin',
    category: 'LEADERSHIP',
    role: 'ADMIN',
    title: 'Academic Registrar',
    email: 'rakesh.acad@kcc.campushub.edu.in',
    password: 'Admin@123',
    icon: Shield,
    desc: 'Rakesh Kumar • Approvals, Student & Faculty Records',
    badge: '🎓 Admin Staff',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    id: 'accounts',
    category: 'LEADERSHIP',
    role: 'ADMIN',
    title: 'Finance & Accounts',
    email: 'meena.fees@kcc.campushub.edu.in',
    password: 'Admin@123',
    icon: Calculator,
    desc: 'Meena Gupta • Batch ₹50k/₹55k Fee Ledgers & Dues',
    badge: '💰 Admin Staff',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'faculty',
    category: 'ACADEMIC',
    role: 'FACULTY',
    title: 'Faculty / HOD (CSE)',
    email: 'faculty@campushub.ai',
    password: 'Faculty@123',
    icon: BookOpen,
    desc: 'Dr. Priya Sharma • Attendance, Labs & Grading',
    badge: '👩‍🏫 Faculty',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    id: 'student',
    category: 'ACADEMIC',
    role: 'STUDENT',
    title: 'Student (B.Tech CSE)',
    email: 'student@campushub.ai',
    password: 'Student@123',
    icon: GraduationCap,
    desc: 'Arjun Singh • Timetable, Fees, Placements & AI Tutor',
    badge: '👨‍🎓 Student',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  {
    id: 'parent',
    category: 'ACADEMIC',
    role: 'PARENT',
    title: 'Parent Portal',
    email: 'parent@campushub.ai',
    password: 'Parent@123',
    icon: Users,
    desc: 'Sunita Singh • Fee Status, Attendance & CGPA Monitor',
    badge: '👨‍👩‍👧 Parent',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
  },
];

export default function LoginPage() {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState('ajsinghindolia@gmail.com');
  const [password, setPassword] = useState('001234');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCredId, setSelectedCredId] = useState<string>('director');
  const [activeTab, setActiveTab] = useState<'ALL' | 'LEADERSHIP' | 'ACADEMIC'>('ALL');

  // Status
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectQuickLogin = (cred: DemoCred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setSelectedCredId(cred.id);
    setError('');
  };

  // 1-Click Direct Instant Authentication
  const handleDirectInstantLogin = async (cred: DemoCred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setSelectedCredId(cred.id);
    setError('');
    setLoading(true);

    const user = await authenticateUser(cred.email, cred.password);
    if (user) {
      localStorage.setItem('campushub_user', JSON.stringify(user));
      const route = getDashboardRoute(user.role);
      router.push(route);
    } else {
      setError('Authentication failed for quick credentials.');
      setLoading(false);
    }
  };

  // Login via Email & Password against DB
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const user = await authenticateUser(email, password);
    if (user) {
      localStorage.setItem('campushub_user', JSON.stringify(user));
      const route = getDashboardRoute(user.role);
      router.push(route);
    } else {
      setError('Invalid email or password. New user? Click "Create Account" below to register.');
      setLoading(false);
    }
  };

  const visibleCreds = DEMO_CREDENTIALS.filter(
    (c) => activeTab === 'ALL' || c.category === activeTab
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-8 lg:p-12 relative overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl" />

      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold text-base shadow-sm ring-2 ring-sky-400/20">
            C
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm tracking-tight block">CampusHub AI</span>
            <span className="text-[10px] text-slate-500 block">KCC Institute of Technology & Management</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-semibold ml-2">
            Greater Noida, UP
          </span>
        </div>
        <div className="text-xs text-slate-600">
          New user? <Link href="/signup" className="text-sky-600 font-bold hover:underline">Create Account</Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Fast Demo Quick-Logins */}
        <div className="lg:col-span-6 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Explore CampusHub OS across all institutional roles.
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Click any role card below to test live dashboards with authentic KCCITM academic, financial, placement, and departmental data.
          </p>

          {/* Red-Highlighted 1-Click Badge above All Roles */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border-2 border-red-500 text-red-700 text-xs font-bold shadow-xs ring-2 ring-red-500/20">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>1-Click Test & Reviewer Demo Logins</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Roles (7)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('LEADERSHIP')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'LEADERSHIP'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Director & Admin Staff (4)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ACADEMIC')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ACADEMIC'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty, Student & Parent (3)
            </button>
          </div>

          {/* Quick Demo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {visibleCreds.map((cred) => {
              const Icon = cred.icon;
              const isSelected = selectedCredId === cred.id;
              return (
                <div
                  key={cred.id}
                  onClick={() => handleSelectQuickLogin(cred)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-400/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50/70 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${cred.badgeColor}`}>
                        {cred.badge}
                      </span>
                    </div>

                    {/* 1-Click Direct Login Button */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirectInstantLogin(cred);
                      }}
                      className="px-2 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-bold flex items-center gap-1 transition shadow-2xs opacity-90 group-hover:opacity-100 cursor-pointer"
                      title={`Direct login as ${cred.title}`}
                    >
                      <Zap className="w-2.5 h-2.5 fill-current" />
                      <span>1-Click</span>
                    </button>
                  </div>

                  <p className="text-xs font-bold text-slate-900">{cred.title}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">{cred.email}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Login Card */}
        <div className="lg:col-span-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Sign in to CampusHub</h2>
                <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                  KCCITM Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered credentials or select any quick demo card on the left
              </p>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. ajsinghindolia@gmail.com"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 font-mono transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <span className="text-[10px] text-slate-400 font-mono">Encrypted & Checked via DB</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Authenticating against Database...
                  </>
                ) : (
                  <>
                    <span>Continue to Authorized Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Create an account?</span>
              <Link href="/signup" className="text-sky-600 font-bold hover:underline">
                Register as Student, Faculty or Parent →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-200/60 pt-4 gap-2">
        <span>© 2026 CampusHub AI • KCC Institute of Technology & Management, Greater Noida</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

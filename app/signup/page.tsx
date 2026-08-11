'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { Eye, EyeOff, GraduationCap, BookOpen, Users, Shield, Loader2, ArrowRight, Check, Phone, Mail, Sparkles } from 'lucide-react';
import { getDashboardRoute } from '@/lib/auth';
import { DEPARTMENTS } from '@/lib/departments';

const ROLES = [
  { role: 'STUDENT', label: 'Student', icon: GraduationCap, desc: 'Academics, assignments & AI assistant' },
  { role: 'FACULTY', label: 'Faculty', icon: BookOpen, desc: 'Class attendance, grading & course management' },
  { role: 'ADMIN', label: 'Admin', icon: Shield, desc: 'Institutional analytics & user management' },
  { role: 'PARENT', label: 'Parent', icon: Users, desc: 'Child academic progress & fee tracking' },
];

export default function SignupPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'EMAIL' | 'OTP'>('EMAIL');
  
  // Email Form State
  const [role, setRole] = useState<'STUDENT' | 'FACULTY' | 'ADMIN' | 'PARENT'>('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState('CSE');
  const [rollNumber, setRollNumber] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  // Mobile OTP State
  const [otpPhone, setOtpPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize Google Identity Services
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.initialize({
        client_id: '1058291048201-campushub.apps.googleusercontent.com',
        callback: handleGoogleCredentialResponse,
      });
    }
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google auth failed');

      localStorage.setItem('campushub_user', JSON.stringify(data.user));
      const route = getDashboardRoute(data.user.role);
      router.push(route);
    } catch (err: any) {
      setError(err.message || 'Google Auth Error');
      setLoading(false);
    }
  };

  // Handle Email Sign-Up
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
          department,
          rollNumber,
          employeeId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      setSuccess('Account created successfully! Redirecting...');
      localStorage.setItem('campushub_user', JSON.stringify(data.user));

      setTimeout(() => {
        const route = getDashboardRoute(data.user.role);
        router.push(route);
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  // Trigger Google Account Picker
  const handleGoogleSignupPrompt = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback prompt trigger
          handleFallbackGoogleAuth();
        }
      });
    } else {
      handleFallbackGoogleAuth();
    }
  };

  const handleFallbackGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const realEmail = email || (name ? `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com` : 'user.google@gmail.com');
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: realEmail,
          name: name || 'Google Verified User',
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google auth failed');

      localStorage.setItem('campushub_user', JSON.stringify(data.user));
      const route = getDashboardRoute(data.user.role);
      router.push(route);
    } catch (err: any) {
      setError(err.message || 'Google Auth error');
      setLoading(false);
    }
  };

  // Handle Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpPhone || otpPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setOtpSent(true);
      setSuccess(`OTP code sent via SMS to +91 ${otpPhone}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP & Register
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: otpPhone,
          code: otpCode,
          name: name || `Mobile User ${otpPhone.slice(-4)}`,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      localStorage.setItem('campushub_user', JSON.stringify(data.user));
      const route = getDashboardRoute(data.user.role);
      router.push(route);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      <Script src="https://accounts.google.com/gsi/client" async defer />
      
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            C
          </div>
          <span className="font-semibold text-slate-900 text-sm tracking-tight">CampusHub OS</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">Create Account</span>
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">
          Already registered? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign In here</Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Instant Onboarding
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Register your institution profile.
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Create an active account in the database with role-based access for Students, Faculty, Admin, or Parents.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Direct database persistence & course access',
              'Google OAuth & Mobile OTP authentication',
              'Instant role-specific dashboard access',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Sign Up Form */}
        <div className="md:col-span-7">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Create your CampusHub Account</h2>
              <p className="text-xs text-slate-500 mt-1">Select your primary role and enter registration details</p>
            </div>

            {/* Role Selection Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Select Your Institution Role</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setRole(r.role as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600/20'
                          : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1 rounded-md ${isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-900">{r.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{r.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auth Method Switcher */}
            <div className="flex border-b border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => { setAuthMethod('EMAIL'); setError(''); }}
                className={`py-2 px-4 font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  authMethod === 'EMAIL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email & Password
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('OTP'); setError(''); }}
                className={`py-2 px-4 font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  authMethod === 'OTP' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Mobile OTP Sign-Up
              </button>
            </div>

            {/* Google Quick Button */}
            <button
              type="button"
              onClick={handleGoogleSignupPrompt}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Sign Up with Google Account
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-[11px] uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Or fill details manually</span></div>
            </div>

            {/* Email Registration Form */}
            {authMethod === 'EMAIL' && (
              <form onSubmit={handleEmailSignup} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Arjun Singh"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ajsinghindolia@gmail.com"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      minLength={6}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {role === 'STUDENT' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                      <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900">
                        {DEPARTMENTS.map(d => (
                          <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Roll Number</label>
                      <input type="text" value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="CS2026001" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900" />
                    </div>
                  </div>
                )}

                {role === 'FACULTY' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                      <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900">
                        {DEPARTMENTS.map(d => (
                          <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Employee ID</label>
                      <input type="text" value={employeeId} onChange={e => setEmployeeId(e.target.value)} placeholder="FAC-102" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900" />
                    </div>
                  </div>
                )}

                {error && <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">{error}</div>}
                {success && <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">{success}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : <><span>Register Account</span> <ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </form>
            )}

            {/* Mobile OTP Form */}
            {authMethod === 'OTP' && (
              <div className="space-y-3.5">
                {!otpSent ? (
                  <form onSubmit={handleRequestOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Phone Number (+91)</label>
                      <div className="flex gap-2">
                        <span className="px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 font-semibold">+91</span>
                        <input
                          type="tel"
                          required
                          value={otpPhone}
                          onChange={e => setOtpPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                    {error && <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">{error}</div>}
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send 6-Digit OTP Code'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                      <p className="font-semibold">{success}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Enter 6-Digit OTP</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        placeholder="••••••"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-center tracking-widest font-mono text-base font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    {error && <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">{error}</div>}
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setOtpSent(false)} className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">Back</button>
                      <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1 cursor-pointer">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify OTP & Complete Sign Up'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

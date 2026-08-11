'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { Eye, EyeOff, GraduationCap, BookOpen, Users, Shield, Loader2, ArrowRight, Check, Phone, Mail, Sparkles } from 'lucide-react';
import { authenticateUser, getDashboardRoute } from '@/lib/auth';

const DEMO_CREDENTIALS = [
  { role: 'Student', email: 'ajsinghindolia@gmail.com', password: '12345678', icon: GraduationCap, desc: 'AJ Singh • Primary Demo Account' },
  { role: 'Faculty', email: 'faculty@campushub.ai', password: 'Faculty@123', icon: BookOpen, desc: 'Attendance, grades & course workflow' },
  { role: 'Admin', email: 'admin@campushub.ai', password: 'Admin@123', icon: Shield, desc: 'Institution control & analytics' },
  { role: 'Parent', email: 'parent@campushub.ai', password: 'Parent@123', icon: Users, desc: 'Student progress & fee monitoring' },
];

export default function LoginPage() {
  const router = useRouter();
  const [authTab, setAuthTab] = useState<'EMAIL' | 'OTP'>('EMAIL');
  
  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // OTP state
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1058291048201-campushub.apps.googleusercontent.com';

  // Initialize Google Identity Services
  const initGoogleAuth = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
        });

        const btnDiv = document.getElementById('googleSignInBtn');
        if (btnDiv) {
          btnDiv.innerHTML = '';
          (window as any).google.accounts.id.renderButton(btnDiv, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            width: 340,
            shape: 'rectangular',
          });
        }
      } catch (err) {
        console.error('Google GSI init error:', err);
      }
    }
  };

  useEffect(() => {
    initGoogleAuth();
    const interval = setInterval(initGoogleAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Google OAuth Response Callback (Only called by real Google popup)
  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response || !response.credential) {
      setError('Google Sign-In was cancelled or invalid response received.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential, role: 'STUDENT' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed');

      localStorage.setItem('campushub_user', JSON.stringify(data.user));
      const route = getDashboardRoute(data.user.role);
      router.push(route);
    } catch (err: any) {
      setError(err.message || 'Google Authentication Error');
      setLoading(false);
    }
  };

  const handleQuickLogin = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setSelectedRole(cred.role);
    setError('');
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

  // Trigger Google Account Picker Modal (Only calls official Google prompt)
  const handleGoogleLoginPrompt = () => {
    setError('');
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          setError('Google Sign-In prompt not displayed. Please click the official Google Sign In button below or check browser pop-up permissions.');
        } else if (notification.isSkippedMoment()) {
          setError('Google Sign-In prompt was dismissed by user.');
        }
      });
    } else {
      setError('Google Identity Services SDK is loading. Please try clicking the Google button in a moment.');
    }
  };

  // Mobile OTP Send
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setOtpSent(true);
      setSuccess(`OTP code sent via SMS to +91 ${phone}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Mobile OTP Verify
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otpCode, role: 'STUDENT' }),
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
      <Script src="https://accounts.google.com/gsi/client" onLoad={initGoogleAuth} async defer />

      {/* Top Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            C
          </div>
          <span className="font-semibold text-slate-900 text-sm tracking-tight">CampusHub OS</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">Enterprise v2.4</span>
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">
          New user? <Link href="/signup" className="text-blue-600 font-semibold hover:underline">Create Account</Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Database & SSO Ready
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Unified campus management for modern institutions.
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            One minimal operating system connecting students, faculty, administration, and parents with real-time sync.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Real-time attendance & AI predictions',
              'Integrated placement & assignment tracking',
              'Institutional analytics & fee automation',
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

        {/* Right Column - Login Card */}
        <div className="md:col-span-7">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Sign in to your account</h2>
              <p className="text-xs text-slate-500 mt-1">Select a role demo card or sign in with your credentials</p>
            </div>

            {/* Quick Demo Role Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              {DEMO_CREDENTIALS.map((cred) => {
                const Icon = cred.icon;
                const isSelected = selectedRole === cred.role;
                return (
                  <button
                    key={cred.role}
                    type="button"
                    onClick={() => handleQuickLogin(cred)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <p className="text-xs font-semibold text-slate-900">{cred.role}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{cred.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Auth Method Tabs */}
            <div className="flex border-b border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => { setAuthTab('EMAIL'); setError(''); }}
                className={`py-2 px-4 font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  authTab === 'EMAIL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email & Password
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('OTP'); setError(''); }}
                className={`py-2 px-4 font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  authTab === 'OTP' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Mobile OTP Login
              </button>
            </div>

            {/* Single Official Google Button Container */}
            <div id="googleSignInBtn" className="flex justify-center w-full min-h-[44px]"></div>

            {/* Email Form */}
            {authTab === 'EMAIL' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@campushub.ai"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
                  ) : (
                    <><span>Continue to Dashboard</span> <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            )}

            {/* OTP Form */}
            {authTab === 'OTP' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Mobile Phone Number (+91)</label>
                      <div className="flex gap-2">
                        <span className="px-3 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 font-semibold flex items-center">+91</span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                    {error && <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">{error}</div>}
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get 6-Digit OTP Code'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                      <p className="font-semibold">{success}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Enter 6-Digit OTP Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        placeholder="••••••"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-center tracking-widest font-mono text-base font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    {error && <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">{error}</div>}
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setOtpSent(false)} className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">Back</button>
                      <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1 cursor-pointer">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify OTP & Login'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
              Need a new account? <Link href="/signup" className="text-blue-600 font-semibold hover:underline">Create an Account here</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/60 pt-4">
        <span>© 2026 CampusHub AI Technologies Inc.</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

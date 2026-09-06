'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  Mail,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Smartphone,
  History
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

export default function AccountSettingsPage() {
  const { addToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('campushub_user');
    if (u) {
      setUser(JSON.parse(u));
    }
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (oldPassword === newPassword) {
      setError('New password cannot be identical to your old password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setSuccess(true);
      addToast({
        title: 'Password Updated Successfully 🔒',
        message: 'Your account password has been updated securely.',
        type: 'success',
      });

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const getDashboardHome = () => {
    switch (user?.role) {
      case 'ADMIN': return '/dashboard/admin';
      case 'FACULTY': return '/dashboard/faculty';
      case 'STUDENT': return '/dashboard/student';
      case 'PARENT': return '/dashboard/parent';
      default: return '/dashboard/student';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <Link
            href={getDashboardHome()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <KeyRound className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Account Security & Password Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your credentials, update your password, and view account security status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Zero Trust Protected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Profile Overview */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">{user?.name || 'User Profile'}</h3>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase mt-0.5">
                  {user?.role || 'STUDENT'}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email:</span>
                <span className="font-medium truncate max-w-[160px]">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Auth Status:</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400 flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> Phone:</span>
                <span className="font-medium">{user?.phone || 'Configured'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" /> Password Security Guidelines
            </h4>
            <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-500">
              <li>Must be at least 6 characters long</li>
              <li>Encrypted securely via bcrypt hash with salt</li>
              <li>Works seamlessly across Web & Mobile apps</li>
            </ul>
          </div>
        </div>

        {/* Right Col: Change Password Form */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Update Account Password</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your current password followed by your new password.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your password has been changed successfully. You can now use your new password.</span>
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showOld ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

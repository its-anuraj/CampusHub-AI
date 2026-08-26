'use client';

import { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Building,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Server,
  Mail,
  Globe,
  Database,
  Sparkles,
  QrCode,
  KeyRound,
  ShieldAlert,
  Copy,
  Trash2,
  X
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'ACADEMICS' | 'SECURITY' | 'GATEWAYS'>('GENERAL');
  const [isSaving, setIsSaving] = useState(false);

  // 2FA states
  const [show2faModal, setShow2faModal] = useState(false);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [totpSecret, setTotpSecret] = useState('JBSWY3DPEHPK3PXP');
  const [is2faEnabled, setIs2faEnabled] = useState(true);
  const [recoveryCodes, setRecoveryCodes] = useState([
    'A9X2-74LK', '8M3B-99QZ', '4V8P-21TR', '7K9W-55JH',
    '3D6Y-88PL', '5N2M-14WQ', '9R4K-77VX', '2H8C-63ZP'
  ]);

  // Form states
  const [institutionName, setInstitutionName] = useState('CampusHub Institute of Technology');
  const [accreditation, setAccreditation] = useState('NAAC A++ (Autonomous)');
  const [campusDomain, setCampusDomain] = useState('campushub.edu.in');
  const [supportEmail, setSupportEmail] = useState('support@campushub.edu.in');

  // Academic Rules
  const [minAttendance, setMinAttendance] = useState(75);
  const [maxBacklogsAllowed, setMaxBacklogsAllowed] = useState(2);
  const [autoSmsParentAlerts, setAutoSmsParentAlerts] = useState(true);

  // Security & Maintenance
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  // Gateways
  const [smsGateway, setSmsGateway] = useState('Fast2SMS Enterprise');
  const [emailProvider, setEmailProvider] = useState('SendGrid Cloud Relay');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSaving(false);
    addToast({
      title: 'Settings Saved',
      message: 'Campus institutional configurations saved and active across all nodes.',
      type: 'success'
    });
  };

  const handleVerify2fa = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      addToast({ title: 'Invalid Code', message: 'Enter a valid 6-digit authenticator code.', type: 'warning' });
      return;
    }
    setIs2faEnabled(true);
    setShow2faModal(false);
    setVerificationCode('');
    addToast({
      title: 'Two-Factor Authentication Active! 🔐',
      message: 'Your admin account is now secured with TOTP authenticator.',
      type: 'success'
    });
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(totpSecret);
    addToast({ title: 'Secret Copied', message: 'Secret key copied to clipboard.', type: 'info' });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus System Configurations</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              Global Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure institutional profiles, academic attendance thresholds, authentication policies, and communication relays
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'GENERAL', label: 'Institutional Profile', icon: Building },
          { id: 'ACADEMICS', label: 'Academic & Attendance Rules', icon: Shield },
          { id: 'SECURITY', label: 'Security & Maintenance', icon: Lock },
          { id: 'GATEWAYS', label: 'SMS & Email Gateways', icon: Bell },
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-600 text-blue-600 bg-blue-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        {activeTab === 'GENERAL' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Institutional Identity & Domains</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">University / College Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Accreditation Grade</label>
                <input
                  type="text"
                  value={accreditation}
                  onChange={(e) => setAccreditation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Campus Primary Web Domain</label>
                <input
                  type="text"
                  value={campusDomain}
                  onChange={(e) => setCampusDomain(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Registrar & Helpdesk Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ACADEMICS' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Academic Regulations & Attendance Guardrails</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Minimum Attendance Threshold for Exam Hall Ticket (%)
                </label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={minAttendance}
                  onChange={(e) => setMinAttendance(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Students below this % receive AI warnings and parent SMS notifications.</span>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Maximum Backlogs Permitted for Placement Drives
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={maxBacklogsAllowed}
                  onChange={(e) => setMaxBacklogsAllowed(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-bold"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Automated Parent Absence Alerts</p>
                <p className="text-[11px] text-slate-500">Dispatch SMS to registered parents if student is marked ABSENT</p>
              </div>
              <button
                onClick={() => setAutoSmsParentAlerts(!autoSmsParentAlerts)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  autoSmsParentAlerts ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoSmsParentAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'SECURITY' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Platform Security & Access Protection</h2>
            <div className="space-y-4 divide-y divide-slate-100">
              {/* Authenticator App 2FA Card */}
              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Google / Microsoft Authenticator (2FA)</h3>
                    <p className="text-[11px] text-slate-500">Protect account logins with time-based 6-digit TOTP one-time passwords</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBackupCodesModal(true)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 transition"
                  >
                    View Backup Codes
                  </button>
                  <button
                    onClick={() => setShow2faModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    Configure 2FA
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-xs font-bold text-slate-900">Campus Maintenance Mode</p>
                  <p className="text-[11px] text-slate-500">Temporarily restrict student/parent logins during semester rollover</p>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    maintenanceMode ? 'bg-rose-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-xs font-bold text-slate-900">Enforce Multi-Factor Authentication (MFA)</p>
                  <p className="text-[11px] text-slate-500">Require mobile OTP verification on login for Admin and Faculty</p>
                </div>
                <button
                  onClick={() => setMfaEnforced(!mfaEnforced)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    mfaEnforced ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      mfaEnforced ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Session Inactivity Timeout (Minutes)</label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-48 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-bold"
                />
              </div>

              {/* Active Device Sessions */}
              <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Active Login Sessions</h3>
                    <p className="text-[11px] text-slate-500">Devices currently authenticated to your CampusHub account</p>
                  </div>
                  <button
                    onClick={() => addToast({ title: 'Sessions Revoked', message: 'Logged out 2 remote devices.', type: 'info' })}
                    className="px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-[11px] font-semibold transition"
                  >
                    Revoke Other Sessions
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Windows PC – Chrome Browser (Current Session)</p>
                      <p className="text-[11px] text-slate-500 font-mono">IP: 192.168.1.42 • Campus Secure Wi-Fi</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Active Now
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Apple iPhone 15 Pro – CampusHub Mobile</p>
                      <p className="text-[11px] text-slate-500 font-mono">IP: 49.37.12.8 • 3 hours ago</p>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px]">Idle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'GATEWAYS' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Third-Party Communication Relays</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-blue-600" /> SMS OTP Gateway
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Connected
                  </span>
                </div>
                <input
                  type="text"
                  value={smsGateway}
                  onChange={(e) => setSmsGateway(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-indigo-600" /> Transactional Email Relay
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <input
                  type="text"
                  value={emailProvider}
                  onChange={(e) => setEmailProvider(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2FA Setup Modal */}
      {show2faModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1 w-fit">
                  <KeyRound className="w-3.5 h-3.5" /> TWO-FACTOR AUTHENTICATION
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Set Up Authenticator App</h3>
              </div>
              <button onClick={() => setShow2faModal(false)} className="p-1 rounded-xl text-slate-400 hover:bg-slate-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Scan this QR code with <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, or <strong>Authy</strong>:
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-center">
                <QrCode className="w-44 h-44 text-slate-900" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Manual Secret Key</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={totpSecret}
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 text-xs"
                  />
                  <button
                    onClick={handleCopySecret}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Copy Secret"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleVerify2fa} className="space-y-3 pt-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Enter 6-Digit Authenticator Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-center text-lg tracking-widest font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShow2faModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                  >
                    Verify & Activate 2FA
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Backup Recovery Codes Modal */}
      {showBackupCodesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit">
                  <ShieldAlert className="w-3.5 h-3.5" /> EMERGENCY RECOVERY ACCESS
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">2FA Backup Recovery Codes</h3>
              </div>
              <button onClick={() => setShowBackupCodesModal(false)} className="p-1 rounded-xl text-slate-400 hover:bg-slate-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              If you lose access to your authenticator app, each of these one-time codes can be used once to regain access to your account. Store them in a safe place.
            </p>

            <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs font-bold text-slate-900 text-center">
              {recoveryCodes.map((code, idx) => (
                <div key={idx} className="p-1.5 bg-white rounded-lg border border-slate-200">
                  {code}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(recoveryCodes.join('\n'));
                  addToast({ title: 'Codes Copied', message: 'All backup recovery codes copied.', type: 'info' });
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Copy All Codes
              </button>
              <button
                onClick={() => setShowBackupCodesModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

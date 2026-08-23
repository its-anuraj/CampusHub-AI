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
  Smartphone,
  Globe,
  Database,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'ACADEMICS' | 'SECURITY' | 'GATEWAYS'>('GENERAL');
  const [isSaving, setIsSaving] = useState(false);

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
    toast.success('Campus institutional configurations saved and active across all nodes.', 'Settings Updated');
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
            <h2 className="text-sm font-bold text-slate-900">Platform Security & Maintenance Controls</h2>
            <div className="space-y-4 divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-2">
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
    </div>
  );
}

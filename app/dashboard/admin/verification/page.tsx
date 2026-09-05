'use client';

import { useState, useEffect } from 'react';
import {
  UserCheck,
  ShieldCheck,
  AlertCircle,
  Plus,
  Check,
  X,
  Loader2,
  FileSpreadsheet,
  Download,
  Users,
  Search,
  School,
  Lock,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { DEPARTMENTS } from '@/lib/departments';

interface PendingStudent {
  id: string;
  rollNumber: string;
  department: string;
  year: number;
  semester: number;
  section: string;
  verificationStatus: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
  };
}

interface AdmissionRecord {
  id: string;
  admissionNumber: string;
  studentName: string;
  department: string;
  initialYear: number;
  initialSemester: number;
  initialSection: string;
  guardianPhone?: string;
  guardianName?: string;
  isClaimed: boolean;
  claimedUserId?: string;
  createdAt: string;
}

export default function AdminVerificationDeskPage() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'PENDING' | 'MASTER'>('PENDING');
  const [loading, setLoading] = useState(false);
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
  const [admissionMaster, setAdmissionMaster] = useState<AdmissionRecord[]>([]);
  const [stats, setStats] = useState({ pendingCount: 0, masterTotal: 0, claimedCount: 0 });

  // Add Master Record Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [admNumber, setAdmNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [initialSection, setInitialSection] = useState('A');
  const [guardianPhone, setGuardianPhone] = useState('');

  // Approval Modal
  const [approvingStudent, setApprovingStudent] = useState<PendingStudent | null>(null);
  const [assignedRoll, setAssignedRoll] = useState('');
  const [assignedSec, setAssignedSec] = useState('A');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verification');
      const data = await res.json();
      if (res.ok) {
        setPendingStudents(data.pendingStudents || []);
        setAdmissionMaster(data.admissionMasterRoster || []);
        setStats(data.stats || { pendingCount: 0, masterTotal: 0, claimedCount: 0 });
      }
    } catch (err) {
      toast.error('Failed to load verification records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMasterRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admNumber.trim() || !studentName.trim()) {
      toast.warning('Admission Number and Name are required');
      return;
    }

    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_ADMISSION_RECORD',
          admissionNumber: admNumber.trim(),
          studentName: studentName.trim(),
          department,
          initialYear: 1,
          initialSemester: 1,
          initialSection: initialSection.toUpperCase(),
          guardianPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add record');

      toast.success(`Admission record for ${studentName} whitelisted!`, 'Master Roster Updated');
      setShowAddModal(false);
      setAdmNumber('');
      setStudentName('');
      setGuardianPhone('');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to whitelist record');
    }
  };

  const handleApprove = async () => {
    if (!approvingStudent) return;

    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE_STUDENT',
          studentId: approvingStudent.id,
          officialRollNumber: assignedRoll || approvingStudent.rollNumber,
          department: approvingStudent.department,
          year: approvingStudent.year || 1,
          semester: approvingStudent.semester || 1,
          section: assignedSec,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Approval failed');

      toast.success(`${approvingStudent.user.name} verified and allocated Section ${assignedSec}!`, 'Student Verified');
      setApprovingStudent(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error approving student');
    }
  };

  const handleReject = async (studentId: string, name: string) => {
    if (!confirm(`Are you sure you want to reject registration for ${name}?`)) return;

    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REJECT_STUDENT',
          studentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rejection failed');

      toast.info(`Registration rejected for ${name}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error rejecting student');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Student Identity & Admission Verification Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              Anti-Fraud Gate
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pre-approved admission whitelist roster, 1st-year student onboarding approval, and official section assignment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Admission Whitelist Record
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-amber-600 font-bold uppercase">Pending Verification Requests</span>
          <p className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {stats.pendingCount} Waiting
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-blue-600 font-bold uppercase">Admission Master Whitelist</span>
          <p className="text-2xl font-bold text-blue-600 mt-1 flex items-center gap-2">
            <School className="w-5 h-5" /> {stats.masterTotal} Total Pre-Approved
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-emerald-600 font-bold uppercase">Verified & Claimed Identities</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> {stats.claimedCount} Accounts Bound
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`py-2.5 px-5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'PENDING'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <AlertCircle className="w-4 h-4" /> Pending Approvals ({pendingStudents.length})
        </button>
        <button
          onClick={() => setActiveTab('MASTER')}
          className={`py-2.5 px-5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'MASTER'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <School className="w-4 h-4" /> Admission Master Roster ({admissionMaster.length})
        </button>
      </div>

      {/* Tab 1: Pending Approvals */}
      {activeTab === 'PENDING' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Self-Registered Student Approval Queue
            </h3>
            <span className="text-xs text-slate-400">Locked from accessing courses until verified</span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            </div>
          ) : pendingStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-1">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700">Verification Queue is Clear!</p>
              <p>All student registrations are fully verified and mapped to official sections.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Student Details</th>
                    <th className="px-5 py-3.5">Entered Roll No</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Registered On</th>
                    <th className="px-5 py-3.5 text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {pendingStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{st.user.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{st.user.email}</p>
                        {st.user.phone && <p className="text-[10px] text-slate-400">Phone: {st.user.phone}</p>}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-blue-600">{st.rollNumber}</td>
                      <td className="px-5 py-3.5">{st.department}</td>
                      <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                        {new Date(st.user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setApprovingStudent(st);
                            setAssignedRoll(st.rollNumber);
                            setAssignedSec('A');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          Verify & Allocate Section
                        </button>
                        <button
                          onClick={() => handleReject(st.id, st.user.name)}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Admission Master Roster */}
      {activeTab === 'MASTER' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Official Pre-Approved Admissions Roster
              </h3>
              <p className="text-[11px] text-slate-500">
                Incoming 1st year student whitelist. Students claiming these roll numbers get auto-verified.
              </p>
            </div>
            <button
              onClick={() => {
                const csv = `AdmissionNumber,StudentName,Department,Section,GuardianPhone\nCS2026001,Aarav Sharma,CSE,A,9876500001\nIT2026002,Neha Varma,IT,B,9876500002`;
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'admission-master-template.csv';
                a.click();
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> CSV Template
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Admission / Roll No</th>
                  <th className="px-5 py-3.5">Student Name</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Default Section</th>
                  <th className="px-5 py-3.5">Guardian Info</th>
                  <th className="px-5 py-3.5 text-right">Claim Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {admissionMaster.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-600">{adm.admissionNumber}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{adm.studentName}</td>
                    <td className="px-5 py-3.5">{adm.department}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold">
                        Sec {adm.initialSection}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                      {adm.guardianPhone || 'Not Specified'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          adm.isClaimed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {adm.isClaimed ? 'CLAIMED & BOUND' : 'UNCLAIMED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Master Record Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Pre-Approved Admission Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMasterRecord} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Official Admission / Roll No</label>
                <input
                  type="text"
                  placeholder="e.g. CS2026101"
                  value={admNumber}
                  onChange={(e) => setAdmNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Section</label>
                  <select
                    value={initialSection}
                    onChange={(e) => setInitialSection(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none font-bold"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Guardian Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval & Section Allotment Modal */}
      {approvingStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setApprovingStudent(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Verify & Allocate Section</h3>
              <button onClick={() => setApprovingStudent(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 space-y-1">
              <p>
                <strong>Student:</strong> {approvingStudent.user.name} ({approvingStudent.user.email})
              </p>
              <p>
                <strong>Department:</strong> {approvingStudent.department}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Official Roll Number</label>
                <input
                  type="text"
                  value={assignedRoll}
                  onChange={(e) => setAssignedRoll(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Allot Class Section</label>
                <select
                  value={assignedSec}
                  onChange={(e) => setAssignedSec(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none font-bold"
                >
                  <option value="A">Section A (Room CS-101)</option>
                  <option value="B">Section B (Room CS-102)</option>
                  <option value="C">Section C (Room CS-103)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setApprovingStudent(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Confirm Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

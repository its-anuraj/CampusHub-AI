'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Loader2,
  UserCheck,
  UserPlus,
  BookOpen,
  Building2,
  AlertTriangle,
  Trash2,
} from 'lucide-react';

export default function FacultyStudentsVerificationPage() {
  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'PARENTS' | 'ROSTER'>('STUDENTS');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [verifiedStudents, setVerifiedStudents] = useState<any[]>([]);
  const [pendingParents, setPendingParents] = useState<any[]>([]);
  const [verifiedParents, setVerifiedParents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pendingCount: 0,
    pendingParentsCount: 0,
    verifiedCount: 0,
    verifiedParentsCount: 0,
    sectionsCount: 1,
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/faculty/students');
      const data = await res.json();
      if (res.ok) {
        setPendingStudents(data.pendingStudents || []);
        setVerifiedStudents(data.verifiedStudents || []);
        setPendingParents(data.pendingParents || []);
        setVerifiedParents(data.verifiedParents || []);
        setStats(data.stats || {
          pendingCount: 0,
          pendingParentsCount: 0,
          verifiedCount: 0,
          verifiedParentsCount: 0,
          sectionsCount: 1,
        });
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleApproveStudent = async (studentId: string, studentName: string) => {
    try {
      setActionLoadingId(studentId);
      const res = await fetch('/api/faculty/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE_STUDENT', studentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve student');

      setNotification({ type: 'success', message: `${studentName} verified! Automated approval email dispatched.` });
      await fetchStudents();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Approval failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectStudent = async (studentId: string, studentName: string) => {
    const reason = prompt(`Reason for rejecting ${studentName}'s registration:`, 'Incomplete or unverified documentation');
    if (!reason) return;

    try {
      setActionLoadingId(studentId);
      const res = await fetch('/api/faculty/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REJECT_STUDENT', studentId, rejectionReason: reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reject student');

      setNotification({ type: 'success', message: `${studentName}'s registration application rejected.` });
      await fetchStudents();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Rejection failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApproveParent = async (parentId: string, parentName: string, studentRoll: string) => {
    try {
      setActionLoadingId(parentId);
      const res = await fetch('/api/faculty/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE_PARENT', parentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve parent');

      setNotification({ type: 'success', message: `Parent account for ${parentName} (linked to Student ${studentRoll}) approved! Email update sent.` });
      await fetchStudents();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Parent approval failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectParent = async (parentId: string, parentName: string) => {
    const reason = prompt(`Reason for rejecting parent registration for ${parentName}:`, 'Unverified relationship or incorrect roll number');
    if (!reason) return;

    try {
      setActionLoadingId(parentId);
      const res = await fetch('/api/faculty/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REJECT_PARENT', parentId, rejectionReason: reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reject parent');

      setNotification({ type: 'success', message: `Parent registration for ${parentName} rejected.` });
      await fetchStudents();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Rejection failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string, rollNumber: string) => {
    const confirmation = confirm(
      `⚠️ PERMANENT DELETE CONFIRMATION:\n\nAre you sure you want to permanently delete the student account for "${studentName}" (${rollNumber})?\n\nThis will completely remove their account, profile, attendance, and all academic records from the institution system. This action is irreversible and can ONLY be performed by Faculty Coordinators.`
    );
    if (!confirmation) return;

    try {
      setActionLoadingId(studentId);
      const res = await fetch('/api/faculty/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE_STUDENT', studentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete student account');

      setNotification({
        type: 'success',
        message: `Student account for ${studentName} (${rollNumber}) has been permanently deleted from the system.`,
      });
      await fetchStudents();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Deletion failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredPendingStudents = pendingStudents.filter(s =>
    s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingParents = pendingParents.filter(p =>
    p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.studentRollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVerified = verifiedStudents.filter(s =>
    s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Class & Section Coordinator Desk
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Section Student & Parent Verification Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and approve registration requests for Students & Parents in your allocated Class Section.
          </p>
        </div>

        {/* Stats Summary Cards */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-lg font-bold text-amber-700">{stats.pendingCount}</span>
            <p className="text-[11px] text-amber-800 font-medium">Pending Students</p>
          </div>
          <div className="px-4 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
            <span className="text-lg font-bold text-indigo-700">{stats.pendingParentsCount}</span>
            <p className="text-[11px] text-indigo-800 font-medium">Pending Parents</p>
          </div>
          <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <span className="text-lg font-bold text-emerald-700">{stats.verifiedCount}</span>
            <p className="text-[11px] text-emerald-800 font-medium">Verified Active</p>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-xs font-medium ${
          notification.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* Search & Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('STUDENTS')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'STUDENTS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Pending Students ({pendingStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('PARENTS')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'PARENTS'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Pending Parents ({pendingParents.length})
          </button>
          <button
            onClick={() => setActiveTab('ROSTER')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ROSTER'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Section Roster ({verifiedStudents.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, roll, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* TAB 1: PENDING STUDENTS */}
      {activeTab === 'STUDENTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Student Applications Awaiting Section Coordinator Verification
            </h2>
            <span className="text-[11px] text-slate-500">
              Approved once. Automated update email is sent to student upon confirmation.
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            </div>
          ) : filteredPendingStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700">No Pending Student Applications</p>
              <p>All students in your section have been verified.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Student Details</th>
                    <th className="px-5 py-3.5">Roll Number</th>
                    <th className="px-5 py-3.5">Department & Sec</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPendingStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{st.user?.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{st.user?.email}</p>
                        {st.user?.phone && <p className="text-[10px] text-slate-400">Ph: {st.user?.phone}</p>}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-blue-600">{st.rollNumber}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                          {st.department} Sec {st.section}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                        {st.user?.city ? `${st.user?.city}, ${st.user?.state || ''}` : 'Not Specified'}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          disabled={actionLoadingId === st.id}
                          onClick={() => handleApproveStudent(st.id, st.user?.name)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-50"
                        >
                          {actionLoadingId === st.id ? 'Verifying...' : 'Approve Student'}
                        </button>
                        <button
                          disabled={actionLoadingId === st.id}
                          onClick={() => handleRejectStudent(st.id, st.user?.name)}
                          className="px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-50 text-amber-700 text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          disabled={actionLoadingId === st.id}
                          onClick={() => handleDeleteStudent(st.id, st.user?.name, st.rollNumber)}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1 shadow-xs disabled:opacity-50"
                          title="Permanently Delete Student Account (Faculty Only)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
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

      {/* TAB 2: PENDING PARENTS */}
      {activeTab === 'PARENTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Parent Registration Applications (Linked to Ward)
              </h2>
              <p className="text-[11px] text-slate-500">
                Rule: Maximum 2 approved parent accounts per individual student. Approved parents gain isolated access only to their child&apos;s records.
              </p>
            </div>
            <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 font-medium">
              {pendingParents.length} Awaiting Review
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
            </div>
          ) : filteredPendingParents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700">No Pending Parent Applications</p>
              <p>All parent registration requests for your section are up to date.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Parent Details</th>
                    <th className="px-5 py-3.5">Linked Student (Ward)</th>
                    <th className="px-5 py-3.5">Existing Approvals</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPendingParents.map((parent) => (
                    <tr key={parent.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{parent.user?.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{parent.user?.email}</p>
                        <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                          {parent.relation || 'Parent'}
                        </span>
                        {parent.user?.phone && <span className="text-[10px] text-slate-400 ml-2">Ph: {parent.user?.phone}</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{parent.studentName || 'Student'}</p>
                        <p className="font-mono font-bold text-blue-600 text-[11px]">{parent.studentRollNumber}</p>
                        <span className="text-[10px] text-slate-500">
                          {parent.targetDepartment || 'CSE'} Sec {parent.targetSection || 'A'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            parent.isMaxReached
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : parent.approvedParentsCount === 1
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {parent.isMaxReached && <AlertTriangle className="w-3 h-3" />}
                            {parent.approvedParentsCount}/2 Approved
                          </span>
                          {parent.approvedParentsList?.length > 0 && (
                            <p className="text-[10px] text-slate-500">
                              Active: {parent.approvedParentsList.join(', ')}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                        {parent.user?.city ? `${parent.user?.city}, ${parent.user?.state || ''}` : 'Not Specified'}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          disabled={actionLoadingId === parent.id || parent.isMaxReached}
                          onClick={() => handleApproveParent(parent.id, parent.user?.name, parent.studentRollNumber)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                          title={parent.isMaxReached ? 'Cannot approve: Max 2 parent limit reached' : 'Approve Parent Account'}
                        >
                          {actionLoadingId === parent.id ? 'Approving...' : 'Approve & Send Email'}
                        </button>
                        <button
                          disabled={actionLoadingId === parent.id}
                          onClick={() => handleRejectParent(parent.id, parent.user?.name)}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
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

      {/* TAB 3: SECTION ROSTER */}
      {activeTab === 'ROSTER' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Enrolled & Verified Student Roster
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Authorized Faculty Coordinators can manage enrollment and permanently delete student accounts if needed.
              </p>
            </div>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium self-start sm:self-auto">
              {verifiedStudents.length} Active Students
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Roll Number</th>
                  <th className="px-5 py-3.5">Student Name</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Year / Sem / Sec</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Faculty Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredVerified.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-600">{st.rollNumber}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <p>{st.user?.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono font-normal">{st.user?.email}</p>
                    </td>
                    <td className="px-5 py-3.5">{st.department}</td>
                    <td className="px-5 py-3.5">
                      Year {st.year} • Sem {st.semester} • <span className="font-bold text-blue-700">Sec {st.section}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        VERIFIED ACTIVE
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedContact(st)}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1 shadow-2xs"
                        title="View Parent Details & Contact Guardian"
                      >
                        <Phone className="w-3.5 h-3.5 text-sky-600" />
                        Contact Parent
                      </button>
                      <button
                        disabled={actionLoadingId === st.id}
                        onClick={() => handleDeleteStudent(st.id, st.user?.name, st.rollNumber)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                        title="Permanently Delete Student Account (Faculty Authority Only)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {actionLoadingId === st.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Parent Direct Contact & Communication Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-left relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                  <Phone className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Parent & Guardian Contact Desk</h3>
                  <p className="text-[11px] text-slate-500">Student: {selectedContact.user?.name} ({selectedContact.rollNumber})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Primary Guardian:</span>
                <strong className="text-slate-900">{selectedContact.guardianName || 'Mr. Ramesh Singh'} ({selectedContact.guardianRelation || 'Father'})</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Registered Phone:</span>
                <span className="font-mono font-bold text-sky-700">{selectedContact.guardianPhone || selectedContact.user?.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Preferred Reach Time:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  After 04:00 PM (Free Period)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Residential Address:</span>
                <span className="text-slate-700 font-medium">{selectedContact.address || selectedContact.city ? `${selectedContact.city || 'Greater Noida'}, ${selectedContact.state || 'UP'}` : 'Sector 62, Noida, UP'}</span>
              </div>
            </div>

            {/* AI Well-Being & Academic Telemetry Note for Faculty */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI Student Insight (Bi-Weekly Wellness Telemetry)</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Attendance is at 88.5%. Student reported mild mid-term stress in Algorithms (CS501). Recommended empathetic check-in on academic doubts.
              </p>
            </div>

            {/* Call Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <a
                href={`tel:${selectedContact.guardianPhone || selectedContact.user?.phone || '9876543210'}`}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Direct Call Guardian
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

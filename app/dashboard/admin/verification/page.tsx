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
  Building2,
  BookOpen,
  Mail,
  UserCog,
  CheckCircle2,
  AlertTriangle,
  Shield,
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
    city?: string;
    state?: string;
    pincode?: string;
    address?: string;
    createdAt: string;
  };
}

interface PendingFaculty {
  id: string;
  employeeId: string;
  department: string;
  designation: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    state?: string;
    pincode?: string;
    address?: string;
    createdAt: string;
  };
}

interface PendingAdmin {
  id: string;
  employeeId: string;
  departmentRole: string;
  designation: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    state?: string;
    pincode?: string;
    address?: string;
    createdAt: string;
  };
}

interface PendingParent {
  id: string;
  relation: string;
  studentRollNumber: string;
  studentName: string;
  targetDepartment: string;
  targetYear: number;
  targetSemester: number;
  targetSection: string;
  approvedParentsCount: number;
  approvedParentsList: string[];
  isMaxReached: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    state?: string;
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

interface FacultyMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface ClassSectionRecord {
  id: string;
  department: string;
  year: number;
  semester: number;
  sectionName: string;
  classAdvisorId?: string;
}

export default function AdminVerificationDeskPage() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'STAFF_ADMINS' | 'STUDENTS' | 'FACULTY' | 'PARENTS' | 'COORDINATORS' | 'MASTER'>('STAFF_ADMINS');
  const [loading, setLoading] = useState(false);
  const [pendingAdmins, setPendingAdmins] = useState<PendingAdmin[]>([]);
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
  const [pendingFaculty, setPendingFaculty] = useState<PendingFaculty[]>([]);
  const [pendingParents, setPendingParents] = useState<PendingParent[]>([]);
  const [admissionMaster, setAdmissionMaster] = useState<AdmissionRecord[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [classSections, setClassSections] = useState<ClassSectionRecord[]>([]);
  const [stats, setStats] = useState({
    pendingAdminsCount: 0,
    pendingStudentsCount: 0,
    pendingFacultyCount: 0,
    pendingParentsCount: 0,
    pendingCount: 0,
    masterTotal: 0,
    claimedCount: 0,
    sectionsCount: 0,
  });

  // Coordinator Assignment State
  const [coordDept, setCoordDept] = useState('CSE');
  const [coordYear, setCoordYear] = useState('1');
  const [coordSem, setCoordSem] = useState('1');
  const [coordSec, setCoordSec] = useState('A');
  const [coordFacultyId, setCoordFacultyId] = useState('');
  const [savingCoord, setSavingCoord] = useState(false);

  // Add Master Record Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [admNumber, setAdmNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [initialSection, setInitialSection] = useState('A');
  const [guardianPhone, setGuardianPhone] = useState('');

  // Approval Modal for Student
  const [approvingStudent, setApprovingStudent] = useState<PendingStudent | null>(null);
  const [assignedRoll, setAssignedRoll] = useState('');
  const [assignedSec, setAssignedSec] = useState('A');

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('campushub_user');
    if (u) {
      try {
        setCurrentUser(JSON.parse(u));
      } catch {}
    }
  }, []);

  const isDirector = !currentUser || (currentUser.role === 'ADMIN' && (currentUser.adminProfile?.departmentRole === 'DIRECTOR' || !currentUser.adminProfile?.departmentRole || currentUser.email === 'ajsinghindolia@gmail.com'));

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verification');
      const data = await res.json();
      if (res.ok) {
        setPendingAdmins(data.pendingAdmins || []);
        setPendingStudents(data.pendingStudents || []);
        setPendingFaculty(data.pendingFaculty || []);
        setPendingParents(data.pendingParents || []);
        setAdmissionMaster(data.admissionMasterRoster || []);
        setFacultyList(data.facultyList || []);
        setClassSections(data.classSections || []);
        if (data.facultyList && data.facultyList.length > 0 && !coordFacultyId) {
          setCoordFacultyId(data.facultyList[0].id);
        }
        setStats(data.stats || {
          pendingAdminsCount: 0,
          pendingStudentsCount: 0,
          pendingFacultyCount: 0,
          pendingParentsCount: 0,
          pendingCount: 0,
          masterTotal: 0,
          claimedCount: 0,
          sectionsCount: 0,
        });
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

  const handleAssignCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordFacultyId) {
      toast.warning('Please select a faculty member');
      return;
    }

    setSavingCoord(true);
    const selectedFac = facultyList.find(f => f.id === coordFacultyId);

    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ASSIGN_COORDINATOR',
          department: coordDept,
          year: coordYear,
          semester: coordSem,
          section: coordSec,
          facultyId: coordFacultyId,
          facultyName: selectedFac?.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to assign coordinator');

      toast.success(`${selectedFac?.name} assigned as Coordinator for ${coordDept} Sec ${coordSec}!`, 'Coordinator Assigned');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error assigning coordinator');
    } finally {
      setSavingCoord(false);
    }
  };

  const handleApproveStudent = async () => {
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

      toast.success(`${approvingStudent.user.name} approved! Update email dispatched.`, 'Student Approved');
      setApprovingStudent(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error approving student');
    }
  };

  const handleRejectStudent = async (studentId: string, name: string) => {
    if (!confirm(`Are you sure you want to reject registration for student ${name}?`)) return;

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

  const handleApproveFaculty = async (facultyId: string, facultyName: string) => {
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE_FACULTY',
          facultyId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Faculty approval failed');

      toast.success(`Faculty account for ${facultyName} approved! Update email dispatched.`, 'Faculty Approved');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error approving faculty member');
    }
  };

  const handleRejectFaculty = async (facultyId: string, facultyName: string) => {
    if (!confirm(`Are you sure you want to reject registration for faculty ${facultyName}?`)) return;

    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REJECT_FACULTY',
          facultyId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rejection failed');

      toast.info(`Faculty registration rejected for ${facultyName}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error rejecting faculty member');
    }
  };

  const handleApproveParent = async (parentId: string, parentName: string, studentRoll: string) => {
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE_PARENT',
          parentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Parent approval failed');

      toast.success(`Parent account for ${parentName} (linked to Student ${studentRoll}) approved! Email update dispatched.`, 'Parent Approved');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error approving parent account');
    }
  };

  const handleRejectParent = async (parentId: string, parentName: string) => {
    if (!confirm(`Are you sure you want to reject registration for parent ${parentName}?`)) return;

    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REJECT_PARENT',
          parentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rejection failed');

      toast.info(`Parent registration rejected for ${parentName}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error rejecting parent account');
    }
  };

  const handleApproveAdmin = async (adminId: string, adminName: string, roleName: string) => {
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE_ADMIN',
          adminId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Department Admin approval failed');

      toast.success(`Department Admin account for ${adminName} (${roleName}) approved! Notification email dispatched.`, 'Admin Approved');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error approving department administrator');
    }
  };

  const handleRejectAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Are you sure you want to reject registration for Administrator ${adminName}?`)) return;

    try {
      const res = await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REJECT_ADMIN',
          adminId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rejection failed');

      toast.info(`Department Admin registration rejected for ${adminName}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Error rejecting department administrator');
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isDirector ? "Director's Admin Staff Clearance Desk" : "Institution Verification & Coordinator Desk"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              {isDirector ? "Director Exclusive" : "Admin Gate"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isDirector
              ? "Review and authorize department administrator accounts (Placement Cell, Fees & Accounts, Library, Event Manager, Academic Admin, Hostel Warden). Student, faculty & parent verifications are delegated to departmental operational staff."
              : "Review student, faculty & parent applications, enforce 2-parent per student security limits, and appoint Section Coordinators."}
          </p>
        </div>

        {!isDirector && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Whitelist Admission Record
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      {isDirector ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] text-blue-600 font-bold uppercase">Pending Staff Approvals</span>
            <p className="text-2xl font-bold text-blue-600 mt-1 flex items-center gap-2">
              <Shield className="w-5 h-5" /> {pendingAdmins.length}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] text-emerald-600 font-bold uppercase">Staff Clearance Status</span>
            <p className="text-lg font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5" /> {pendingAdmins.length === 0 ? 'All Clear' : `${pendingAdmins.length} Awaiting`}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] text-purple-600 font-bold uppercase">Active Departments</span>
            <p className="text-2xl font-bold text-purple-600 mt-1 flex items-center gap-2">
              <Building2 className="w-5 h-5" /> 10 Depts
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Campus Governance</span>
            <p className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-blue-600" /> Director Gate
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] text-blue-600 font-bold uppercase">Staff Admins</span>
            <p className="text-2xl font-bold text-blue-600 mt-1 flex items-center gap-2">
              <Shield className="w-5 h-5" /> {stats.pendingAdminsCount}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] text-amber-600 font-bold uppercase">Pending Students</span>
            <p className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> {stats.pendingStudentsCount}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] text-indigo-600 font-bold uppercase">Pending Faculty</span>
            <p className="text-2xl font-bold text-indigo-600 mt-1 flex items-center gap-2">
              <Building2 className="w-5 h-5" /> {stats.pendingFacultyCount}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] text-purple-600 font-bold uppercase">Pending Parents</span>
            <p className="text-2xl font-bold text-purple-600 mt-1 flex items-center gap-2">
              <Users className="w-5 h-5" /> {stats.pendingParentsCount}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] text-emerald-600 font-bold uppercase">Allocated Sections</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> {stats.sectionsCount}
            </p>
          </div>
        </div>
      )}

      {/* Director Delegation Informational Callout */}
      {isDirector && (
        <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-950">Departmental Verification Delegation Active</h4>
            <p className="text-[11px] text-blue-800/80 mt-0.5 leading-relaxed">
              As College Director, your desk exclusively clears and authorizes <strong>Department Administrative Staff & Cell Heads</strong> (TPO, Finance, Library, Events, Academics, Hostel). Operational Student and Parent verifications are delegated to the <strong>Academic Administration & Registrar Desk</strong>, and Faculty onboarding is vetted by respective <strong>Department HODs</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Tabs (Only for Non-Director Operational Staff) */}
      {!isDirector && (
        <div className="flex border-b border-slate-200 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('STAFF_ADMINS')}
            className={`py-2.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'STAFF_ADMINS'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield className="w-4 h-4" /> Staff & Admin Approvals ({pendingAdmins.length})
          </button>
          <button
            onClick={() => setActiveTab('STUDENTS')}
            className={`py-2.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'STUDENTS'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" /> Student Approvals ({pendingStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('FACULTY')}
            className={`py-2.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'FACULTY'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" /> Faculty Approvals ({pendingFaculty.length})
          </button>
          <button
            onClick={() => setActiveTab('PARENTS')}
            className={`py-2.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'PARENTS'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" /> Parent Approvals ({pendingParents.length})
          </button>
          <button
            onClick={() => setActiveTab('COORDINATORS')}
            className={`py-2.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'COORDINATORS'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserCog className="w-4 h-4" /> Appoint Section Coordinators
          </button>
          <button
            onClick={() => setActiveTab('MASTER')}
            className={`py-2.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'MASTER'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <School className="w-4 h-4" /> Admission Master ({admissionMaster.length})
          </button>
        </div>
      )}

      {/* Tab 0: Staff & Admin Approvals (Director Exclusive Desk) */}
      {(isDirector || activeTab === 'STAFF_ADMINS') && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Department Administrator Registration Applications
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  College Director Exclusive Desk
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Review and approve staff administrators (Placement Cell, Fees Department, Library, Event Manager, Club Manager, Academic Admin, Hostel Warden).
                Upon Director approval, an email update is sent enabling dedicated department workspace access.
              </p>
            </div>
            <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-medium">
              {pendingAdmins.length} Awaiting Director Approval
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            </div>
          ) : pendingAdmins.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-1">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700">No Pending Administrator Applications</p>
              <p>All department staff registration requests have been approved by the College Director.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Staff Name & Contact</th>
                    <th className="px-5 py-3.5">Employee ID</th>
                    <th className="px-5 py-3.5">Department Role</th>
                    <th className="px-5 py-3.5">Designation</th>
                    <th className="px-5 py-3.5">Residential Location</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {pendingAdmins.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{adm.user.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{adm.user.email}</p>
                        {adm.user.phone && <p className="text-[10px] text-slate-400 font-mono">Ph: +91 {adm.user.phone}</p>}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-blue-600">{adm.employeeId}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[11px]">
                          {adm.departmentRole.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 font-medium">{adm.designation || 'Department Administrator'}</td>
                      <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                        {adm.user.city ? `${adm.user.city}, ${adm.user.state || ''} - ${adm.user.pincode || ''}` : 'Not Specified'}
                        {adm.user.address && <p className="text-[10px] text-slate-400 truncate max-w-xs">{adm.user.address}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleApproveAdmin(adm.id, adm.user.name, adm.departmentRole)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          Approve & Send Email
                        </button>
                        <button
                          onClick={() => handleRejectAdmin(adm.id, adm.user.name)}
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

      {/* Tab 1: Student Approvals */}
      {activeTab === 'STUDENTS' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Student Registration Applications
              </h3>
              <p className="text-[11px] text-slate-500">
                Approving sends an automated notification email allowing the student to log in easily with their registered credentials.
              </p>
            </div>
            <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-medium">
              {pendingStudents.length} Awaiting Verification
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            </div>
          ) : pendingStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-1">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700">No Pending Student Applications</p>
              <p>All registered students are verified and mapped to official class sections.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Student Details</th>
                    <th className="px-5 py-3.5">Roll / Admission No</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {pendingStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{st.user.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{st.user.email}</p>
                        {st.user.phone && <p className="text-[10px] text-slate-400">Ph: {st.user.phone}</p>}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-blue-600">{st.rollNumber}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                          {st.department}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                        {st.user.city ? `${st.user.city}, ${st.user.state || ''}` : 'Not Specified'}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setApprovingStudent(st);
                            setAssignedRoll(st.rollNumber);
                            setAssignedSec(st.section || 'A');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          Approve & Notify
                        </button>
                        <button
                          onClick={() => handleRejectStudent(st.id, st.user.name)}
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

      {/* Tab 2: Faculty Approvals */}
      {activeTab === 'FACULTY' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Faculty Registration Applications (Admin Verified)
              </h3>
              <p className="text-[11px] text-slate-500">
                Mandatory Employee ID & Department check. Upon approval, an email update is sent enabling full faculty portal access.
              </p>
            </div>
            <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 font-medium">
              {pendingFaculty.length} Awaiting Verification
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            </div>
          ) : pendingFaculty.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-1">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700">No Pending Faculty Applications</p>
              <p>All faculty registrations have been reviewed and verified by the Administrator.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Faculty Member</th>
                    <th className="px-5 py-3.5">Employee ID</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Designation</th>
                    <th className="px-5 py-3.5">Residential Location</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {pendingFaculty.map((fac) => (
                    <tr key={fac.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{fac.user.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{fac.user.email}</p>
                        {fac.user.phone && <p className="text-[10px] text-slate-400">Ph: {fac.user.phone}</p>}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-indigo-600">{fac.employeeId}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                          {fac.department}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{fac.designation || 'Assistant Professor'}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-slate-900 font-semibold">
                          {fac.user.city ? `${fac.user.city}, ${fac.user.state || ''}` : 'Location Pending'}
                        </p>
                        {fac.user.address && (
                          <p className="text-[10px] text-slate-500 max-w-xs truncate" title={fac.user.address}>
                            {fac.user.address} {fac.user.pincode ? `(${fac.user.pincode})` : ''}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleApproveFaculty(fac.id, fac.user.name)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                        >
                          Approve & Send Email
                        </button>
                        <button
                          onClick={() => handleRejectFaculty(fac.id, fac.user.name)}
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

      {/* Tab 3: Parent Approvals */}
      {activeTab === 'PARENTS' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Parent Registration Applications
              </h3>
              <p className="text-[11px] text-slate-500">
                Rule: Maximum 2 approved parents per student. Parents only view their verified child&apos;s data.
              </p>
            </div>
            <span className="text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 font-medium">
              {pendingParents.length} Awaiting Verification
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
            </div>
          ) : pendingParents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs space-y-1">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700">No Pending Parent Applications</p>
              <p>All parent registration requests have been reviewed.</p>
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
                  {pendingParents.map((parent) => (
                    <tr key={parent.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{parent.user.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{parent.user.email}</p>
                        <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                          {parent.relation || 'Parent'}
                        </span>
                        {parent.user.phone && <span className="text-[10px] text-slate-400 ml-2">Ph: {parent.user.phone}</span>}
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
                        {parent.user.city ? `${parent.user.city}, ${parent.user.state || ''}` : 'Not Specified'}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          disabled={parent.isMaxReached}
                          onClick={() => handleApproveParent(parent.id, parent.user.name, parent.studentRollNumber)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Approve & Send Email
                        </button>
                        <button
                          onClick={() => handleRejectParent(parent.id, parent.user.name)}
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

      {/* Tab 4: Appoint Section Coordinators */}
      {activeTab === 'COORDINATORS' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Assignment Form */}
          <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Appoint Section Coordinator</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign a faculty member as the official coordinator who verifies new students & parents for that section.
              </p>
            </div>

            <form onSubmit={handleAssignCoordinator} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
                <select
                  value={coordDept}
                  onChange={(e) => setCoordDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-blue-600"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Year</label>
                  <select
                    value={coordYear}
                    onChange={(e) => setCoordYear(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Semester</label>
                  <select
                    value={coordSem}
                    onChange={(e) => setCoordSem(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Sem {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Section</label>
                  <select
                    value={coordSec}
                    onChange={(e) => setCoordSec(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none font-bold"
                  >
                    <option value="A">Sec A</option>
                    <option value="B">Sec B</option>
                    <option value="C">Sec C</option>
                    <option value="D">Sec D</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Faculty Coordinator</label>
                <select
                  value={coordFacultyId}
                  onChange={(e) => setCoordFacultyId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none focus:border-blue-600 font-medium"
                  required
                >
                  <option value="">-- Choose Faculty Mentor --</option>
                  {facultyList.map((fac) => (
                    <option key={fac.id} value={fac.id}>{fac.name} ({fac.email})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={savingCoord}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingCoord ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                <span>Assign Section Coordinator</span>
              </button>
            </form>
          </div>

          {/* Active Sections List */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Current Section Coordinators</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of faculty members assigned as Section Coordinators.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-4 py-3">Year / Sem</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Assigned Coordinator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {classSections.map((sec) => {
                    const assignedFaculty = facultyList.find(f => f.id === sec.classAdvisorId);
                    return (
                      <tr key={sec.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-blue-600">Sec {sec.sectionName}</td>
                        <td className="px-4 py-3">Year {sec.year} (Sem {sec.semester})</td>
                        <td className="px-4 py-3">{sec.department}</td>
                        <td className="px-4 py-3">
                          {assignedFaculty ? (
                            <span className="font-semibold text-slate-900 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {assignedFaculty.name}
                            </span>
                          ) : (
                            <span className="text-amber-600 font-medium">Not Assigned</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Admission Master Roster */}
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
                      <option key={d.code} value={d.code}>{d.code}</option>
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
              <h3 className="text-sm font-bold text-slate-900">Approve Student & Dispatch Email</h3>
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
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" /> Automated Email Notification:
              </p>
              <p className="text-[11px] text-emerald-700">
                &ldquo;Account creation request approved! You can now log in easily using your registered email and password.&rdquo;
              </p>
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
                onClick={handleApproveStudent}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Confirm & Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

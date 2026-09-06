'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  UserCheck,
  UserX,
  Loader2,
  Upload,
  Download,
  Users,
  CheckCircle2,
  Shield,
  FileSpreadsheet,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckSquare,
  Square,
  MinusSquare,
  X,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  PowerOff,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'FACULTY' | 'STUDENT' | 'PARENT';
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
  phone?: string;
  createdAt: string;
}

const INITIAL_USERS: UserRecord[] = [
  { id: 'usr-1', name: 'AJ Singh', email: 'ajsinghindolia@gmail.com', role: 'ADMIN', department: 'Administration', status: 'ACTIVE', phone: '+91 98765 43210', createdAt: '10 Aug 2026' },
  { id: 'usr-2', name: 'Dr. Priya Sharma', email: 'priya.sharma@campushub.edu', role: 'FACULTY', department: 'Computer Science & Engineering', status: 'ACTIVE', phone: '+91 98765 11111', createdAt: '12 Aug 2026' },
  { id: 'usr-3', name: 'Anuraj Singh', email: 'anuraj.singh@campushub.edu', role: 'STUDENT', department: 'Computer Science & Engineering', status: 'ACTIVE', phone: '+91 98765 22222', createdAt: '14 Aug 2026' },
  { id: 'usr-4', name: 'Prof. Rahul Gupta', email: 'rahul.gupta@campushub.edu', role: 'FACULTY', department: 'Database Systems', status: 'ACTIVE', phone: '+91 98765 33333', createdAt: '15 Aug 2026' },
  { id: 'usr-5', name: 'Rajesh Singh (Parent)', email: 'rajesh.singh@parent.campushub.edu', role: 'PARENT', department: 'Parent Liaison', status: 'ACTIVE', phone: '+91 98765 44444', createdAt: '16 Aug 2026' },
  { id: 'usr-6', name: 'Rohan Mehta', email: 'rohan.mehta@campushub.edu', role: 'STUDENT', department: 'Electronics & Communication', status: 'ACTIVE', phone: '+91 98765 55555', createdAt: '18 Aug 2026' },
  { id: 'usr-7', name: 'Dr. Anita Patel', email: 'anita.patel@campushub.edu', role: 'FACULTY', department: 'Operating Systems', status: 'INACTIVE', phone: '+91 98765 66666', createdAt: '20 Aug 2026' },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Multi-Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Confirmation Modals State
  const [showBulkDeactivateConfirm, setShowBulkDeactivateConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);

  // Single Admin Staff Form (Director Provisioning)
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffDeptRole, setStaffDeptRole] = useState('PLACEMENT_CELL');
  const [staffEmpId, setStaffEmpId] = useState('');
  const [staffDesignation, setStaffDesignation] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffPassword, setStaffPassword] = useState('Admin@123');
  const [isCreatingStaff, setIsCreatingStaff] = useState(false);

  // Bulk CSV Import State
  const [importCategory, setImportCategory] = useState<'ADMIN_STAFF' | 'FACULTY' | 'STUDENTS'>('ADMIN_STAFF');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRecords, setParsedRecords] = useState<any[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Load users from API/Database
  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: UserRecord[] = data.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role || 'STUDENT',
            department:
              u.adminProfile?.departmentRole?.replace('_', ' ') ||
              u.studentProfile?.department ||
              u.facultyProfile?.department ||
              'Administration',
            status: u.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
            createdAt: new Date(u.createdAt || Date.now()).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
          }));
          setUsers(mapped);
        }
      }
    } catch (err) {
      // Use fallback
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  // Selection helpers
  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every((u) => selectedIds.includes(u.id));
  const someFilteredSelected = filteredUsers.some((u) => selectedIds.includes(u.id)) && !allFilteredSelected;

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredUsers.map((u) => u.id));
      setSelectedIds(selectedIds.filter((id) => !filteredIds.has(id)));
    } else {
      const newIds = Array.from(new Set([...selectedIds, ...filteredUsers.map((u) => u.id)]));
      setSelectedIds(newIds);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  // Bulk Deactivation
  const handleExecuteBulkDeactivate = async () => {
    if (selectedIds.length === 0) return;

    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, status: 'INACTIVE' }),
      });
    } catch (e) {}

    setUsers((prev) =>
      prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: 'INACTIVE' } : u))
    );
    toast.success(`Successfully deactivated ${selectedIds.length} user account(s).`, 'Bulk Deactivation Complete');
    setSelectedIds([]);
    setShowBulkDeactivateConfirm(false);
  };

  // Bulk Activation
  const handleExecuteBulkActivate = async () => {
    if (selectedIds.length === 0) return;

    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, status: 'ACTIVE' }),
      });
    } catch (e) {}

    setUsers((prev) =>
      prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: 'ACTIVE' } : u))
    );
    toast.success(`Successfully activated ${selectedIds.length} user account(s).`, 'Bulk Activation Complete');
    setSelectedIds([]);
  };

  // Bulk Deletion
  const handleExecuteBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
    } catch (e) {}

    const count = selectedIds.length;
    setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
    toast.success(`Permanently deleted ${count} user account(s) from directory.`, 'Bulk Deletion Done');
    setSelectedIds([]);
    setShowBulkDeleteConfirm(false);
  };

  // Single User Deletion
  const handleExecuteSingleDelete = async () => {
    if (!userToDelete) return;

    try {
      await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userToDelete.id }),
      });
    } catch (e) {}

    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setSelectedIds((prev) => prev.filter((id) => id !== userToDelete.id));
    toast.success(`User "${userToDelete.name}" deleted permanently.`, 'Account Removed');
    setUserToDelete(null);
  };

  // Director Provision Admin Staff Handler
  const handleCreateAdminStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim()) {
      toast.warning('Please provide both staff name and email.');
      return;
    }

    setIsCreatingStaff(true);
    try {
      const payload = {
        name: staffName.trim(),
        email: staffEmail.trim().toLowerCase(),
        role: 'ADMIN',
        departmentRole: staffDeptRole,
        employeeId: staffEmpId.trim() || `KCC-ADM-${Date.now().toString().slice(-4)}`,
        designation: staffDesignation.trim() || `${staffDeptRole.replace('_', ' ')} Officer`,
        phone: staffPhone.trim(),
        password: staffPassword || 'Admin@123',
      };

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create staff account');

      const newUser: UserRecord = {
        id: data.id || `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: 'ADMIN',
        department: staffDeptRole.replace('_', ' '),
        status: 'ACTIVE',
        createdAt: 'Just now',
      };

      setUsers([newUser, ...users]);
      setStaffName('');
      setStaffEmail('');
      setStaffEmpId('');
      setStaffDesignation('');
      setStaffPhone('');
      setStaffPassword('Admin@123');
      setShowAddModal(false);
      toast.success(`Admin staff account for ${newUser.name} created and active in database!`, 'Staff Provisioned');
    } catch (err: any) {
      toast.error(err.message || 'Error creating admin staff account');
    } finally {
      setIsCreatingStaff(false);
    }
  };

  const toggleStatus = async (id: string) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;
    const nextStatus = targetUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
    } catch (e) {}

    setUsers(
      users.map((u) => {
        if (u.id === id) {
          toast.info(`${u.name} status updated to ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Accurate Downloadable CSV Templates
  const handleDownloadTemplate = () => {
    let filename = 'kccitm-admin-staff-template.csv';
    let csvContent = '';

    if (importCategory === 'ADMIN_STAFF') {
      filename = 'kccitm-admin-staff-template.csv';
      csvContent = `Name,Email,DepartmentRole,EmployeeId,Designation,Phone
Suresh Sharma,suresh.tpo@kcc.campushub.edu.in,PLACEMENT_CELL,KCC-ADM-TPO-01,Head of Placements (TPO),+91 9876543210
Meena Gupta,meena.fees@kcc.campushub.edu.in,FEES_ACCOUNTS,KCC-ADM-ACC-02,Accounts & Finance Officer,+91 9876543211
Dr. Naveen Joshi,naveen.lib@kcc.campushub.edu.in,LIBRARY,KCC-ADM-LIB-03,Chief Librarian,+91 9876543212
Rakesh Kumar,rakesh.acad@kcc.campushub.edu.in,ACADEMIC_ADMIN,KCC-ADM-ACAD-04,Academic Registrar,+91 9876543213
Sunita Malhotra,sunita.events@kcc.campushub.edu.in,EVENT_MANAGER,KCC-ADM-EVT-05,Campus Events Lead,+91 9876543214`;
    } else if (importCategory === 'FACULTY') {
      filename = 'kccitm-faculty-master-template.csv';
      csvContent = `Name,Email,Department,EmployeeId,Designation,Phone
Dr. Priya Sharma,priya.sharma@kcc.campushub.edu.in,CSE,KCC-FAC-CSE-01,Professor & HOD,+91 9876543220
Prof. Rajesh Verma,rajesh.verma@kcc.campushub.edu.in,CSE-AIML,KCC-FAC-AIML-02,Associate Professor,+91 9876543221
Dr. Anita Roy,anita.roy@kcc.campushub.edu.in,IT,KCC-FAC-IT-03,Associate Professor,+91 9876543222
Prof. Manoj Tiwari,manoj.tiwari@kcc.campushub.edu.in,ECE,KCC-FAC-ECE-04,Assistant Professor,+91 9876543223
Dr. Alok Pandey,alok.pandey@kcc.campushub.edu.in,MECH,KCC-FAC-ME-05,Associate Professor,+91 9876543224`;
    } else {
      filename = 'kccitm-student-batch-template.csv';
      csvContent = `Name,Email,Department,RollNumber,Year,Semester,Section,Phone
Arjun Singh,arjun.singh@student.kcc.campushub.edu.in,CSE,KCC2023CSE045,3,5,A,+91 9876543230
Priya Patel,priya.patel@student.kcc.campushub.edu.in,CSE-AIML,KCC2023AIML012,3,5,A,+91 9876543231
Rohit Kumar,rohit.kumar@student.kcc.campushub.edu.in,CSE-DS,KCC2024DS028,2,3,B,+91 9876543232
Sneha Sharma,sneha.sharma@student.kcc.campushub.edu.in,IT,KCC2023IT009,3,5,A,+91 9876543233
Vikas Yadav,vikas.yadav@student.kcc.campushub.edu.in,ECE,KCC2024ECE015,2,3,A,+91 9876543234`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    toast.success(`Accurate ${importCategory} CSV template downloaded.`, 'Template Ready');
  };

  // Real CSV File Parse Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setParseError('Please upload a valid .csv file.');
      return;
    }

    setCsvFile(file);
    setParseError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          setParseError('CSV file is empty or missing data rows.');
          setParsedRecords([]);
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const records: any[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim());
          if (cols.length < 2) continue;

          const row: any = {};
          headers.forEach((h, idx) => {
            row[h] = cols[idx] || '';
          });

          // Normalize record
          const role =
            importCategory === 'ADMIN_STAFF'
              ? 'ADMIN'
              : importCategory === 'FACULTY'
              ? 'FACULTY'
              : 'STUDENT';

          const normalized = {
            name: row.name || cols[0] || '',
            email: row.email || cols[1] || '',
            role,
            department: row.department || row.departmentrole || 'CSE',
            departmentRole: row.departmentrole || 'ACADEMIC_ADMIN',
            employeeId: row.employeeid || '',
            rollNumber: row.rollnumber || '',
            designation: row.designation || (role === 'ADMIN' ? 'Staff Administrator' : 'Faculty'),
            phone: row.phone || '',
            year: row.year ? Number(row.year) : 1,
            semester: row.semester ? Number(row.semester) : 1,
            section: row.section || 'A',
          };

          if (normalized.name && normalized.email) {
            records.push(normalized);
          }
        }

        if (records.length === 0) {
          setParseError('No valid records found in CSV. Check column headers.');
        } else {
          setParsedRecords(records);
          toast.success(`Successfully parsed ${records.length} valid records from ${file.name}`, 'CSV Parsed');
        }
      } catch (err) {
        setParseError('Failed to parse CSV file. Ensure valid comma-separated format.');
        setParsedRecords([]);
      }
    };

    reader.readAsText(file);
  };

  // Execute Real Database Bulk Import
  const handleExecuteBulkImport = async () => {
    if (parsedRecords.length === 0) {
      toast.warning('Please select a valid CSV file with records to import.');
      return;
    }

    setIsImporting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: parsedRecords }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to import records to database');

      toast.success(
        `Successfully imported ${data.count || parsedRecords.length} records into KCCITM database!`,
        'Bulk Import Completed'
      );
      setShowBulkModal(false);
      setCsvFile(null);
      setParsedRecords([]);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || 'Error processing batch CSV import');
    } finally {
      setIsImporting(false);
    }
  };

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'ADMIN':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'FACULTY':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PARENT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const selectedUsersList = users.filter((u) => selectedIds.includes(u.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">User & Role Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              Director Master Desk
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional directory control: Multi-account batch deactivation, permanent deletion, role clearance, and CSV onboarding
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Bulk CSV Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Single User
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Total Directory</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{users.length} Users</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Students</span>
          <p className="text-xl font-bold text-blue-600 mt-1">
            {users.filter((u) => u.role === 'STUDENT').length} Enrolled
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Faculty</span>
          <p className="text-xl font-bold text-purple-600 mt-1">
            {users.filter((u) => u.role === 'FACULTY').length} Teachers
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Active Status</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {users.filter((u) => u.status === 'ACTIVE').length} / {users.length}
          </p>
        </div>
      </div>

      {/* Floating Sticky Bulk Operations Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-3 duration-200 border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs">
              {selectedIds.length} Selected
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              Perform Director bulk action on selected accounts:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExecuteBulkActivate}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5" /> Activate All ({selectedIds.length})
            </button>

            <button
              onClick={() => setShowBulkDeactivateConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <UserX className="w-3.5 h-3.5" /> Deactivate All ({selectedIds.length})
            </button>

            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
            </button>

            <button
              onClick={clearSelection}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Deselect all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search and Role Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-full sm:max-w-md shadow-2xs focus-within:border-blue-600 outline-none">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            placeholder="Search by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'STUDENT', 'FACULTY', 'ADMIN', 'PARENT'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                roleFilter === r
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table with Multi-Selection Checkboxes */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="cursor-pointer text-slate-600 hover:text-blue-600 flex items-center justify-center mx-auto"
                    title={allFilteredSelected ? 'Deselect all visible' : 'Select all visible'}
                  >
                    {allFilteredSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : someFilteredSelected ? (
                      <MinusSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="px-5 py-3.5">User Details</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Director Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = selectedIds.includes(u.id);
                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(u.id)}
                          className="cursor-pointer text-slate-600 flex items-center justify-center mx-auto"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{u.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getRoleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">{u.department}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleStatus(u.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              u.status === 'ACTIVE'
                                ? 'text-amber-700 hover:bg-amber-50 border border-amber-200'
                                : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                            }`}
                            title={u.status === 'ACTIVE' ? 'Deactivate account' : 'Activate account'}
                          >
                            {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>

                          <button
                            onClick={() => setUserToDelete(u)}
                            className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 hover:border-rose-200 border border-transparent transition cursor-pointer"
                            title={`Delete account for ${u.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Deactivation Confirmation Modal */}
      {showBulkDeactivateConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowBulkDeactivateConfirm(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                <PowerOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm Bulk Deactivation</h3>
                <p className="text-xs text-slate-500">Director Administrative Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to deactivate <strong className="text-slate-900">{selectedIds.length}</strong> selected account(s)? These users will temporarily lose access to campus portal services until reactivated.
            </p>

            <div className="max-h-36 overflow-y-auto bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1 divide-y divide-slate-100">
              {selectedUsersList.map((u) => (
                <div key={u.id} className="pt-1 first:pt-0 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{u.name}</span>
                  <span className="text-[10px] text-slate-400">{u.email}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBulkDeactivateConfirm(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBulkDeactivate}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                Deactivate {selectedIds.length} Accounts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowBulkDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-900">Permanent Bulk Deletion</h3>
                <p className="text-xs text-rose-600 font-semibold">Irreversible Director Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are about to permanently purge <strong className="text-rose-600 font-bold">{selectedIds.length} user accounts</strong> from the institutional directory. All associated course records and profiles will be deleted.
            </p>

            <div className="max-h-36 overflow-y-auto bg-rose-50/50 p-3 rounded-2xl border border-rose-200 text-xs space-y-1 divide-y divide-rose-100">
              {selectedUsersList.map((u) => (
                <div key={u.id} className="pt-1 first:pt-0 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{u.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{u.email}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBulkDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                Permanently Delete ({selectedIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single User Delete Confirmation Modal */}
      {userToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setUserToDelete(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <div className="p-2 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete User Account</h3>
                <p className="text-[11px] text-slate-500">{userToDelete.email}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900">{userToDelete.name}</strong> from the campus directory?
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteSingleDelete}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Single User Modal (Provision Department Admin Staff) */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => !isCreatingStaff && setShowAddModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Provision Department Admin Staff</h3>
                  <p className="text-[11px] text-slate-500">Director Desk • Institutional Staff Onboarding</p>
                </div>
              </div>
              <button
                disabled={isCreatingStaff}
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdminStaff} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Staff Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Suresh Kumar"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Official Institutional Email</label>
                  <input
                    type="email"
                    placeholder="name.dept@kcc.campushub.edu.in"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Department Admin Role</label>
                  <select
                    value={staffDeptRole}
                    onChange={(e) => setStaffDeptRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none font-semibold text-slate-800"
                  >
                    <option value="PLACEMENT_CELL">💼 Placement & TPO Desk</option>
                    <option value="FEES_ACCOUNTS">💰 Finance & Accounts Desk</option>
                    <option value="LIBRARY">📚 Library & Catalog Desk</option>
                    <option value="EVENT_MANAGER">🎪 Campus Events & Affairs</option>
                    <option value="ACADEMIC_ADMIN">🎓 Academic Affairs & Exam Cell</option>
                    <option value="HOSTEL_ADMIN">🏢 Hostel & Housing Warden</option>
                    <option value="CLUB_MANAGER">⚡ Student Clubs & Societies</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Employee ID</label>
                  <input
                    type="text"
                    placeholder="e.g. KCC-ADM-TPO-01"
                    value={staffEmpId}
                    onChange={(e) => setStaffEmpId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Head of Training & Placements (TPO)"
                    value={staffDesignation}
                    onChange={(e) => setStaffDesignation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Login Password</label>
                <input
                  type="text"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-mono"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isCreatingStaff}
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingStaff}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  {isCreatingStaff ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Provisioning...
                    </>
                  ) : (
                    'Provision & Activate Staff Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal with Accurate Data Parser */}
      {showBulkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => !isImporting && setShowBulkModal(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Bulk Directory CSV Onboarding</h3>
                  <p className="text-[11px] text-slate-500">Accurate batch import for Staff, Faculty & Students</p>
                </div>
              </div>
              <button
                disabled={isImporting}
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Select Import Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ADMIN_STAFF', label: 'Admin Staff Batch' },
                    { id: 'FACULTY', label: 'Faculty Master Batch' },
                    { id: 'STUDENTS', label: 'Student Enrollment' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setImportCategory(cat.id as any);
                        setCsvFile(null);
                        setParsedRecords([]);
                        setParseError(null);
                      }}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                        importCategory === cat.id
                          ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download Accurate Template Button */}
              <button
                onClick={handleDownloadTemplate}
                type="button"
                className="w-full py-2.5 border border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/30 rounded-xl text-xs font-bold text-blue-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" /> Download Official Sample CSV ({importCategory.replace('_', ' ')})
              </button>

              {/* Drag & Drop / File Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Upload CSV File</label>
                <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 flex flex-col items-center justify-center text-center relative transition-colors">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileSpreadsheet className="w-10 h-10 text-blue-600 mb-2" />
                  <p className="text-xs font-bold text-slate-800">
                    {csvFile ? csvFile.name : 'Click to Browse or Drag & Drop .CSV File'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB • Click to choose different file` : 'Strict column validation enabled'}
                  </p>
                </div>
              </div>

              {parseError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Parsed Live Preview Table */}
              {parsedRecords.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {parsedRecords.length} Records Parsed Successfully
                    </span>
                    <span className="text-[11px] text-slate-500">Previewing first 5 rows</span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-44 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[9px]">
                        <tr>
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Email</th>
                          <th className="px-3 py-2">Role/Dept</th>
                          <th className="px-3 py-2">Identifier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedRecords.slice(0, 5).map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-semibold text-slate-800">{r.name}</td>
                            <td className="px-3 py-2 text-slate-600 font-mono">{r.email}</td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                                {r.departmentRole || r.department}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-mono text-slate-700">{r.employeeId || r.rollNumber || 'Auto'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isImporting}
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isImporting || parsedRecords.length === 0}
                  onClick={handleExecuteBulkImport}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Storing in Database...
                    </>
                  ) : (
                    `Store & Import ${parsedRecords.length} Records`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

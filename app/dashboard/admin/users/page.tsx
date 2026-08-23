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
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Single User Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'FACULTY' | 'ADMIN' | 'PARENT'>('STUDENT');
  const [department, setDepartment] = useState('Computer Science & Engineering');

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.warning('Please provide both name and email.');
      return;
    }

    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      department,
      status: 'ACTIVE',
      createdAt: 'Just now',
    };

    setUsers([newUser, ...users]);
    setName('');
    setEmail('');
    setShowAddModal(false);
    toast.success(`User account for ${newUser.name} created successfully!`, 'Account Created');
  };

  const toggleStatus = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const next = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          toast.info(`${u.name} status updated to ${next}`);
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const handleDownloadTemplate = () => {
    const csvContent = `Name,Email,Role,Department,Phone\nJohn Doe,john.doe@campushub.edu,STUDENT,Computer Science,+91 98000 00001\nDr. Jane Smith,jane.smith@campushub.edu,FACULTY,Electronics,+91 98000 00002`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campushub-user-import-template.csv';
    link.click();
    toast.success('Sample CSV template downloaded.', 'Template Downloaded');
  };

  const handleSimulateBulkImport = () => {
    const bulkImported: UserRecord[] = [
      { id: `usr-${Date.now()}-1`, name: 'Aakash Verma', email: 'aakash.v@campushub.edu', role: 'STUDENT', department: 'Computer Science & Engineering', status: 'ACTIVE', createdAt: 'Bulk Import' },
      { id: `usr-${Date.now()}-2`, name: 'Pooja Hegde', email: 'pooja.h@campushub.edu', role: 'STUDENT', department: 'Electronics & Communication', status: 'ACTIVE', createdAt: 'Bulk Import' },
      { id: `usr-${Date.now()}-3`, name: 'Dr. Ramesh Kulkarni', email: 'ramesh.k@campushub.edu', role: 'FACULTY', department: 'Mechanical Engineering', status: 'ACTIVE', createdAt: 'Bulk Import' },
    ];

    setUsers([...bulkImported, ...users]);
    setShowBulkModal(false);
    toast.success(`Successfully imported 3 users into the institutional directory.`, 'Bulk Onboarding Complete');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">User & Role Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              Directory
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage student, faculty, admin, and parent accounts, role-based access control, and bulk onboarding
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

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">User Details</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
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
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        u.status === 'ACTIVE'
                          ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                          : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Single User Modal */}
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
              <h3 className="text-sm font-bold text-slate-900">Add Single User Account</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Anuraj Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@campushub.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="PARENT">Parent</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Technology">IT</option>
                    <option value="Electronics & Communication">ECE</option>
                    <option value="Mechanical Engineering">MECH</option>
                    <option value="Administration">Admin Office</option>
                  </select>
                </div>
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
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {showBulkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowBulkModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Bulk Student & Faculty Onboarding</h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Upload a structured CSV file containing columns: <code className="font-mono text-blue-600 font-semibold">Name, Email, Role, Department, Phone</code>.
              </p>

              <button
                onClick={handleDownloadTemplate}
                className="w-full py-2 border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 rounded-xl text-xs font-semibold text-blue-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download Sample CSV Template
              </button>

              <div className="p-6 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/30 flex flex-col items-center justify-center text-center">
                <FileSpreadsheet className="w-10 h-10 text-blue-600 mb-2" />
                <p className="text-xs font-bold text-slate-800">Drag & Drop Batch CSV File</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Supports up to 5,000 records per batch</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSimulateBulkImport}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Process & Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

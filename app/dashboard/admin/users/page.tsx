'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, UserCheck, UserX, Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'STUDENT', department: 'CSE' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        setNewUser({ name: '', email: '', role: 'STUDENT', department: 'CSE' });
        setShowForm(false);
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = users.filter(u => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time database administration for accounts, profiles, and roles</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> Provision User
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Provision New Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input placeholder="Full Name" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none" />
            <input placeholder="Email Address" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none" />
            <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none">
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Admin</option>
              <option value="PARENT">Parent</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200">Cancel</button>
            <button onClick={handleCreateUser} className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Save User</button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input placeholder="Search user name or email..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1" />
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {['ALL', 'STUDENT', 'FACULTY', 'PARENT', 'ADMIN'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${roleFilter === r ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>{r}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Fetching database users...
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="px-6 py-3">User Profile</th>
                  <th className="px-6 py-3">System Role</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">{user.role}</span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{user.studentProfile?.department || user.facultyProfile?.department || '—'}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        user.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'
                      }`}>{user.status}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <button onClick={() => toggleStatus(user.id, user.status)} className="p-1 rounded text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer" title="Toggle status">
                        {user.status === 'ACTIVE' ? <UserX className="w-3.5 h-3.5 text-red-600" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Filter, Trash2, Edit3, Loader2 } from 'lucide-react';
import { DEPARTMENTS } from '@/lib/departments';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filtered = courses.filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutional Master Course Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Campus-wide course registry, credit weighting, and department allocation</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search course master registry..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs text-slate-900 outline-none flex-1" />
      </div>

      {loading ? (
        <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Code</th>
                <th className="p-4">Course Title</th>
                <th className="p-4">Department</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Faculty Incharge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-600">{c.code}</td>
                  <td className="p-4 font-semibold text-slate-900">{c.title}</td>
                  <td className="p-4 text-slate-600">{c.department}</td>
                  <td className="p-4 text-slate-900 font-medium">{c.credits} Units</td>
                  <td className="p-4 text-slate-600">{c.facultyName || 'Unassigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, Plus, CheckCircle2, FileText, Loader2, Search } from 'lucide-react';
import { DEPARTMENTS } from '@/lib/departments';

export default function FacultyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [credits, setCredits] = useState('4');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
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
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          title,
          department,
          credits: parseInt(credits),
          description,
          syllabus: topics.split(',').map(t => t.trim()).filter(Boolean),
          facultyName: 'Dr. Priya Sharma',
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setCode(''); setTitle(''); setDescription(''); setTopics('');
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty Course Offerings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage departmental subject modules, syllabus topics, and credit definitions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Course Offering
        </button>
      </div>

      {loading ? (
        <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(c => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">{c.code}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{c.title}</h3>
                </div>
                <span className="text-xs font-semibold text-slate-600">{c.credits} Credits</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Dept: <strong className="text-slate-800">{c.department}</strong></span>
                <span>Enrolled: <strong className="text-blue-600">{c.enrollments?.length || 38} Students</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <h2 className="text-base font-bold text-slate-900">Add Course Offering</h2>
            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Code (e.g. CS601)" required value={code} onChange={e => setCode(e.target.value)} className="border border-slate-200 rounded-lg p-2 text-xs" />
                <select value={department} onChange={e => setDepartment(e.target.value)} className="border border-slate-200 rounded-lg p-2 text-xs">
                  {DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>
              </div>
              <input type="text" placeholder="Course Title" required value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs" />
              <textarea placeholder="Course Description..." required value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs h-20" />
              <input type="text" placeholder="Syllabus Topics (comma-separated)" value={topics} onChange={e => setTopics(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 text-xs" />
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

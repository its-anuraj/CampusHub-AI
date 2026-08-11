'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Award, CheckCircle2, Search, Filter, Layers, FileText, ChevronRight, Clock, Plus, Loader2 } from 'lucide-react';
import { DEPARTMENTS } from '@/lib/departments';

interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  credits: number;
  semester: number;
  description: string;
  syllabus: string;
  facultyName: string;
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
          // Default enroll first 4 courses for student demo
          if (data.length > 0) {
            setEnrolledIds(data.slice(0, 4).map((c: Course) => c.id));
            setSelectedCourse(data[0]);
          }
        }
      } catch (err) {
        console.error('Fetch courses error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filtered = courses.filter(c => {
    if (deptFilter !== 'ALL' && c.department !== deptFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalCredits = courses
    .filter(c => enrolledIds.includes(c.id))
    .reduce((acc, curr) => acc + curr.credits, 0);

  const handleEnrollToggle = (id: string) => {
    setEnrolledIds(prev => prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Courses & Syllabus</h1>
          <p className="text-xs text-slate-500 mt-1">Course catalog, department modules, credit allocations, and unit breakdown</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-xs">
          <Award className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Enrolled Credits</p>
            <p className="text-sm font-bold text-slate-900">{totalCredits} / 24 Credits</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course code or title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <div className="p-12 flex justify-center items-center text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" /> Loading course catalog...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Course List */}
          <div className="lg:col-span-7 space-y-3">
            {filtered.map(course => {
              const isEnrolled = enrolledIds.includes(course.id);
              const isSelected = selectedCourse?.id === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`bg-white border rounded-2xl p-5 shadow-card transition-all cursor-pointer ${
                    isSelected ? 'border-blue-600 ring-1 ring-blue-600/20 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">{course.code}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">{course.department}</span>
                        <span className="text-[10px] text-slate-400">Sem {course.semester}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mt-1">{course.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleEnrollToggle(course.id); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0 ${
                        isEnrolled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                      }`}
                    >
                      {isEnrolled ? <><CheckCircle2 className="w-3.5 h-3.5" /> Enrolled</> : <><Plus className="w-3.5 h-3.5" /> Register</>}
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 text-xs text-slate-500">
                    <span>Faculty: <strong className="text-slate-800">{course.facultyName}</strong></span>
                    <span>Credits: <strong className="text-slate-900">{course.credits} Units</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Syllabus Detail Drawer */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-card sticky top-6">
            {selectedCourse ? (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">{selectedCourse.code}</span>
                  <h2 className="text-base font-bold text-slate-900 mt-1">{selectedCourse.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">{selectedCourse.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-medium">DEPARTMENT</p>
                    <p className="font-semibold text-slate-900 mt-0.5">{selectedCourse.department}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-medium">CREDIT WEIGHT</p>
                    <p className="font-semibold text-slate-900 mt-0.5">{selectedCourse.credits} Credits</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" /> Syllabus Modules & Topics
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      try {
                        const parsed = JSON.parse(selectedCourse.syllabus);
                        return Array.isArray(parsed) ? parsed.map((topic: string, i: number) => (
                          <div key={i} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center gap-2 text-xs text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                            <span>{topic}</span>
                          </div>
                        )) : <p className="text-xs text-slate-500">{selectedCourse.syllabus}</p>;
                      } catch {
                        return <p className="text-xs text-slate-500">{selectedCourse.syllabus}</p>;
                      }
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">Select a course from the catalog to view syllabus details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

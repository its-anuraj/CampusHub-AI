'use client';

import { useState } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  DollarSign,
  Plus,
  Search,
  Filter,
  TrendingUp,
  CheckCircle2,
  MoreVertical,
  Edit,
  Mail,
  Phone,
  BarChart2,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';
import { departments as initialDepartments } from '@/lib/departments';

interface DepartmentDetail {
  code: string;
  name: string;
  hod: string;
  hodEmail: string;
  facultyCount: number;
  studentCapacity: number;
  enrolledStudents: number;
  annualBudget: string;
  labCount: number;
}

const EXTENDED_DEPARTMENTS: DepartmentDetail[] = [
  { code: 'CSE', name: 'Computer Science & Engineering', hod: 'Dr. Priya Sharma', hodEmail: 'priya.sharma@campushub.edu', facultyCount: 42, studentCapacity: 600, enrolledStudents: 580, annualBudget: '₹1.85 Cr', labCount: 8 },
  { code: 'AI_DS', name: 'Artificial Intelligence & Data Science', hod: 'Dr. Rajesh Khanna', hodEmail: 'rajesh.khanna@campushub.edu', facultyCount: 28, studentCapacity: 300, enrolledStudents: 295, annualBudget: '₹1.40 Cr', labCount: 5 },
  { code: 'ECE', name: 'Electronics & Communication Engineering', hod: 'Dr. Suresh Nair', hodEmail: 'suresh.nair@campushub.edu', facultyCount: 35, studentCapacity: 480, enrolledStudents: 450, annualBudget: '₹1.20 Cr', labCount: 6 },
  { code: 'MECH', name: 'Mechanical Engineering', hod: 'Dr. Vikram Joshi', hodEmail: 'vikram.joshi@campushub.edu', facultyCount: 30, studentCapacity: 360, enrolledStudents: 320, annualBudget: '₹1.10 Cr', labCount: 7 },
  { code: 'CIVIL', name: 'Civil Engineering', hod: 'Dr. Ananya Roy', hodEmail: 'ananya.roy@campushub.edu', facultyCount: 24, studentCapacity: 240, enrolledStudents: 210, annualBudget: '₹85 Lakhs', labCount: 4 },
  { code: 'IT', name: 'Information Technology', hod: 'Dr. Amit Trivedi', hodEmail: 'amit.trivedi@campushub.edu', facultyCount: 32, studentCapacity: 360, enrolledStudents: 350, annualBudget: '₹1.15 Cr', labCount: 6 },
  { code: 'ROBOTICS', name: 'Robotics & Automation', hod: 'Dr. Neha Saxena', hodEmail: 'neha.saxena@campushub.edu', facultyCount: 18, studentCapacity: 180, enrolledStudents: 175, annualBudget: '₹95 Lakhs', labCount: 4 },
  { code: 'MGMT', name: 'Department of Management Studies', hod: 'Dr. Manish Kapoor', hodEmail: 'manish.kapoor@campushub.edu', facultyCount: 22, studentCapacity: 300, enrolledStudents: 290, annualBudget: '₹75 Lakhs', labCount: 2 },
];

export default function AdminDepartmentsPage() {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<DepartmentDetail[]>(EXTENDED_DEPARTMENTS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [hod, setHod] = useState('');
  const [hodEmail, setHodEmail] = useState('');
  const [facultyCount, setFacultyCount] = useState(20);
  const [studentCapacity, setStudentCapacity] = useState(240);

  const filtered = departments.filter(
    (d) =>
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.hod.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = departments.reduce((acc, d) => acc + d.enrolledStudents, 0);
  const totalFaculty = departments.reduce((acc, d) => acc + d.facultyCount, 0);
  const avgRatio = Math.round(totalStudents / Math.max(1, totalFaculty));

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !hod) {
      toast.warning('Please complete all department fields.');
      return;
    }

    const newDept: DepartmentDetail = {
      code: code.toUpperCase(),
      name,
      hod,
      hodEmail: hodEmail || `${hod.toLowerCase().replace(/[^a-z]/g, '')}@campushub.edu`,
      facultyCount: Number(facultyCount) || 15,
      studentCapacity: Number(studentCapacity) || 200,
      enrolledStudents: Math.floor((Number(studentCapacity) || 200) * 0.9),
      annualBudget: '₹75 Lakhs',
      labCount: 3,
    };

    setDepartments([newDept, ...departments]);
    setCode('');
    setName('');
    setHod('');
    setHodEmail('');
    setShowAddModal(false);
    toast.success(`Department of ${newDept.name} registered into University Catalog.`, 'Department Created');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">University Department Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
              13 Faculties
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Department infrastructure, faculty-to-student load distribution, HOD assignments, and laboratory budgets
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Department
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Total Departments</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{departments.length} Active</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Total Faculty Members</span>
          <p className="text-xl font-bold text-blue-600 mt-1">{totalFaculty} Professors</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Total Student Body</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{totalStudents} Enrolled</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium">Student : Faculty Ratio</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{avgRatio} : 1 (Ideal)</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 max-w-md shadow-2xs focus-within:border-blue-600 outline-none">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          placeholder="Search department name, code, HOD..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
        />
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((dept) => {
          const ratio = Math.round(dept.enrolledStudents / Math.max(1, dept.facultyCount));
          const utilization = Math.round((dept.enrolledStudents / dept.studentCapacity) * 100);

          return (
            <div
              key={dept.code}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {dept.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">{dept.name}</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                    {dept.annualBudget}
                  </span>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Head of Department (HOD)</span>
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-800">{dept.hod}</strong>
                    <span className="text-[11px] text-blue-600 font-mono">{dept.hodEmail}</span>
                  </div>
                </div>

                {/* Department Capacity & Ratio Grid */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Faculty</span>
                    <strong className="text-slate-900">{dept.facultyCount}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Students</span>
                    <strong className="text-slate-900">{dept.enrolledStudents} / {dept.studentCapacity}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Ratio</span>
                    <strong className="text-emerald-700">{ratio}:1</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">{dept.labCount} Specialized Labs Active</span>
                <span className="text-[11px] font-semibold text-blue-600">{utilization}% Capacity Filled</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
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
              <h3 className="text-sm font-bold text-slate-900">Add Academic Department</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDepartment} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Code</label>
                  <input
                    type="text"
                    placeholder="e.g. BIOTECH"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Department Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Biotechnology Engineering"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">HOD Name</label>
                  <input
                    type="text"
                    placeholder="Dr. Full Name"
                    value={hod}
                    onChange={(e) => setHod(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Faculty Count</label>
                  <input
                    type="number"
                    value={facultyCount}
                    onChange={(e) => setFacultyCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    required
                  />
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
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

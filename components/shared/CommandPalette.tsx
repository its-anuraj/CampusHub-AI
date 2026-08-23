'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  CreditCard,
  GraduationCap,
  MessageSquare,
  FileText,
  UserCheck,
  Building2,
  Users,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  LayoutDashboard,
  Bus,
  Library,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  role?: string;
  href: string;
  icon: any;
  shortcut?: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  // Student
  { id: 's-dash', title: 'Student Dashboard', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student', icon: LayoutDashboard },
  { id: 's-ai', title: 'AI Study Assistant & Chat', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student/ai-chat', icon: Sparkles },
  { id: 's-att', title: 'Attendance & AI Prediction', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student/attendance', icon: UserCheck },
  { id: 's-tt', title: 'Interactive Weekly Timetable', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student/timetable', icon: Clock },
  { id: 's-ass', title: 'Assignments & Deadlines', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student/assignments', icon: FileText },
  { id: 's-crs', title: 'Enrolled Courses & Syllabus', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student/courses', icon: BookOpen },
  { id: 's-res', title: 'Semester Results & CGPA', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student/results', icon: GraduationCap },
  { id: 's-plc', title: 'Placement Drives & Eligibility', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student/placement', icon: Building2 },
  { id: 's-fee', title: 'Fee Status & Online Payment', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student/fees', icon: CreditCard },
  { id: 's-lib', title: 'Library Catalog & Reservations', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student/library', icon: Library },
  { id: 's-id', title: 'Digital Student ID Card', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student/id-card', icon: Shield },
  { id: 's-dis', title: 'Campus Discussion Forum', category: 'Student Portal', role: 'STUDENT', href: '/dashboard/student/discussion', icon: MessageSquare },

  // Faculty
  { id: 'f-dash', title: 'Faculty Dashboard', category: 'Faculty Portal', role: 'FACULTY', href: '/dashboard/faculty', icon: LayoutDashboard },
  { id: 'f-att', title: 'Mark Daily Attendance', category: 'Faculty Portal', role: 'FACULTY', href: '/dashboard/faculty/attendance', icon: UserCheck },
  { id: 'f-mrk', title: 'Gradebook & Marks Entry', category: 'Faculty Portal', role: 'FACULTY', href: '/dashboard/faculty/marks', icon: GraduationCap },
  { id: 'f-ass', title: 'Manage Course Assignments', category: 'Faculty Portal', role: 'FACULTY', href: '/dashboard/faculty/assignments', icon: FileText },
  { id: 'f-cls', title: 'Class Timetable & Schedule', category: 'Faculty Portal', role: 'FACULTY', href: '/dashboard/faculty/classes', icon: Clock },
  { id: 'f-stu', title: 'Student Directory & Profiles', category: 'Faculty Portal', role: 'FACULTY', href: '/dashboard/faculty/students', icon: Users },
  { id: 'f-nts', title: 'Lecture Notes & Materials', category: 'Faculty Portal', role: 'FACULTY', href: '/dashboard/faculty/notes', icon: BookOpen },

  // Admin
  { id: 'a-dash', title: 'Admin Command Center', category: 'Admin Console', role: 'ADMIN', href: '/dashboard/admin', icon: LayoutDashboard },
  { id: 'a-usr', title: 'User & Role Management', category: 'Admin Console', role: 'ADMIN', href: '/dashboard/admin/users', icon: Users },
  { id: 'a-dep', title: 'Department Infrastructure', category: 'Admin Console', role: 'ADMIN', href: '/dashboard/admin/departments', icon: Building2 },
  { id: 'a-plc', title: 'Placement Drives & Drives', category: 'Admin Console', role: 'ADMIN', href: '/dashboard/admin/placements', icon: Building2 },
  { id: 'a-fee', title: 'Fee Collection & Dues', category: 'Admin Console', role: 'ADMIN', href: '/dashboard/admin/fees', icon: CreditCard },
  { id: 'a-log', title: 'Security & Audit Logs', category: 'Admin Console', role: 'ADMIN', href: '/dashboard/admin/logs', icon: Shield },
  { id: 'a-set', title: 'Campus System Settings', category: 'Admin Console', role: 'ADMIN', href: '/dashboard/admin/settings', icon: LayoutDashboard },

  // Parent
  { id: 'p-dash', title: 'Parent Portal Dashboard', category: 'Parent Portal', role: 'PARENT', href: '/dashboard/parent', icon: LayoutDashboard },
  { id: 'p-att', title: 'Child Attendance Alerts', category: 'Parent Portal', role: 'PARENT', href: '/dashboard/parent/attendance', icon: UserCheck },
  { id: 'p-fee', title: 'Online Fee Payment', category: 'Parent Portal', role: 'PARENT', href: '/dashboard/parent/fees', icon: CreditCard },
  { id: 'p-bus', title: 'Live Bus & Transport Tracking', category: 'Parent Portal', role: 'PARENT', href: '/dashboard/parent/transport', icon: Bus },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export default function CommandPalette({ isOpen, onClose, userRole }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = COMMAND_ITEMS.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  const handleSelect = (item: CommandItem) => {
    router.push(item.href);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search any campus module..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100/50">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              No matching modules or actions found for &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 text-blue-900 border border-blue-100'
                      : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{item.title}</p>
                      <span className="text-[10px] text-slate-400">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.role && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {item.role}
                      </span>
                    )}
                    <ArrowRight
                      className={`w-3.5 h-3.5 ${
                        isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'
                      } transition-transform`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Navigate:{' '}
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd>{' '}
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd>
            </span>
            <span>
              Select:{' '}
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↵</kbd>
            </span>
            <span>
              Close:{' '}
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">esc</kbd>
            </span>
          </div>
          <span className="text-blue-600 font-medium">CampusHub Spotlight</span>
        </div>
      </div>
    </div>
  );
}

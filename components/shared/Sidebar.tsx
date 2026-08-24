'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BookOpen, ClipboardList, Calendar, Bell, GraduationCap,
  Users, BarChart3, Settings, LogOut, Building2, CreditCard,
  Library, MessageSquare, Briefcase, FileText, UserCheck, AlertTriangle,
  Bus, BookMarked, Award, UserCog, PieChart, Megaphone, Database, Timer,
  Home, Utensils, Heart, Compass, Cpu, HardDrive, Package, ShieldAlert,
  ShieldCheck, Radio, Sparkles, BedDouble
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const studentNav: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
      { label: 'Timetable', href: '/dashboard/student/timetable', icon: Calendar },
      { label: 'Attendance', href: '/dashboard/student/attendance', icon: UserCheck },
      { label: 'Interactive Campus Map', href: '/dashboard/student/campus-map', icon: Compass },
    ],
  },
  {
    label: 'Academics',
    items: [
      { label: 'Courses & Syllabus', href: '/dashboard/student/courses', icon: BookOpen },
      { label: 'Assignments', href: '/dashboard/student/assignments', icon: ClipboardList, badge: 3 },
      { label: 'Study Planner', href: '/dashboard/student/study-planner', icon: Timer },
      { label: 'Library Catalog', href: '/dashboard/student/library', icon: BookMarked },
      { label: 'Academic Results', href: '/dashboard/student/results', icon: Award },
      { label: 'Verifiable Credentials', href: '/dashboard/student/certificates', icon: ShieldCheck },
    ],
  },
  {
    label: 'Career & Community',
    items: [
      { label: 'AI Resume Builder', href: '/dashboard/student/resume-builder', icon: FileText, badge: 'AI' },
      { label: 'Placements', href: '/dashboard/student/placement', icon: Briefcase },
      { label: 'Alumni Network', href: '/dashboard/student/alumni', icon: Users },
      { label: 'Events & Hackathons', href: '/dashboard/student/events', icon: Calendar },
      { label: 'Campus Forum', href: '/dashboard/student/discussion', icon: MessageSquare },
      { label: 'AI Assistant', href: '/dashboard/student/ai-chat', icon: Sparkles },
    ],
  },
  {
    label: 'Student Life & Services',
    items: [
      { label: 'Hostel & Housing', href: '/dashboard/student/hostel', icon: BedDouble },
      { label: 'Smart Cafeteria', href: '/dashboard/student/cafeteria', icon: Utensils },
      { label: 'Scholarships & Aid', href: '/dashboard/student/scholarships', icon: Award },
      { label: 'Health & Wellness Sanctuary', href: '/dashboard/student/wellness', icon: Heart },
      { label: 'Lost & Found Desk', href: '/dashboard/student/lost-found', icon: Package },
      { label: 'Digital ID Card', href: '/dashboard/student/id-card', icon: Award },
      { label: 'Fee Payments', href: '/dashboard/student/fees', icon: CreditCard },
      { label: 'Grievances', href: '/dashboard/student/complaints', icon: AlertTriangle },
    ],
  },
];

const facultyNav: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard/faculty', icon: LayoutDashboard },
      { label: 'Class Schedule', href: '/dashboard/faculty/classes', icon: Calendar },
      { label: 'Faculty Leaves & OD', href: '/dashboard/faculty/leaves', icon: Calendar },
    ],
  },
  {
    label: 'Course Workload',
    items: [
      { label: 'My Courses', href: '/dashboard/faculty/courses', icon: BookOpen },
      { label: 'Mark Attendance', href: '/dashboard/faculty/attendance', icon: UserCheck },
      { label: 'Assignments', href: '/dashboard/faculty/assignments', icon: ClipboardList, badge: 28 },
      { label: 'Course Resources', href: '/dashboard/faculty/notes', icon: FileText },
      { label: 'Announcements', href: '/dashboard/faculty/notices', icon: Bell },
    ],
  },
  {
    label: 'Research & Labs',
    items: [
      { label: 'Research & Grants', href: '/dashboard/faculty/research', icon: BookOpen },
      { label: 'Research Lab Hardware', href: '/dashboard/faculty/labs', icon: Cpu },
      { label: 'Symposium & Events', href: '/dashboard/faculty/events', icon: Calendar },
    ],
  },
  {
    label: 'Student Performance',
    items: [
      { label: 'Student Directory', href: '/dashboard/faculty/students', icon: Users },
      { label: 'Analytics', href: '/dashboard/faculty/analytics', icon: BarChart3 },
    ],
  },
];

const adminNav: NavGroup[] = [
  {
    label: 'Executive & Safety',
    items: [
      { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
      { label: 'Campus Analytics', href: '/dashboard/admin/analytics', icon: PieChart },
      { label: 'Emergency Siren Blast', href: '/dashboard/admin/emergency', icon: ShieldAlert, badge: 'SOS' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'User Directory', href: '/dashboard/admin/users', icon: UserCog },
      { label: 'Departments', href: '/dashboard/admin/departments', icon: Building2 },
      { label: 'Master Courses', href: '/dashboard/admin/courses', icon: BookOpen },
      { label: 'Faculty Leave Approvals', href: '/dashboard/admin/leaves', icon: Calendar },
      { label: 'Scholarships Desk', href: '/dashboard/admin/scholarships', icon: Award },
      { label: 'Placement Cell', href: '/dashboard/admin/placements', icon: Briefcase },
      { label: 'Campus Notices', href: '/dashboard/admin/notices', icon: Megaphone },
    ],
  },
  {
    label: 'Operations & Housing',
    items: [
      { label: 'Hostel Housing', href: '/dashboard/admin/hostel', icon: BedDouble },
      { label: 'Hardware Inventory', href: '/dashboard/admin/inventory', icon: HardDrive },
      { label: 'Fee Operations', href: '/dashboard/admin/fees', icon: CreditCard },
      { label: 'Helpdesk Tickets', href: '/dashboard/admin/complaints', icon: AlertTriangle, badge: 12 },
      { label: 'System Logs', href: '/dashboard/admin/logs', icon: Database },
    ],
  },
];

const parentNav: NavGroup[] = [
  {
    label: 'Child Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard/parent', icon: LayoutDashboard },
      { label: 'Attendance Record', href: '/dashboard/parent/attendance', icon: UserCheck },
      { label: 'Marks & Progress', href: '/dashboard/parent/performance', icon: BarChart3 },
      { label: 'Grievance Desk', href: '/dashboard/parent/feedback', icon: MessageSquare },
    ],
  },
  {
    label: 'Finances & Transport',
    items: [
      { label: 'Fee Payments', href: '/dashboard/parent/fees', icon: CreditCard },
      { label: 'Live Bus Tracking', href: '/dashboard/parent/transport', icon: Bus },
      { label: 'Notices', href: '/dashboard/parent/notices', icon: Bell },
    ],
  },
];

function getNavForRole(role: string): NavGroup[] {
  switch (role) {
    case 'STUDENT': return studentNav;
    case 'FACULTY': return facultyNav;
    case 'ADMIN': return adminNav;
    case 'PARENT': return parentNav;
    default: return studentNav;
  }
}

interface SidebarProps {
  user: any;
  isOpen: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ user, isOpen, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navGroups = getNavForRole(user?.role);

  const handleLogout = () => {
    localStorage.removeItem('campushub_user');
    router.push('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
        <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-xs">
          C
        </div>
        {isOpen && (
          <div className="overflow-hidden">
            <p className="text-slate-900 font-semibold text-xs leading-none tracking-tight">CampusHub OS</p>
            <p className="text-slate-500 text-[11px] leading-tight mt-0.5 capitalize">{user?.role?.toLowerCase()} workspace</p>
          </div>
        )}
      </div>

      {/* User Switcher Pill */}
      {isOpen && (
        <div className="mx-3 my-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs flex-shrink-0 border border-blue-200">
              {user?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-slate-900 text-xs font-medium truncate leading-tight">{user?.name}</p>
              <p className="text-slate-500 text-[10px] truncate leading-tight mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {isOpen && (
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors group relative',
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600')} />
                    {isOpen && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className={cn(
                            'text-[10px] font-semibold px-1.5 py-0.2 rounded-md',
                            item.badge === 'SOS' ? 'bg-rose-600 text-white animate-pulse' :
                            item.badge === 'AI' ? 'bg-purple-100 text-purple-700 font-bold' : 'bg-slate-200/70 text-slate-700'
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col fixed top-0 left-0 h-screen z-30 transition-all duration-200',
        isOpen ? 'w-64' : 'w-20'
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        'flex lg:hidden flex-col fixed top-0 left-0 h-screen w-64 z-50 transition-transform duration-200',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}

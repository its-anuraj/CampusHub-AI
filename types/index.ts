// Shared TypeScript types for CampusHub AI

export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN' | 'PARENT' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
}

export interface Student extends User {
  rollNumber: string;
  department: string;
  year: number;
  semester: number;
  section: string;
  cgpa: number;
  backlogs: number;
  parentId?: string;
}

export interface Faculty extends User {
  employeeId: string;
  department: string;
  designation: string;
  subjects: string[];
}

export interface Admin extends User {
  employeeId: string;
  department: string;
}

export interface Parent extends User {
  studentId: string;
  studentName: string;
  relation: string;
}

// Dashboard Stats
export interface StudentDashboardStats {
  attendancePercentage: number;
  cgpa: number;
  backlogs: number;
  pendingAssignments: number;
  upcomingExams: number;
  unreadNotices: number;
  todaysClasses: TodayClass[];
  recentNotices: Notice[];
  attendanceData: AttendanceData[];
}

export interface FacultyDashboardStats {
  totalStudents: number;
  classesToday: number;
  pendingGrading: number;
  averageAttendance: number;
  upcomingClasses: TodayClass[];
  recentSubmissions: Assignment[];
  studentPerformance: PerformanceData[];
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalDepartments: number;
  feeCollectionThisMonth: number;
  attendanceToday: number;
  activeComplaints: number;
  placedStudents: number;
  recentActivity: ActivityLog[];
  enrollmentData: EnrollmentData[];
  departmentData: DepartmentData[];
}

export interface ParentDashboardStats {
  childName: string;
  childRollNumber: string;
  attendancePercentage: number;
  cgpa: number;
  pendingFees: number;
  nextExam: string;
  recentMarks: Mark[];
  attendanceData: AttendanceData[];
}

// Modules
export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'GENERAL' | 'EXAM' | 'EVENT' | 'PLACEMENT' | 'URGENT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  department?: string;
  year?: number;
  isPinned: boolean;
  createdBy: string;
  createdAt: Date;
  readBy?: string[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: Date;
  totalMarks: number;
  facultyName: string;
  status?: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'LATE';
  submittedAt?: Date;
  marksObtained?: number;
  feedback?: string;
  fileUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  date: Date;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  markedBy: string;
}

export interface AttendanceData {
  month: string;
  present: number;
  absent: number;
  percentage: number;
}

export interface TodayClass {
  id: string;
  subject: string;
  facultyName: string;
  room: string;
  startTime: string;
  endTime: string;
  type: 'LECTURE' | 'LAB' | 'TUTORIAL';
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export interface PerformanceData {
  subject: string;
  marks: number;
  maxMarks: number;
  grade: string;
}

export interface EnrollmentData {
  year: string;
  students: number;
}

export interface DepartmentData {
  name: string;
  students: number;
  faculty: number;
  color: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
}

export interface Mark {
  subject: string;
  exam: string;
  marks: number;
  maxMarks: number;
  grade: string;
}

export interface PlacementCompany {
  id: string;
  name: string;
  logo?: string;
  role: string;
  package: string;
  eligibility: {
    minCgpa: number;
    noBacklogs: boolean;
    departments: string[];
  };
  deadline: Date;
  status: 'OPEN' | 'CLOSED' | 'UPCOMING';
  applicants: number;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  subject: string;
  available: boolean;
  totalCopies: number;
  availableCopies: number;
  dueDate?: Date;
}

export interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar?: string;
  isAnonymous: boolean;
  tags: string[];
  likes: number;
  replies: number;
  createdAt: Date;
  isLiked?: boolean;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'HOSTEL' | 'ELECTRICITY' | 'INTERNET' | 'WATER' | 'CLEANING' | 'OTHER';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  submittedBy: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface FeeRecord {
  id: string;
  type: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  receipt?: string;
}

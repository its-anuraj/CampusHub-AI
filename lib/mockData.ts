// Centralized Mock Data for CampusHub AI Dashboards

import {
  StudentDashboardStats,
  FacultyDashboardStats,
  AdminDashboardStats,
  ParentDashboardStats,
  Assignment,
  TodayClass,
  FeeRecord,
  PlacementCompany,
  LibraryBook,
  DiscussionPost,
  Complaint,
  Notice
} from '@/types';

export const studentDashboardData: StudentDashboardStats = {
  attendancePercentage: 86.4,
  cgpa: 8.52,
  backlogs: 0,
  pendingAssignments: 3,
  upcomingExams: 2,
  unreadNotices: 4,
  todaysClasses: [
    { id: '1', subject: 'Data Structures & Algorithms', facultyName: 'Dr. Sharma', room: 'Lab 302', startTime: '09:00', endTime: '10:30', type: 'LAB', status: 'COMPLETED' },
    { id: '2', subject: 'Database Management Systems', facultyName: 'Prof. Verma', room: 'LT-1', startTime: '11:00', endTime: '12:00', type: 'LECTURE', status: 'ONGOING' },
    { id: '3', subject: 'Computer Networks', facultyName: 'Dr. Anita Roy', room: 'LT-3', startTime: '14:00', endTime: '15:00', type: 'LECTURE', status: 'UPCOMING' },
  ],
  recentNotices: [
    { id: 'n1', title: 'Mid-Semester Examination Schedule Published', content: 'Exam schedule for 5th sem is out on portal.', category: 'EXAM', priority: 'HIGH', isPinned: true, createdBy: 'Examination Cell', createdAt: new Date() },
    { id: 'n2', title: 'Placement Drive: Microsoft Software Engineer', content: 'Registration closes tomorrow 5 PM.', category: 'PLACEMENT', priority: 'URGENT', isPinned: true, createdBy: 'Training & Placement', createdAt: new Date() },
  ],
  attendanceData: [
    { month: 'Jun', present: 22, absent: 2, percentage: 91.6 },
    { month: 'Jul', present: 20, absent: 4, percentage: 83.3 },
    { month: 'Aug', present: 18, absent: 3, percentage: 85.7 },
  ],
};

export const facultyDashboardData: FacultyDashboardStats = {
  totalStudents: 180,
  classesToday: 4,
  pendingGrading: 12,
  averageAttendance: 88.5,
  upcomingClasses: [
    { id: 'f1', subject: 'Data Structures (CSE-A)', facultyName: 'Self', room: 'Lab 302', startTime: '09:00', endTime: '10:30', type: 'LAB', status: 'COMPLETED' },
    { id: 'f2', subject: 'DBMS (CSE-B)', facultyName: 'Self', room: 'LT-1', startTime: '11:00', endTime: '12:00', type: 'LECTURE', status: 'ONGOING' },
    { id: 'f3', subject: 'Advanced Algorithms (M.Tech)', facultyName: 'Self', room: 'LT-5', startTime: '14:30', endTime: '16:00', type: 'LECTURE', status: 'UPCOMING' },
  ],
  recentSubmissions: [
    { id: 'a1', title: 'B-Tree & Indexing Implementation', subject: 'DBMS', description: 'Implement B-Tree in C++', dueDate: new Date(Date.now() + 86400000 * 2), totalMarks: 20, facultyName: 'Prof. Verma', status: 'SUBMITTED', submittedAt: new Date() },
  ],
  studentPerformance: [
    { subject: 'DBMS', marks: 85, maxMarks: 100, grade: 'A' },
    { subject: 'Data Structures', marks: 92, maxMarks: 100, grade: 'A+' },
    { subject: 'Operating Systems', marks: 78, maxMarks: 100, grade: 'B+' },
  ],
};

export const adminDashboardData: AdminDashboardStats = {
  totalStudents: 2450,
  totalFaculty: 128,
  totalDepartments: 8,
  feeCollectionThisMonth: 8500000,
  attendanceToday: 89.2,
  activeComplaints: 5,
  placedStudents: 340,
  recentActivity: [
    { id: 'act1', action: 'New Faculty Account Provisioned', user: 'Admin User', timestamp: new Date(), type: 'SUCCESS' },
    { id: 'act2', action: 'Semester Fee Notification Triggered', user: 'Finance Dept', timestamp: new Date(), type: 'INFO' },
  ],
  enrollmentData: [
    { year: '2023', students: 2100 },
    { year: '2024', students: 2280 },
    { year: '2025', students: 2390 },
    { year: '2026', students: 2450 },
  ],
  departmentData: [
    { name: 'Computer Science', students: 720, faculty: 35, color: '#3B82F6' },
    { name: 'Electronics', students: 540, faculty: 28, color: '#10B981' },
    { name: 'Mechanical', students: 420, faculty: 22, color: '#F59E0B' },
    { name: 'Civil', students: 380, faculty: 20, color: '#8B5CF6' },
    { name: 'IT', students: 390, faculty: 23, color: '#EC4899' },
  ],
};

export const parentDashboardData: ParentDashboardStats = {
  childName: 'Aarav Sharma',
  childRollNumber: '2023CSE042',
  attendancePercentage: 86.4,
  cgpa: 8.52,
  pendingFees: 0,
  nextExam: 'Database Systems (15 Aug)',
  recentMarks: [
    { subject: 'Data Structures', exam: 'Mid Sem 1', marks: 23, maxMarks: 25, grade: 'A+' },
    { subject: 'DBMS', exam: 'Mid Sem 1', marks: 21, maxMarks: 25, grade: 'A' },
    { subject: 'Computer Networks', exam: 'Mid Sem 1', marks: 19, maxMarks: 25, grade: 'B+' },
  ],
  attendanceData: [
    { month: 'Jun', present: 22, absent: 2, percentage: 91.6 },
    { month: 'Jul', present: 20, absent: 4, percentage: 83.3 },
    { month: 'Aug', present: 18, absent: 3, percentage: 85.7 },
  ],
};

export const todaysClasses: TodayClass[] = [
  { id: '1', subject: 'Data Structures & Algorithms', facultyName: 'Dr. Sharma', room: 'Lab 302', startTime: '09:00', endTime: '10:30', type: 'LAB', status: 'COMPLETED' },
  { id: '2', subject: 'Database Management Systems', facultyName: 'Prof. Verma', room: 'LT-1', startTime: '11:00', endTime: '12:00', type: 'LECTURE', status: 'ONGOING' },
  { id: '3', subject: 'Computer Networks', facultyName: 'Dr. Anita Roy', room: 'LT-3', startTime: '14:00', endTime: '15:00', type: 'LECTURE', status: 'UPCOMING' },
];

export const assignments: Assignment[] = [
  { id: 'asgn1', title: 'B-Tree & Indexing Implementation', subject: 'DBMS', description: 'Implement B-Tree insertion and search algorithms in C++/Java.', dueDate: new Date(Date.now() + 86400000 * 2), totalMarks: 20, facultyName: 'Prof. Verma', status: 'PENDING' },
  { id: 'asgn2', title: 'OS Process Synchronization Lab', subject: 'Operating Systems', description: 'Solve Dining Philosophers Problem using semaphores.', dueDate: new Date(Date.now() + 86400000 * 5), totalMarks: 25, facultyName: 'Dr. Rajesh Kumar', status: 'SUBMITTED', submittedAt: new Date(Date.now() - 86400000) },
  { id: 'asgn3', title: 'Subnetting & Routing Table Design', subject: 'Computer Networks', description: 'Calculate CIDR masks and routing protocols topology.', dueDate: new Date(Date.now() - 86400000 * 3), totalMarks: 15, facultyName: 'Dr. Anita Roy', status: 'GRADED', marksObtained: 14, feedback: 'Excellent network diagram layout.' },
];

export const feeRecords: FeeRecord[] = [
  { id: 'fee1', type: 'Tuition Fee (Semester 5)', amount: 65000, dueDate: new Date('2026-08-30'), status: 'PAID', paidDate: new Date('2026-08-01'), receipt: 'REC-2026-001' },
  { id: 'fee2', type: 'Development & Library Charge', amount: 8500, dueDate: new Date('2026-08-30'), status: 'PAID', paidDate: new Date('2026-08-01'), receipt: 'REC-2026-002' },
  { id: 'fee3', type: 'Hostel & Mess Fee (Term 2)', amount: 32000, dueDate: new Date('2026-09-15'), status: 'PENDING' },
  { id: 'fee4', type: 'Examination Fee (Dec 2026)', amount: 2500, dueDate: new Date('2026-10-10'), status: 'PENDING' },
];

export const placementCompanies: PlacementCompany[] = [
  { id: 'comp1', name: 'Microsoft Corporation', role: 'Software Development Engineer I', package: '₹45.0 LPA', eligibility: { minCgpa: 8.0, noBacklogs: true, departments: ['CSE', 'IT', 'ECE'] }, deadline: new Date(Date.now() + 86400000 * 3), status: 'OPEN', applicants: 142 },
  { id: 'comp2', name: 'Google India', role: 'Associate Software Engineer', package: '₹52.0 LPA', eligibility: { minCgpa: 8.5, noBacklogs: true, departments: ['CSE', 'IT'] }, deadline: new Date(Date.now() + 86400000 * 7), status: 'OPEN', applicants: 98 },
  { id: 'comp3', name: 'Amazon AWS', role: 'Cloud Support Engineer', package: '₹28.0 LPA', eligibility: { minCgpa: 7.5, noBacklogs: false, departments: ['CSE', 'IT', 'ECE', 'ME'] }, deadline: new Date(Date.now() + 86400000 * 12), status: 'UPCOMING', applicants: 0 },
  { id: 'comp4', name: 'Deloitte USI', role: 'Technology Consultant', package: '₹14.5 LPA', eligibility: { minCgpa: 6.5, noBacklogs: false, departments: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CIVIL'] }, deadline: new Date(Date.now() - 86400000 * 2), status: 'CLOSED', applicants: 310 },
];

export const libraryBooks: LibraryBook[] = [
  { id: 'book1', title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest, Stein', isbn: '978-0262033848', subject: 'Data Structures', available: true, totalCopies: 10, availableCopies: 4 },
  { id: 'book2', title: 'Database System Concepts', author: 'Silberschatz, Korth, Sudarshan', isbn: '978-0078022159', subject: 'DBMS', available: true, totalCopies: 8, availableCopies: 2 },
  { id: 'book3', title: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', isbn: '978-1118063330', subject: 'Operating Systems', available: false, totalCopies: 5, availableCopies: 0 },
  { id: 'book4', title: 'Computer Networking: A Top-Down Approach', author: 'Kurose, Ross', isbn: '978-0133594140', subject: 'Computer Networks', available: true, totalCopies: 6, availableCopies: 5 },
];

export const discussionPosts: DiscussionPost[] = [
  { id: 'post1', title: 'Best resources for Dynamic Programming prep?', content: 'Hey everyone, preparing for upcoming Microsoft drive. Any recommendations for DP patterns?', author: 'Aarav Sharma', isAnonymous: false, tags: ['Placements', 'Algorithms', 'Interview'], likes: 18, replies: 6, createdAt: new Date(Date.now() - 3600000 * 4) },
  { id: 'post2', title: 'DBMS Lab Assignment 2 Clarification', content: 'In Question 3, do we need to implement B+ Trees or standard B-Trees?', author: 'Anonymous Student', isAnonymous: true, tags: ['DBMS', 'Assignments'], likes: 7, replies: 2, createdAt: new Date(Date.now() - 3600000 * 12) },
];

export const complaints: Complaint[] = [
  { id: 'cmp1', title: 'Hostel Block B 3rd Floor Wi-Fi Disconnection', description: 'Frequent internet drops between 8 PM to 11 PM.', category: 'INTERNET', status: 'IN_PROGRESS', submittedBy: 'Aarav Sharma', createdAt: new Date(Date.now() - 86400000 * 2) },
  { id: 'cmp2', title: 'Lab 302 Projector Bulb Replacement', description: 'Screen flickering during morning lectures.', category: 'ELECTRICITY', status: 'RESOLVED', submittedBy: 'Prof. Verma', createdAt: new Date(Date.now() - 86400000 * 5), resolvedAt: new Date(Date.now() - 86400000 * 1) },
];

export const notices: Notice[] = [
  { id: 'n1', title: 'Mid-Semester Examination Schedule Published', content: 'Mid-Semester examinations start from August 25. Check detailed timetable in student portal.', category: 'EXAM', priority: 'HIGH', isPinned: true, createdBy: 'Examination Cell', createdAt: new Date() },
  { id: 'n2', title: 'Microsoft SDE Placement Drive Registration', content: 'Eligible 4th year & 3rd year CSE/IT students can apply before August 14.', category: 'PLACEMENT', priority: 'URGENT', isPinned: true, createdBy: 'Training & Placement Cell', createdAt: new Date() },
  { id: 'n3', title: 'Annual Hackathon "HackCampus 2026" Announced', content: 'Registrations open for 48-hour campus hackathon with prizes worth ₹2.5 Lakhs.', category: 'EVENT', priority: 'MEDIUM', isPinned: false, createdBy: 'Tech Club', createdAt: new Date() },
];

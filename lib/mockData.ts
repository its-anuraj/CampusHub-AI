// Centralized Data for KCC Institute of Technology & Management (KCCITM)

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
  attendancePercentage: 87.5,
  cgpa: 8.45,
  backlogs: 0,
  pendingAssignments: 2,
  upcomingExams: 2,
  unreadNotices: 3,
  todaysClasses: [
    { id: '1', subject: 'Design & Analysis of Algorithms', facultyName: 'Dr. Priya Sharma', room: 'Lab 204 (CSE Block)', startTime: '09:30', endTime: '11:00', type: 'LAB', status: 'COMPLETED' },
    { id: '2', subject: 'Database Management Systems', facultyName: 'Prof. Rajesh Verma', room: 'LT-2 (Main Building)', startTime: '11:15', endTime: '12:15', type: 'LECTURE', status: 'ONGOING' },
    { id: '3', subject: 'Machine Learning & Deep Neural Nets', facultyName: 'Dr. Anita Roy', room: 'Lab 301 (AI Lab)', startTime: '14:00', endTime: '15:30', type: 'LAB', status: 'UPCOMING' },
  ],
  recentNotices: [
    { id: 'n1', title: 'AKTU Mid-Semester Odd Sem Examination Schedule', content: 'KCCITM Odd semester mid-term tests begin from Oct 12. Hall tickets will be issued digitally.', category: 'EXAM', priority: 'HIGH', isPinned: true, createdBy: 'Examination Cell', createdAt: new Date() },
    { id: 'n2', title: 'Amazon AWS & TCS National Qualifier Test (NQT) Drive', content: 'Batch 2023-27 & 2024-28 eligible candidates must register on TPO portal by Friday 5 PM.', category: 'PLACEMENT', priority: 'URGENT', isPinned: true, createdBy: 'TPO Desk - KCCITM', createdAt: new Date() },
  ],
  attendanceData: [
    { month: 'Jun', present: 22, absent: 2, percentage: 91.6 },
    { month: 'Jul', present: 21, absent: 3, percentage: 87.5 },
    { month: 'Aug', present: 20, absent: 2, percentage: 90.9 },
  ],
};

export const facultyDashboardData: FacultyDashboardStats = {
  totalStudents: 150,
  classesToday: 3,
  pendingGrading: 8,
  averageAttendance: 89.2,
  upcomingClasses: [
    { id: 'f1', subject: 'Design & Analysis of Algorithms (CSE 3rd Sem)', facultyName: 'Self', room: 'Lab 204', startTime: '09:30', endTime: '11:00', type: 'LAB', status: 'COMPLETED' },
    { id: 'f2', subject: 'Database Management Systems (IT 5th Sem)', facultyName: 'Self', room: 'LT-2', startTime: '11:15', endTime: '12:15', type: 'LECTURE', status: 'ONGOING' },
    { id: 'f3', subject: 'Cloud Computing & DevOps (CSE-AIML 7th Sem)', facultyName: 'Self', room: 'LT-5', startTime: '14:30', endTime: '15:30', type: 'LECTURE', status: 'UPCOMING' },
  ],
  recentSubmissions: [
    { id: 'a1', title: 'Dynamic Programming & Graph Algorithms', subject: 'Algorithms', description: 'Implement Dijkstra and Floyd-Warshall in C++/Python', dueDate: new Date(Date.now() + 86400000 * 3), totalMarks: 25, facultyName: 'Dr. Priya Sharma', status: 'SUBMITTED', submittedAt: new Date() },
  ],
  studentPerformance: [
    { subject: 'Algorithms', marks: 88, maxMarks: 100, grade: 'A+' },
    { subject: 'DBMS', marks: 82, maxMarks: 100, grade: 'A' },
    { subject: 'Operating Systems', marks: 79, maxMarks: 100, grade: 'B+' },
  ],
};

export const adminDashboardData: AdminDashboardStats = {
  totalStudents: 2000,
  totalFaculty: 150,
  totalDepartments: 10,
  feeCollectionThisMonth: 12500000,
  attendanceToday: 91.4,
  activeComplaints: 3,
  placedStudents: 412,
  recentActivity: [
    { id: 'act1', action: 'Director Anuraj Singh authorized Batch 2024-28 Fee Ledger Schedule', user: 'Director Desk', timestamp: new Date(), type: 'SUCCESS' },
    { id: 'act2', action: 'TCS & Capgemini Campus Drive clearance approved by TPO', user: 'Placement Cell', timestamp: new Date(), type: 'INFO' },
    { id: 'act3', action: 'New Faculty Onboarded in CSE-AIML Department', user: 'Registrar Office', timestamp: new Date(), type: 'SUCCESS' },
  ],
  enrollmentData: [
    { year: '2023-27 (Batch 1)', students: 480 },
    { year: '2024-28 (Batch 2)', students: 510 },
    { year: '2025-29 (Batch 3)', students: 500 },
    { year: '2026-30 (Batch 4)', students: 510 },
  ],
  departmentData: [
    { name: 'CSE', students: 550, faculty: 38, color: '#3B82F6' },
    { name: 'CSE-AIML', students: 320, faculty: 22, color: '#6366F1' },
    { name: 'CSE-DS', students: 240, faculty: 18, color: '#8B5CF6' },
    { name: 'IT', students: 220, faculty: 16, color: '#EC4899' },
    { name: 'ECE', students: 180, faculty: 15, color: '#10B981' },
    { name: 'MECH', students: 140, faculty: 12, color: '#F59E0B' },
    { name: 'CIVIL', students: 110, faculty: 9, color: '#EF4444' },
    { name: 'MBA', students: 120, faculty: 10, color: '#14B8A6' },
    { name: 'MCA', students: 80, faculty: 6, color: '#06B6D4' },
    { name: 'ASH', students: 40, faculty: 4, color: '#84CC16' },
  ],
};

export const parentDashboardData: ParentDashboardStats = {
  childName: 'Arjun Singh',
  childRollNumber: 'KCC2023CSE045',
  attendancePercentage: 88.5,
  cgpa: 8.45,
  pendingFees: 0,
  nextExam: 'Algorithms & DBMS (12 Oct)',
  recentMarks: [
    { subject: 'Algorithms', exam: 'Mid Sem 1', marks: 24, maxMarks: 25, grade: 'A+' },
    { subject: 'DBMS', exam: 'Mid Sem 1', marks: 22, maxMarks: 25, grade: 'A' },
    { subject: 'Machine Learning', exam: 'Mid Sem 1', marks: 21, maxMarks: 25, grade: 'A' },
  ],
  attendanceData: [
    { month: 'Jun', present: 22, absent: 2, percentage: 91.6 },
    { month: 'Jul', present: 21, absent: 3, percentage: 87.5 },
    { month: 'Aug', present: 20, absent: 2, percentage: 90.9 },
  ],
};

export const todaysClasses: TodayClass[] = [
  { id: '1', subject: 'Design & Analysis of Algorithms', facultyName: 'Dr. Priya Sharma', room: 'Lab 204 (CSE Block)', startTime: '09:30', endTime: '11:00', type: 'LAB', status: 'COMPLETED' },
  { id: '2', subject: 'Database Management Systems', facultyName: 'Prof. Rajesh Verma', room: 'LT-2 (Main Building)', startTime: '11:15', endTime: '12:15', type: 'LECTURE', status: 'ONGOING' },
  { id: '3', subject: 'Machine Learning & Neural Nets', facultyName: 'Dr. Anita Roy', room: 'Lab 301 (AI Lab)', startTime: '14:00', endTime: '15:30', type: 'LAB', status: 'UPCOMING' },
];

export const assignments: Assignment[] = [
  { id: 'asgn1', title: 'Dynamic Programming & Graph Traversal', subject: 'Algorithms', description: 'Implement DP memoization and shortest path routing in C++.', dueDate: new Date(Date.now() + 86400000 * 3), totalMarks: 25, facultyName: 'Dr. Priya Sharma', status: 'PENDING' },
  { id: 'asgn2', title: 'SQL Query Optimization & Indexing', subject: 'DBMS', description: 'Analyze B-Tree index cardinality and transaction isolation levels.', dueDate: new Date(Date.now() + 86400000 * 6), totalMarks: 20, facultyName: 'Prof. Rajesh Verma', status: 'SUBMITTED', submittedAt: new Date(Date.now() - 86400000) },
  { id: 'asgn3', title: 'Neural Network Forward & Backpropagation', subject: 'Machine Learning', description: 'Implement a 3-layer neural network from scratch using NumPy.', dueDate: new Date(Date.now() - 86400000 * 2), totalMarks: 30, facultyName: 'Dr. Anita Roy', status: 'GRADED', marksObtained: 28, feedback: 'Great math proofs on gradient descent.' },
];

// Session-wise Fixed Fee Structure for KCCITM (Batch 2023-27: ₹50,000 / sem, Batch 2024-28: ₹55,000 / sem)
export const feeRecords: FeeRecord[] = [
  { id: 'fee1', type: 'Tuition Fee (Batch 2023-27 • Semester 5)', amount: 50000, dueDate: new Date('2026-08-31'), status: 'PAID', paidDate: new Date('2026-08-05'), receipt: 'KCC-RCPT-2026-001' },
  { id: 'fee2', type: 'AKTU Examination & ERP Portal Fee', amount: 2500, dueDate: new Date('2026-08-31'), status: 'PAID', paidDate: new Date('2026-08-05'), receipt: 'KCC-RCPT-2026-002' },
  { id: 'fee3', type: 'Industry Training & Placement (TPO) Fee', amount: 3500, dueDate: new Date('2026-09-15'), status: 'PENDING' },
  { id: 'fee4', type: 'Hostel & Mess Fee (Odd Semester)', amount: 45000, dueDate: new Date('2026-09-30'), status: 'PENDING' },
];

// Placement Companies at KCCITM (Top Recruiters, Packages & Drives)
export const placementCompanies: PlacementCompany[] = [
  { id: 'comp1', name: 'Amazon AWS', role: 'Cloud Support / SDE Intern', package: '₹28.5 LPA', eligibility: { minCgpa: 7.5, noBacklogs: true, departments: ['CSE', 'CSE-AIML', 'CSE-DS', 'IT'] }, deadline: new Date(Date.now() + 86400000 * 5), status: 'OPEN', applicants: 118 },
  { id: 'comp2', name: 'Tata Consultancy Services (TCS Digital)', role: 'Systems Engineer / Digital Developer', package: '₹7.5 - 11.5 LPA', eligibility: { minCgpa: 6.8, noBacklogs: true, departments: ['CSE', 'CSE-AIML', 'CSE-DS', 'IT', 'ECE'] }, deadline: new Date(Date.now() + 86400000 * 9), status: 'OPEN', applicants: 245 },
  { id: 'comp3', name: 'Capgemini India', role: 'Senior Analyst & Software Engineer', package: '₹6.5 - 8.5 LPA', eligibility: { minCgpa: 6.5, noBacklogs: false, departments: ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'] }, deadline: new Date(Date.now() + 86400000 * 14), status: 'UPCOMING', applicants: 0 },
  { id: 'comp4', name: 'Infosys (Power Programmer & SE)', role: 'Specialist Programmer', package: '₹9.5 LPA', eligibility: { minCgpa: 7.0, noBacklogs: true, departments: ['CSE', 'CSE-AIML', 'CSE-DS', 'IT'] }, deadline: new Date(Date.now() + 86400000 * 20), status: 'UPCOMING', applicants: 0 },
  { id: 'comp5', name: 'Wipro Technologies', role: 'Project Engineer (Turbo)', package: '₹6.5 LPA', eligibility: { minCgpa: 6.0, noBacklogs: false, departments: ['CSE', 'IT', 'ECE', 'MECH'] }, deadline: new Date(Date.now() - 86400000 * 4), status: 'CLOSED', applicants: 310 },
  { id: 'comp6', name: 'Cognizant (GenC Elevate)', role: 'Associate Software Developer', package: '₹6.0 LPA', eligibility: { minCgpa: 6.5, noBacklogs: false, departments: ['CSE', 'IT', 'ECE', 'MCA'] }, deadline: new Date(Date.now() - 86400000 * 8), status: 'CLOSED', applicants: 280 },
];

export const libraryBooks: LibraryBook[] = [
  { id: 'book1', title: 'Introduction to Algorithms (CLRS 4th Ed)', author: 'Thomas H. Cormen, Charles E. Leiserson', isbn: '978-0262046305', subject: 'Data Structures & Algorithms', available: true, totalCopies: 12, availableCopies: 5 },
  { id: 'book2', title: 'Database System Concepts (7th Ed)', author: 'Abraham Silberschatz, Henry F. Korth', isbn: '978-0078022159', subject: 'DBMS', available: true, totalCopies: 10, availableCopies: 4 },
  { id: 'book3', title: 'Operating System Concepts (10th Ed)', author: 'Silberschatz, Peter B. Galvin, Greg Gagne', isbn: '978-1118063330', subject: 'Operating Systems', available: false, totalCopies: 8, availableCopies: 0 },
  { id: 'book4', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell, Peter Norvig', isbn: '978-0134610993', subject: 'AI & Machine Learning', available: true, totalCopies: 10, availableCopies: 7 },
];

export const discussionPosts: DiscussionPost[] = [
  { id: 'post1', title: 'KCCITM Placement Drive: Amazon AWS & TCS NQT Prep Roadmap', content: 'Sharing curated dynamic programming & core CS subject notes for upcoming campus drives.', author: 'Arjun Singh', isAnonymous: false, tags: ['Placements', 'KCCITM', 'Algorithms'], likes: 24, replies: 8, createdAt: new Date(Date.now() - 3600000 * 5) },
  { id: 'post2', title: 'AKTU Odd Semester Lab Exam Schedule clarification', content: 'Are the external practicals starting from next week or after Diwali break?', author: 'Anonymous Student', isAnonymous: true, tags: ['AKTU', 'Exams'], likes: 11, replies: 4, createdAt: new Date(Date.now() - 3600000 * 14) },
];

export const complaints: Complaint[] = [
  { id: 'cmp1', title: 'KCCITM Campus Wi-Fi 6 High Bandwidth Router in Lab 3', description: 'Network connectivity optimized for AI workstation cluster.', category: 'INTERNET', status: 'RESOLVED', submittedBy: 'Arjun Singh', createdAt: new Date(Date.now() - 86400000 * 3), resolvedAt: new Date(Date.now() - 86400000 * 1) },
  { id: 'cmp2', title: 'Hostel Block B Air Conditioning Maintenance', description: 'Filter replacement requested for Room 204.', category: 'HOSTEL', status: 'IN_PROGRESS', submittedBy: 'Priya Patel', createdAt: new Date(Date.now() - 86400000 * 1) },
];

export const notices: Notice[] = [
  { id: 'n1', title: 'AKTU Mid-Semester Odd Sem Examination Schedule', content: 'Odd semester mid-term tests begin from Oct 12. Hall tickets will be issued digitally on KCC.campushub.edu.in.', category: 'EXAM', priority: 'HIGH', isPinned: true, createdBy: 'Examination Cell - KCCITM', createdAt: new Date() },
  { id: 'n2', title: 'Amazon AWS & TCS National Qualifier Test (NQT) Drive', content: 'Batch 2023-27 & 2024-28 eligible candidates must register on TPO portal by Friday 5 PM.', category: 'PLACEMENT', priority: 'URGENT', isPinned: true, createdBy: 'Training & Placement Desk (TPO)', createdAt: new Date() },
  { id: 'n3', title: 'KCCITM Annual National Tech-Fest & AI Hackathon', content: 'Registrations open for 36-hour National Hackathon with prizes worth ₹2.5 Lakhs. Supported by GDG & ACM.', category: 'EVENT', priority: 'MEDIUM', isPinned: false, createdBy: 'Department of CSE & Tech Club', createdAt: new Date() },
];

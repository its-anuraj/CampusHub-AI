import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Cleanup existing tables for idempotent seed
  await prisma.auditLog.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.notice.deleteMany({});
  await prisma.placementApplication.deleteMany({});
  await prisma.placementCompany.deleteMany({});
  await prisma.feeRecord.deleteMany({});
  await prisma.libraryBook.deleteMany({});

  // 1. Users & Profiles
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@campushub.ai' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@campushub.ai',
      password: 'Admin@123',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const facultyUser = await prisma.user.upsert({
    where: { email: 'faculty@campushub.ai' },
    update: {},
    create: {
      name: 'Dr. Priya Sharma',
      email: 'faculty@campushub.ai',
      password: 'Faculty@123',
      role: 'FACULTY',
      status: 'ACTIVE',
      facultyProfile: {
        create: {
          employeeId: 'FAC-001',
          department: 'CSE',
          designation: 'Associate Professor',
          subjects: JSON.stringify(['Data Structures', 'Computer Networks']),
        },
      },
    },
  });

  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@campushub.ai' },
    update: {},
    create: {
      name: 'Sunita Singh',
      email: 'parent@campushub.ai',
      password: 'Parent@123',
      role: 'PARENT',
      status: 'ACTIVE',
      parentProfile: {
        create: {
          relation: 'Mother',
        },
      },
    },
  });

  const parentProfile = await prisma.parent.findUnique({ where: { userId: parentUser.id } });

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@campushub.ai' },
    update: {},
    create: {
      name: 'Arjun Singh',
      email: 'student@campushub.ai',
      password: 'Student@123',
      role: 'STUDENT',
      status: 'ACTIVE',
      studentProfile: {
        create: {
          rollNumber: 'CS2023045',
          department: 'CSE',
          year: 3,
          semester: 5,
          section: 'A',
          cgpa: 8.2,
          backlogs: 0,
          parentId: parentProfile?.id,
        },
      },
    },
  });

  const studentProfile = await prisma.student.findUnique({ where: { userId: studentUser.id } });

  // Dedicated User AJ Singh
  await prisma.user.upsert({
    where: { email: 'ajsinghindolia@gmail.com' },
    update: { password: '12345678' },
    create: {
      name: 'AJ Singh',
      email: 'ajsinghindolia@gmail.com',
      password: '12345678',
      role: 'STUDENT',
      status: 'ACTIVE',
      studentProfile: {
        create: {
          rollNumber: 'CS2026888',
          department: 'CSE',
          year: 3,
          semester: 5,
          section: 'A',
          cgpa: 9.1,
          backlogs: 0,
        },
      },
    },
  });

  // Additional Students
  const student2 = await prisma.user.upsert({
    where: { email: 'priya@student.campushub.ai' },
    update: {},
    create: {
      name: 'Priya Patel',
      email: 'priya@student.campushub.ai',
      password: 'Student@123',
      role: 'STUDENT',
      status: 'ACTIVE',
      studentProfile: {
        create: {
          rollNumber: 'CS2023046',
          department: 'CSE',
          year: 3,
          semester: 5,
          section: 'A',
          cgpa: 8.9,
          backlogs: 0,
        },
      },
    },
  });

  // 2. Notices
  await prisma.notice.createMany({
    data: [
      {
        title: 'Mid-Semester Exam Schedule Released',
        content: 'Mid-semester examinations will be held from 25th August to 2nd September 2026. All students must carry valid ID cards.',
        category: 'EXAM',
        priority: 'URGENT',
        department: 'ALL',
        isPinned: true,
        createdBy: 'Examination Cell',
      },
      {
        title: 'TCS Campus Recruitment Drive',
        content: 'Tata Consultancy Services (TCS) is visiting our campus on 15th August for CSE, IT, ECE graduates with CGPA >= 7.0.',
        category: 'PLACEMENT',
        priority: 'HIGH',
        department: 'CSE',
        isPinned: true,
        createdBy: 'Placement Cell',
      },
      {
        title: 'Library Book Return Reminder',
        content: 'Please return all overdue books by Friday to avoid fine imposition.',
        category: 'GENERAL',
        priority: 'MEDIUM',
        department: 'ALL',
        isPinned: false,
        createdBy: 'Library Department',
      },
    ],
  });

  // 3. Assignments & Submissions
  const asgn1 = await prisma.assignment.create({
    data: {
      title: 'Binary Search Tree Implementation',
      subject: 'Data Structures',
      description: 'Implement a BST with insert, search, delete, and traversal functions in C++.',
      dueDate: new Date('2026-08-15'),
      totalMarks: 20,
      facultyName: 'Dr. Priya Sharma',
    },
  });

  const asgn2 = await prisma.assignment.create({
    data: {
      title: 'TCP/IP Packet Capture Analysis',
      subject: 'Computer Networks',
      description: 'Use Wireshark to capture TCP handshake packets and summarize window size behavior.',
      dueDate: new Date('2026-08-20'),
      totalMarks: 20,
      facultyName: 'Dr. Priya Sharma',
    },
  });

  if (studentProfile) {
    await prisma.submission.create({
      data: {
        assignmentId: asgn1.id,
        studentId: studentProfile.id,
        status: 'SUBMITTED',
      },
    });

    // 4. Attendance
    const subjects = ['Data Structures', 'DBMS', 'Operating Systems', 'Computer Networks', 'Software Eng'];
    for (const sub of subjects) {
      await prisma.attendance.create({
        data: {
          studentId: studentProfile.id,
          subject: sub,
          status: Math.random() > 0.15 ? 'PRESENT' : 'ABSENT',
          markedBy: 'Dr. Priya Sharma',
          date: new Date(),
        },
      });
    }

    // 5. Fees
    await prisma.feeRecord.createMany({
      data: [
        {
          studentId: studentProfile.id,
          type: 'Tuition Fee - Semester 5',
          amount: 85000,
          dueDate: new Date('2026-07-31'),
          paidDate: new Date('2026-07-28'),
          status: 'PAID',
          receipt: 'RCPT-2026-001',
        },
        {
          studentId: studentProfile.id,
          type: 'Hostel Fee - Semester 5',
          amount: 45000,
          dueDate: new Date('2026-08-15'),
          status: 'PENDING',
        },
      ],
    });
  }

  // 6. Placement Companies
  await prisma.placementCompany.createMany({
    data: [
      {
        name: 'Tata Consultancy Services',
        role: 'Software Engineer',
        package: '4.5 - 7.0 LPA',
        minCgpa: 7.0,
        departments: JSON.stringify(['CSE', 'IT', 'ECE']),
        deadline: new Date('2026-08-15'),
        status: 'OPEN',
        applicants: 142,
      },
      {
        name: 'Infosys',
        role: 'Systems Engineer',
        package: '3.6 - 5.0 LPA',
        minCgpa: 6.5,
        departments: JSON.stringify(['CSE', 'IT', 'ECE', 'MECH']),
        deadline: new Date('2026-08-20'),
        status: 'OPEN',
        applicants: 98,
      },
      {
        name: 'Amazon',
        role: 'SDE Intern',
        package: '50,000/month',
        minCgpa: 8.0,
        departments: JSON.stringify(['CSE', 'IT']),
        deadline: new Date('2026-09-01'),
        status: 'UPCOMING',
        applicants: 0,
      },
    ],
  });

  // 7. Library Books
  await prisma.libraryBook.createMany({
    data: [
      { title: 'Introduction to Algorithms', author: 'Cormen, Leiserson', isbn: '978-0262033848', subject: 'Data Structures', totalCopies: 5, availableCopies: 3, available: true },
      { title: 'Database System Concepts', author: 'Silberschatz, Korth', isbn: '978-0073523323', subject: 'DBMS', totalCopies: 4, availableCopies: 0, available: false },
      { title: 'Operating System Concepts', author: 'Silberschatz', isbn: '978-1118063330', subject: 'Operating Systems', totalCopies: 6, availableCopies: 4, available: true },
    ],
  });

  // 8. Courses & Enrollments
  await prisma.courseEnrollment.deleteMany({});
  await prisma.course.deleteMany({});

  const c1 = await prisma.course.create({
    data: {
      code: 'CS501',
      title: 'Advanced Data Structures & Algorithms',
      department: 'CSE',
      credits: 4,
      semester: 5,
      description: 'Master binary search trees, B-trees, graph algorithms, dynamic programming, and NP-completeness.',
      syllabus: JSON.stringify(['Arrays & Hashing', 'Trees & B-Trees', 'Graph Traversal (BFS/DFS)', 'Dynamic Programming', 'NP Complexity']),
      facultyName: 'Dr. Priya Sharma',
    },
  });

  const c2 = await prisma.course.create({
    data: {
      code: 'CS502',
      title: 'Database Management Systems (DBMS)',
      department: 'CSE',
      credits: 4,
      semester: 5,
      description: 'Relational algebra, SQL query optimization, ER modeling, normalization (1NF-5NF), transaction ACID properties, and indexing.',
      syllabus: JSON.stringify(['ER Modeling', 'Relational Algebra & SQL', 'Normalization', 'Transaction Processing', 'Indexing & B+ Trees']),
      facultyName: 'Prof. Rajesh Verma',
    },
  });

  const c3 = await prisma.course.create({
    data: {
      code: 'CS503',
      title: 'Computer Networks & Internet Protocols',
      department: 'CSE',
      credits: 4,
      semester: 5,
      description: 'OSI layers, TCP/IP stack, socket programming, IPv4/IPv6 subnetting, routing protocols (OSPF, BGP), and Wireshark analysis.',
      syllabus: JSON.stringify(['Physical & Data Link Layers', 'IP Addressing & Subnetting', 'Transport TCP/UDP', 'Application Protocols', 'Network Security']),
      facultyName: 'Dr. Anita Roy',
    },
  });

  const c4 = await prisma.course.create({
    data: {
      code: 'CS504',
      title: 'Operating Systems & System Architecture',
      department: 'CSE',
      credits: 4,
      semester: 5,
      description: 'Process management, CPU scheduling, semaphores, deadlock prevention, virtual memory paging, and file system layout.',
      syllabus: JSON.stringify(['Processes & Threads', 'CPU Scheduling', 'Process Sync & Deadlocks', 'Memory Management', 'File Systems']),
      facultyName: 'Dr. Rajesh Kumar',
    },
  });

  const c5 = await prisma.course.create({
    data: {
      code: 'AI501',
      title: 'Applied Machine Learning & Deep Neural Nets',
      department: 'AIML',
      credits: 3,
      semester: 5,
      description: 'Supervised regression/classification, decision trees, neural network backpropagation, PyTorch, and model evaluations.',
      syllabus: JSON.stringify(['Supervised Learning', 'Regression & Classification', 'Neural Network Backprop', 'PyTorch Basics', 'Model Evaluation']),
      facultyName: 'Dr. Sneha Gupta',
    },
  });

  if (studentProfile) {
    await prisma.courseEnrollment.createMany({
      data: [
        { courseId: c1.id, studentId: studentProfile.id, status: 'ENROLLED', grade: 'A+' },
        { courseId: c2.id, studentId: studentProfile.id, status: 'ENROLLED', grade: 'A' },
        { courseId: c3.id, studentId: studentProfile.id, status: 'ENROLLED', grade: 'B+' },
        { courseId: c4.id, studentId: studentProfile.id, status: 'ENROLLED', grade: 'A' },
      ],
    });
  }

  // 9. Hostel Rooms
  try {
    await prisma.hostelRoom.createMany({
      data: [
        { block: 'Block A (Boys - Everest)', roomNumber: '101', capacity: 2, occupied: 1, roomType: 'DOUBLE_AC', floor: 1, monthlyRent: 7500, status: 'AVAILABLE' },
        { block: 'Block A (Boys - Everest)', roomNumber: '102', capacity: 2, occupied: 2, roomType: 'DOUBLE_AC', floor: 1, monthlyRent: 7500, status: 'OCCUPIED' },
        { block: 'Block C (Girls - Sarojini)', roomNumber: '101', capacity: 2, occupied: 1, roomType: 'DOUBLE_AC', floor: 1, monthlyRent: 7500, status: 'AVAILABLE' },
      ],
    });
  } catch {}

  // 10. Campus Events
  try {
    await prisma.campusEvent.createMany({
      data: [
        {
          title: 'HackNova 2026: 36-Hour National AI Hackathon',
          description: 'Build cutting-edge agentic AI, LLM agents, and Web3 applications. ₹2.5 Lakhs in cash prizes.',
          category: 'HACKATHON',
          venue: 'Campus Innovation Hub & Auditorium',
          date: new Date('2026-09-12T09:00:00.000Z'),
          time: '09:00 AM - 09:00 PM (36 Hours)',
          organizer: 'Department of CSE & ACM Chapter',
          maxCapacity: 250,
          registered: 184,
          status: 'UPCOMING',
        },
        {
          title: 'Generative AI & LLM Systems Hands-on Workshop',
          description: 'Prompt engineering, RAG architectures with vector embeddings, and fine-tuning on GPUs.',
          category: 'WORKSHOP',
          venue: 'Advanced Computing Lab 3',
          date: new Date('2026-08-30T10:00:00.000Z'),
          time: '10:00 AM - 04:00 PM',
          organizer: 'Google Developer Group (GDG On-Campus)',
          maxCapacity: 80,
          registered: 76,
          status: 'UPCOMING',
        },
      ],
    });
  } catch {}

  // 11. Scholarships
  try {
    await prisma.scholarship.createMany({
      data: [
        {
          title: 'Chancellor’s Academic Merit Scholarship',
          provider: 'CampusHub Institutional Endowment',
          amount: 75000,
          deadline: new Date('2026-09-30T23:59:59.000Z'),
          minCgpa: 8.5,
          familyIncome: 1200000,
          description: 'Awarded to top 5% academic scorers across each department with exceptional research potential.',
          category: 'MERIT',
          status: 'ACTIVE',
        },
      ],
    });
  } catch {}

  // 12. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { action: 'Database initialized & seeded successfully with full CampusHub AI v2.5.0 ecosystem', type: 'SUCCESS' },
      { action: 'Student Arjun Singh logged in', type: 'INFO' },
      { action: 'Notice "Mid-Semester Exam Schedule" published', type: 'INFO' },
    ],
  });

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding KCC Institute of Technology and Management (KCCITM) database...');

  // Cleanup existing tables for idempotent seed
  await prisma.auditLog.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.notice.deleteMany({});
  await prisma.placementApplication.deleteMany({});
  await prisma.placementCompany.deleteMany({});
  await prisma.feeRecord.deleteMany({});
  await prisma.libraryBook.deleteMany({});
  await prisma.courseEnrollment.deleteMany({});
  await prisma.course.deleteMany({});

  // 1. Director User & Profile (Anuraj Singh)
  const directorUser = await prisma.user.upsert({
    where: { email: 'ajsinghindolia@gmail.com' },
    update: {
      name: 'Anuraj Singh',
      phone: '6397193704',
      password: '001234',
      role: 'ADMIN',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      pincode: '201306',
      address: 'KCC Institute of Technology and Management Campus, Knowledge Park III, Greater Noida, UP',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
    },
    create: {
      name: 'Anuraj Singh',
      phone: '6397193704',
      email: 'ajsinghindolia@gmail.com',
      password: '001234',
      role: 'ADMIN',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      pincode: '201306',
      address: 'KCC Institute of Technology and Management Campus, Knowledge Park III, Greater Noida, UP',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      adminProfile: {
        create: {
          employeeId: 'KCC-DIR-001',
          departmentRole: 'DIRECTOR',
          designation: 'Director & Chief Executive Administrator (KCCITM)',
        },
      },
    },
  });

  await prisma.adminProfile.upsert({
    where: { userId: directorUser.id },
    update: {
      employeeId: 'KCC-DIR-001',
      departmentRole: 'DIRECTOR',
      designation: 'Director & Chief Executive Administrator (KCCITM)',
    },
    create: {
      userId: directorUser.id,
      employeeId: 'KCC-DIR-001',
      departmentRole: 'DIRECTOR',
      designation: 'Director & Chief Executive Administrator (KCCITM)',
    },
  });

  // 1b. Department Admin Staff Profiles (TPO, Accounts, Academic Admin, Library, Events)
  const staffMembers = [
    {
      name: 'Suresh Sharma',
      email: 'suresh.tpo@kcc.campushub.edu.in',
      password: 'Admin@123',
      employeeId: 'KCC-ADM-TPO-01',
      departmentRole: 'PLACEMENT_CELL',
      designation: 'Head of Training & Placements (TPO)',
      phone: '9876543210',
    },
    {
      name: 'Rakesh Kumar',
      email: 'rakesh.acad@kcc.campushub.edu.in',
      password: 'Admin@123',
      employeeId: 'KCC-ADM-ACAD-04',
      departmentRole: 'ACADEMIC_ADMIN',
      designation: 'Academic Registrar & Examination Officer',
      phone: '9876543213',
    },
    {
      name: 'Meena Gupta',
      email: 'meena.fees@kcc.campushub.edu.in',
      password: 'Admin@123',
      employeeId: 'KCC-ADM-ACC-02',
      departmentRole: 'FEES_ACCOUNTS',
      designation: 'Accounts & Finance Officer',
      phone: '9876543211',
    },
    {
      name: 'Dr. Naveen Joshi',
      email: 'naveen.lib@kcc.campushub.edu.in',
      password: 'Admin@123',
      employeeId: 'KCC-ADM-LIB-03',
      departmentRole: 'LIBRARY',
      designation: 'Chief Librarian & Knowledge Center Head',
      phone: '9876543212',
    },
    {
      name: 'Sunita Malhotra',
      email: 'sunita.events@kcc.campushub.edu.in',
      password: 'Admin@123',
      employeeId: 'KCC-ADM-EVT-05',
      departmentRole: 'EVENT_MANAGER',
      designation: 'Campus Events & Student Activities Head',
      phone: '9876543214',
    },
  ];

  for (const staff of staffMembers) {
    const sUser = await prisma.user.upsert({
      where: { email: staff.email },
      update: {
        name: staff.name,
        password: staff.password,
        role: 'ADMIN',
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        phone: staff.phone,
      },
      create: {
        name: staff.name,
        email: staff.email,
        password: staff.password,
        role: 'ADMIN',
        phone: staff.phone,
        city: 'Greater Noida',
        state: 'Uttar Pradesh',
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        adminProfile: {
          create: {
            employeeId: staff.employeeId,
            departmentRole: staff.departmentRole,
            designation: staff.designation,
          },
        },
      },
    });

    await prisma.adminProfile.upsert({
      where: { userId: sUser.id },
      update: {
        employeeId: staff.employeeId,
        departmentRole: staff.departmentRole,
        designation: staff.designation,
      },
      create: {
        userId: sUser.id,
        employeeId: staff.employeeId,
        departmentRole: staff.departmentRole,
        designation: staff.designation,
      },
    });
  }

  // 2. Faculty Profiles across KCCITM Departments
  const facultyUser1 = await prisma.user.upsert({
    where: { email: 'faculty@campushub.ai' },
    update: {},
    create: {
      name: 'Dr. Priya Sharma',
      email: 'faculty@campushub.ai',
      password: 'Faculty@123',
      role: 'FACULTY',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      status: 'ACTIVE',
      facultyProfile: {
        create: {
          employeeId: 'KCC-FAC-CSE-01',
          department: 'CSE',
          designation: 'Professor & Head of Department',
          subjects: JSON.stringify(['Design & Analysis of Algorithms', 'Data Structures']),
        },
      },
    },
  });

  const facultyUser2 = await prisma.user.upsert({
    where: { email: 'rajesh.verma@kcc.campushub.edu.in' },
    update: {},
    create: {
      name: 'Prof. Rajesh Verma',
      email: 'rajesh.verma@kcc.campushub.edu.in',
      password: 'Faculty@123',
      role: 'FACULTY',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      status: 'ACTIVE',
      facultyProfile: {
        create: {
          employeeId: 'KCC-FAC-AIML-02',
          department: 'CSE-AIML',
          designation: 'Associate Professor',
          subjects: JSON.stringify(['Machine Learning', 'Deep Learning']),
        },
      },
    },
  });

  // 3. Parent User & Profile
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@campushub.ai' },
    update: {},
    create: {
      name: 'Sunita Singh',
      email: 'parent@campushub.ai',
      password: 'Parent@123',
      role: 'PARENT',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      status: 'ACTIVE',
      parentProfile: {
        create: {
          relation: 'Mother',
          studentRollNumber: 'KCC2023CSE045',
          studentName: 'Arjun Singh',
          targetDepartment: 'CSE',
          targetYear: 3,
          targetSemester: 5,
          targetSection: 'A',
        },
      },
    },
  });

  const parentProfile = await prisma.parent.findUnique({ where: { userId: parentUser.id } });

  // 4. Student Users (Batch 2023-27: ₹50,000/sem, Batch 2024-28: ₹55,000/sem)
  const studentUser1 = await prisma.user.upsert({
    where: { email: 'student@campushub.ai' },
    update: {},
    create: {
      name: 'Arjun Singh',
      email: 'student@campushub.ai',
      password: 'Student@123',
      role: 'STUDENT',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      pincode: '201306',
      address: 'Hostel Block A, KCCITM Campus, Greater Noida',
      status: 'ACTIVE',
      studentProfile: {
        create: {
          rollNumber: 'KCC2023CSE045',
          admissionNumber: 'ADM-KCC-2023-045',
          department: 'CSE',
          year: 3,
          semester: 5,
          section: 'A',
          cgpa: 8.45,
          backlogs: 0,
          academicStatus: 'REGULAR',
          classAdvisor: 'Dr. Priya Sharma',
          guardianName: 'Sunita Singh',
          guardianRelation: 'Mother',
          guardianPhone: '9876543210',
          parentId: parentProfile?.id,
        },
      },
    },
  });

  const studentProfile1 = await prisma.student.findUnique({ where: { userId: studentUser1.id } });

  const studentUser2 = await prisma.user.upsert({
    where: { email: 'priya@student.campushub.ai' },
    update: {},
    create: {
      name: 'Priya Patel',
      email: 'priya@student.campushub.ai',
      password: 'Student@123',
      role: 'STUDENT',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      status: 'ACTIVE',
      studentProfile: {
        create: {
          rollNumber: 'KCC2023AIML012',
          admissionNumber: 'ADM-KCC-2023-012',
          department: 'CSE-AIML',
          year: 3,
          semester: 5,
          section: 'A',
          cgpa: 8.92,
          backlogs: 0,
          academicStatus: 'REGULAR',
          classAdvisor: 'Prof. Rajesh Verma',
        },
      },
    },
  });

  const studentProfile2 = await prisma.student.findUnique({ where: { userId: studentUser2.id } });

  // 5. Notices for KCCITM
  await prisma.notice.createMany({
    data: [
      {
        title: 'AKTU Odd Semester Mid-Term Examination Schedule',
        content: 'Mid-semester examinations will be held from 12th October to 20th October 2026 for all B.Tech, MBA & MCA students. Admit cards are available on KCC.campushub.edu.in.',
        category: 'EXAM',
        priority: 'URGENT',
        department: 'ALL',
        isPinned: true,
        createdBy: 'Examination Cell - KCCITM',
      },
      {
        title: 'Amazon AWS & TCS Digital Campus Recruitment Drive (Batch 2023-27 & 2024-28)',
        content: 'Amazon AWS & TCS are visiting KCCITM campus. Eligible branches: CSE, CSE-AIML, CSE-DS, IT, ECE. Package up to ₹28.5 LPA. Register via TPO portal.',
        category: 'PLACEMENT',
        priority: 'HIGH',
        department: 'CSE',
        isPinned: true,
        createdBy: 'Training & Placement Cell (TPO)',
      },
      {
        title: 'Director Notice: Batch-wise Semester Fee Settlement Schedule',
        content: 'Students are advised to clear Odd Semester fees before 30th September. Batch 2023-27: ₹50,000/sem, Batch 2024-28: ₹55,000/sem via online gateway.',
        category: 'GENERAL',
        priority: 'HIGH',
        department: 'ALL',
        isPinned: true,
        createdBy: 'Office of the Director (Anuraj Singh)',
      },
    ],
  });

  // 6. Assignments & Submissions
  const asgn1 = await prisma.assignment.create({
    data: {
      title: 'Dynamic Programming & Graph Algorithms',
      subject: 'Design & Analysis of Algorithms',
      description: 'Implement Floyd-Warshall and Dijkstra shortest path algorithms in C++/Python with execution time benchmarking.',
      dueDate: new Date('2026-09-20'),
      totalMarks: 25,
      facultyName: 'Dr. Priya Sharma',
    },
  });

  const asgn2 = await prisma.assignment.create({
    data: {
      title: 'Relational Database Indexing & ACID Transactions',
      subject: 'Database Management Systems',
      description: 'Design B+ Tree storage engine queries and simulate 2-Phase Locking for concurrent transactions in PostgreSQL.',
      dueDate: new Date('2026-09-25'),
      totalMarks: 20,
      facultyName: 'Prof. Rajesh Verma',
    },
  });

  if (studentProfile1) {
    await prisma.submission.create({
      data: {
        assignmentId: asgn1.id,
        studentId: studentProfile1.id,
        status: 'SUBMITTED',
      },
    });

    // Attendance
    const subjects = ['Design & Analysis of Algorithms', 'DBMS', 'Operating Systems', 'Machine Learning', 'Computer Networks'];
    for (const sub of subjects) {
      await prisma.attendance.create({
        data: {
          studentId: studentProfile1.id,
          subject: sub,
          status: Math.random() > 0.12 ? 'PRESENT' : 'ABSENT',
          markedBy: 'Dr. Priya Sharma',
          date: new Date(),
        },
      });
    }

    // 7. Session-wise Fixed Fees (Batch 2023-27: ₹50,000 / semester)
    await prisma.feeRecord.createMany({
      data: [
        {
          studentId: studentProfile1.id,
          type: 'Tuition Fee (Batch 2023-27 • Semester 5)',
          amount: 50000,
          dueDate: new Date('2026-08-31'),
          paidDate: new Date('2026-08-05'),
          status: 'PAID',
          receipt: 'KCC-RCPT-2026-001',
        },
        {
          studentId: studentProfile1.id,
          type: 'AKTU University Examination & ERP Portal Fee',
          amount: 2500,
          dueDate: new Date('2026-08-31'),
          paidDate: new Date('2026-08-05'),
          status: 'PAID',
          receipt: 'KCC-RCPT-2026-002',
        },
        {
          studentId: studentProfile1.id,
          type: 'Industry Training & Placement (TPO) Fee',
          amount: 3500,
          dueDate: new Date('2026-09-15'),
          status: 'PENDING',
        },
        {
          studentId: studentProfile1.id,
          type: 'Hostel & Mess Fee (Odd Semester)',
          amount: 45000,
          dueDate: new Date('2026-09-30'),
          status: 'PENDING',
        },
      ],
    });
  }

  // 8. Placement Companies at KCCITM (Amazon, TCS, Capgemini, Infosys, Wipro, Cognizant)
  await prisma.placementCompany.createMany({
    data: [
      {
        name: 'Amazon AWS',
        role: 'Cloud Support / SDE Intern',
        package: '₹28.5 LPA',
        minCgpa: 7.5,
        departments: JSON.stringify(['CSE', 'CSE-AIML', 'CSE-DS', 'IT']),
        deadline: new Date('2026-09-18'),
        status: 'OPEN',
        applicants: 118,
      },
      {
        name: 'Tata Consultancy Services (TCS Digital)',
        role: 'Digital & Prime Software Engineer',
        package: '₹7.5 - 11.5 LPA',
        minCgpa: 6.8,
        departments: JSON.stringify(['CSE', 'CSE-AIML', 'CSE-DS', 'IT', 'ECE']),
        deadline: new Date('2026-09-25'),
        status: 'OPEN',
        applicants: 245,
      },
      {
        name: 'Capgemini India',
        role: 'Senior Software Analyst',
        package: '₹6.5 - 8.5 LPA',
        minCgpa: 6.5,
        departments: JSON.stringify(['CSE', 'IT', 'ECE', 'MECH', 'CIVIL']),
        deadline: new Date('2026-09-30'),
        status: 'UPCOMING',
        applicants: 0,
      },
      {
        name: 'Infosys',
        role: 'Specialist Programmer (Power Programmer)',
        package: '₹9.5 LPA',
        minCgpa: 7.0,
        departments: JSON.stringify(['CSE', 'CSE-AIML', 'CSE-DS', 'IT']),
        deadline: new Date('2026-10-05'),
        status: 'UPCOMING',
        applicants: 0,
      },
      {
        name: 'Wipro Technologies',
        role: 'Project Engineer (Turbo)',
        package: '₹6.5 LPA',
        minCgpa: 6.0,
        departments: JSON.stringify(['CSE', 'IT', 'ECE', 'MECH']),
        deadline: new Date('2026-08-30'),
        status: 'CLOSED',
        applicants: 310,
      },
    ],
  });

  // 9. Library Books
  await prisma.libraryBook.createMany({
    data: [
      { title: 'Introduction to Algorithms (CLRS 4th Ed)', author: 'Thomas H. Cormen, Charles E. Leiserson', isbn: '978-0262046305', subject: 'Data Structures & Algorithms', totalCopies: 15, availableCopies: 8, available: true },
      { title: 'Database System Concepts (7th Ed)', author: 'Abraham Silberschatz, Henry F. Korth', isbn: '978-0078022159', subject: 'DBMS', totalCopies: 12, availableCopies: 5, available: true },
      { title: 'Operating System Concepts (10th Ed)', author: 'Silberschatz, Peter B. Galvin', isbn: '978-1118063330', subject: 'Operating Systems', totalCopies: 10, availableCopies: 4, available: true },
      { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell, Peter Norvig', isbn: '978-0134610993', subject: 'AI & Machine Learning', totalCopies: 12, availableCopies: 9, available: true },
    ],
  });

  // 10. Courses for KCCITM Departments
  const c1 = await prisma.course.create({
    data: {
      code: 'KCC-CS501',
      title: 'Design & Analysis of Algorithms',
      department: 'CSE',
      credits: 4,
      semester: 5,
      description: 'Advanced divide & conquer, dynamic programming, graph algorithms (Dijkstra, Bellman-Ford), and NP-completeness.',
      syllabus: JSON.stringify(['Asymptotic Analysis', 'Divide and Conquer', 'Dynamic Programming', 'Graph Algorithms', 'NP-Completeness']),
      facultyName: 'Dr. Priya Sharma',
    },
  });

  const c2 = await prisma.course.create({
    data: {
      code: 'KCC-CS502',
      title: 'Database Management Systems (DBMS)',
      department: 'CSE',
      credits: 4,
      semester: 5,
      description: 'Relational model, SQL queries, normalization, indexing, transaction processing, and concurrency control.',
      syllabus: JSON.stringify(['ER Modeling', 'Relational Algebra', 'Normalization', 'ACID Transactions', 'B+ Tree Indexing']),
      facultyName: 'Prof. Rajesh Verma',
    },
  });

  const c3 = await prisma.course.create({
    data: {
      code: 'KCC-AI501',
      title: 'Machine Learning & Deep Neural Nets',
      department: 'CSE-AIML',
      credits: 4,
      semester: 5,
      description: 'Supervised and unsupervised learning, gradient descent, deep neural networks, CNNs, and PyTorch.',
      syllabus: JSON.stringify(['Supervised Learning', 'Loss Functions & Optimization', 'Neural Networks', 'CNN Architecture', 'Model Evaluation']),
      facultyName: 'Prof. Rajesh Verma',
    },
  });

  const c4 = await prisma.course.create({
    data: {
      code: 'KCC-DS501',
      title: 'Big Data Engineering & Analytics',
      department: 'CSE-DS',
      credits: 4,
      semester: 5,
      description: 'Distributed data pipelines, Apache Spark, Hadoop ecosystem, data warehousing, and predictive modeling.',
      syllabus: JSON.stringify(['Hadoop & HDFS', 'Apache Spark Architecture', 'Data Warehousing', 'Feature Engineering', 'Pipeline Deployment']),
      facultyName: 'Dr. Anita Roy',
    },
  });

  if (studentProfile1) {
    await prisma.courseEnrollment.createMany({
      data: [
        { courseId: c1.id, studentId: studentProfile1.id, status: 'ENROLLED', grade: 'A+' },
        { courseId: c2.id, studentId: studentProfile1.id, status: 'ENROLLED', grade: 'A' },
        { courseId: c3.id, studentId: studentProfile1.id, status: 'ENROLLED', grade: 'A+' },
      ],
    });
  }

  // 11. Campus Events
  try {
    await prisma.campusEvent.createMany({
      data: [
        {
          title: 'KCCITM HackNova 2026: 36-Hour National AI Hackathon',
          description: 'Build cutting-edge agentic AI, LLM agents, and Web3 applications. ₹2.5 Lakhs cash prizes.',
          category: 'HACKATHON',
          venue: 'KCCITM Auditorium & Innovation Lab Complex',
          date: new Date('2026-10-15T09:00:00.000Z'),
          time: '09:00 AM - 09:00 PM (36 Hours)',
          organizer: 'Department of CSE & ACM Student Chapter',
          maxCapacity: 300,
          registered: 215,
          status: 'UPCOMING',
        },
        {
          title: 'Hands-on Generative AI & AWS Cloud Architecture Workshop',
          description: 'Vector databases, RAG architecture, and deployment of LLMs on AWS EC2 GPU instances.',
          category: 'WORKSHOP',
          venue: 'Advanced AI Computing Lab 3 (Ground Floor)',
          date: new Date('2026-09-28T10:00:00.000Z'),
          time: '10:00 AM - 04:00 PM',
          organizer: 'Google Developer Group (GDG KCCITM)',
          maxCapacity: 100,
          registered: 92,
          status: 'UPCOMING',
        },
      ],
    });
  } catch {}

  // 12. Scholarships
  try {
    await prisma.scholarship.createMany({
      data: [
        {
          title: 'KCCITM Chairman Academic Excellence Scholarship',
          provider: 'KCC Group of Institutions Endowment Trust',
          amount: 50000,
          deadline: new Date('2026-10-31T23:59:59.000Z'),
          minCgpa: 8.5,
          familyIncome: 800000,
          description: 'Merit scholarship awarded to top 5% rank holders in AKTU semester examinations.',
          category: 'MERIT',
          status: 'ACTIVE',
        },
      ],
    });
  } catch {}

  // 13. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { action: 'KCC Institute of Technology and Management (KCCITM) database initialized successfully', type: 'SUCCESS' },
      { action: 'Director Anuraj Singh authenticated to College Director & Super Admin desk', type: 'INFO' },
      { action: 'Batch fee ledgers (2023-27: ₹50k, 2024-28: ₹55k) activated', type: 'SUCCESS' },
    ],
  });

  console.log('KCCITM Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

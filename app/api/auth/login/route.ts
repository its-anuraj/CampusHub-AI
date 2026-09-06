import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

const DEMO_USERS_MAP: Record<string, any> = {
  'ajsinghindolia@gmail.com': {
    id: 'user-dir-001',
    name: 'Anuraj Singh',
    email: 'ajsinghindolia@gmail.com',
    passwords: ['001234', 'Admin@123'],
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    phone: '6397193704',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    adminProfile: {
      id: 'prof-dir-001',
      userId: 'user-dir-001',
      employeeId: 'KCC-DIR-001',
      departmentRole: 'DIRECTOR',
      designation: 'Director & Chief Executive Administrator (KCCITM)',
    },
  },
  'admin@campushub.ai': {
    id: 'user-dir-001',
    name: 'Anuraj Singh',
    email: 'admin@campushub.ai',
    passwords: ['001234', 'Admin@123'],
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    phone: '6397193704',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    adminProfile: {
      id: 'prof-dir-001',
      userId: 'user-dir-001',
      employeeId: 'KCC-DIR-001',
      departmentRole: 'DIRECTOR',
      designation: 'Director & Chief Executive Administrator (KCCITM)',
    },
  },
  'suresh.tpo@kcc.campushub.edu.in': {
    id: 'user-adm-tpo',
    name: 'Suresh Sharma',
    email: 'suresh.tpo@kcc.campushub.edu.in',
    passwords: ['Admin@123'],
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    phone: '9876543210',
    adminProfile: {
      id: 'prof-tpo-001',
      userId: 'user-adm-tpo',
      employeeId: 'KCC-ADM-TPO-01',
      departmentRole: 'PLACEMENT_CELL',
      designation: 'Head of Training & Placements (TPO)',
    },
  },
  'rakesh.acad@kcc.campushub.edu.in': {
    id: 'user-adm-acad',
    name: 'Rakesh Kumar',
    email: 'rakesh.acad@kcc.campushub.edu.in',
    passwords: ['Admin@123'],
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    phone: '9876543213',
    adminProfile: {
      id: 'prof-acad-001',
      userId: 'user-adm-acad',
      employeeId: 'KCC-ADM-ACAD-04',
      departmentRole: 'ACADEMIC_ADMIN',
      designation: 'Academic Registrar & Examination Officer',
    },
  },
  'meena.fees@kcc.campushub.edu.in': {
    id: 'user-adm-fees',
    name: 'Meena Gupta',
    email: 'meena.fees@kcc.campushub.edu.in',
    passwords: ['Admin@123'],
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    phone: '9876543211',
    adminProfile: {
      id: 'prof-fees-001',
      userId: 'user-adm-fees',
      employeeId: 'KCC-ADM-ACC-02',
      departmentRole: 'FEES_ACCOUNTS',
      designation: 'Accounts & Finance Officer',
    },
  },
  'naveen.lib@kcc.campushub.edu.in': {
    id: 'user-adm-lib',
    name: 'Dr. Naveen Joshi',
    email: 'naveen.lib@kcc.campushub.edu.in',
    passwords: ['Admin@123'],
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    phone: '9876543212',
    adminProfile: {
      id: 'prof-lib-001',
      userId: 'user-adm-lib',
      employeeId: 'KCC-ADM-LIB-03',
      departmentRole: 'LIBRARY',
      designation: 'Chief Librarian & Knowledge Center Head',
    },
  },
  'sunita.events@kcc.campushub.edu.in': {
    id: 'user-adm-evt',
    name: 'Sunita Malhotra',
    email: 'sunita.events@kcc.campushub.edu.in',
    passwords: ['Admin@123'],
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    phone: '9876543214',
    adminProfile: {
      id: 'prof-evt-001',
      userId: 'user-adm-evt',
      employeeId: 'KCC-ADM-EVT-05',
      departmentRole: 'EVENT_MANAGER',
      designation: 'Campus Events & Student Activities Head',
    },
  },
  'faculty@campushub.ai': {
    id: 'user-fac-001',
    name: 'Dr. Priya Sharma',
    email: 'faculty@campushub.ai',
    passwords: ['Faculty@123'],
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    phone: '9876543210',
    facultyProfile: {
      id: 'prof-fac-001',
      userId: 'user-fac-001',
      employeeId: 'KCC-FAC-CSE-01',
      department: 'CSE',
      designation: 'Professor & Head of Department',
      subjects: JSON.stringify(['Design & Analysis of Algorithms', 'Data Structures']),
    },
  },
  'rajesh.verma@kcc.campushub.edu.in': {
    id: 'user-fac-002',
    name: 'Prof. Rajesh Verma',
    email: 'rajesh.verma@kcc.campushub.edu.in',
    passwords: ['Faculty@123'],
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    phone: '9876543215',
    facultyProfile: {
      id: 'prof-fac-002',
      userId: 'user-fac-002',
      employeeId: 'KCC-FAC-AIML-02',
      department: 'CSE-AIML',
      designation: 'Associate Professor',
      subjects: JSON.stringify(['Machine Learning', 'Deep Learning']),
    },
  },
  'student@campushub.ai': {
    id: 'user-stu-001',
    name: 'Arjun Singh',
    email: 'student@campushub.ai',
    passwords: ['Student@123'],
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    phone: '9876543210',
    studentProfile: {
      id: 'prof-stu-001',
      userId: 'user-stu-001',
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
    },
  },
  'priya@student.campushub.ai': {
    id: 'user-stu-002',
    name: 'Priya Patel',
    email: 'priya@student.campushub.ai',
    passwords: ['Student@123'],
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    phone: '9876543216',
    studentProfile: {
      id: 'prof-stu-002',
      userId: 'user-stu-002',
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
  'parent@campushub.ai': {
    id: 'user-par-001',
    name: 'Sunita Singh',
    email: 'parent@campushub.ai',
    passwords: ['Parent@123'],
    role: 'PARENT',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    phone: '9876543210',
    parentProfile: {
      id: 'prof-par-001',
      userId: 'user-par-001',
      relation: 'Mother',
      studentRollNumber: 'KCC2023CSE045',
      studentName: 'Arjun Singh',
      targetDepartment: 'CSE',
      targetYear: 3,
      targetSemester: 5,
      targetSection: 'A',
    },
  },
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Try querying Prisma database
    let user: any = null;
    try {
      user = await db.user.findFirst({
        where: {
          email: {
            equals: normalizedEmail,
          },
        },
        include: {
          studentProfile: true,
          facultyProfile: true,
          parentProfile: true,
          adminProfile: true,
        },
      });
    } catch (dbErr) {
      console.warn('Database query bypassed or unavailable, checking demo fallback:', dbErr);
    }

    // 2. If user found in Database
    if (user) {
      let isPasswordValid = false;
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        isPasswordValid = user.password === password;
      }

      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      if (user.status === 'PENDING' || user.verificationStatus === 'PENDING_APPROVAL') {
        return NextResponse.json({
          error: 'Your account is pending verification and approval. Once approved by your Coordinator / Administrator, you will receive an update and can log in easily with your registered credentials.',
        }, { status: 403 });
      }

      if (user.status !== 'ACTIVE' || user.verificationStatus === 'REJECTED') {
        return NextResponse.json({
          error: 'Your account registration was rejected or deactivated. Please contact the institution administrator.',
        }, { status: 403 });
      }

      // Try logging audit log safely
      try {
        await db.auditLog.create({
          data: {
            userId: user.id,
            action: `User ${user.name} (${user.role}) authenticated successfully`,
            type: 'SUCCESS',
          },
        });
      } catch (logErr) {
        // Non-blocking audit log
      }

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          studentProfile: user.studentProfile,
          facultyProfile: user.facultyProfile,
          parentProfile: user.parentProfile,
          adminProfile: user.adminProfile,
        },
      });
    }

    // 3. Fallback: Check verified Demo Users dictionary (ensures 100% login uptime on Vercel)
    const demoUser = DEMO_USERS_MAP[normalizedEmail];
    if (demoUser) {
      const isDemoPassValid = demoUser.passwords.includes(password) || demoUser.passwords.includes(password.trim());
      if (isDemoPassValid) {
        return NextResponse.json({
          user: {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role,
            avatar: demoUser.avatar,
            phone: demoUser.phone,
            studentProfile: demoUser.studentProfile || null,
            facultyProfile: demoUser.facultyProfile || null,
            parentProfile: demoUser.parentProfile || null,
            adminProfile: demoUser.adminProfile || null,
          },
        });
      }
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Authentication error' }, { status: 500 });
  }
}

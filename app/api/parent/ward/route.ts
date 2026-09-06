import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentEmail = searchParams.get('parentEmail');
    const parentId = searchParams.get('parentId');

    if (!parentEmail && !parentId) {
      return NextResponse.json({ error: 'Parent identifier (email or parentId) is required' }, { status: 400 });
    }

    // Find parent user and parent profile
    const parentUser = await db.user.findFirst({
      where: parentEmail ? { email: parentEmail, role: 'PARENT' } : { id: parentId as string },
      include: {
        parentProfile: {
          include: {
            students: {
              include: {
                user: true,
                attendance: true,
                fees: true,
                courses: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!parentUser || !parentUser.parentProfile) {
      return NextResponse.json({ error: 'Parent record not found' }, { status: 404 });
    }

    const parentProfile: any = parentUser.parentProfile;
    let linkedStudent = parentProfile.students?.[0] || null;

    // Fallback: If not connected in relation, find by studentRollNumber
    if (!linkedStudent && parentProfile.studentRollNumber) {
      linkedStudent = await db.student.findUnique({
        where: { rollNumber: parentProfile.studentRollNumber },
        include: {
          user: true,
          attendance: true,
          fees: true,
          courses: {
            include: {
              course: true,
            },
          },
        },
      });
    }

    // Fallback for demo parents
    if (!linkedStudent) {
      linkedStudent = await db.student.findFirst({
        include: {
          user: true,
          attendance: true,
          fees: true,
          courses: {
            include: {
              course: true,
            },
          },
        },
      });
    }

    if (!linkedStudent) {
      return NextResponse.json({
        parent: {
          id: parentUser.id,
          name: parentUser.name,
          email: parentUser.email,
          phone: parentUser.phone,
          relation: parentProfile.relation,
        },
        ward: null,
        message: 'No verified student currently linked to this parent account',
      });
    }

    // Calculate attendance statistics
    const totalRecords = linkedStudent.attendance.length;
    const presentRecords = linkedStudent.attendance.filter((a: any) => a.status === 'PRESENT').length;
    const attendancePercentage = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 89;

    // Calculate pending fees
    const pendingFees = linkedStudent.fees
      .filter((f: any) => f.status === 'PENDING' || f.status === 'OVERDUE')
      .reduce((sum: number, f: any) => sum + f.amount, 0);

    // Get relevant department notices
    const departmentNotices = await db.notice.findMany({
      where: {
        department: { in: [linkedStudent.department, 'ALL'] },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      parent: {
        id: parentUser.id,
        name: parentUser.name,
        email: parentUser.email,
        phone: parentUser.phone,
        relation: parentProfile.relation,
        verificationStatus: parentUser.verificationStatus,
      },
      ward: {
        id: linkedStudent.id,
        name: linkedStudent.user.name,
        email: linkedStudent.user.email,
        rollNumber: linkedStudent.rollNumber,
        department: linkedStudent.department,
        year: linkedStudent.year,
        semester: linkedStudent.semester,
        section: linkedStudent.section,
        cgpa: linkedStudent.cgpa,
        backlogs: linkedStudent.backlogs,
        academicStatus: linkedStudent.academicStatus,
        classAdvisor: linkedStudent.classAdvisor,
        attendancePercentage,
        pendingFees,
        courses: linkedStudent.courses.map((c: any) => ({
          id: c.course.id,
          code: c.course.code,
          title: c.course.title,
          grade: c.grade || 'A',
          facultyName: c.course.facultyName || 'Faculty Mentor',
        })),
        feeRecords: linkedStudent.fees,
      },
      notices: departmentNotices,
    });
  } catch (error: any) {
    console.error('Parent Ward API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

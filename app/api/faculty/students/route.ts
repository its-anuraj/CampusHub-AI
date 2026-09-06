import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendApprovalNotification } from '@/lib/emailService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const facultyEmail = searchParams.get('facultyEmail') || 'faculty@campushub.ai';

    const faculty = await db.user.findFirst({
      where: { email: facultyEmail, role: 'FACULTY' },
      include: { facultyProfile: true },
    });

    // Find class sections where this faculty is advisor / coordinator
    let managedSections = await db.classSection.findMany({
      where: faculty ? { classAdvisorId: faculty.id } : {},
    });

    if (managedSections.length === 0) {
      managedSections = await db.classSection.findMany({
        take: 2,
      });
    }

    // 1. Get Pending Student Verifications
    const pendingStudents = await db.student.findMany({
      where: {
        verificationStatus: 'PENDING_APPROVAL',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
            state: true,
            pincode: true,
            address: true,
            createdAt: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    // 2. Get Active Verified Students
    const verifiedStudents = await db.student.findMany({
      where: {
        verificationStatus: 'VERIFIED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: { rollNumber: 'asc' },
      take: 50,
    });

    // 3. Get Pending Parent Applications
    const rawPendingParents = await db.parent.findMany({
      where: {
        user: {
          verificationStatus: 'PENDING_APPROVAL',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
            state: true,
            pincode: true,
            address: true,
            createdAt: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    // For each pending parent, compute how many approved parents already exist for that student
    const pendingParents = await Promise.all(
      rawPendingParents.map(async (p) => {
        let approvedParentsCount = 0;
        let approvedParentsList: string[] = [];

        if (p.studentRollNumber) {
          const approvedParents = await db.parent.findMany({
            where: {
              studentRollNumber: p.studentRollNumber,
              user: {
                status: 'ACTIVE',
                verificationStatus: 'VERIFIED',
              },
            },
            include: { user: true },
          });

          approvedParentsCount = approvedParents.length;
          approvedParentsList = approvedParents.map(
            (ap) => `${ap.user.name} (${ap.relation || 'Parent'})`
          );
        }

        return {
          id: p.id,
          userId: p.userId,
          relation: p.relation,
          studentRollNumber: p.studentRollNumber,
          studentName: p.studentName,
          targetDepartment: p.targetDepartment,
          targetYear: p.targetYear,
          targetSemester: p.targetSemester,
          targetSection: p.targetSection,
          user: p.user,
          approvedParentsCount,
          approvedParentsList,
          isMaxReached: approvedParentsCount >= 2,
        };
      })
    );

    // 4. Get Verified Parents
    const verifiedParents = await db.parent.findMany({
      where: {
        user: {
          verificationStatus: 'VERIFIED',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        students: {
          select: {
            id: true,
            rollNumber: true,
            department: true,
            section: true,
          },
        },
      },
      take: 30,
    });

    return NextResponse.json({
      faculty: faculty ? { id: faculty.id, name: faculty.name, email: faculty.email } : null,
      managedSections,
      pendingStudents,
      verifiedStudents,
      pendingParents,
      verifiedParents,
      stats: {
        pendingCount: pendingStudents.length,
        pendingParentsCount: pendingParents.length,
        verifiedCount: verifiedStudents.length,
        verifiedParentsCount: verifiedParents.length,
        sectionsCount: managedSections.length,
      },
    });
  } catch (error: any) {
    console.error('Faculty Students API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, studentId, parentId, facultyName = 'Faculty Coordinator', rejectionReason } = body;

    // Student Approval Flow
    if (action === 'APPROVE_STUDENT') {
      if (!studentId) return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });

      const student = await db.student.findUnique({
        where: { id: studentId },
        include: { user: true },
      });

      if (!student) return NextResponse.json({ error: 'Student record not found' }, { status: 404 });

      const updated = await db.student.update({
        where: { id: studentId },
        data: {
          verificationStatus: 'VERIFIED',
          classAdvisor: facultyName,
          user: {
            update: {
              status: 'ACTIVE',
              verificationStatus: 'VERIFIED',
            },
          },
        },
        include: { user: true },
      });

      await sendApprovalNotification({
        email: student.user.email,
        name: student.user.name,
        role: 'STUDENT',
        details: {
          rollNumber: student.rollNumber,
          department: student.department,
          section: student.section,
          approvedBy: `Section Coordinator (${facultyName})`,
        },
      });

      await db.auditLog.create({
        data: {
          action: `Section Coordinator (${facultyName}) approved student verification for ${student.user.name} (${student.rollNumber}) in Sec ${student.section}. Notification email sent.`,
          type: 'SUCCESS',
        },
      });

      return NextResponse.json({ message: 'Student verification approved successfully and notification email sent', student: updated });
    }

    if (action === 'REJECT_STUDENT') {
      if (!studentId) return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });

      const student = await db.student.findUnique({
        where: { id: studentId },
        include: { user: true },
      });

      if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

      const updated = await db.student.update({
        where: { id: studentId },
        data: {
          verificationStatus: 'REJECTED',
          user: {
            update: {
              status: 'INACTIVE',
              verificationStatus: 'REJECTED',
            },
          },
        },
        include: { user: true },
      });

      await db.auditLog.create({
        data: {
          action: `Section Coordinator (${facultyName}) rejected student registration for ${student.user.name} (Reason: ${rejectionReason || 'Invalid credentials'})`,
          type: 'WARNING',
        },
      });

      return NextResponse.json({ message: 'Student registration rejected', student: updated });
    }

    // Parent Approval Flow (Max 2 approvals per student)
    if (action === 'APPROVE_PARENT') {
      if (!parentId) return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 });

      const parent = await db.parent.findUnique({
        where: { id: parentId },
        include: { user: true },
      });

      if (!parent) return NextResponse.json({ error: 'Parent record not found' }, { status: 404 });

      // Check if student already has 2 approved parents
      if (parent.studentRollNumber) {
        const approvedCount = await db.parent.count({
          where: {
            studentRollNumber: parent.studentRollNumber,
            id: { not: parentId },
            user: {
              status: 'ACTIVE',
              verificationStatus: 'VERIFIED',
            },
          },
        });

        if (approvedCount >= 2) {
          return NextResponse.json({
            error: `Cannot approve: Student '${parent.studentRollNumber}' already has 2 approved parent accounts. Maximum limit reached.`,
          }, { status: 409 });
        }

        // Link student to parent if student exists
        const student = await db.student.findUnique({
          where: { rollNumber: parent.studentRollNumber },
        });

        if (student) {
          await db.student.update({
            where: { id: student.id },
            data: { parentId: parent.id },
          });
        }
      }

      const updatedParent = await db.parent.update({
        where: { id: parentId },
        data: {
          user: {
            update: {
              status: 'ACTIVE',
              verificationStatus: 'VERIFIED',
            },
          },
        },
        include: { user: true },
      });

      await sendApprovalNotification({
        email: parent.user.email,
        name: parent.user.name,
        role: 'PARENT',
        details: {
          rollNumber: parent.studentRollNumber || 'N/A',
          department: parent.targetDepartment || 'CSE',
          section: parent.targetSection || 'A',
          approvedBy: `Section Coordinator (${facultyName})`,
        },
      });

      await db.auditLog.create({
        data: {
          action: `Section Coordinator (${facultyName}) approved Parent account for ${parent.user.name} (${parent.relation}) linked to Student ${parent.studentRollNumber}. Notification email sent.`,
          type: 'SUCCESS',
        },
      });

      return NextResponse.json({
        message: 'Parent account approved successfully! Notification email dispatched to parent.',
        parent: updatedParent,
      });
    }

    if (action === 'REJECT_PARENT') {
      if (!parentId) return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 });

      const parent = await db.parent.findUnique({
        where: { id: parentId },
        include: { user: true },
      });

      if (!parent) return NextResponse.json({ error: 'Parent record not found' }, { status: 404 });

      await db.user.update({
        where: { id: parent.userId },
        data: {
          status: 'INACTIVE',
          verificationStatus: 'REJECTED',
        },
      });

      await db.auditLog.create({
        data: {
          action: `Section Coordinator (${facultyName}) rejected Parent registration for ${parent.user.name} (Reason: ${rejectionReason || 'Unverified student link'})`,
          type: 'WARNING',
        },
      });

      return NextResponse.json({ message: 'Parent registration rejected' });
    }

    if (action === 'DELETE_STUDENT') {
      if (!studentId) return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });

      const student = await db.student.findUnique({
        where: { id: studentId },
        include: { user: true },
      });

      if (!student) return NextResponse.json({ error: 'Student record not found' }, { status: 404 });

      const studentName = student.user.name;
      const studentRoll = student.rollNumber;
      const studentEmail = student.user.email;
      const userId = student.userId;

      // Clean dependent relations
      await db.submission.deleteMany({ where: { studentId } });
      await db.attendance.deleteMany({ where: { studentId } });
      await db.placementApplication.deleteMany({ where: { studentId } });
      await db.feeRecord.deleteMany({ where: { studentId } });
      await db.complaint.deleteMany({ where: { studentId } });
      await db.courseEnrollment.deleteMany({ where: { studentId } });
      await db.academicHistory.deleteMany({ where: { studentId } });

      // Delete student and user account
      await db.student.delete({ where: { id: studentId } });
      await db.user.delete({ where: { id: userId } });

      await db.auditLog.create({
        data: {
          action: `Faculty Coordinator (${facultyName}) permanently deleted student account for ${studentName} (${studentRoll}, ${studentEmail}).`,
          type: 'WARNING',
        },
      });

      return NextResponse.json({
        message: `Student account for ${studentName} (${studentRoll}) permanently deleted by Faculty.`,
        deletedStudent: { id: studentId, name: studentName, rollNumber: studentRoll },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Faculty Students Action POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const facultyName = searchParams.get('facultyName') || 'Faculty Coordinator';

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const student = await db.student.findUnique({
      where: { id: studentId },
      include: { user: true },
    });

    if (!student) return NextResponse.json({ error: 'Student record not found' }, { status: 404 });

    const studentName = student.user.name;
    const studentRoll = student.rollNumber;
    const studentEmail = student.user.email;
    const userId = student.userId;

    await db.submission.deleteMany({ where: { studentId } });
    await db.attendance.deleteMany({ where: { studentId } });
    await db.placementApplication.deleteMany({ where: { studentId } });
    await db.feeRecord.deleteMany({ where: { studentId } });
    await db.complaint.deleteMany({ where: { studentId } });
    await db.courseEnrollment.deleteMany({ where: { studentId } });
    await db.academicHistory.deleteMany({ where: { studentId } });

    await db.student.delete({ where: { id: studentId } });
    await db.user.delete({ where: { id: userId } });

    await db.auditLog.create({
      data: {
        action: `Faculty Coordinator (${facultyName}) permanently deleted student account for ${studentName} (${studentRoll}, ${studentEmail}).`,
        type: 'WARNING',
      },
    });

    return NextResponse.json({
      message: `Student account for ${studentName} (${studentRoll}) permanently deleted by Faculty.`,
      deletedStudent: { id: studentId, name: studentName, rollNumber: studentRoll },
    });
  } catch (error: any) {
    console.error('Faculty Students DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

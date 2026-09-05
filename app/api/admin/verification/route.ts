import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: List all pending verifications and admission master records
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'ALL';

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
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    const admissionMasterRoster = await db.admissionMaster.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      pendingStudents,
      admissionMasterRoster,
      stats: {
        pendingCount: pendingStudents.length,
        masterTotal: admissionMasterRoster.length,
        claimedCount: admissionMasterRoster.filter(a => a.isClaimed).length,
      },
    });
  } catch (error: any) {
    console.error('Admin Verification GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST: Add new Admission Master records OR Approve/Reject pending student
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Action 1: Add/Import Pre-approved Admission Master Roster
    if (action === 'ADD_ADMISSION_RECORD') {
      const { admissionNumber, studentName, department, initialYear = 1, initialSemester = 1, initialSection = 'A', guardianPhone, guardianName } = body;
      
      if (!admissionNumber || !studentName || !department) {
        return NextResponse.json({ error: 'Admission number, student name, and department are required' }, { status: 400 });
      }

      const existing = await db.admissionMaster.findUnique({
        where: { admissionNumber: admissionNumber.trim() },
      });

      if (existing) {
        return NextResponse.json({ error: `Admission Number ${admissionNumber} already exists in master roster` }, { status: 409 });
      }

      const record = await db.admissionMaster.create({
        data: {
          admissionNumber: admissionNumber.trim(),
          studentName: studentName.trim(),
          department,
          initialYear: Number(initialYear),
          initialSemester: Number(initialSemester),
          initialSection: initialSection.toUpperCase(),
          guardianPhone: guardianPhone || null,
          guardianName: guardianName || null,
        },
      });

      await db.auditLog.create({
        data: {
          action: `Admin added Admission Master record: ${record.admissionNumber} (${record.studentName} - ${record.department})`,
          type: 'INFO',
        },
      });

      return NextResponse.json({ message: 'Admission record added successfully', record }, { status: 201 });
    }

    // Action 2: Approve Pending Student & Allot Official Section
    if (action === 'APPROVE_STUDENT') {
      const { studentId, officialRollNumber, department, year = 1, semester = 1, section = 'A' } = body;

      if (!studentId) {
        return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
      }

      const student = await db.student.findUnique({
        where: { id: studentId },
        include: { user: true },
      });

      if (!student) {
        return NextResponse.json({ error: 'Student record not found' }, { status: 404 });
      }

      const updatedStudent = await db.student.update({
        where: { id: studentId },
        data: {
          rollNumber: officialRollNumber ? officialRollNumber.trim() : student.rollNumber,
          department: department || student.department,
          year: Number(year),
          semester: Number(semester),
          section: section.toUpperCase(),
          verificationStatus: 'VERIFIED',
          user: {
            update: {
              status: 'ACTIVE',
              verificationStatus: 'VERIFIED',
            },
          },
        },
        include: { user: true },
      });

      await db.auditLog.create({
        data: {
          action: `Admin verified student ${student.user.name} (${updatedStudent.rollNumber}) and allocated Section ${section}`,
          type: 'SUCCESS',
        },
      });

      return NextResponse.json({ message: 'Student successfully verified and allocated section', student: updatedStudent });
    }

    // Action 3: Reject Pending Student
    if (action === 'REJECT_STUDENT') {
      const { studentId, reason = 'Unverified credentials' } = body;

      const student = await db.student.findUnique({
        where: { id: studentId },
        include: { user: true },
      });

      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      await db.student.update({
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
      });

      await db.auditLog.create({
        data: {
          action: `Admin rejected unverified student registration: ${student.user.name} (Reason: ${reason})`,
          type: 'WARNING',
        },
      });

      return NextResponse.json({ message: 'Student registration rejected' });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin Verification POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

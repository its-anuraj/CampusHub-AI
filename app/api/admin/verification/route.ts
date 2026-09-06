import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendApprovalNotification } from '@/lib/emailService';

// GET: List all pending verifications (students, faculty, parents), admission master, and section coordinator assignments
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
            city: true,
            state: true,
            pincode: true,
            address: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    const pendingFaculty = await db.faculty.findMany({
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
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

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

    const pendingParents = await Promise.all(
      rawPendingParents.map(async (p) => {
        let approvedCount = 0;
        let approvedList: string[] = [];

        if (p.studentRollNumber) {
          const approved = await db.parent.findMany({
            where: {
              studentRollNumber: p.studentRollNumber,
              user: { status: 'ACTIVE', verificationStatus: 'VERIFIED' },
            },
            include: { user: true },
          });
          approvedCount = approved.length;
          approvedList = approved.map(ap => `${ap.user.name} (${ap.relation || 'Parent'})`);
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
          approvedParentsCount: approvedCount,
          approvedParentsList: approvedList,
          isMaxReached: approvedCount >= 2,
        };
      })
    );

    const pendingAdmins = await db.adminProfile.findMany({
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

    const facultyList = await db.user.findMany({
      where: { role: 'FACULTY', status: 'ACTIVE' },
      select: { id: true, name: true, email: true, phone: true },
    });

    const classSections = await db.classSection.findMany({
      include: {
        session: true,
      },
    });

    return NextResponse.json({
      pendingStudents,
      pendingFaculty,
      pendingParents,
      pendingAdmins,
      admissionMasterRoster,
      facultyList,
      classSections,
      stats: {
        pendingStudentsCount: pendingStudents.length,
        pendingFacultyCount: pendingFaculty.length,
        pendingParentsCount: pendingParents.length,
        pendingAdminsCount: pendingAdmins.length,
        pendingCount: pendingStudents.length + pendingFaculty.length + pendingParents.length + pendingAdmins.length,
        masterTotal: admissionMasterRoster.length,
        claimedCount: admissionMasterRoster.filter(a => a.isClaimed).length,
        sectionsCount: classSections.length,
      },
    });
  } catch (error: any) {
    console.error('Admin Verification GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST: Manage Verifications, Approvals, Admissions, and Section Coordinators
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Action 0: Admin assigns Class/Section Coordinator to a Section
    if (action === 'ASSIGN_COORDINATOR') {
      const { department, year = 1, semester = 1, section = 'A', facultyId, facultyName } = body;

      if (!facultyId || !department) {
        return NextResponse.json({ error: 'Faculty ID and Department are required' }, { status: 400 });
      }

      let activeSession = await db.academicSession.findFirst({
        where: { isCurrent: true },
      });

      if (!activeSession) {
        activeSession = await db.academicSession.create({
          data: {
            sessionName: '2026-2027 Academic Year',
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            isCurrent: true,
          },
        });
      }

      const existingSection = await db.classSection.findFirst({
        where: {
          sessionId: activeSession.id,
          department,
          year: Number(year),
          semester: Number(semester),
          sectionName: section.toUpperCase(),
        },
      });

      let updatedSection;
      if (existingSection) {
        updatedSection = await db.classSection.update({
          where: { id: existingSection.id },
          data: {
            classAdvisorId: facultyId,
          },
        });
      } else {
        updatedSection = await db.classSection.create({
          data: {
            sessionId: activeSession.id,
            department,
            year: Number(year),
            semester: Number(semester),
            sectionName: section.toUpperCase(),
            classAdvisorId: facultyId,
          },
        });
      }

      await db.auditLog.create({
        data: {
          action: `Admin assigned ${facultyName || facultyId} as Section Coordinator for ${department} Year ${year} (Sem ${semester}) Sec ${section}`,
          type: 'INFO',
        },
      });

      return NextResponse.json({ message: 'Section Coordinator assigned successfully', section: updatedSection });
    }

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

      // Dispatch approval email notification update to student's email
      await sendApprovalNotification({
        email: student.user.email,
        name: student.user.name,
        role: 'STUDENT',
        details: {
          rollNumber: updatedStudent.rollNumber,
          department: updatedStudent.department,
          section: updatedStudent.section,
          approvedBy: 'Campus Administrator',
        },
      });

      await db.auditLog.create({
        data: {
          action: `Admin verified student ${student.user.name} (${updatedStudent.rollNumber}) and allocated Section ${section}. Email update sent.`,
          type: 'SUCCESS',
        },
      });

      return NextResponse.json({ 
        message: 'Student account successfully approved and verified! Notification update sent to student email.',
        student: updatedStudent 
      });
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

    // Action 4: Approve Pending Faculty Member (Admin Only)
    if (action === 'APPROVE_FACULTY') {
      const { facultyId, designation } = body;

      if (!facultyId) {
        return NextResponse.json({ error: 'Faculty ID is required' }, { status: 400 });
      }

      const faculty = await db.faculty.findUnique({
        where: { id: facultyId },
        include: { user: true },
      });

      if (!faculty) {
        return NextResponse.json({ error: 'Faculty member record not found' }, { status: 404 });
      }

      const updatedFaculty = await db.faculty.update({
        where: { id: facultyId },
        data: {
          designation: designation || faculty.designation,
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
        email: faculty.user.email,
        name: faculty.user.name,
        role: 'FACULTY',
        details: {
          employeeId: faculty.employeeId,
          department: faculty.department,
          approvedBy: 'Campus Administrator',
        },
      });

      await db.auditLog.create({
        data: {
          action: `Admin approved Faculty account for ${faculty.user.name} (Emp ID: ${faculty.employeeId}, Dept: ${faculty.department}). Email update sent.`,
          type: 'SUCCESS',
        },
      });

      return NextResponse.json({
        message: 'Faculty account approved successfully! Notification update sent to faculty email.',
        faculty: updatedFaculty,
      });
    }

    // Action 5: Reject Pending Faculty Member (Admin Only)
    if (action === 'REJECT_FACULTY') {
      const { facultyId, reason = 'Unverified employee credentials' } = body;

      const faculty = await db.faculty.findUnique({
        where: { id: facultyId },
        include: { user: true },
      });

      if (!faculty) {
        return NextResponse.json({ error: 'Faculty member record not found' }, { status: 404 });
      }

      await db.user.update({
        where: { id: faculty.userId },
        data: {
          status: 'INACTIVE',
          verificationStatus: 'REJECTED',
        },
      });

      await db.auditLog.create({
        data: {
          action: `Admin rejected Faculty registration: ${faculty.user.name} (Emp ID: ${faculty.employeeId}) (Reason: ${reason})`,
          type: 'WARNING',
        },
      });

      return NextResponse.json({ message: 'Faculty registration rejected' });
    }

    // Action 6: Approve Pending Parent Member (Max 2 approvals per student)
    if (action === 'APPROVE_PARENT') {
      const { parentId } = body;

      if (!parentId) {
        return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 });
      }

      const parent = await db.parent.findUnique({
        where: { id: parentId },
        include: { user: true },
      });

      if (!parent) {
        return NextResponse.json({ error: 'Parent record not found' }, { status: 404 });
      }

      if (parent.studentRollNumber) {
        const approvedCount = await db.parent.count({
          where: {
            studentRollNumber: parent.studentRollNumber,
            id: { not: parentId },
            user: { status: 'ACTIVE', verificationStatus: 'VERIFIED' },
          },
        });

        if (approvedCount >= 2) {
          return NextResponse.json({
            error: `Cannot approve: Student '${parent.studentRollNumber}' already has 2 approved parent accounts. Maximum limit reached.`,
          }, { status: 409 });
        }

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
          approvedBy: 'Campus Administrator',
        },
      });

      await db.auditLog.create({
        data: {
          action: `Admin approved Parent account for ${parent.user.name} (${parent.relation}) linked to Student ${parent.studentRollNumber}. Email update sent.`,
          type: 'SUCCESS',
        },
      });

      return NextResponse.json({
        message: 'Parent account approved successfully! Notification email dispatched to parent.',
        parent: updatedParent,
      });
    }

    // Action 7: Reject Pending Parent Member
    if (action === 'REJECT_PARENT') {
      const { parentId, reason = 'Unverified relationship or incorrect roll number' } = body;

      if (!parentId) {
        return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 });
      }

      const parent = await db.parent.findUnique({
        where: { id: parentId },
        include: { user: true },
      });

      if (!parent) {
        return NextResponse.json({ error: 'Parent record not found' }, { status: 404 });
      }

      await db.user.update({
        where: { id: parent.userId },
        data: {
          status: 'INACTIVE',
          verificationStatus: 'REJECTED',
        },
      });

      await db.auditLog.create({
        data: {
          action: `Admin rejected Parent registration for ${parent.user.name} (Reason: ${reason})`,
          type: 'WARNING',
        },
      });

      return NextResponse.json({ message: 'Parent registration rejected' });
    }

    // Action 8: Approve Department Administrator (College Director Exclusive)
    if (action === 'APPROVE_ADMIN') {
      const { adminId, designation } = body;

      if (!adminId) {
        return NextResponse.json({ error: 'Department Admin ID is required' }, { status: 400 });
      }

      const adminRecord = await db.adminProfile.findUnique({
        where: { id: adminId },
        include: { user: true },
      });

      if (!adminRecord) {
        return NextResponse.json({ error: 'Department Admin record not found' }, { status: 404 });
      }

      const updatedAdmin = await db.adminProfile.update({
        where: { id: adminId },
        data: {
          designation: designation || adminRecord.designation,
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
        email: adminRecord.user.email,
        name: adminRecord.user.name,
        role: `ADMIN (${adminRecord.departmentRole})`,
        details: {
          employeeId: adminRecord.employeeId,
          department: adminRecord.departmentRole,
          approvedBy: 'College Director (Super Admin)',
        },
      });

      await db.auditLog.create({
        data: {
          action: `College Director approved Department Admin account for ${adminRecord.user.name} (Emp ID: ${adminRecord.employeeId}, Role: ${adminRecord.departmentRole}). Notification email dispatched.`,
          type: 'SUCCESS',
        },
      });

      return NextResponse.json({
        message: 'Department Administrator account approved successfully! Notification email dispatched.',
        admin: updatedAdmin,
      });
    }

    // Action 9: Reject Department Administrator
    if (action === 'REJECT_ADMIN') {
      const { adminId, reason = 'Unverified credentials or invalid employee ID' } = body;

      if (!adminId) {
        return NextResponse.json({ error: 'Department Admin ID is required' }, { status: 400 });
      }

      const adminRecord = await db.adminProfile.findUnique({
        where: { id: adminId },
        include: { user: true },
      });

      if (!adminRecord) {
        return NextResponse.json({ error: 'Department Admin record not found' }, { status: 404 });
      }

      await db.user.update({
        where: { id: adminRecord.userId },
        data: {
          status: 'INACTIVE',
          verificationStatus: 'REJECTED',
        },
      });

      await db.auditLog.create({
        data: {
          action: `College Director rejected Department Admin registration for ${adminRecord.user.name} (Emp ID: ${adminRecord.employeeId}) (Reason: ${reason})`,
          type: 'WARNING',
        },
      });

      return NextResponse.json({ message: 'Department Admin registration rejected' });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin Verification POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

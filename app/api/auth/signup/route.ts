import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'STUDENT', phone, department = 'CSE', rollNumber, employeeId } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    let finalRollNumber = rollNumber?.trim();
    let assignedDepartment = department || 'CSE';
    let assignedYear = 1;
    let assignedSemester = 1;
    let assignedSection = 'A';
    let verificationStatus: 'VERIFIED' | 'PENDING_APPROVAL' = 'VERIFIED';
    let userStatus: 'ACTIVE' | 'PENDING' = 'ACTIVE';
    let matchedAdmissionId: string | null = null;

    if (role === 'STUDENT') {
      if (finalRollNumber) {
        // 1. Check if roll number already claimed by another user
        const existingStudentWithRoll = await db.student.findUnique({
          where: { rollNumber: finalRollNumber },
        });

        if (existingStudentWithRoll) {
          return NextResponse.json({
            error: `Roll Number '${finalRollNumber}' is already registered and claimed by another user. Please contact the Academic Office if this is an error.`,
          }, { status: 409 });
        }

        // 2. Check Admission Master Whitelist
        const admissionRecord = await db.admissionMaster.findUnique({
          where: { admissionNumber: finalRollNumber },
        });

        if (admissionRecord) {
          if (admissionRecord.isClaimed) {
            return NextResponse.json({
              error: `Admission Number '${finalRollNumber}' has already been claimed by a registered account.`,
            }, { status: 409 });
          }

          // Verified from pre-admission roster!
          matchedAdmissionId = admissionRecord.id;
          assignedDepartment = admissionRecord.department;
          assignedYear = admissionRecord.initialYear;
          assignedSemester = admissionRecord.initialSemester;
          assignedSection = admissionRecord.initialSection;
          verificationStatus = 'VERIFIED';
          userStatus = 'ACTIVE';
        } else {
          // Unverified roll number - requires Admin approval
          verificationStatus = 'PENDING_APPROVAL';
          userStatus = 'PENDING';
        }
      } else {
        // Auto-generate temporary admission token
        finalRollNumber = `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        verificationStatus = 'PENDING_APPROVAL';
        userStatus = 'PENDING';
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile based on role
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone: phone || null,
        status: userStatus,
        verificationStatus,
        ...(role === 'STUDENT' ? {
          studentProfile: {
            create: {
              rollNumber: finalRollNumber,
              admissionNumber: finalRollNumber,
              department: assignedDepartment,
              year: assignedYear,
              semester: assignedSemester,
              section: assignedSection,
              cgpa: 8.0,
              backlogs: 0,
              academicStatus: 'REGULAR',
              verificationStatus,
              classAdvisor: 'Dr. Priya Sharma (CSE HOD)',
            },
          },
        } : {}),
        ...(role === 'FACULTY' ? {
          facultyProfile: {
            create: {
              employeeId: employeeId || `FAC-${Math.floor(100 + Math.random() * 900)}`,
              department: department || 'CSE',
              designation: 'Assistant Professor',
              subjects: JSON.stringify(['Computer Science']),
            },
          },
        } : {}),
        ...(role === 'PARENT' ? {
          parentProfile: {
            create: {
              relation: 'Parent',
            },
          },
        } : {}),
      },
      include: {
        studentProfile: true,
        facultyProfile: true,
        parentProfile: true,
      },
    });

    // Mark admission master record claimed if matched
    if (matchedAdmissionId) {
      await db.admissionMaster.update({
        where: { id: matchedAdmissionId },
        data: {
          isClaimed: true,
          claimedUserId: newUser.id,
        },
      });
    }

    // Log registration action
    await db.auditLog.create({
      data: {
        userId: newUser.id,
        action: `Registration: ${newUser.name} as ${newUser.role} [Status: ${userStatus}, Verification: ${verificationStatus}, Section: ${assignedSection}]`,
        type: verificationStatus === 'VERIFIED' ? 'SUCCESS' : 'WARNING',
      },
    });

    return NextResponse.json({
      message: verificationStatus === 'VERIFIED' 
        ? 'Account created and verified successfully' 
        : 'Account created and submitted for Admin verification',
      verificationStatus,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        verificationStatus: newUser.verificationStatus,
        avatar: newUser.avatar,
        phone: newUser.phone,
        studentProfile: newUser.studentProfile,
        facultyProfile: newUser.facultyProfile,
        parentProfile: newUser.parentProfile,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

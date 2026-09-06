import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

/**
 * Validates and normalizes 10-digit Indian mobile phone numbers
 * Accepts 10 digits starting with 6, 7, 8, 9 (and optionally strips +91 or leading 0)
 */
function validateIndianMobile(phoneStr?: string | null): { isValid: boolean; digits: string } {
  if (!phoneStr) return { isValid: false, digits: '' };
  const cleaned = phoneStr.trim().replace(/[\s\-\(\)\+]/g, '');
  let digits = cleaned;
  if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }
  const isValid = /^[6-9]\d{9}$/.test(digits);
  return { isValid, digits };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      role = 'STUDENT',
      phone,
      department = 'CSE',
      rollNumber,
      year,
      semester,
      section,
      guardianName,
      guardianRelation,
      guardianPhone,
      address,
      city,
      state,
      pincode,
      employeeId,
      studentName,
      studentRollNumber,
      relation,
      departmentRole,
      adminDepartmentRole,
      avatar,
    } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Validate mandatory profile photo
    if (!avatar || typeof avatar !== 'string' || avatar.trim().length === 0) {
      return NextResponse.json({
        error: 'Profile photo is mandatory for account creation. Please upload a clear passport-size photo.',
      }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Validate 10-digit Indian Mobile Phone Number for all registering roles
    const phoneCheck = validateIndianMobile(phone);
    if (!phoneCheck.isValid) {
      return NextResponse.json({
        error: 'Please enter a valid 10-digit Indian mobile number (must be 10 digits starting with 6, 7, 8, or 9).',
      }, { status: 400 });
    }
    const normalizedPhone = phoneCheck.digits;

    // 1. Check if Email already exists (Active or Pending)
    const existingEmail = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingEmail) {
      return NextResponse.json({
        error: `Email Address '${normalizedEmail}' matches an existing or pending account. Please use your original details or contact your Class/Section Coordinator.`,
      }, { status: 409 });
    }

    // 2. Check if Mobile Phone Number already exists (Active or Pending)
    const existingPhone = await db.user.findFirst({
      where: { phone: normalizedPhone },
    });

    if (existingPhone) {
      return NextResponse.json({
        error: `Mobile Phone Number '${normalizedPhone}' matches an existing or pending account. Please use your original details or contact your Class/Section Coordinator.`,
      }, { status: 409 });
    }

    let finalRollNumber = rollNumber?.trim().toUpperCase();
    let assignedDepartment = department || 'CSE';
    let assignedYear = year ? parseInt(year.toString(), 10) : 1;
    let assignedSemester = semester ? parseInt(semester.toString(), 10) : 1;
    let assignedSection = section ? section.trim().toUpperCase() : 'A';
    let verificationStatus: string = 'PENDING_APPROVAL';
    let userStatus: string = 'PENDING';
    let coordinatorName = 'Dr. Priya Sharma (CSE Coordinator)';
    let matchedAdmissionId: string | null = null;
    let targetStudentId: string | null = null;
    let finalStudentRoll = (studentRollNumber || rollNumber)?.trim().toUpperCase();
    let finalStudentName = (studentName || name)?.trim();
    let finalRelation = relation || guardianRelation || 'Father';
    let finalGuardianPhone: string | null = null;

    if (role === 'STUDENT') {
      if (!finalRollNumber) {
        return NextResponse.json({ error: 'Student Roll Number / Admission Number is required' }, { status: 400 });
      }
      if (!guardianName || !guardianName.trim()) {
        return NextResponse.json({ error: 'Guardian Name is required' }, { status: 400 });
      }
      if (!guardianRelation || !guardianRelation.trim()) {
        return NextResponse.json({ error: 'Guardian Relationship (e.g., Father, Mother, Guardian) is required' }, { status: 400 });
      }
      
      // Guardian 10-digit Indian mobile check
      const guardianPhoneCheck = validateIndianMobile(guardianPhone);
      if (!guardianPhoneCheck.isValid) {
        return NextResponse.json({
          error: 'Please enter a valid 10-digit Indian Guardian mobile phone number (must be 10 digits starting with 6, 7, 8, or 9).',
        }, { status: 400 });
      }
      finalGuardianPhone = guardianPhoneCheck.digits;

      if (!city || !city.trim()) {
        return NextResponse.json({ error: 'City is required' }, { status: 400 });
      }
      if (!state || !state.trim()) {
        return NextResponse.json({ error: 'State is required' }, { status: 400 });
      }
      if (!pincode || !pincode.trim()) {
        return NextResponse.json({ error: 'Pincode is required' }, { status: 400 });
      }
      if (!address || !address.trim()) {
        return NextResponse.json({ error: 'Permanent Residential Address is required' }, { status: 400 });
      }

      // Check if Roll Number already exists (Active or Pending)
      const existingStudentWithRoll = await db.student.findUnique({
        where: { rollNumber: finalRollNumber },
      });

      if (existingStudentWithRoll) {
        return NextResponse.json({
          error: `Roll Number '${finalRollNumber}' matches an existing or pending registered student. Please use your original details or contact your Class/Section Coordinator.`,
        }, { status: 409 });
      }

      // Check Pre-approved Admission Master Whitelist
      const admissionRecord = await db.admissionMaster.findUnique({
        where: { admissionNumber: finalRollNumber },
      });

      if (admissionRecord && !admissionRecord.isClaimed) {
        matchedAdmissionId = admissionRecord.id;
        assignedDepartment = admissionRecord.department;
        assignedYear = admissionRecord.initialYear;
        assignedSemester = admissionRecord.initialSemester;
        assignedSection = admissionRecord.initialSection;
      }

      // Find Section Coordinator assigned by Admin
      const classSection = await db.classSection.findFirst({
        where: {
          department: assignedDepartment,
          year: assignedYear,
          semester: assignedSemester,
          sectionName: assignedSection,
        },
      });

      if (classSection && classSection.classAdvisorId) {
        const advisorUser = await db.user.findUnique({
          where: { id: classSection.classAdvisorId },
        });
        if (advisorUser) {
          coordinatorName = `${advisorUser.name} (${assignedDepartment} Sec ${assignedSection} Coordinator)`;
        }
      }
    } else if (role === 'FACULTY') {
      if (!employeeId || !employeeId.trim()) {
        return NextResponse.json({ error: 'Faculty Employee ID is required' }, { status: 400 });
      }
      if (!department || !department.trim()) {
        return NextResponse.json({ error: 'Department is required' }, { status: 400 });
      }
      if (!city || !city.trim()) {
        return NextResponse.json({ error: 'City is required' }, { status: 400 });
      }
      if (!state || !state.trim()) {
        return NextResponse.json({ error: 'State is required' }, { status: 400 });
      }
      if (!pincode || !pincode.trim()) {
        return NextResponse.json({ error: 'Pincode is required' }, { status: 400 });
      }
      if (!address || !address.trim()) {
        return NextResponse.json({ error: 'Permanent Residential Address is required' }, { status: 400 });
      }

      const finalEmpId = employeeId.trim().toUpperCase();
      const existingEmp = await db.faculty.findUnique({
        where: { employeeId: finalEmpId },
      });

      if (existingEmp) {
        return NextResponse.json({
          error: `Employee ID '${finalEmpId}' matches an existing or pending registered faculty member. Please contact the Academic Office or System Administrator.`,
        }, { status: 409 });
      }

      verificationStatus = 'PENDING_APPROVAL';
      userStatus = 'PENDING';
      coordinatorName = 'System Administrator / Academic Office';
    } else if (role === 'PARENT') {
      if (!finalStudentRoll) {
        return NextResponse.json({ error: "Student Roll / Admission Number is required for parent verification" }, { status: 400 });
      }
      if (!finalStudentName) {
        return NextResponse.json({ error: "Student Full Name is required" }, { status: 400 });
      }
      if (!finalRelation) {
        return NextResponse.json({ error: "Relationship with student (e.g., Father, Mother, Guardian) is required" }, { status: 400 });
      }
      if (!city || !city.trim()) {
        return NextResponse.json({ error: 'City is required' }, { status: 400 });
      }
      if (!state || !state.trim()) {
        return NextResponse.json({ error: 'State is required' }, { status: 400 });
      }
      if (!pincode || !pincode.trim()) {
        return NextResponse.json({ error: 'Pincode is required' }, { status: 400 });
      }
      if (!address || !address.trim()) {
        return NextResponse.json({ error: 'Residential Address is required' }, { status: 400 });
      }

      // Check if student exists in Student roster or Admission Master
      const targetStudent = await db.student.findUnique({
        where: { rollNumber: finalStudentRoll },
        include: { user: true },
      });

      const targetAdmission = await db.admissionMaster.findUnique({
        where: { admissionNumber: finalStudentRoll },
      });

      if (!targetStudent && !targetAdmission) {
        return NextResponse.json({
          error: `Student with Roll Number '${finalStudentRoll}' was not found in the institution database. Please verify the roll number with your child or the academic office.`,
        }, { status: 404 });
      }

      if (targetStudent) {
        targetStudentId = targetStudent.id;
        finalStudentName = targetStudent.user.name;
        assignedDepartment = targetStudent.department;
        assignedYear = targetStudent.year;
        assignedSemester = targetStudent.semester;
        assignedSection = targetStudent.section;
      } else if (targetAdmission) {
        finalStudentName = targetAdmission.studentName;
        assignedDepartment = targetAdmission.department;
        assignedYear = targetAdmission.initialYear;
        assignedSemester = targetAdmission.initialSemester;
        assignedSection = targetAdmission.initialSection;
      }

      // Strict Limit: Check how many parents are already registered/approved for this student (MAX 2)
      const existingParents = await db.parent.findMany({
        where: {
          studentRollNumber: finalStudentRoll,
          user: {
            status: { in: ['ACTIVE', 'PENDING'] },
            verificationStatus: { in: ['VERIFIED', 'PENDING_APPROVAL'] },
          },
        },
        include: { user: true },
      });

      if (existingParents.length >= 2) {
        const approvedNames = existingParents.map(p => `${p.user.name} (${p.relation})`).join(', ');
        return NextResponse.json({
          error: `Maximum limit reached: 2 parent/guardian registrations are already active/pending for Student '${finalStudentRoll}' (${approvedNames}). An individual student cannot have more than 2 approved parent accounts. Please contact the Section Coordinator.`,
        }, { status: 409 });
      }

      // Find Section Coordinator for this student's class and section
      const classSection = await db.classSection.findFirst({
        where: {
          department: assignedDepartment,
          year: assignedYear,
          semester: assignedSemester,
          sectionName: assignedSection,
        },
      });

      if (classSection && classSection.classAdvisorId) {
        const advisorUser = await db.user.findUnique({
          where: { id: classSection.classAdvisorId },
        });
        if (advisorUser) {
          coordinatorName = `${advisorUser.name} (${assignedDepartment} Sec ${assignedSection} Coordinator)`;
        }
      }

      verificationStatus = 'PENDING_APPROVAL';
      userStatus = 'PENDING';
    } else if (role === 'ADMIN') {
      const selectedDeptRole = (departmentRole || adminDepartmentRole || '').trim().toUpperCase();
      
      const allowedRoles = [
        'PLACEMENT_CELL',
        'FEES_ACCOUNTS',
        'LIBRARY',
        'EVENT_MANAGER',
        'CLUB_MANAGER',
        'ACADEMIC_ADMIN',
        'HOSTEL_ADMIN',
      ];

      if (!selectedDeptRole || !allowedRoles.includes(selectedDeptRole)) {
        return NextResponse.json({
          error: 'Please select a valid Department Admin role (e.g. Placement Cell, Fees Department, Library, Event Manager, Club Manager, Academic Admin, Hostel Admin).',
        }, { status: 400 });
      }

      if (!employeeId || !employeeId.trim()) {
        return NextResponse.json({ error: 'Employee ID is required for department administrator registration.' }, { status: 400 });
      }
      if (!city || !city.trim()) {
        return NextResponse.json({ error: 'City is required' }, { status: 400 });
      }
      if (!state || !state.trim()) {
        return NextResponse.json({ error: 'State is required' }, { status: 400 });
      }
      if (!pincode || !pincode.trim()) {
        return NextResponse.json({ error: 'Pincode is required' }, { status: 400 });
      }
      if (!address || !address.trim()) {
        return NextResponse.json({ error: 'Permanent Residential Address is required' }, { status: 400 });
      }

      const finalEmpId = employeeId.trim().toUpperCase();
      const existingEmp = await db.adminProfile.findUnique({
        where: { employeeId: finalEmpId },
      });

      if (existingEmp) {
        return NextResponse.json({
          error: `Employee ID '${finalEmpId}' matches an existing or pending registered administrator. Please contact the College Director.`,
        }, { status: 409 });
      }

      verificationStatus = 'PENDING_APPROVAL';
      userStatus = 'PENDING';
      coordinatorName = 'College Director (Super Admin Desk)';
    }

    // Helper for Designation
    const getAdminDesignation = (deptRole: string) => {
      switch (deptRole) {
        case 'PLACEMENT_CELL': return 'Training & Placement Officer (TPO)';
        case 'FEES_ACCOUNTS': return 'Finance & Accounts Officer';
        case 'LIBRARY': return 'Chief Librarian & Digital Resources Head';
        case 'EVENT_MANAGER': return 'Campus Events & Cultural Affairs Lead';
        case 'CLUB_MANAGER': return 'Student Clubs & Activities Coordinator';
        case 'ACADEMIC_ADMIN': return 'Academic Affairs & Examinations Head';
        case 'HOSTEL_ADMIN': return 'Hostel Warden & Housing Incharge';
        default: return 'Department Administrator';
      }
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile based on role
    const newUser = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        avatar: avatar.trim(),
        phone: normalizedPhone,
        city: city?.trim() || null,
        state: state?.trim() || null,
        pincode: pincode?.trim() || null,
        address: address?.trim() || null,
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
              guardianName: guardianName?.trim() || null,
              guardianRelation: guardianRelation?.trim() || null,
              guardianPhone: finalGuardianPhone,
              city: city?.trim() || null,
              state: state?.trim() || null,
              pincode: pincode?.trim() || null,
              address: address?.trim() || null,
              cgpa: 8.0,
              backlogs: 0,
              academicStatus: 'REGULAR',
              verificationStatus,
              classAdvisor: coordinatorName,
            },
          },
        } : {}),
        ...(role === 'FACULTY' ? {
          facultyProfile: {
            create: {
              employeeId: employeeId.trim().toUpperCase(),
              department: department || 'CSE',
              designation: 'Assistant Professor',
              subjects: JSON.stringify(['Computer Science']),
            },
          },
        } : {}),
        ...(role === 'PARENT' ? {
          parentProfile: {
            create: {
              relation: finalRelation,
              studentRollNumber: finalStudentRoll,
              studentName: finalStudentName,
              targetDepartment: assignedDepartment,
              targetYear: assignedYear,
              targetSemester: assignedSemester,
              targetSection: assignedSection,
              ...(targetStudentId ? {
                students: {
                  connect: { id: targetStudentId },
                },
              } : {}),
            },
          },
        } : {}),
        ...(role === 'ADMIN' ? {
          adminProfile: {
            create: {
              employeeId: employeeId.trim().toUpperCase(),
              departmentRole: (departmentRole || adminDepartmentRole || 'PLACEMENT_CELL').trim().toUpperCase(),
              designation: getAdminDesignation((departmentRole || adminDepartmentRole || 'PLACEMENT_CELL').trim().toUpperCase()),
            },
          },
        } : {}),
      },
      include: {
        studentProfile: true,
        facultyProfile: true,
        parentProfile: true,
        adminProfile: true,
      },
    });

    // Mark admission master record claimed if matched for student
    if (matchedAdmissionId && role === 'STUDENT') {
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
        action: `Registration: ${newUser.name} as ${newUser.role} [Status: ${userStatus}, Phone: +91-${normalizedPhone}, Coordinator: ${coordinatorName}]`,
        type: verificationStatus === 'VERIFIED' ? 'SUCCESS' : 'WARNING',
      },
    });

    return NextResponse.json({
      message: verificationStatus === 'VERIFIED' 
        ? 'Account created and verified successfully' 
        : `Registration submitted for approval by ${coordinatorName}`,
      verificationStatus,
      coordinator: coordinatorName,
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
        adminProfile: newUser.adminProfile,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

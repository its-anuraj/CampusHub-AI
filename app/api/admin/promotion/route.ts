import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Fetch student cohort for promotion review
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || 'CSE';
    const year = Number(searchParams.get('year') || 1);
    const semester = Number(searchParams.get('semester') || 1);

    const students = await db.student.findMany({
      where: {
        department,
        year,
        semester,
        verificationStatus: 'VERIFIED',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            status: true,
          },
        },
        academicHistories: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: { cgpa: 'desc' },
    });

    const evaluatedStudents = students.map((s) => {
      // Evaluation Rules:
      // - Eligible: CGPA >= 4.0 and Backlogs <= 3
      // - Year-Back / Detention: Backlogs > 3 or CGPA < 4.0
      const isEligible = s.cgpa >= 4.0 && s.backlogs <= 3;
      const recommendedAction = isEligible ? 'PROMOTE' : 'YEAR_BACK';
      const nextSem = semester + 1;
      const nextYear = semester % 2 === 0 ? year + 1 : year;

      return {
        id: s.id,
        name: s.user.name,
        email: s.user.email,
        rollNumber: s.rollNumber,
        department: s.department,
        currentYear: s.year,
        currentSemester: s.semester,
        currentSection: s.section,
        cgpa: s.cgpa,
        backlogs: s.backlogs,
        academicStatus: s.academicStatus,
        classAdvisor: s.classAdvisor,
        isEligible,
        recommendedAction,
        targetYear: isEligible ? nextYear : year,
        targetSemester: isEligible ? nextSem : semester,
      };
    });

    const stats = {
      total: evaluatedStudents.length,
      eligibleForPromotion: evaluatedStudents.filter(s => s.isEligible).length,
      yearBackCount: evaluatedStudents.filter(s => !s.isEligible).length,
      averageCgpa: evaluatedStudents.length > 0 
        ? +(evaluatedStudents.reduce((acc, s) => acc + s.cgpa, 0) / evaluatedStudents.length).toFixed(2)
        : 0,
    };

    return NextResponse.json({
      department,
      year,
      semester,
      stats,
      students: evaluatedStudents,
    });
  } catch (error: any) {
    console.error('Admin Promotion GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST: Execute Batch Promotion and Section Reallocation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      department = 'CSE',
      currentYear = 1,
      currentSemester = 1,
      sectionStrategy = 'MERIT_CGPA', // 'MERIT_CGPA' | 'BALANCED_RANDOM' | 'RETAIN_CURRENT'
      customOverrides = [], // Array of { studentId, action: 'PROMOTE' | 'YEAR_BACK', targetSection: 'A' | 'B' | 'C' }
      academicSessionName = '2026-2027 Even Semester',
    } = body;

    // 1. Fetch current cohort
    const students = await db.student.findMany({
      where: {
        department,
        year: Number(currentYear),
        semester: Number(currentSemester),
        verificationStatus: 'VERIFIED',
      },
      include: {
        user: true,
      },
      orderBy: { cgpa: 'desc' },
    });

    if (students.length === 0) {
      return NextResponse.json({ error: 'No verified students found for the selected department, year, and semester.' }, { status: 404 });
    }

    const nextSem = Number(currentSemester) + 1;
    const nextYear = Number(currentSemester) % 2 === 0 ? Number(currentYear) + 1 : Number(currentYear);

    // Apply Overrides map
    const overrideMap = new Map<string, { action: string; targetSection?: string }>();
    customOverrides.forEach((o: any) => overrideMap.set(o.studentId, o));

    // Segregate eligible vs year-back
    const eligibleStudents: typeof students = [];
    const detainedStudents: typeof students = [];

    students.forEach((s) => {
      const override = overrideMap.get(s.id);
      const isEligible = override 
        ? override.action === 'PROMOTE' 
        : (s.cgpa >= 4.0 && s.backlogs <= 3);

      if (isEligible) {
        eligibleStudents.push(s);
      } else {
        detainedStudents.push(s);
      }
    });

    // 2. Section Allocation Algorithm for Promoted Students
    const sections = ['A', 'B', 'C'];
    const studentSectionAssignments = new Map<string, string>();

    if (sectionStrategy === 'MERIT_CGPA') {
      // Sort descending by CGPA: Top tier -> Sec A, Next -> Sec B, Next -> Sec C
      const sorted = [...eligibleStudents].sort((a, b) => b.cgpa - a.cgpa);
      const chunkSize = Math.ceil(sorted.length / sections.length) || 1;
      sorted.forEach((s, idx) => {
        const secIndex = Math.min(Math.floor(idx / chunkSize), sections.length - 1);
        studentSectionAssignments.set(s.id, sections[secIndex]);
      });
    } else if (sectionStrategy === 'BALANCED_RANDOM') {
      // Round-robin distribution for balanced class strengths and mixed CGPAs
      const shuffled = [...eligibleStudents].sort(() => Math.random() - 0.5);
      shuffled.forEach((s, idx) => {
        const sec = sections[idx % sections.length];
        studentSectionAssignments.set(s.id, sec);
      });
    } else {
      // RETAIN_CURRENT
      eligibleStudents.forEach((s) => {
        studentSectionAssignments.set(s.id, s.section || 'A');
      });
    }

    // Apply manual section overrides if any
    eligibleStudents.forEach((s) => {
      const override = overrideMap.get(s.id);
      if (override?.targetSection) {
        studentSectionAssignments.set(s.id, override.targetSection.toUpperCase());
      }
    });

    // 3. Process DB Updates & Historical Snapshots
    let promotedCount = 0;
    let yearBackCount = 0;

    for (const student of eligibleStudents) {
      const newSection = studentSectionAssignments.get(student.id) || 'A';

      // Archive previous semester to AcademicHistory
      await db.academicHistory.create({
        data: {
          studentId: student.id,
          academicYear: `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`,
          year: student.year,
          semester: student.semester,
          section: student.section,
          sgpa: student.cgpa,
          backlogsCount: student.backlogs,
          attendancePct: 85.0,
          promotionStatus: 'PROMOTED',
        },
      });

      // Update student to next semester / year with new section
      await db.student.update({
        where: { id: student.id },
        data: {
          year: nextYear,
          semester: nextSem,
          section: newSection,
          academicStatus: 'PROMOTED',
        },
      });
      promotedCount++;
    }

    for (const student of detainedStudents) {
      // Archive detention to AcademicHistory
      await db.academicHistory.create({
        data: {
          studentId: student.id,
          academicYear: `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`,
          year: student.year,
          semester: student.semester,
          section: student.section,
          sgpa: student.cgpa,
          backlogsCount: student.backlogs,
          attendancePct: 62.0,
          promotionStatus: 'YEAR_BACK',
        },
      });

      // Retain student in same year/sem with YEAR_BACK status
      await db.student.update({
        where: { id: student.id },
        data: {
          academicStatus: 'YEAR_BACK',
        },
      });
      yearBackCount++;
    }

    // Log institutional action
    await db.auditLog.create({
      data: {
        action: `Batch Academic Promotion: Department ${department} (Year ${currentYear}, Sem ${currentSemester}) -> Promoted ${promotedCount} students [Strategy: ${sectionStrategy}], Retained ${yearBackCount} Year-Back students.`,
        type: 'SUCCESS',
      },
    });

    return NextResponse.json({
      message: `Batch promotion executed successfully. ${promotedCount} students promoted to Sem ${nextSem} (Year ${nextYear}), ${yearBackCount} students retained on Year-Back status.`,
      promotedCount,
      yearBackCount,
      targetYear: nextYear,
      targetSemester: nextSem,
      strategyUsed: sectionStrategy,
    });
  } catch (error: any) {
    console.error('Admin Promotion POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

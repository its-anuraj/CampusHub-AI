import { NextResponse } from 'next/server';

export async function GET() {
  const accreditationData = {
    program: 'B.Tech in Computer Science & Engineering (NBA Tier-1 Accredited)',
    academicYear: '2026-2027 (Even Semester)',
    programOutcomes: [
      { code: 'PO1', title: 'Engineering Knowledge', targetPercent: 80, attainedPercent: 86, status: 'EXCEEDED' },
      { code: 'PO2', title: 'Problem Analysis', targetPercent: 75, attainedPercent: 78, status: 'ATTAINED' },
      { code: 'PO3', title: 'Design / Development of Solutions', targetPercent: 75, attainedPercent: 82, status: 'EXCEEDED' },
      { code: 'PO4', title: 'Conduct Investigations of Complex Problems', targetPercent: 70, attainedPercent: 74, status: 'ATTAINED' },
      { code: 'PO5', title: 'Modern Tool Usage (AI/ML, Cloud)', targetPercent: 85, attainedPercent: 91, status: 'EXCEEDED' },
      { code: 'PO6', title: 'The Engineer and Society', targetPercent: 70, attainedPercent: 68, status: 'NEEDS_ACTION' },
      { code: 'PO7', title: 'Environment and Sustainability', targetPercent: 70, attainedPercent: 72, status: 'ATTAINED' },
      { code: 'PO8', title: 'Ethics & Professionalism', targetPercent: 80, attainedPercent: 84, status: 'EXCEEDED' }
    ],
    courseOutcomesProgress: [
      { courseCode: 'CS401', courseName: 'Distributed Systems', coCount: 5, syllabusCoveredPercent: 78, attainmentScore: 2.74, maxScore: 3.0 },
      { courseCode: 'AI501', courseName: 'Deep Learning & Neural Vision', coCount: 6, syllabusCoveredPercent: 85, attainmentScore: 2.88, maxScore: 3.0 },
      { courseCode: 'CS408', courseName: 'Cloud Computing & DevOps', coCount: 4, syllabusCoveredPercent: 70, attainmentScore: 2.65, maxScore: 3.0 }
    ]
  };

  return NextResponse.json({
    success: true,
    data: accreditationData
  });
}

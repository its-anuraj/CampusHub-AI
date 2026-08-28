import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let atRiskStudents = [
  {
    studentId: 'STU-2024-089',
    name: 'Akash Tripathi',
    semester: '5th Sem CSE',
    attendancePct: 62.5,
    assignmentPendingCount: 4,
    lmsInactivityDays: 14,
    riskLevel: 'HIGH_RISK',
    riskScore: 88,
    reasons: ['Attendance below mandatory 75% threshold', 'Missed consecutive 3 lab submissions', 'No LMS login past 2 weeks'],
    counselorAssigned: 'Prof. Anjali Verma',
    interventionStatus: 'COUNSELING_SCHEDULED'
  },
  {
    studentId: 'STU-2024-112',
    name: 'Manish Rawat',
    semester: '3rd Sem ECE',
    attendancePct: 68.0,
    assignmentPendingCount: 2,
    lmsInactivityDays: 8,
    riskLevel: 'MODERATE_RISK',
    riskScore: 64,
    reasons: ['IAT-1 score drop (>30% below mean)', 'Attendance dipped from 82% to 68% in October'],
    counselorAssigned: 'Dr. Ramesh Kulkarni',
    interventionStatus: 'PARENT_CONTACTED'
  },
  {
    studentId: 'STU-2024-045',
    name: 'Pooja Hegde',
    semester: '5th Sem CSE',
    attendancePct: 71.5,
    assignmentPendingCount: 1,
    lmsInactivityDays: 4,
    riskLevel: 'WATCHLIST',
    riskScore: 45,
    reasons: ['Marginal attendance warning trigger'],
    counselorAssigned: 'Unassigned',
    interventionStatus: 'MONITORING'
  }
];

export async function GET() {
  const highRiskCount = atRiskStudents.filter(s => s.riskLevel === 'HIGH_RISK').length;
  return apiSuccess({
    students: atRiskStudents,
    totalAtRisk: atRiskStudents.length,
    highRiskCount,
    retentionHealthPct: 94.2
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, interventionStatus, counselorAssigned } = body;

    if (!studentId) {
      return apiError('Missing student identifier', 400);
    }

    const student = atRiskStudents.find(s => s.studentId === studentId);
    if (student) {
      if (interventionStatus) student.interventionStatus = interventionStatus;
      if (counselorAssigned) student.counselorAssigned = counselorAssigned;
    }

    return apiSuccess(atRiskStudents, 'Intervention recorded in retention ledger', 200);
  } catch {
    return apiError('Failed to record student intervention', 500);
  }
}

import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let teachingAssistants = [
  {
    id: 'ta-101',
    name: 'Saurabh Joshi (M.Tech CSE 2nd Yr)',
    assignedCourse: 'CS301 - Operating Systems',
    weeklyStipendHours: 10,
    loggedHoursThisMonth: 38,
    activeDuties: [
      { task: 'Lab Session 3 Benchmarking Supervision', date: 'Thursdays 2-5 PM', completed: true },
      { task: 'Mid-term Quiz 1 Evaluation (60 papers)', date: 'Due Sept 2', completed: false }
    ],
    performanceRating: 4.8
  },
  {
    id: 'ta-102',
    name: 'Kavita Chawla (Ph.D. Scholar)',
    assignedCourse: 'CS402 - Distributed Cloud Systems',
    weeklyStipendHours: 12,
    loggedHoursThisMonth: 44,
    activeDuties: [
      { task: 'Tutorial Doubts Session on Raft Consensus', date: 'Tuesdays 4-6 PM', completed: true },
      { task: 'Invigilation for End-Semester Mock Test', date: 'Due Sept 5', completed: true }
    ],
    performanceRating: 5.0
  }
];

export async function GET() {
  return apiSuccess({
    teachingAssistants,
    totalActiveTAs: teachingAssistants.length,
    totalWorkloadAllocatedHours: 82
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taId, dutyTitle, dueDate } = body;

    if (!taId || !dutyTitle) {
      return apiError('Missing TA ID or duty description', 400);
    }

    const targetTA = teachingAssistants.find(t => t.id === taId);
    if (targetTA) {
      targetTA.activeDuties.push({
        task: dutyTitle,
        date: dueDate || 'Upcoming Week',
        completed: false
      });
    }

    return apiSuccess(teachingAssistants, 'TA duty assigned successfully', 201);
  } catch {
    return apiError('Failed to allocate TA duty', 500);
  }
}

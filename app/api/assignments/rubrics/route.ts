import { NextResponse } from 'next/server';

let mockSubmissions = [
  {
    id: 'sub-101',
    studentName: 'Aarav Sharma',
    rollNo: '24CS089',
    assignmentTitle: 'Project 2: Raft Consensus Distributed State Machine',
    submittedAt: '2026-08-26 14:30',
    rubrics: {
      correctness: 28, // max 30
      codeQuality: 19, // max 20
      testCoverage: 20, // max 20
      documentation: 14, // max 15
      vivaVivaVoce: 14 // max 15
    },
    totalScore: 95,
    maxScore: 100,
    feedbackNote: 'Exceptional leader election implementation and RPC timeout handling.',
    status: 'EVALUATED'
  },
  {
    id: 'sub-102',
    studentName: 'Sneha Patel',
    rollNo: '24CS092',
    assignmentTitle: 'Project 2: Raft Consensus Distributed State Machine',
    submittedAt: '2026-08-26 16:15',
    rubrics: {
      correctness: 24,
      codeQuality: 16,
      testCoverage: 15,
      documentation: 12,
      vivaVivaVoce: 13
    },
    totalScore: 80,
    maxScore: 100,
    feedbackNote: 'Good logic, but unit test coverage for split-brain edge cases needs improvement.',
    status: 'EVALUATED'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockSubmissions
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentName, rollNo, assignmentTitle, rubrics, feedbackNote } = body;

    const totalScore = Object.values(rubrics as Record<string, number>).reduce((a, b) => a + Number(b), 0);

    const newEvaluation = {
      id: `sub-${Date.now()}`,
      studentName: studentName || 'New Student',
      rollNo: rollNo || '24CS999',
      assignmentTitle: assignmentTitle || 'Lab Evaluation',
      submittedAt: new Date().toISOString(),
      rubrics,
      totalScore,
      maxScore: 100,
      feedbackNote: feedbackNote || 'Evaluation completed according to syllabus rubric.',
      status: 'EVALUATED'
    };

    mockSubmissions.unshift(newEvaluation);

    return NextResponse.json({
      success: true,
      message: 'Rubric evaluation & feedback score recorded',
      data: newEvaluation
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not record evaluation' }, { status: 500 });
  }
}

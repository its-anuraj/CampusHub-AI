import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const PENDING_SURVEYS = [
  {
    id: 'fb-cs501',
    courseCode: 'CS501',
    courseTitle: 'Data Structures & Algorithms',
    facultyName: 'Dr. Priya Sharma',
    semester: 'Semester 5 (Fall 2026)',
    deadline: '2026-09-10T23:59:59.000Z',
    status: 'PENDING',
    criteria: [
      { id: 'c1', label: 'Clarity of Explanations & Lecture Delivery', rating: 0 },
      { id: 'c2', label: 'Punctuality & Timely Syllabus Coverage', rating: 0 },
      { id: 'c3', label: 'Quality of Practical Lab Assignments', rating: 0 },
      { id: 'c4', label: 'Approachability for Doubt Clearing & Mentoring', rating: 0 },
      { id: 'c5', label: 'Fairness in Evaluation & Continuous Assessment', rating: 0 },
    ]
  },
  {
    id: 'fb-cs502',
    courseCode: 'CS502',
    courseTitle: 'Database Management Systems',
    facultyName: 'Prof. Rahul Gupta',
    semester: 'Semester 5 (Fall 2026)',
    deadline: '2026-09-10T23:59:59.000Z',
    status: 'COMPLETED',
    criteria: [
      { id: 'c1', label: 'Clarity of Explanations & Lecture Delivery', rating: 5 },
      { id: 'c2', label: 'Punctuality & Timely Syllabus Coverage', rating: 4 },
      { id: 'c3', label: 'Quality of Practical Lab Assignments', rating: 5 },
      { id: 'c4', label: 'Approachability for Doubt Clearing & Mentoring', rating: 5 },
      { id: 'c5', label: 'Fairness in Evaluation & Continuous Assessment', rating: 4 },
    ]
  },
  {
    id: 'fb-cs503',
    courseCode: 'CS503',
    courseTitle: 'Operating Systems',
    facultyName: 'Dr. Anita Patel',
    semester: 'Semester 5 (Fall 2026)',
    deadline: '2026-09-10T23:59:59.000Z',
    status: 'PENDING',
    criteria: [
      { id: 'c1', label: 'Clarity of Explanations & Lecture Delivery', rating: 0 },
      { id: 'c2', label: 'Punctuality & Timely Syllabus Coverage', rating: 0 },
      { id: 'c3', label: 'Quality of Practical Lab Assignments', rating: 0 },
      { id: 'c4', label: 'Approachability for Doubt Clearing & Mentoring', rating: 0 },
      { id: 'c5', label: 'Fairness in Evaluation & Continuous Assessment', rating: 0 },
    ]
  }
];

export async function GET() {
  return apiSuccess({
    surveys: PENDING_SURVEYS,
    activeSemester: 'Semester 5 (Academic Year 2026-27)',
    mandatoryNotice: 'All feedback is encrypted and 100% anonymous. Feedback does not affect student grades.'
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { surveyId, ratings, comments } = body;

    if (!surveyId || !ratings) {
      return apiError('Missing survey feedback responses');
    }

    return apiSuccess({
      submissionId: `FB-SUB-${Date.now().toString().slice(-6)}`,
      surveyId,
      anonymousHash: `SHA256-${Math.random().toString(36).substring(2, 12)}`,
      submittedAt: new Date().toISOString()
    }, 'Anonymous Course & Faculty Evaluation recorded successfully!');
  } catch (err: any) {
    return apiError(err.message || 'Failed to submit feedback');
  }
}

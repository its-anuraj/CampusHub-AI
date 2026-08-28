import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let guestLectures = [
  {
    id: 'gl-101',
    speakerName: 'Dr. Srinivas Ramachandran',
    designation: 'Principal Scientist, Microsoft Research India',
    topic: 'Frontiers in Large Reasoning Models and Multimodal Grounding',
    targetDepartment: 'CSE & AI/DS',
    eventDate: '2026-09-12, 11:00 AM',
    venue: 'Sir M. Visvesvaraya Auditorium',
    expectedAttendees: 350,
    honorariumInr: 25000,
    status: 'DEAN_APPROVED',
    hostFaculty: 'Dr. Vivek Swaminathan'
  },
  {
    id: 'gl-102',
    speakerName: 'Meera Nambiar',
    designation: 'VP of Engineering, Zerodha',
    topic: 'Building Resilient Microservices & Zero-Downtime Financial Architecture',
    targetDepartment: 'CSE & ISE',
    eventDate: '2026-09-24, 02:30 PM',
    venue: 'Seminar Hall 3 (Tech Block)',
    expectedAttendees: 180,
    honorariumInr: 20000,
    status: 'IN_REVIEW',
    hostFaculty: 'Dr. Ramesh Kulkarni'
  }
];

export async function GET() {
  return apiSuccess({ lectures: guestLectures, totalHostedThisYear: 14 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { speakerName, designation, topic, eventDate, targetDepartment } = body;

    if (!speakerName || !topic || !eventDate) {
      return apiError('Missing required speaker proposal fields', 400);
    }

    const newLecture = {
      id: `gl-${Date.now()}`,
      speakerName,
      designation: designation || 'Industry Expert',
      topic,
      targetDepartment: targetDepartment || 'Computer Science',
      eventDate,
      venue: 'Main Campus Seminar Hall 1',
      expectedAttendees: 200,
      honorariumInr: 15000,
      status: 'IN_REVIEW',
      hostFaculty: 'Faculty Organizer'
    };

    guestLectures.unshift(newLecture);
    return apiSuccess(newLecture, 'Guest lecture invitation submitted to Dean', 201);
  } catch {
    return apiError('Failed to record lecture invitation', 500);
  }
}

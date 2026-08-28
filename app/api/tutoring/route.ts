import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let tutors = [
  {
    id: 'tut-1',
    name: 'Tanvi Saxena',
    major: 'Computer Science (4th Year)',
    gpa: '9.4 / 10',
    skills: ['Operating Systems', 'Compiler Design', 'C++ / STL', 'DSA'],
    hourlyRateCredits: 15,
    rating: 4.9,
    reviewsCount: 38,
    availability: 'Mon, Wed 5PM - 8PM',
    bio: 'Former Google Summer of Code contributor. Can help demystify virtual memory, multithreading, and red-black trees.'
  },
  {
    id: 'tut-2',
    name: 'Rahul Deshmukh',
    major: 'Electronics & Comm (3rd Year)',
    gpa: '9.1 / 10',
    skills: ['Digital Signal Processing', 'Verilog / FPGA', 'Microcontrollers'],
    hourlyRateCredits: 12,
    rating: 4.8,
    reviewsCount: 24,
    availability: 'Tue, Thu, Sat 4PM - 7PM',
    bio: 'Robotics club hardware lead. Passionate about hands-on lab circuit debugging and verilog state machines.'
  },
  {
    id: 'tut-3',
    name: 'Ananya Sharma',
    major: 'Mathematics & Computing (4th Year)',
    gpa: '9.7 / 10',
    skills: ['Linear Algebra', 'Probability & Statistics', 'Calculus III'],
    hourlyRateCredits: 20,
    rating: 5.0,
    reviewsCount: 52,
    availability: 'Daily 6PM - 9PM',
    bio: 'Gold medalist in University Math Olympiad. Clear intuitive geometric explanations of linear transforms.'
  }
];

export async function GET() {
  return apiSuccess({ tutors, studentCreditsBalance: 85 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tutorId, topic, date, sessionType } = body;

    if (!tutorId || !topic) {
      return apiError('Missing required tutor booking parameters', 400);
    }

    const booking = {
      bookingId: `session-${Date.now()}`,
      tutorId,
      topic,
      date: date || 'Tomorrow at 6:00 PM',
      sessionType: sessionType || '1-on-1 Google Meet',
      status: 'CONFIRMED',
      meetLink: 'https://meet.google.com/hub-tutor-session'
    };

    return apiSuccess(booking, 'Peer tutoring session booked successfully', 201);
  } catch {
    return apiError('Failed to schedule tutoring session', 500);
  }
}

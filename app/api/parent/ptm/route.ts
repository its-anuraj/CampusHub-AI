import { NextResponse } from 'next/server';

let mockPtmBookings = [
  {
    id: 'PTM-2026-01',
    facultyName: 'Dr. S. K. Raman',
    designation: 'Head of Computer Science & Academic Mentor',
    date: '2026-08-30',
    timeSlot: '04:00 PM - 04:20 PM',
    mode: 'GOOGLE_MEET_VIDEO',
    meetingLink: 'https://meet.jit.si/campushub-ptm-mentor-raman',
    agendaNotes: 'Discussion on Mid-Semester progress and competitive internship preparation.',
    status: 'CONFIRMED'
  },
  {
    id: 'PTM-2026-02',
    facultyName: 'Prof. Ananya Roy',
    designation: 'Training & Placement Advisor',
    date: '2026-09-02',
    timeSlot: '05:00 PM - 05:20 PM',
    mode: 'GOOGLE_MEET_VIDEO',
    meetingLink: 'https://meet.jit.si/campushub-ptm-placement-roy',
    agendaNotes: 'Review campus placement drives eligibility and career roadmaps.',
    status: 'SCHEDULED'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockPtmBookings
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { facultyName, date, timeSlot, agendaNotes } = body;

    const newBooking = {
      id: `PTM-${Date.now().toString().slice(-4)}`,
      facultyName: facultyName || 'Faculty Mentor',
      designation: 'Academic Course Counselor',
      date: date || '2026-09-05',
      timeSlot: timeSlot || '04:30 PM - 04:50 PM',
      mode: 'GOOGLE_MEET_VIDEO',
      meetingLink: `https://meet.jit.si/campushub-ptm-${Date.now().toString().slice(-4)}`,
      agendaNotes: agendaNotes || 'General academic review',
      status: 'CONFIRMED'
    };

    mockPtmBookings.unshift(newBooking);

    return NextResponse.json({
      success: true,
      message: 'Parent-Teacher Meeting booked and Google Meet invite sent to registered email',
      data: newBooking
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not schedule PTM' }, { status: 500 });
  }
}

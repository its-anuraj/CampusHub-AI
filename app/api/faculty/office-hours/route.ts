import { NextResponse } from 'next/server';

let mockSlots = [
  {
    id: 'slot-1',
    dayOfWeek: 'Monday',
    timeRange: '03:30 PM - 04:30 PM',
    location: 'Faculty Cabin #304 / Google Meet',
    maxAppointments: 3,
    bookedCount: 2,
    appointments: [
      { studentName: 'Rohan Sharma (24CS088)', agenda: 'Research proposal review on Federated Learning', status: 'CONFIRMED' },
      { studentName: 'Deepak Rao (24CS095)', agenda: 'Clarification on End-Sem major project rubrics', status: 'CONFIRMED' }
    ]
  },
  {
    id: 'slot-2',
    dayOfWeek: 'Wednesday',
    timeRange: '04:00 PM - 05:30 PM',
    location: 'AI & Data Lab Seminar Room',
    maxAppointments: 4,
    bookedCount: 1,
    appointments: [
      { studentName: 'Meera Iyer (24AI012)', agenda: 'Academic internship recommendation letter request', status: 'CONFIRMED' }
    ]
  },
  {
    id: 'slot-3',
    dayOfWeek: 'Friday',
    timeRange: '02:00 PM - 03:30 PM',
    location: 'Online Virtual Office (Zoom)',
    maxAppointments: 3,
    bookedCount: 0,
    appointments: []
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockSlots
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dayOfWeek, timeRange, location, maxAppointments } = body;

    const newSlot = {
      id: `slot-${Date.now()}`,
      dayOfWeek: dayOfWeek || 'Thursday',
      timeRange: timeRange || '03:00 PM - 04:00 PM',
      location: location || 'Faculty Office',
      maxAppointments: Number(maxAppointments) || 3,
      bookedCount: 0,
      appointments: []
    };

    mockSlots.push(newSlot);

    return NextResponse.json({
      success: true,
      message: 'Office hours slot published successfully',
      data: newSlot
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not create office slot' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

let mockScheduleConflicts = [
  {
    id: 'CONF-01',
    severity: 'CRITICAL',
    description: 'Faculty Double Booking: Prof. S. K. Raman assigned to CS401 (Room 301) and CS502 (Room 405) simultaneously on Tuesday 10:00 AM.',
    affectedSlots: ['Tue 10:00 - 11:00 AM (Room 301)', 'Tue 10:00 - 11:00 AM (Room 405)'],
    resolutionSuggestion: 'Re-assign CS502 to Wednesday 02:00 PM (Room 405 is available).'
  },
  {
    id: 'CONF-02',
    severity: 'WARNING',
    description: 'Classroom Capacity Overrun: AI601 (Batch of 78 students) assigned to Seminar Hall B (Capacity: 60).',
    affectedSlots: ['Thu 11:30 - 01:00 PM (Seminar Hall B)'],
    resolutionSuggestion: 'Swap room with Main Lecture Theatre 1 (Capacity: 120).'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      activeConflicts: mockScheduleConflicts,
      totalWeeklyLectures: 340,
      roomUtilizationPercent: 88.4,
      solverStatus: 'AI Constraint Solver v3.2 Active'
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, conflictId } = body;

    if (action === 'AUTO_RESOLVE') {
      mockScheduleConflicts = [];
      return NextResponse.json({
        success: true,
        message: 'All schedule overlaps and capacity bottlenecks resolved through genetic constraint optimization algorithm.',
        data: { activeConflicts: [], resolvedCount: 2 }
      });
    }

    return NextResponse.json({ success: true, message: 'Optimization completed' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not resolve timetable conflicts' }, { status: 500 });
  }
}

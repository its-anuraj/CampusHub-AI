import { NextResponse } from 'next/server';

const mockStudyGroups = [
  {
    id: 'grp-1',
    name: 'Distributed Systems & Cloud Architecture Cohort',
    subject: 'CS402 - Cloud Computing',
    membersCount: 5,
    maxMembers: 6,
    meetingSchedule: 'Mon, Wed, Fri • 6:30 PM',
    activeRoomLink: 'https://meet.jit.si/campushub-dist-sys-room',
    leadStudent: 'Rohan Sharma',
    tags: ['Raft Consensus', 'Kubernetes', 'gRPC'],
    streakDays: 14
  },
  {
    id: 'grp-2',
    name: 'Deep Learning & Neural Vision Squad',
    subject: 'AI501 - Machine Learning',
    membersCount: 4,
    maxMembers: 5,
    meetingSchedule: 'Tue, Thu • 8:00 PM',
    activeRoomLink: 'https://meet.jit.si/campushub-dl-vision',
    leadStudent: 'Ananya Verma',
    tags: ['PyTorch', 'Transformers', 'CNNs'],
    streakDays: 21
  },
  {
    id: 'grp-3',
    name: 'Embedded Systems & ARM Assembly Circle',
    subject: 'EC308 - Microprocessors',
    membersCount: 3,
    maxMembers: 4,
    meetingSchedule: 'Sat, Sun • 11:00 AM',
    activeRoomLink: 'https://meet.jit.si/campushub-arm-circle',
    leadStudent: 'Karan Patel',
    tags: ['ARM Cortex-M4', 'FreeRTOS', 'I2C/SPI'],
    streakDays: 8
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockStudyGroups
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, subject, maxMembers, meetingSchedule, tags } = body;

    const newGroup = {
      id: `grp-${Date.now()}`,
      name: name || 'New Collaboration Pod',
      subject: subject || 'General Studies',
      membersCount: 1,
      maxMembers: Number(maxMembers) || 5,
      meetingSchedule: meetingSchedule || 'Daily • 7:00 PM',
      activeRoomLink: `https://meet.jit.si/campushub-room-${Date.now().toString().slice(-4)}`,
      leadStudent: 'Current Student',
      tags: tags || ['Study Group', 'Revision'],
      streakDays: 1
    };

    return NextResponse.json({
      success: true,
      message: 'Study Group created successfully',
      data: newGroup
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Could not create study group' }, { status: 500 });
  }
}

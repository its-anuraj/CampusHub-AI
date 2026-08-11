import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const assignments = await db.assignment.findMany({
      include: {
        submissions: true,
      },
      orderBy: { dueDate: 'asc' },
    });
    return NextResponse.json(assignments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subject, description, dueDate, totalMarks, facultyName } = body;

    const assignment = await db.assignment.create({
      data: {
        title,
        subject,
        description,
        dueDate: new Date(dueDate),
        totalMarks: Number(totalMarks) || 20,
        facultyName: facultyName || 'Faculty Member',
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

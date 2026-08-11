import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    const where: any = {};
    if (studentId) where.studentId = studentId;

    const records = await db.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { records, subject, markedBy } = await request.json(); // records: { studentId, status }[]

    const created = await Promise.all(
      records.map((r: any) =>
        db.attendance.create({
          data: {
            studentId: r.studentId,
            subject,
            status: r.status,
            markedBy: markedBy || 'Faculty',
            date: new Date(),
          },
        })
      )
    );

    await db.auditLog.create({
      data: {
        action: `Attendance marked for ${subject} (${created.length} students)`,
        type: 'SUCCESS',
      },
    });

    return NextResponse.json({ count: created.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

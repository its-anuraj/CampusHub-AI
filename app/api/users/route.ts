import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const users = await db.user.findMany({
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password, role, department, rollNumber, employeeId } = await request.json();

    const user = await db.user.create({
      data: {
        name,
        email,
        password: password || 'Default@123',
        role,
        status: 'ACTIVE',
        ...(role === 'STUDENT' && {
          studentProfile: {
            create: {
              rollNumber: rollNumber || `ROLL-${Date.now().toString().slice(-4)}`,
              department: department || 'CSE',
            },
          },
        }),
        ...(role === 'FACULTY' && {
          facultyProfile: {
            create: {
              employeeId: employeeId || `EMP-${Date.now().toString().slice(-4)}`,
              department: department || 'CSE',
              subjects: JSON.stringify(['General Course']),
            },
          },
        }),
      },
    });

    await db.auditLog.create({
      data: {
        action: `Created new user ${name} (${role})`,
        type: 'SUCCESS',
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const user = await db.user.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

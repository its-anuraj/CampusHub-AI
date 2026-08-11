import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'STUDENT', phone, department = 'CSE', rollNumber, employeeId } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile based on role
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone: phone || null,
        status: 'ACTIVE',
        ...(role === 'STUDENT' ? {
          studentProfile: {
            create: {
              rollNumber: rollNumber || `CS2026${Math.floor(100 + Math.random() * 900)}`,
              department: department || 'CSE',
              year: 3,
              semester: 5,
              section: 'A',
              cgpa: 8.0,
              backlogs: 0,
            },
          },
        } : {}),
        ...(role === 'FACULTY' ? {
          facultyProfile: {
            create: {
              employeeId: employeeId || `FAC-${Math.floor(100 + Math.random() * 900)}`,
              department: department || 'CSE',
              designation: 'Assistant Professor',
              subjects: JSON.stringify(['Computer Science']),
            },
          },
        } : {}),
        ...(role === 'PARENT' ? {
          parentProfile: {
            create: {
              relation: 'Parent',
            },
          },
        } : {}),
      },
      include: {
        studentProfile: true,
        facultyProfile: true,
        parentProfile: true,
      },
    });

    // Log registration action
    await db.auditLog.create({
      data: {
        userId: newUser.id,
        action: `New user ${newUser.name} registered as ${newUser.role}`,
        type: 'SUCCESS',
      },
    });

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        phone: newUser.phone,
        studentProfile: newUser.studentProfile,
        facultyProfile: newUser.facultyProfile,
        parentProfile: newUser.parentProfile,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

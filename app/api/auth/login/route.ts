import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        facultyProfile: true,
        parentProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Support both bcrypt hashed password check and plain text fallback (for seed data)
    let isPasswordValid = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      isPasswordValid = user.password === password;
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Account is deactivated. Contact campus admin.' }, { status: 403 });
    }

    // Log login action
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: `User ${user.name} (${user.role}) authenticated successfully`,
        type: 'SUCCESS',
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        studentProfile: user.studentProfile,
        facultyProfile: user.facultyProfile,
        parentProfile: user.parentProfile,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Authentication error' }, { status: 500 });
  }
}

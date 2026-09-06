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
        adminProfile: true,
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

    if (user.status === 'PENDING' || user.verificationStatus === 'PENDING_APPROVAL') {
      return NextResponse.json({
        error: 'Your account is pending verification and approval. Once approved by your Coordinator / Administrator, you will receive an update and can log in easily with your registered credentials.',
      }, { status: 403 });
    }

    if (user.status !== 'ACTIVE' || user.verificationStatus === 'REJECTED') {
      return NextResponse.json({
        error: 'Your account registration was rejected or deactivated. Please contact the institution administrator.',
      }, { status: 403 });
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
        adminProfile: user.adminProfile,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Authentication error' }, { status: 500 });
  }
}

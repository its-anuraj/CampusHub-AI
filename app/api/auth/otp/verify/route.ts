import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyOTP } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const { phone, code, role = 'STUDENT', name } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone number and OTP code are required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    const isValid = verifyOTP(cleanPhone, code);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP code. Please try again.' }, { status: 400 });
    }

    // Check if user already exists with this phone or simulated phone email
    const simulatedEmail = `phone_${cleanPhone}@campushub.ai`;

    let user = await db.user.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          { email: simulatedEmail }
        ]
      },
      include: {
        studentProfile: true,
        facultyProfile: true,
        parentProfile: true,
      },
    });

    if (!user) {
      // Auto-provision user with phone number
      user = await db.user.create({
        data: {
          name: name || `Campus User ${cleanPhone.slice(-4)}`,
          email: simulatedEmail,
          password: `OTP_USER_${Date.now()}`,
          phone: cleanPhone,
          role,
          status: 'ACTIVE',
          studentProfile: {
            create: {
              rollNumber: `PH${cleanPhone.slice(-6)}`,
              department: 'CSE',
              year: 3,
              semester: 5,
              section: 'A',
              cgpa: 8.2,
              backlogs: 0,
            },
          },
        },
        include: {
          studentProfile: true,
          facultyProfile: true,
          parentProfile: true,
        },
      });

      await db.auditLog.create({
        data: {
          userId: user.id,
          action: `Mobile OTP user ${user.phone} registered and verified`,
          type: 'SUCCESS',
        },
      });
    } else {
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: `Mobile OTP user ${user.name} authenticated`,
          type: 'SUCCESS',
        },
      });
    }

    return NextResponse.json({
      message: 'Mobile OTP verified successfully',
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
    console.error('OTP verify error:', error);
    return NextResponse.json({ error: error.message || 'OTP verification failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, oldPassword, newPassword, confirmPassword } = body;

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Email, current password, and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirm password do not match.' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User account not found.' },
        { status: 404 }
      );
    }

    // Verify old password
    let isOldPasswordValid = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    } else {
      isOldPasswordValid = user.password === oldPassword;
    }

    if (!isOldPasswordValid) {
      return NextResponse.json(
        { error: 'Incorrect current password. Please try again.' },
        { status: 401 }
      );
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password cannot be the same as the old password.' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await db.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    // Create security audit log
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: `User ${user.name} (${user.role}) changed their account password successfully`,
        type: 'SUCCESS',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. You can now use your new password to log in.',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update password.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let email = body.email;
    let name = body.name;
    let avatar = body.avatar || body.picture;
    let googleId = body.googleId || body.sub;
    const role = body.role || 'STUDENT';

    // Handle raw Google Credential JWT from Google Identity Services
    if (body.credential) {
      try {
        const parts = body.credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          email = payload.email;
          name = payload.name;
          avatar = payload.picture;
          googleId = payload.sub;
        }
      } catch (jwtError) {
        console.error('Failed to parse Google JWT credential:', jwtError);
      }
    }

    if (!email || !name) {
      return NextResponse.json({ error: 'Valid Google user email and name are required' }, { status: 400 });
    }

    let user = await db.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        facultyProfile: true,
        parentProfile: true,
      },
    });

    if (!user) {
      // Auto-provision Google authenticated user in database
      user = await db.user.create({
        data: {
          name,
          email,
          password: `GOOGLE_AUTH_${googleId || Date.now()}`,
          role,
          avatar: avatar || null,
          status: 'ACTIVE',
          studentProfile: {
            create: {
              rollNumber: `GOOG${Math.floor(1000 + Math.random() * 9000)}`,
              department: 'CSE',
              year: 3,
              semester: 5,
              section: 'A',
              cgpa: 8.5,
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
          action: `Google user ${user.name} (${user.email}) registered and authenticated`,
          type: 'SUCCESS',
        },
      });
    } else {
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: `Google user ${user.name} (${user.email}) logged in`,
          type: 'SUCCESS',
        },
      });
    }

    return NextResponse.json({
      message: 'Google authentication successful',
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
    console.error('Google auth server error:', error);
    return NextResponse.json({ error: error.message || 'Google authentication failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const users = await db.user.findMany({
      include: {
        studentProfile: true,
        facultyProfile: true,
        adminProfile: true,
        parentProfile: true,
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
    const body = await request.json();

    // Check if bulk import array
    if (Array.isArray(body.users) && body.users.length > 0) {
      const createdUsers = [];
      for (const item of body.users) {
        const {
          name,
          email,
          password = 'Default@123',
          role = 'STUDENT',
          department = 'CSE',
          rollNumber,
          employeeId,
          departmentRole = 'ACADEMIC_ADMIN',
          designation,
          phone,
          year = 1,
          semester = 1,
          section = 'A',
        } = item;

        if (!name || !email) continue;

        try {
          const user = await db.user.upsert({
            where: { email },
            update: {
              name,
              phone: phone || null,
              status: 'ACTIVE',
            },
            create: {
              name,
              email,
              password,
              role,
              phone: phone || null,
              status: 'ACTIVE',
              verificationStatus: 'VERIFIED',
              ...(role === 'STUDENT' && {
                studentProfile: {
                  create: {
                    rollNumber: rollNumber || `KCC-${Date.now().toString().slice(-6)}`,
                    department,
                    year: Number(year) || 1,
                    semester: Number(semester) || 1,
                    section: section || 'A',
                  },
                },
              }),
              ...(role === 'FACULTY' && {
                facultyProfile: {
                  create: {
                    employeeId: employeeId || `KCC-FAC-${Date.now().toString().slice(-4)}`,
                    department,
                    designation: designation || 'Assistant Professor',
                    subjects: JSON.stringify([department]),
                  },
                },
              }),
              ...(role === 'ADMIN' && {
                adminProfile: {
                  create: {
                    employeeId: employeeId || `KCC-ADM-${Date.now().toString().slice(-4)}`,
                    departmentRole: departmentRole || 'ACADEMIC_ADMIN',
                    designation: designation || 'Department Administrator',
                  },
                },
              }),
            },
            include: {
              studentProfile: true,
              facultyProfile: true,
              adminProfile: true,
            },
          });
          createdUsers.push(user);
        } catch (itemErr) {
          console.error(`Error importing row for ${email}:`, itemErr);
        }
      }

      await db.auditLog.create({
        data: {
          action: `Bulk CSV imported ${createdUsers.length} user accounts into directory`,
          type: 'SUCCESS',
        },
      });

      return NextResponse.json({ success: true, count: createdUsers.length, users: createdUsers }, { status: 201 });
    }

    // Single User Creation
    const {
      name,
      email,
      password = 'Admin@123',
      role = 'ADMIN',
      department = 'Administration',
      rollNumber,
      employeeId,
      departmentRole = 'ACADEMIC_ADMIN',
      designation = 'Department Administrator',
      phone,
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password,
        role,
        phone: phone || null,
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        ...(role === 'STUDENT' && {
          studentProfile: {
            create: {
              rollNumber: rollNumber || `KCC-${Date.now().toString().slice(-6)}`,
              department,
            },
          },
        }),
        ...(role === 'FACULTY' && {
          facultyProfile: {
            create: {
              employeeId: employeeId || `KCC-FAC-${Date.now().toString().slice(-4)}`,
              department,
              designation: designation || 'Assistant Professor',
              subjects: JSON.stringify([department]),
            },
          },
        }),
        ...(role === 'ADMIN' && {
          adminProfile: {
            create: {
              employeeId: employeeId || `KCC-ADM-${Date.now().toString().slice(-4)}`,
              departmentRole: departmentRole || 'ACADEMIC_ADMIN',
              designation: designation || 'Department Administrator',
            },
          },
        }),
      },
      include: {
        studentProfile: true,
        facultyProfile: true,
        adminProfile: true,
      },
    });

    await db.auditLog.create({
      data: {
        action: `Director provisioned new admin staff: ${name} (${departmentRole || role})`,
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
    const body = await request.json();
    const { id, ids, status } = body;

    if (Array.isArray(ids) && ids.length > 0) {
      await db.user.updateMany({
        where: { id: { in: ids } },
        data: { status },
      });
      await db.auditLog.create({
        data: {
          action: `Bulk updated status to ${status} for ${ids.length} users`,
          type: 'INFO',
        },
      });
      return NextResponse.json({ success: true, count: ids.length, status });
    }

    if (id) {
      const user = await db.user.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json(user);
    }

    return NextResponse.json({ error: 'Missing id or ids' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id, ids } = body;

    const targetIds = Array.isArray(ids) ? ids : (id ? [id] : []);
    if (targetIds.length === 0) {
      return NextResponse.json({ error: 'Missing id or ids to delete' }, { status: 400 });
    }

    await db.user.deleteMany({
      where: { id: { in: targetIds } },
    });

    await db.auditLog.create({
      data: {
        action: `Bulk deleted ${targetIds.length} user accounts`,
        type: 'WARNING',
      },
    });

    return NextResponse.json({ success: true, deletedCount: targetIds.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

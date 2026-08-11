import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }

    const notices = await db.notice.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(notices);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, priority, department, isPinned, createdBy } = body;

    const notice = await db.notice.create({
      data: {
        title,
        content,
        category: category || 'GENERAL',
        priority: priority || 'MEDIUM',
        department: department || 'ALL',
        isPinned: Boolean(isPinned),
        createdBy: createdBy || 'Admin',
      },
    });

    await db.auditLog.create({
      data: {
        action: `Notice "${title}" published`,
        type: 'INFO',
      },
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, isPinned } = await request.json();
    const notice = await db.notice.update({
      where: { id },
      data: { isPinned },
    });
    return NextResponse.json(notice);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing notice ID' }, { status: 400 });

    await db.notice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

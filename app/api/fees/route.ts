import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const fees = await db.feeRecord.findMany({
      orderBy: { dueDate: 'asc' },
    });
    return NextResponse.json(fees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    const updated = await db.feeRecord.update({
      where: { id },
      data: {
        status: 'PAID',
        paidDate: new Date(),
        receipt: `RCPT-${Date.now().toString().slice(-6)}`,
      },
    });

    await db.auditLog.create({
      data: {
        action: `Fee payment settled for record ${updated.type}`,
        type: 'SUCCESS',
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

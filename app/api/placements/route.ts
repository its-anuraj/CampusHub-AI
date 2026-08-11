import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const companies = await db.placementCompany.findMany({
      orderBy: { deadline: 'asc' },
    });
    return NextResponse.json(companies);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { companyId, studentId } = await request.json();

    const application = await db.placementApplication.create({
      data: {
        companyId,
        studentId,
        status: 'APPLIED',
      },
    });

    await db.placementCompany.update({
      where: { id: companyId },
      data: { applicants: { increment: 1 } },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

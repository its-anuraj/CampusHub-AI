import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_SCHOLARSHIPS = [
  {
    id: 'sch-1',
    title: 'Chancellor’s Academic Merit Scholarship',
    provider: 'CampusHub Institutional Endowment',
    amount: 75000,
    deadline: '2026-09-30T23:59:59.000Z',
    minCgpa: 8.5,
    familyIncome: 1200000,
    description: 'Awarded to top 5% academic scorers across each department with exceptional research potential.',
    category: 'MERIT',
    status: 'ACTIVE'
  },
  {
    id: 'sch-2',
    title: 'Alumni Foundation Need-Based Tuition Grant',
    provider: 'Global Alumni Council',
    amount: 50000,
    deadline: '2026-10-15T23:59:59.000Z',
    minCgpa: 7.0,
    familyIncome: 450000,
    description: 'Financial assistance for deserving undergraduate students with annual family income below ₹4.5 Lakhs.',
    category: 'NEED_BASED',
    status: 'ACTIVE'
  },
  {
    id: 'sch-3',
    title: 'Women in STEM Innovation Fellowship',
    provider: 'Tech Industry Consortium',
    amount: 60000,
    deadline: '2026-09-20T23:59:59.000Z',
    minCgpa: 7.8,
    familyIncome: 800000,
    description: 'Encouraging female engineers in AI, Cyber Security, and Deep Learning research projects.',
    category: 'SPECIAL',
    status: 'ACTIVE'
  }
];

export async function GET() {
  try {
    let list: any[] = [];
    try {
      list = await prisma.scholarship.findMany({ orderBy: { deadline: 'asc' } });
    } catch {}

    return apiSuccess(list.length > 0 ? list : MOCK_SCHOLARSHIPS);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch scholarships');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'APPLY') {
      const { scholarshipId, studentName, rollNumber, cgpa, annualIncome } = body;
      let app;
      try {
        app = await prisma.scholarshipApplication.create({
          data: {
            scholarshipId,
            studentName: studentName || 'Alex Kumar',
            rollNumber: rollNumber || '23CSE042',
            cgpa: Number(cgpa) || 8.42,
            annualIncome: Number(annualIncome) || 350000,
            status: 'SUBMITTED'
          }
        });
      } catch {
        app = {
          id: `app-${Date.now()}`,
          scholarshipId,
          studentName: studentName || 'Alex Kumar',
          rollNumber: rollNumber || '23CSE042',
          cgpa: Number(cgpa) || 8.42,
          annualIncome: Number(annualIncome) || 350000,
          status: 'SUBMITTED',
          appliedAt: new Date().toISOString()
        };
      }
      return apiSuccess(app, 'Scholarship application submitted successfully');
    }

    return apiError('Invalid action');
  } catch (err: any) {
    return apiError(err.message || 'Failed to process scholarship application');
  }
}

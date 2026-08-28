import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function GET() {
  const cieMatrix = {
    courseCode: 'CS301',
    courseName: 'Design & Analysis of Algorithms',
    totalStudents: 64,
    components: [
      { name: 'Internal Assessment Test 1 (IAT-1)', maxMarks: 50, classAverage: 38.4, targetAttainmentPct: 75, actualAttainmentPct: 82 },
      { name: 'Internal Assessment Test 2 (IAT-2)', maxMarks: 50, classAverage: 36.2, targetAttainmentPct: 75, actualAttainmentPct: 78 },
      { name: 'Course Project / Implementation Lab', maxMarks: 25, classAverage: 22.8, targetAttainmentPct: 80, actualAttainmentPct: 91 },
      { name: 'Continuous Quizzes & Attendance', maxMarks: 15, classAverage: 13.1, targetAttainmentPct: 80, actualAttainmentPct: 86 }
    ],
    overallCoAttainmentLevel: 2.82, // on 3.0 scale
    isNbaCompliant: true,
    weakTopicsIdentified: ['Amortized Potential Method Analysis', 'Ford-Fulkerson Max Flow Cuts']
  };

  return apiSuccess(cieMatrix);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { componentName, marksList } = body;

    if (!marksList || !Array.isArray(marksList) || marksList.length === 0) {
      return apiError('Valid student marks array is required for CIE attainment processing', 400);
    }

    const avg = marksList.reduce((a, b) => a + b, 0) / marksList.length;
    const attainment = Math.round((marksList.filter(m => m >= 30).length / marksList.length) * 100);

    return apiSuccess({
      componentName: componentName || 'New CIE Assessment',
      calculatedAverage: Number(avg.toFixed(2)),
      calculatedAttainmentPct: attainment,
      attainmentLevel: attainment > 80 ? 3 : attainment > 70 ? 2 : 1
    }, 'CIE Attainment Matrix recomputed', 200);
  } catch {
    return apiError('Failed to calculate CIE attainment', 500);
  }
}

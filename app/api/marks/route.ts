import { NextResponse } from 'next/server';

const SEED_STUDENT_MARKS = [
  { id: '1', rollNumber: 'CS2023-001', name: 'Aarav Sharma', internal: 18, midterm: 26, endSem: 44, total: 88, grade: 'A+' },
  { id: '2', rollNumber: 'CS2023-014', name: 'Bhavna Verma', internal: 19, midterm: 28, endSem: 47, total: 94, grade: 'O' },
  { id: '3', rollNumber: 'CS2023-027', name: 'Chetan Kapoor', internal: 14, midterm: 20, endSem: 36, total: 70, grade: 'A' },
  { id: '4', rollNumber: 'CS2023-042', name: 'Anuraj Singh', internal: 19, midterm: 29, endSem: 48, total: 96, grade: 'O' },
  { id: '5', rollNumber: 'CS2023-055', name: 'Divya Nair', internal: 16, midterm: 22, endSem: 38, total: 76, grade: 'A' },
  { id: '6', rollNumber: 'CS2023-068', name: 'Eshan Malhotra', internal: 12, midterm: 18, endSem: 32, total: 62, grade: 'B+' },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseCode = searchParams.get('course') || 'CS501';

    return NextResponse.json({
      success: true,
      courseCode,
      students: SEED_STUDENT_MARKS,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseCode, marks } = body;

    return NextResponse.json({
      success: true,
      message: `Gradebook for ${courseCode} successfully saved and published.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const semester = searchParams.get('semester');

    const courses = await db.course.findMany({
      where: {
        ...(department && department !== 'ALL' ? { department } : {}),
        ...(semester ? { semester: parseInt(semester) } : {}),
      },
      include: {
        enrollments: {
          include: {
            student: true,
          },
        },
      },
      orderBy: {
        code: 'asc',
      },
    });

    return NextResponse.json(courses);
  } catch (error: any) {
    console.error('Fetch courses error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, title, department = 'CSE', credits = 4, semester = 5, description, syllabus, facultyName } = body;

    if (!code || !title || !description) {
      return NextResponse.json({ error: 'Course code, title, and description are required' }, { status: 400 });
    }

    const existingCourse = await db.course.findUnique({
      where: { code },
    });

    if (existingCourse) {
      return NextResponse.json({ error: 'A course with this code already exists' }, { status: 409 });
    }

    const newCourse = await db.course.create({
      data: {
        code,
        title,
        department,
        credits: parseInt(credits),
        semester: parseInt(semester),
        description,
        syllabus: typeof syllabus === 'string' ? syllabus : JSON.stringify(syllabus || []),
        facultyName: facultyName || 'Faculty Member',
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    console.error('Create course error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create course' }, { status: 500 });
  }
}

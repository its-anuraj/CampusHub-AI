import { NextResponse } from 'next/server';
import { generateTranscriptHtml } from '@/lib/transcriptGenerator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentName, rollNo, degree, branch, cgpa, courses } = body;

    const sampleData = {
      studentName: studentName || 'Aarav Sharma',
      rollNo: rollNo || '24CS089',
      degree: degree || 'Bachelor of Technology (Honors)',
      branch: branch || 'Computer Science & Engineering',
      cgpa: cgpa || 9.42,
      semester: 6,
      courses: courses || [
        { courseCode: 'CS401', courseTitle: 'Distributed Systems & Cloud Computing', credits: 4, grade: 'A+', gradePoint: 10 },
        { courseCode: 'AI501', courseTitle: 'Deep Learning & Neural Architectures', credits: 4, grade: 'A+', gradePoint: 10 },
        { courseCode: 'CS408', courseTitle: 'Modern Database Internals & Storage Engines', credits: 3, grade: 'A', gradePoint: 9 },
        { courseCode: 'EC308', courseTitle: 'Embedded Systems & ARM Microcontrollers', credits: 3, grade: 'A', gradePoint: 9 }
      ]
    };

    const html = generateTranscriptHtml(sampleData);

    return NextResponse.json({
      success: true,
      data: {
        rawHtml: html,
        transcriptMeta: sampleData,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not generate transcript' }, { status: 500 });
  }
}

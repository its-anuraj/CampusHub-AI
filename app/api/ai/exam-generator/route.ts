import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseCode, topic, examType = 'Mid-Semester Exam', totalMarks = 50, bloomsTaxonomy = 'Balanced' } = body;

    const sections = [
      {
        sectionName: 'Section A: Fundamental Recall & Understanding (Bloom L1-L2)',
        marksPerQuestion: 2,
        questions: [
          { qNo: 1, text: `Define the core principles of ${topic || 'the subject'} and state two standard application scenarios.`, bloomsLevel: 'Remember (L1)', marks: 2 },
          { qNo: 2, text: `Differentiate between static and dynamic allocation mechanisms in this context.`, bloomsLevel: 'Understand (L2)', marks: 2 },
          { qNo: 3, text: `Explain how fault tolerance is guaranteed under standard boundary conditions.`, bloomsLevel: 'Understand (L2)', marks: 2 }
        ]
      },
      {
        sectionName: 'Section B: Application & Analytical Synthesis (Bloom L3-L4)',
        marksPerQuestion: 8,
        questions: [
          { qNo: 4, text: `Design an optimal algorithmic pipeline to solve high-concurrency data ingestion for ${topic || 'the system'}, providing step-by-step pseudo-code.`, bloomsLevel: 'Apply (L3)', marks: 8 },
          { qNo: 5, text: `Analyze the time and space complexity trade-offs when scaling the architecture to 100,000 active nodes.`, bloomsLevel: 'Analyze (L4)', marks: 8 }
        ]
      },
      {
        sectionName: 'Section C: Evaluation & Architectural Design (Bloom L5-L6)',
        marksPerQuestion: 14,
        questions: [
          { qNo: 6, text: `Critically evaluate two existing production design approaches for ${topic || 'the domain'}. Propose an enhanced hybrid framework with state diagrams and security validation.`, bloomsLevel: 'Create & Evaluate (L5/L6)', marks: 14 }
        ]
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        paperTitle: `${courseCode || 'CS401'} - ${examType}`,
        topic: topic || 'Advanced Systems Architecture',
        totalMarks,
        bloomsTaxonomy,
        durationMinutes: 120,
        generatedAt: new Date().toISOString(),
        sections
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate exam question paper' }, { status: 500 });
  }
}

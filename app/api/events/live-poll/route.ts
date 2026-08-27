import { NextResponse } from 'next/server';

let mockPoll = {
  id: 'hackathon-poll-2026',
  eventName: 'National Smart Campus AI Hackathon 2026',
  question: 'Which track presentation displayed the highest real-world production viability?',
  totalVotes: 342,
  options: [
    { id: 'opt-1', title: 'Team NeuralMed - AI Radiology Diagnostics', votes: 128, percentage: 37 },
    { id: 'opt-2', title: 'Team EcoGrid - Autonomous Micro-Grid Balancer', votes: 104, percentage: 30 },
    { id: 'opt-3', title: 'Team CyberGuard - Quantum Post-Key Exchange', votes: 65, percentage: 19 },
    { id: 'opt-4', title: 'Team AgriSense - Drone Hyper-spectral Pest Map', votes: 45, percentage: 14 }
  ],
  questionsQueue: [
    { id: 'q-1', author: 'Aditya K.', upvotes: 24, text: 'How does NeuralMed handle inference latency on edge clinical tablets?' },
    { id: 'q-2', author: 'Pooja M.', upvotes: 18, text: 'What is the hardware deployment cost per solar inverter node in EcoGrid?' },
    { id: 'q-3', author: 'Rahul S.', upvotes: 12, text: 'Is the quantum key exchange tested against simulated Shor algorithm attacks?' }
  ]
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockPoll
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, optionId, questionText, questionId } = body;

    if (action === 'VOTE' && optionId) {
      const opt = mockPoll.options.find(o => o.id === optionId);
      if (opt) {
        opt.votes += 1;
        mockPoll.totalVotes += 1;
        mockPoll.options.forEach(o => {
          o.percentage = Math.round((o.votes / mockPoll.totalVotes) * 100);
        });
      }
    } else if (action === 'ASK_QUESTION' && questionText) {
      mockPoll.questionsQueue.unshift({
        id: `q-${Date.now()}`,
        author: 'Anonymous Student',
        upvotes: 1,
        text: questionText
      });
    } else if (action === 'UPVOTE' && questionId) {
      const q = mockPoll.questionsQueue.find(item => item.id === questionId);
      if (q) q.upvotes += 1;
    }

    return NextResponse.json({
      success: true,
      message: 'Action recorded successfully',
      data: mockPoll
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not process event poll action' }, { status: 500 });
  }
}

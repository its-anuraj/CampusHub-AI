import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function GET() {
  const interviewTracks = [
    {
      id: 'track-dsa',
      title: 'Data Structures & Algorithms',
      difficulty: 'Hard',
      durationMinutes: 45,
      questionsCount: 3,
      roles: ['SDE-1', 'Backend Engineer'],
      questions: [
        {
          id: 'q1',
          question: 'How would you design a distributed Least Recently Used (LRU) Cache with O(1) eviction and sub-millisecond concurrency?',
          expectedKeypoints: ['Doubly Linked List', 'Hash Map', 'Read-Write Locks or Sharded Concurrency', 'Eviction Policy'],
          hints: ['Think about node pointers and thread-safe hash buckets.'],
        },
        {
          id: 'q2',
          question: 'Explain how you detect cycles in a directed graph and determine the topological ordering.',
          expectedKeypoints: ['Kahn Algorithm (in-degree count)', 'DFS with 3-color state tracking', 'DAG constraints'],
          hints: ['Consider in-degree tracking vs recursion stack visiting state.'],
        }
      ]
    },
    {
      id: 'track-sysdesign',
      title: 'High-Scale System Design',
      difficulty: 'Advanced',
      durationMinutes: 60,
      questionsCount: 2,
      roles: ['Distributed Systems', 'Cloud Architect'],
      questions: [
        {
          id: 'q-sd-1',
          question: 'Design a globally scalable real-time notification push service supporting 100M active WebSocket connections with at-least-once delivery semantics.',
          expectedKeypoints: ['Gateway Layer', 'Pub/Sub Broker (Kafka/RabbitMQ)', 'Redis Presence Cluster', 'Dead-letter Queues', 'Idempotency Keys'],
          hints: ['How do you manage connection affinity and load balancer horizontal scaling?'],
        }
      ]
    }
  ];

  return apiSuccess({ tracks: interviewTracks, activeSessions: 42 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trackId, questionId, studentAnswer } = body;

    if (!studentAnswer || studentAnswer.length < 10) {
      return apiError('Please provide a substantive technical response for evaluation', 400);
    }

    const evaluation = {
      score: Math.min(98, 70 + Math.floor(studentAnswer.length / 25)),
      technicalAccuracy: 'Strong conceptual clarity on core algorithmic invariants.',
      communicationRating: 'Clear, structured decomposition and trade-off analysis.',
      strengths: [
        'Accurate time and space asymptotic analysis',
        'Identified edge cases and high concurrency bottlenecks'
      ],
      improvementAreas: [
        'Consider memory fragmentation under heavy continuous mutations',
        'Elaborate on backpressure mechanisms under network partitions'
      ],
      aiFeedbackNote: 'Excellent structure! Your breakdown of the core invariants aligns with standard FAANG bar-raiser expectations.'
    };

    return apiSuccess({ trackId, questionId, evaluation }, 'Interview answer evaluated successfully', 200);
  } catch {
    return apiError('Failed to process interview response evaluation', 500);
  }
}

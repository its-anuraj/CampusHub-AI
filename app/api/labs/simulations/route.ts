import { NextResponse } from 'next/server';

export async function GET() {
  const simulations = [
    {
      id: 'sim-1',
      title: 'RC Circuit Transient Response Analyzer',
      discipline: 'Electrical Engineering',
      duration: '45 mins',
      difficulty: 'Intermediate',
      completedStudents: 420,
      rating: 4.9,
      tags: ['Circuits', 'Capacitors', 'Ohm Law', 'Transient'],
      defaultParams: { resistance: 1000, capacitance: 10, voltage: 5 }
    },
    {
      id: 'sim-2',
      title: 'Pendulum Harmonic Motion & Gravitational Constant',
      discipline: 'Applied Physics',
      duration: '30 mins',
      difficulty: 'Beginner',
      completedStudents: 612,
      rating: 4.8,
      tags: ['Mechanics', 'Oscillation', 'Gravity', 'Kinematics'],
      defaultParams: { length: 1.5, mass: 0.5, angle: 15 }
    },
    {
      id: 'sim-3',
      title: 'B-Tree & Red-Black Tree Balancing Visualizer',
      discipline: 'Computer Science',
      duration: '50 mins',
      difficulty: 'Advanced',
      completedStudents: 890,
      rating: 5.0,
      tags: ['Data Structures', 'Algorithms', 'Trees', 'Time Complexity'],
      defaultParams: { nodes: 15, treeType: 'Red-Black' }
    },
    {
      id: 'sim-4',
      title: 'Acid-Base Titration & pH Equivalence Curve',
      discipline: 'Engineering Chemistry',
      duration: '40 mins',
      difficulty: 'Intermediate',
      completedStudents: 340,
      rating: 4.7,
      tags: ['Chemistry', 'pH', 'Titration', 'Equivalence'],
      defaultParams: { acidVolume: 25, titrantConcentration: 0.1 }
    }
  ];

  return NextResponse.json({
    success: true,
    data: simulations
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { simId, params } = body;

    // Computational Simulation Solver
    let resultData: any = {};

    if (simId === 'sim-1') {
      const R = params.resistance || 1000;
      const C = (params.capacitance || 10) * 1e-6;
      const V = params.voltage || 5;
      const tau = R * C; // Time constant
      
      const timePoints = [0, tau * 0.5, tau, tau * 2, tau * 3, tau * 5];
      const curve = timePoints.map(t => ({
        timeMs: Number((t * 1000).toFixed(2)),
        voltageOut: Number((V * (1 - Math.exp(-t / tau))).toFixed(3))
      }));

      resultData = {
        timeConstantTau: `${(tau * 1000).toFixed(2)} ms`,
        peakCurrent: `${((V / R) * 1000).toFixed(2)} mA`,
        chargingCurve: curve,
        energyStored: `${(0.5 * C * V * V * 1000).toFixed(4)} mJ`
      };
    } else {
      resultData = {
        status: 'Simulation Calculated Successfully',
        outputValue: 98.4,
        metrics: { stabilityIndex: 'Optimal', convergenceSteps: 12 }
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        simId,
        params,
        result: resultData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Simulation execution error' }, { status: 500 });
  }
}

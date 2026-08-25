import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const DEPARTMENT_BUDGETS = [
  { dept: 'Computer Science & Engineering', code: 'CSE', allocated: 8500000, spent: 6240000, committed: 1100000, available: 1160000, utilization: 73.4 },
  { dept: 'Electronics & Communication', code: 'ECE', allocated: 6500000, spent: 4800000, committed: 800000, available: 900000, utilization: 73.8 },
  { dept: 'Mechanical Engineering', code: 'MECH', allocated: 7200000, spent: 5900000, committed: 600000, available: 700000, utilization: 81.9 },
  { dept: 'Civil & Infrastructure', code: 'CIVIL', allocated: 4800000, spent: 3400000, committed: 400000, available: 1000000, utilization: 70.8 },
  { dept: 'Management & MBA Studies', code: 'MBA', allocated: 3500000, spent: 2600000, committed: 300000, available: 600000, utilization: 74.2 },
];

let mockRequisitions = [
  { id: 'REQ-2026-104', dept: 'CSE', item: 'NVIDIA RTX 4090 GPU Rig for NLP Lab', amount: 480000, requestedBy: 'Dr. Priya Sharma', status: 'PENDING_APPROVAL', date: '2026-08-24' },
  { id: 'REQ-2026-103', dept: 'ECE', item: 'Keysight Digital Storage Oscilloscopes (x4)', amount: 320000, requestedBy: 'Prof. R. Sen', status: 'APPROVED', date: '2026-08-20' },
  { id: 'REQ-2026-102', dept: 'MECH', item: 'High-Precision 3D Resin Filament Batch', amount: 95000, requestedBy: 'Dr. V. Yadav', status: 'APPROVED', date: '2026-08-18' }
];

export async function GET() {
  const totalAllocated = DEPARTMENT_BUDGETS.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = DEPARTMENT_BUDGETS.reduce((s, b) => s + b.spent, 0);

  return apiSuccess({
    budgets: DEPARTMENT_BUDGETS,
    requisitions: mockRequisitions,
    metrics: {
      fiscalYear: 'FY 2026-27',
      totalAllocated: `₹${(totalAllocated / 10000000).toFixed(2)} Cr`,
      totalSpent: `₹${(totalSpent / 10000000).toFixed(2)} Cr`,
      overallUtilization: `${Math.round((totalSpent / totalAllocated) * 100)}%`
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, reqId, dept, item, amount, requestedBy } = body;

    if (action === 'APPROVE') {
      mockRequisitions = mockRequisitions.map(r => r.id === reqId ? { ...r, status: 'APPROVED' } : r);
      return apiSuccess({ reqId }, 'Purchase requisition sanctioned by Chief Financial Officer.');
    }

    if (action === 'CREATE') {
      const newReq = {
        id: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
        dept: dept || 'CSE',
        item,
        amount: Number(amount) || 50000,
        requestedBy: requestedBy || 'Department Chair',
        status: 'PENDING_APPROVAL',
        date: new Date().toISOString().split('T')[0]
      };
      mockRequisitions = [newReq, ...mockRequisitions];
      return apiSuccess(newReq, 'Requisition submitted for Dean & Finance audit.');
    }

    return apiError('Invalid budget action');
  } catch (err: any) {
    return apiError(err.message || 'Budget error');
  }
}

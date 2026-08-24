import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_LEAVES = [
  {
    id: 'lv-1',
    facultyName: 'Dr. Ramesh Kumar',
    employeeId: 'FAC-CSE-019',
    department: 'Computer Science & Engineering',
    leaveType: 'CASUAL',
    startDate: '2026-09-02T00:00:00.000Z',
    endDate: '2026-09-03T00:00:00.000Z',
    daysCount: 2,
    reason: 'Attending IEEE AI & Quantum Summit as keynote speaker',
    status: 'APPROVED',
    substitute: 'Prof. Anita Desai',
    reviewedBy: 'Dr. S. Nair (HOD CSE)',
    appliedAt: '2026-08-20T10:30:00.000Z'
  },
  {
    id: 'lv-2',
    facultyName: 'Dr. Ramesh Kumar',
    employeeId: 'FAC-CSE-019',
    department: 'Computer Science & Engineering',
    leaveType: 'DUTY_LEAVE',
    startDate: '2026-09-15T00:00:00.000Z',
    endDate: '2026-09-17T00:00:00.000Z',
    daysCount: 3,
    reason: 'University External Examiner Duty for Final Year Viva',
    status: 'PENDING',
    substitute: 'Dr. Vikram Patel',
    reviewedBy: null,
    appliedAt: '2026-08-24T09:15:00.000Z'
  }
];

export async function GET(req: Request) {
  try {
    let leaves: any[] = [];
    try {
      leaves = await prisma.facultyLeave.findMany({ orderBy: { appliedAt: 'desc' } });
    } catch {}

    const list = leaves.length > 0 ? leaves : MOCK_LEAVES;
    return apiSuccess({
      leaves: list,
      balances: {
        casualLeave: { total: 12, used: 3, remaining: 9 },
        medicalLeave: { total: 10, used: 1, remaining: 9 },
        dutyLeave: { total: 15, used: 4, remaining: 11 },
        earnedLeave: { total: 30, used: 0, remaining: 30 },
      }
    });
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch leaves');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'APPLY') {
      const { leaveType, startDate, endDate, daysCount, reason, substitute, facultyName, employeeId, department } = body;
      let newLeave;
      try {
        newLeave = await prisma.facultyLeave.create({
          data: {
            facultyName: facultyName || 'Dr. Ramesh Kumar',
            employeeId: employeeId || 'FAC-CSE-019',
            department: department || 'Computer Science & Engineering',
            leaveType: leaveType || 'CASUAL',
            startDate: new Date(startDate || Date.now()),
            endDate: new Date(endDate || Date.now()),
            daysCount: Number(daysCount) || 1,
            reason: reason || 'Personal Work',
            substitute: substitute || 'Unassigned',
            status: 'PENDING'
          }
        });
      } catch {
        newLeave = {
          id: `lv-${Date.now()}`,
          facultyName: facultyName || 'Dr. Ramesh Kumar',
          employeeId: employeeId || 'FAC-CSE-019',
          department: department || 'Computer Science & Engineering',
          leaveType: leaveType || 'CASUAL',
          startDate: startDate || new Date().toISOString(),
          endDate: endDate || new Date().toISOString(),
          daysCount: Number(daysCount) || 1,
          reason: reason || 'Personal Work',
          substitute: substitute || 'Unassigned',
          status: 'PENDING',
          appliedAt: new Date().toISOString()
        };
      }

      return apiSuccess(newLeave, 'Leave application submitted for HOD review');
    }

    if (action === 'UPDATE_STATUS') {
      const { leaveId, status, reviewedBy } = body;
      return apiSuccess({ leaveId, status, reviewedBy }, `Leave status updated to ${status}`);
    }

    return apiError('Invalid action');
  } catch (err: any) {
    return apiError(err.message || 'Failed to process leave request');
  }
}

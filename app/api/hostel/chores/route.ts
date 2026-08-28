import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let chores = [
  {
    id: 'chore-1',
    task: 'Trash Bag Emptying & Recycling Bin Sorting',
    assignedTo: 'Rahul Kumar',
    roomNumber: 'B-304',
    dueDate: 'Today, 8:00 PM',
    isCompleted: false,
    streakDays: 4,
    karmaPoints: 20
  },
  {
    id: 'chore-2',
    task: 'Desk & Study Corner Sanitization & Dusting',
    assignedTo: 'Aditya Singh (You)',
    roomNumber: 'B-304',
    dueDate: 'Tomorrow, 10:00 AM',
    isCompleted: true,
    streakDays: 12,
    karmaPoints: 25
  },
  {
    id: 'chore-3',
    task: 'Water Dispenser Refill & Pantry Snack Restock',
    assignedTo: 'Sameer Sen',
    roomNumber: 'B-304',
    dueDate: 'Friday, 6:00 PM',
    isCompleted: false,
    streakDays: 2,
    karmaPoints: 15
  }
];

export async function GET() {
  return apiSuccess({
    chores,
    roomKarmaPool: 420,
    roomNumber: 'B-304',
    roommates: ['Aditya Singh (You)', 'Rahul Kumar', 'Sameer Sen']
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { choreId, action } = body;

    if (action === 'TOGGLE') {
      chores = chores.map(c => c.id === choreId ? { ...c, isCompleted: !c.isCompleted } : c);
      return apiSuccess(chores, 'Chore status updated', 200);
    }

    if (action === 'ADD') {
      const { task, assignedTo, dueDate } = body;
      const newChore = {
        id: `chore-${Date.now()}`,
        task,
        assignedTo: assignedTo || 'Aditya Singh (You)',
        roomNumber: 'B-304',
        dueDate: dueDate || 'This Weekend',
        isCompleted: false,
        streakDays: 1,
        karmaPoints: 20
      };
      chores.push(newChore);
      return apiSuccess(newChore, 'New roommate chore added to rotation', 201);
    }

    return apiError('Invalid chore operation', 400);
  } catch {
    return apiError('Failed to process chore rotation', 500);
  }
}

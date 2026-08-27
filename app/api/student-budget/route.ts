import { NextResponse } from 'next/server';

let mockExpenses = [
  { id: 'exp-1', title: 'Monthly Cafeteria Meal Plan Top-up', amount: 1850, category: 'Food & Dining', date: '2026-08-25', paymentMethod: 'UPI' },
  { id: 'exp-2', title: 'Microprocessor Reference Handbook', amount: 450, category: 'Books & Supplies', date: '2026-08-22', paymentMethod: 'Card' },
  { id: 'exp-3', title: 'Inter-College Hackathon Registration', amount: 300, category: 'Events & Clubs', date: '2026-08-20', paymentMethod: 'Campus Wallet' },
  { id: 'exp-4', title: 'Stationery & Engineering Chart Papers', amount: 120, category: 'Books & Supplies', date: '2026-08-18', paymentMethod: 'Cash' },
  { id: 'exp-5', title: 'Weekend Shuttle Trip to Metro', amount: 60, category: 'Transit', date: '2026-08-15', paymentMethod: 'Campus Wallet' }
];

export async function GET() {
  const monthlyLimit = 5000;
  const totalSpent = mockExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  return NextResponse.json({
    success: true,
    data: {
      expenses: mockExpenses,
      monthlyLimit,
      totalSpent,
      balanceRemaining: monthlyLimit - totalSpent,
      categoriesBreakdown: {
        'Food & Dining': 1850,
        'Books & Supplies': 570,
        'Events & Clubs': 300,
        'Transit': 60
      }
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, amount, category = 'Food & Dining', paymentMethod = 'UPI' } = body;

    const newExpense = {
      id: `exp-${Date.now()}`,
      title,
      amount: Number(amount) || 0,
      category,
      date: new Date().toISOString().split('T')[0],
      paymentMethod
    };

    mockExpenses = [newExpense, ...mockExpenses];

    return NextResponse.json({
      success: true,
      message: 'Expense recorded successfully',
      data: newExpense
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not record expense' }, { status: 500 });
  }
}

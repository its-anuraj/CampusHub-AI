import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let installmentPlan = {
  totalAnnualFeeInr: 180000,
  paidSoFarInr: 120000,
  outstandingInr: 60000,
  planType: '3-Part Semester Split',
  installments: [
    {
      installmentNumber: 1,
      title: 'Term 1 Admission & Tuition Deposit',
      amountInr: 60000,
      dueDate: '2025-08-10',
      paidDate: '2025-08-08',
      transactionRef: 'UPI-HDFC-9920194',
      status: 'PAID'
    },
    {
      installmentNumber: 2,
      title: 'Term 2 Mid-Year Examination & Lab Fee',
      amountInr: 60000,
      dueDate: '2025-12-15',
      paidDate: '2025-12-12',
      transactionRef: 'UPI-ICICI-8812034',
      status: 'PAID'
    },
    {
      installmentNumber: 3,
      title: 'Term 3 Final Semester Tuition & Hostel Fee',
      amountInr: 60000,
      dueDate: '2026-09-30',
      paidDate: null,
      transactionRef: null,
      status: 'UPCOMING_DUE'
    }
  ],
  upiAutoDebitEnabled: true,
  linkedUpiId: 'anuraj.parent@okaxis'
};

export async function GET() {
  return apiSuccess(installmentPlan);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, upiId } = body;

    if (action === 'TOGGLE_AUTO_DEBIT') {
      installmentPlan.upiAutoDebitEnabled = !installmentPlan.upiAutoDebitEnabled;
      if (upiId) installmentPlan.linkedUpiId = upiId;
      return apiSuccess(installmentPlan, 'UPI e-Mandate auto-debit preference saved', 200);
    }

    if (action === 'PAY_NOW') {
      const pending = installmentPlan.installments.find(i => i.status === 'UPCOMING_DUE');
      if (pending) {
        pending.status = 'PAID';
        pending.paidDate = new Date().toISOString().split('T')[0];
        pending.transactionRef = `UPI-PAY-${Date.now().toString().slice(-6)}`;
        installmentPlan.paidSoFarInr += pending.amountInr;
        installmentPlan.outstandingInr -= pending.amountInr;
      }
      return apiSuccess(installmentPlan, 'Installment fee payment successful', 200);
    }

    return apiError('Invalid installment action', 400);
  } catch {
    return apiError('Failed to process installment payment', 500);
  }
}

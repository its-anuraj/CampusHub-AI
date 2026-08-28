import { NextResponse } from 'next/server';
import { apiSuccess, apiError } from '@/lib/apiResponse';

let tenders = [
  {
    id: 'TEND-2026-88',
    title: 'Procurement of High-Performance GPU Cluster Nodes (NVIDIA H100 Tensor Core)',
    department: 'Advanced Computing Center',
    estimatedBudgetInrLakhs: 140.0,
    biddingDeadline: '2026-09-15',
    bidsReceivedCount: 4,
    lowestBidder: 'Netweb Technologies Ltd (₹134.5 Lakhs - L1)',
    currentStage: 'TECHNICAL_EVALUATION',
    status: 'ACTIVE_TENDER'
  },
  {
    id: 'TEND-2026-72',
    title: 'Annual Campus High-Speed Fiber Backbone & Wi-Fi 7 Access Points Upgrade',
    department: 'IT Infrastructure Directorate',
    estimatedBudgetInrLakhs: 45.0,
    biddingDeadline: '2026-08-30',
    bidsReceivedCount: 5,
    lowestBidder: 'Cisco Systems Partner India (₹41.2 Lakhs - L1)',
    currentStage: 'PURCHASE_ORDER_ISSUED',
    status: 'AWARDED'
  }
];

export async function GET() {
  const totalBudgetLakhs = tenders.reduce((a, t) => a + t.estimatedBudgetInrLakhs, 0);

  return apiSuccess({
    tenders,
    totalBudgetLakhs,
    activeTendersCount: tenders.filter(t => t.status === 'ACTIVE_TENDER').length,
    registeredVendorsCount: 48
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, department, estimatedBudgetInrLakhs, biddingDeadline } = body;

    if (!title || !department || !estimatedBudgetInrLakhs) {
      return apiError('Missing required procurement requisition fields', 400);
    }

    const newTender = {
      id: `TEND-${Date.now().toString().slice(-4)}`,
      title,
      department,
      estimatedBudgetInrLakhs: Number(estimatedBudgetInrLakhs),
      biddingDeadline: biddingDeadline || '2026-10-31',
      bidsReceivedCount: 0,
      lowestBidder: 'Awaiting Bid Opening (L1)',
      currentStage: 'PUBLISHED_E_PORTAL',
      status: 'ACTIVE_TENDER'
    };

    tenders.unshift(newTender);
    return apiSuccess(newTender, 'E-Tender notice floated on Central Public Procurement Portal', 201);
  } catch {
    return apiError('Failed to create procurement tender', 500);
  }
}

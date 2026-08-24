import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_ROOMS = [
  { id: 'h-101', block: 'Block A (Boys - Everest)', roomNumber: '101', capacity: 2, occupied: 1, roomType: 'DOUBLE_AC', floor: 1, monthlyRent: 7500, status: 'AVAILABLE' },
  { id: 'h-102', block: 'Block A (Boys - Everest)', roomNumber: '102', capacity: 2, occupied: 2, roomType: 'DOUBLE_AC', floor: 1, monthlyRent: 7500, status: 'OCCUPIED' },
  { id: 'h-201', block: 'Block A (Boys - Everest)', roomNumber: '201', capacity: 1, occupied: 0, roomType: 'SINGLE_AC', floor: 2, monthlyRent: 11000, status: 'AVAILABLE' },
  { id: 'h-202', block: 'Block A (Boys - Everest)', roomNumber: '202', capacity: 3, occupied: 2, roomType: 'TRIPLE_NON_AC', floor: 2, monthlyRent: 5000, status: 'AVAILABLE' },
  { id: 'h-301', block: 'Block C (Girls - Sarojini)', roomNumber: '101', capacity: 2, occupied: 1, roomType: 'DOUBLE_AC', floor: 1, monthlyRent: 7500, status: 'AVAILABLE' },
  { id: 'h-302', block: 'Block C (Girls - Sarojini)', roomNumber: '102', capacity: 1, occupied: 0, roomType: 'SINGLE_AC', floor: 1, monthlyRent: 11000, status: 'AVAILABLE' },
];

const MOCK_MESS_MENU = {
  day: 'Monday',
  breakfast: 'Idli Sambar, Chutney, Boiled Eggs, Tea/Coffee (07:30 AM - 09:30 AM)',
  lunch: 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Chapati, Salad (12:30 PM - 02:30 PM)',
  snacks: 'Samosa, Veg Sandwich, Masala Chai (05:00 PM - 06:00 PM)',
  dinner: 'Kadai Chicken / Malai Kofta, Mix Veg, Phulka, Gulab Jamun (08:00 PM - 10:00 PM)'
};

const MOCK_MAINTENANCE = [
  { id: 'm-1', studentName: 'Alex Kumar', roomNumber: '101', block: 'Block A', category: 'PLUMBING', issue: 'Washroom tap leakage', status: 'IN_PROGRESS', priority: 'MEDIUM', createdAt: new Date().toISOString() },
  { id: 'm-2', studentName: 'Alex Kumar', roomNumber: '101', block: 'Block A', category: 'INTERNET', issue: 'Wi-Fi router periodic packet drop', status: 'RESOLVED', priority: 'LOW', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export async function GET() {
  try {
    let rooms: any[] = [];
    let maintenance: any[] = [];
    try {
      rooms = await prisma.hostelRoom.findMany();
      maintenance = await prisma.hostelMaintenance.findMany({ orderBy: { createdAt: 'desc' } });
    } catch {
      // fallback
    }

    return apiSuccess({
      rooms: rooms.length > 0 ? rooms : MOCK_ROOMS,
      messMenu: MOCK_MESS_MENU,
      maintenanceRequests: maintenance.length > 0 ? maintenance : MOCK_MAINTENANCE,
      currentAllocation: {
        roomNumber: '101',
        block: 'Block A (Boys - Everest)',
        roomType: 'Double Sharing AC',
        bedNumber: 'Bed 01 (Window Side)',
        roommate: 'Rohan Sharma (CSE - 3rd Year)',
        wardenName: 'Prof. S. R. Verma',
        wardenPhone: '+91 98765 43210',
        gatePassTiming: 'Curfew: 10:00 PM',
        monthlyFee: '₹7,500 / mo',
        feeStatus: 'PAID'
      }
    });
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch hostel data');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'MAINTENANCE_REQUEST') {
      const { category, issue, roomNumber, block, studentName } = body;
      let newReq;
      try {
        newReq = await prisma.hostelMaintenance.create({
          data: {
            studentName: studentName || 'Student User',
            roomNumber: roomNumber || '101',
            block: block || 'Block A',
            category: category || 'OTHER',
            issue: issue || 'General Maintenance',
            priority: body.priority || 'MEDIUM',
            status: 'PENDING'
          }
        });
      } catch {
        newReq = {
          id: `m-${Date.now()}`,
          studentName: studentName || 'Student User',
          roomNumber: roomNumber || '101',
          block: block || 'Block A',
          category: category || 'OTHER',
          issue: issue || 'General Maintenance',
          priority: body.priority || 'MEDIUM',
          status: 'PENDING',
          createdAt: new Date().toISOString()
        };
      }
      return apiSuccess(newReq, 'Maintenance request submitted successfully');
    }

    return apiError('Invalid action');
  } catch (err: any) {
    return apiError(err.message || 'Failed to process hostel request');
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/apiResponse';

const MOCK_ITEMS = [
  { id: 'c-1', name: 'Paneer Butter Masala Thali', stall: 'Main Dining Hall', category: 'LUNCH', price: 120, calories: 550, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80' },
  { id: 'c-2', name: 'Crispy Masala Dosa + Filter Coffee', stall: 'South Indian Corner', category: 'BREAKFAST', price: 70, calories: 380, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80' },
  { id: 'c-3', name: 'Grilled Chicken Brown Bread Sandwich', stall: 'Healthy Bites & Juice Bar', category: 'SNACKS', price: 90, calories: 320, isVeg: false, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80' },
  { id: 'c-4', name: 'Fresh Cold Pressed Orange Juice', stall: 'Healthy Bites & Juice Bar', category: 'BEVERAGES', price: 50, calories: 110, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=80' },
  { id: 'c-5', name: 'Iced Caramel Hazelnut Macchiato', stall: 'Nescafe Express', category: 'BEVERAGES', price: 80, calories: 190, isVeg: true, isAvailable: true, imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&auto=format&fit=crop&q=80' },
];

export async function GET() {
  try {
    let items: any[] = [];
    try {
      items = await prisma.cafeteriaItem.findMany();
    } catch {}

    return apiSuccess(items.length > 0 ? items : MOCK_ITEMS);
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch cafeteria menu');
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, totalAmount, studentName } = body;
    const token = `CHUB-MEAL-${Math.floor(100 + Math.random() * 900)}`;

    return apiSuccess({
      orderId: `ORD-${Date.now()}`,
      token,
      items,
      totalAmount,
      studentName: studentName || 'Alex Kumar',
      pickupEstimatedMinutes: 12,
      status: 'PREPARING'
    }, 'Meal order placed! Present token at pickup counter.');
  } catch (err: any) {
    return apiError(err.message || 'Failed to place meal order');
  }
}

import { NextResponse } from 'next/server';

let mockMessMenu = {
  date: '2026-08-27 (Today)',
  messHall: 'Aryabhata Central Dining Hall',
  hygieneAuditScore: '96/100 (FSSAI 5-Star Certified)',
  meals: [
    {
      mealType: 'Breakfast (07:30 - 09:30 AM)',
      items: 'Idli, Medu Vada, Sambar, Coconut Chutney, Fresh Fruits, Tea/Coffee',
      calories: 480,
      allergens: ['Dairy', 'Gluten Free'],
      parentHealthRating: 4.8
    },
    {
      mealType: 'Lunch (12:30 - 02:30 PM)',
      items: 'Paneer Butter Masala / Chicken Curry, Dal Tadka, Jeera Rice, Phulka Roti, Salad & Curd',
      calories: 720,
      allergens: ['Dairy', 'Wheat'],
      parentHealthRating: 4.6
    },
    {
      mealType: 'Dinner (07:30 - 09:30 PM)',
      items: 'Mix Veg Kadhai, Dal Fry, Steamed Rice, Chapati, Gulab Jamun',
      calories: 650,
      allergens: ['Dairy', 'Wheat'],
      parentHealthRating: 4.7
    }
  ],
  dietaryPreferences: {
    studentPreference: 'Vegetarian (High Protein)',
    allergies: 'None recorded',
    specialDietaryNotes: 'Prefers extra curd & fresh fruit salad during lunch.'
  }
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockMessMenu
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { preference, notes } = body;

    if (preference) mockMessMenu.dietaryPreferences.studentPreference = preference;
    if (notes) mockMessMenu.dietaryPreferences.specialDietaryNotes = notes;

    return NextResponse.json({
      success: true,
      message: 'Student dietary preference updated in kitchen mess roster',
      data: mockMessMenu
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not update dietary preference' }, { status: 500 });
  }
}

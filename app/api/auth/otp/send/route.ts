import { NextResponse } from 'next/server';
import { storeOTP } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.trim().length < 10) {
      return NextResponse.json({ error: 'Valid 10-digit mobile phone number is required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // Generate 6-digit random OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in secure memory cache with 5-min expiration
    storeOTP(cleanPhone, otpCode);

    // SMS Gateway dispatch simulation / provider hook (Twilio/Fast2SMS/MSG91)
    console.log(`[SMS GATEWAY DISPATCH] Sent 6-digit OTP code to +91-${cleanPhone}`);

    return NextResponse.json({
      message: `OTP code sent via SMS to +91 ${cleanPhone}`,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to dispatch SMS OTP' }, { status: 500 });
  }
}

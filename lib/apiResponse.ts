import { NextResponse } from 'next/server';

export interface ApiResponsePayload<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export function apiSuccess<T>(data?: T, message?: string, status: number = 200) {
  const payload: ApiResponsePayload<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status });
}

export function apiError(error: string, status: number = 400, message?: string) {
  const payload: ApiResponsePayload = {
    success: false,
    error,
    message,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status });
}

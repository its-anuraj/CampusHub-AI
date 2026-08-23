import { NextResponse } from 'next/server';

const AUDIT_LOGS = [
  { id: 'LOG-8891', actor: 'ajsinghindolia@gmail.com', role: 'ADMIN', action: 'Admin Superuser Login Success', category: 'AUTH', severity: 'SUCCESS', ipAddress: '103.21.14.88', timestamp: '2026-08-23T23:10:00Z' },
  { id: 'LOG-8890', actor: 'priya.sharma@campushub.edu', role: 'FACULTY', action: 'Published Gradebook for CS501 (Data Structures)', category: 'GRADEBOOK', severity: 'INFO', ipAddress: '192.168.1.45', timestamp: '2026-08-23T22:45:12Z' },
  { id: 'LOG-8889', actor: 'system-gateway', role: 'SYSTEM', action: 'Daily Database Backup & Snapshot Completed (64MB)', category: 'SYSTEM', severity: 'SUCCESS', ipAddress: '127.0.0.1', timestamp: '2026-08-23T22:00:00Z' },
  { id: 'LOG-8888', actor: 'unknown-client', role: 'GUEST', action: 'Failed Login Attempt: Invalid OTP Token (3 retries)', category: 'SECURITY', severity: 'WARNING', ipAddress: '45.112.87.19', timestamp: '2026-08-23T21:30:15Z' },
  { id: 'LOG-8887', actor: 'admin@campushub.edu', role: 'ADMIN', action: 'Fee Structure Updated for Academic Year 2026-27', category: 'FINANCE', severity: 'INFO', ipAddress: '103.21.14.88', timestamp: '2026-08-23T19:15:00Z' },
  { id: 'LOG-8886', actor: 'rahul.gupta@campushub.edu', role: 'FACULTY', action: 'Created Assignment: "SQL Complex Joins & Views"', category: 'ACADEMICS', severity: 'INFO', ipAddress: '192.168.1.52', timestamp: '2026-08-23T18:00:00Z' },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');

    let logs = AUDIT_LOGS;

    if (category && category !== 'ALL') {
      logs = logs.filter((l) => l.category.toUpperCase() === category.toUpperCase());
    }

    if (severity && severity !== 'ALL') {
      logs = logs.filter((l) => l.severity.toUpperCase() === severity.toUpperCase());
    }

    return NextResponse.json({ success: true, logs, total: logs.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

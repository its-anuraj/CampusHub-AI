import { NextResponse } from 'next/server';

let mockAuditLogs = [
  {
    id: 'LOG-88102',
    timestamp: '2026-08-27 10:45:12',
    actorRole: 'ADMIN',
    actorEmail: 'admin@campushub.edu.in',
    action: 'EMERGENCY_SIREN_BROADCAST_TEST',
    ipAddress: '10.0.4.12 (Campus Core Gateway)',
    riskLevel: 'LOW',
    status: 'AUTHORIZED'
  },
  {
    id: 'LOG-88101',
    timestamp: '2026-08-27 09:22:45',
    actorRole: 'FACULTY',
    actorEmail: 'prof.raman@campushub.edu.in',
    action: 'END_SEM_MARKS_BATCH_UPDATE',
    ipAddress: '192.168.1.104 (Faculty Academic VLAN)',
    riskLevel: 'MEDIUM',
    status: 'AUTHORIZED'
  },
  {
    id: 'LOG-88100',
    timestamp: '2026-08-26 23:14:02',
    actorRole: 'STUDENT',
    actorEmail: '24cs089@campushub.edu.in',
    action: 'UNAUTHORIZED_ADMIN_PANEL_PROBE',
    ipAddress: '103.21.144.90 (External VPN)',
    riskLevel: 'HIGH',
    status: 'BLOCKED_BY_WAF'
  },
  {
    id: 'LOG-88099',
    timestamp: '2026-08-26 18:30:10',
    actorRole: 'ADMIN',
    actorEmail: 'security@campushub.edu.in',
    action: 'ROLE_RBAC_PERMISSION_GRANT',
    ipAddress: '10.0.4.15',
    riskLevel: 'LOW',
    status: 'AUTHORIZED'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      logs: mockAuditLogs,
      securityScore: '98/100 (Hardened)',
      wafBlocks24h: 18,
      privilegedSessionsActive: 3
    }
  });
}

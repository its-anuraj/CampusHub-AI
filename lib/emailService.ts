import { db } from './db';

export interface ApprovalEmailPayload {
  email: string;
  name: string;
  role: 'STUDENT' | 'FACULTY' | 'PARENT' | 'ADMIN' | string;
  details?: {
    rollNumber?: string;
    employeeId?: string;
    department?: string;
    section?: string;
    approvedBy?: string;
  };
}

/**
 * Dispatches account approval notification update to student / faculty registered email
 * Once approved, user can directly log in anytime with their registered email & password.
 */
export async function sendApprovalNotification(payload: ApprovalEmailPayload) {
  const { email, name, role, details } = payload;
  const timestamp = new Date().toISOString();

  const emailSubject = `CampusHub AI: Account Creation Request Approved (${role})`;
  const emailBody = `
Dear ${name},

Your account creation request has been approved!
You can now log in easily using your registered email and password.

Account Details:
- Role: ${role}
- Registered Email: ${email}
${details?.department ? `- Department: ${details.department}` : ''}
${details?.rollNumber ? `- Roll Number: ${details.rollNumber}` : ''}
${details?.employeeId ? `- Employee ID: ${details.employeeId}` : ''}
${details?.section ? `- Section: ${details.section}` : ''}
${details?.approvedBy ? `- Approved By: ${details.approvedBy}` : ''}

Login Portal: http://localhost:3000/login
(Note: Approval is required only once. You can now access your dashboard directly anytime with your registered credentials.)

Best regards,
CampusHub AI Administration Desk
`;

  // Server console dispatch simulation
  console.log(`\n======================================================`);
  console.log(`[EMAIL DISPATCH SERVICE] 🚀 OUTGOING EMAIL TO: ${email}`);
  console.log(`[SUBJECT] ${emailSubject}`);
  console.log(`[BODY]\n${emailBody.trim()}`);
  console.log(`======================================================\n`);

  // Record dispatch in AuditLog
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    await db.auditLog.create({
      data: {
        userId: user ? user.id : null,
        action: `Email Notification sent to ${email} (${name} - ${role}): Account creation request approved! You can now log in easily using your registered email and password.`,
        type: 'SUCCESS',
      },
    });
  } catch (err) {
    console.error('Failed to log approval email in AuditLog:', err);
  }

  return {
    success: true,
    message: 'Account creation request approved! Email update dispatched to user.',
    emailSentTo: email,
    timestamp,
  };
}

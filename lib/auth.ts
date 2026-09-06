export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  studentProfile?: any;
  facultyProfile?: any;
  parentProfile?: any;
  adminProfile?: any;
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export function getDashboardRoute(role: string): string {
  switch (role) {
    case 'ADMIN': return '/dashboard/admin';
    case 'FACULTY': return '/dashboard/faculty';
    case 'STUDENT': return '/dashboard/student';
    case 'PARENT': return '/dashboard/parent';
    default: return '/login';
  }
}

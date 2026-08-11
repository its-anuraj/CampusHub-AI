import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

export function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getAttendanceColor(percentage: number): string {
  if (percentage >= 85) return 'text-green-500';
  if (percentage >= 75) return 'text-yellow-500';
  return 'text-red-500';
}

export function getAttendanceBg(percentage: number): string {
  if (percentage >= 85) return 'bg-green-500';
  if (percentage >= 75) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function getGradeColor(grade: string): string {
  if (['A+', 'A'].includes(grade)) return 'text-green-500';
  if (['B+', 'B'].includes(grade)) return 'text-blue-500';
  if (['C+', 'C'].includes(grade)) return 'text-yellow-500';
  return 'text-red-500';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE': case 'PRESENT': case 'PAID': case 'RESOLVED': return 'badge-success';
    case 'PENDING': case 'IN_PROGRESS': case 'UPCOMING': return 'badge-warning';
    case 'INACTIVE': case 'ABSENT': case 'OVERDUE': case 'LATE': return 'badge-danger';
    case 'SUBMITTED': case 'GRADED': case 'OPEN': return 'badge-info';
    default: return 'badge-info';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'URGENT': return 'badge-danger';
    case 'HIGH': return 'badge-warning';
    case 'MEDIUM': return 'badge-info';
    default: return '';
  }
}

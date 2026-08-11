'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('campushub_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      switch (user.role) {
        case 'ADMIN': router.replace('/dashboard/admin'); break;
        case 'FACULTY': router.replace('/dashboard/faculty'); break;
        case 'STUDENT': router.replace('/dashboard/student'); break;
        case 'PARENT': router.replace('/dashboard/parent'); break;
        default: router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <span className="text-white font-bold text-2xl">C</span>
        </div>
        <p className="text-slate-400 text-sm">Loading CampusHub AI...</p>
      </div>
    </div>
  );
}

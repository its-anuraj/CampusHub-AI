'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import Header from '@/components/shared/Header';
import AccessibilityToolbar from '@/components/shared/AccessibilityToolbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('campushub_user');
    if (!userStr) {
      router.replace('/login');
      return;
    }
    setUser(JSON.parse(userStr));
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          C
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex font-sans">
      {/* Mobile Overlay */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        mobileOpen={sidebarMobileOpen}
        onMobileClose={() => setSidebarMobileOpen(false)}
      />

      {/* Main Container */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <Header
          user={user}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onMobileMenuOpen={() => setSidebarMobileOpen(true)}
        />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Global Accessibility Suite */}
      <AccessibilityToolbar />
    </div>
  );
}

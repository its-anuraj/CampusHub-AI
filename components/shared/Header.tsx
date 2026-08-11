'use client';

import { useState } from 'react';
import { Menu, Bell, Search, PanelLeftClose, PanelLeft, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  user: any;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onMobileMenuOpen: () => void;
}

export default function Header({ user, sidebarOpen, onToggleSidebar, onMobileMenuOpen }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'Mid-Semester exam schedule published', time: '2h ago', unread: true },
    { id: 2, text: 'Assignment "BST Implementation" due tomorrow', time: '4h ago', unread: true },
    { id: 3, text: 'TCS Placement drive registration opened', time: '1d ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>

        {/* Global Search Bar */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-64 lg:w-80 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/10 transition-all">
          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search courses, notices, records..."
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
          />
          <kbd className="hidden sm:inline-block text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">⌘K</kbd>
        </div>

        <div className="flex-1" />

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* AI Helper Quick Tag */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI OS Online</span>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-slate-900 font-semibold text-xs">Notifications</p>
                  <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-medium">3 unread</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {notifications.map(n => (
                    <div key={n.id} className={cn('p-3 hover:bg-slate-50 transition-colors cursor-pointer', n.unread && 'bg-blue-50/20')}>
                      <p className="text-slate-800 text-xs leading-snug">{n.text}</p>
                      <p className="text-slate-400 text-[10px] mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Badge */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              {user?.name?.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-500 capitalize leading-tight mt-0.5">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

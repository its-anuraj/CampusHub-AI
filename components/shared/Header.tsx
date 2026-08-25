'use client';

import { useState } from 'react';
import { Menu, Bell, Search, PanelLeftClose, PanelLeft, ChevronDown, Sparkles, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

import CommandPalette from '@/components/shared/CommandPalette';
import ThemeCustomizerModal from '@/components/shared/ThemeCustomizerModal';
import NotificationCenter from '@/components/shared/NotificationCenter';

interface HeaderProps {
  user: any;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onMobileMenuOpen: () => void;
}

export default function Header({ user, sidebarOpen, onToggleSidebar, onMobileMenuOpen }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  return (
    <>
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        userRole={user?.role}
      />
      <ThemeCustomizerModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
      />
      <NotificationCenter
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
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

          {/* Global Search Bar (opens Command Palette) */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-1.5 w-64 lg:w-80 text-left transition-all cursor-pointer group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
            <span className="text-xs text-slate-400 group-hover:text-slate-600 flex-1 truncate">
              Search courses, modules, actions...
            </span>
            <kbd className="hidden sm:inline-block text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono shadow-2xs">
              ⌘K
            </kbd>
          </button>

          <div className="flex-1" />

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Theme Palette Customizer Button */}
          <button
            onClick={() => setThemeModalOpen(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
            title="Customize Campus Theme"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* AI Helper Quick Tag */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI OS Online</span>
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setNotifOpen(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors relative cursor-pointer"
            title="Open Notification Center"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </button>

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
    </>
  );
}

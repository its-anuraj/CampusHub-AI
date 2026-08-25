import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CampusHub AI – Smart Campus Management Platform',
  description: 'Enterprise AI-Powered Smart Campus Operating System for Students, Faculty, Admin, and Parents.',
  keywords: 'campus management, student portal, faculty portal, attendance, assignments, placement, AI',
  authors: [{ name: 'CampusHub AI Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/globe.svg',
    apple: '/globe.svg',
  },
};

import { ToastProvider } from '@/lib/toastContext';
import { ThemeProvider } from '@/lib/themeContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-[#FAFAFA] text-slate-900`}>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

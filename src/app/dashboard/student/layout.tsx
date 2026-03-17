'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Trophy, Users, Image, User, ChevronLeft, Home, LogOut, Menu, X, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadUsers } from '@/lib/adminData';

const ImageIcon = Image;

const STUDENT_NAV = [
  { href: '/dashboard/student/overview', icon: <LayoutDashboard size={16} />, label: 'Overview' },
  { href: '/dashboard/student/my-events', icon: <Calendar size={16} />, label: 'My Events' },
  { href: '/dashboard/student/queries', icon: <MessageSquare size={16} />, label: 'Queries' },
  { href: '/dashboard/student/leaderboard', icon: <Trophy size={16} />, label: 'Leaderboard' },
  { href: '/dashboard/student/community', icon: <Users size={16} />, label: 'Community' },
  { href: '/dashboard/student/media', icon: <ImageIcon size={16} />, label: 'Media' },
  { href: '/dashboard/student/profile', icon: <User size={16} />, label: 'Profile' },
];

const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sessionRaw = localStorage.getItem('gdgoc-student-session');
    if (!sessionRaw) {
      router.replace('/login');
      return;
    }

    try {
      const session = JSON.parse(sessionRaw) as { email?: string };
      const users = loadUsers();
      const user = users.find(u => u.email.toLowerCase() === (session.email || '').toLowerCase());
      if (user?.banned) {
        localStorage.removeItem('gdgoc-student-session');
        router.replace('/login');
      }
    } catch {
      localStorage.removeItem('gdgoc-student-session');
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('gdgoc-student-session');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#030303] flex">
      {/* Sidebar – desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen sticky top-0 border-r border-white/5 transition-all duration-300 bg-[#060606]',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/5">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {GOOGLE_COLORS.map((c, i) => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />)}
              </div>
              <span className="text-xs font-mono text-white/60 uppercase tracking-widest">Student</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-white/30 hover:text-white transition-colors ml-auto">
            <ChevronLeft size={14} className={cn('transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {STUDENT_NAV.map(({ href, icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'sidebar-link',
                  active && 'active',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? label : undefined}
              >
                {icon}
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <Link href="/" className={cn('sidebar-link', collapsed && 'justify-center px-2')} title={collapsed ? 'Back to Site' : undefined}>
            <Home size={16} />
            {!collapsed && <span>Back to Site</span>}
          </Link>
          <button onClick={handleLogout} className={cn('sidebar-link w-full', collapsed && 'justify-center px-2')} title={collapsed ? 'Logout' : undefined}>
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#060606] border-b border-white/5 flex items-center px-4 gap-3">
        <button onClick={() => setMobileOpen(true)} className="text-white/50 hover:text-white">
          <Menu size={20} />
        </button>
        <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Student Dashboard</span>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-black/80"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-[#060606] border-r border-white/5 p-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Student</span>
                <button onClick={() => setMobileOpen(false)} className="text-white/30 hover:text-white"><X size={16} /></button>
              </div>
              <nav className="flex flex-col gap-1">
                {STUDENT_NAV.map(({ href, icon, label }) => (
                  <Link key={href} href={href} className={cn('sidebar-link', pathname === href && 'active')} onClick={() => setMobileOpen(false)}>
                    {icon}<span>{label}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-white/10 space-y-1">
                <Link href="/" className="sidebar-link" onClick={() => setMobileOpen(false)}>
                  <Home size={16} />
                  <span>Back to Site</span>
                </Link>
                <button onClick={handleLogout} className="sidebar-link w-full">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-auto md:h-screen md:overflow-y-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, Trophy, Image, Megaphone,
  LineChart, Settings, ChevronLeft, Home, LogOut, Menu, X, ShieldCheck, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getModulesForRole, DashboardModule } from '@/lib/rolePermissions';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';

const ImageIcon = Image;

const ALL_ADMIN_NAV: { module: DashboardModule; href: string; icon: React.ReactNode; label: string }[] = [
  { module: 'overview', href: '/dashboard/admin/overview', icon: <LayoutDashboard size={16} />, label: 'Overview' },
  { module: 'events', href: '/dashboard/admin/events', icon: <Calendar size={16} />, label: 'Events' },
  { module: 'users', href: '/dashboard/admin/users', icon: <Users size={16} />, label: 'Users' },
  { module: 'queries', href: '/dashboard/admin/queries', icon: <MessageSquare size={16} />, label: 'Queries' },
  { module: 'leaderboard', href: '/dashboard/admin/leaderboard', icon: <Trophy size={16} />, label: 'Leaderboard' },
  { module: 'media', href: '/dashboard/admin/media', icon: <ImageIcon size={16} />, label: 'Media' },
  { module: 'announcements', href: '/dashboard/admin/announcements', icon: <Megaphone size={16} />, label: 'Announcements' },
  { module: 'analytics', href: '/dashboard/admin/analytics', icon: <LineChart size={16} />, label: 'Analytics' },
  { module: 'settings', href: '/dashboard/admin/settings', icon: <Settings size={16} />, label: 'Settings' },
];

const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

function AdminDashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentRole } = useAdminAuth();

  useEffect(() => {
    const session = localStorage.getItem('gdgoc-admin-session');
    if (!session) router.replace('/admin');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('gdgoc-admin-session');
    localStorage.removeItem('adminRole');
    router.push('/admin');
  };

  const handleBackToSite = () => {
    const session = localStorage.getItem('gdgoc-admin-session');
    const role = localStorage.getItem('adminRole');
    if (session) localStorage.setItem('gdgoc-admin-session', session);
    if (role) localStorage.setItem('adminRole', role);
    router.push('/');
  };

  const allowedModules = getModulesForRole(currentRole);
  const visibleNav = ALL_ADMIN_NAV.filter(n => allowedModules.includes(n.module));

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
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {GOOGLE_COLORS.map((c, i) => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />)}
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest leading-none">Admin</div>
                <div className="text-[9px] font-mono text-g-red uppercase tracking-widest opacity-60">{currentRole}</div>
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-white/30 hover:text-white ml-auto">
            <ChevronLeft size={14} className={cn('transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {visibleNav.map(({ href, icon, label }) => {
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
                {!collapsed && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-g-blue flex-shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <button onClick={handleBackToSite} className={cn('sidebar-link w-full', collapsed && 'justify-center px-2')}>
            <Home size={16} />
            {!collapsed && <span>Back to Site</span>}
          </button>
          <button onClick={handleLogout} className={cn('sidebar-link w-full', collapsed && 'justify-center px-2')}>
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
        <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Admin Dashboard</span>
        <div className="ml-auto flex items-center gap-2 bg-g-red/10 border border-g-red/20 rounded px-2 py-1">
          <ShieldCheck size={11} className="text-g-red" />
          <span className="text-[10px] font-mono text-g-red uppercase">{currentRole}</span>
        </div>
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
                <span className="text-xs font-mono text-g-red uppercase tracking-widest">{currentRole} Admin</span>
                <button onClick={() => setMobileOpen(false)} className="text-white/30 hover:text-white"><X size={16} /></button>
              </div>
              <nav className="flex flex-col gap-1">
                {visibleNav.map(({ href, icon, label }) => (
                  <Link key={href} href={href} className={cn('sidebar-link', pathname === href && 'active')} onClick={() => setMobileOpen(false)}>
                    {icon}<span>{label}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-white/10 space-y-1">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleBackToSite();
                  }}
                  className="sidebar-link w-full"
                >
                  <Home size={16} />
                  <span>Back to Site</span>
                </button>
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

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminDashboardContent>{children}</AdminDashboardContent>
    </AdminAuthProvider>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/Chatbot';

const MAINTENANCE_KEY = 'gdgoc-maintenance-mode';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      if (typeof window === 'undefined') return;
      const value = window.localStorage.getItem(MAINTENANCE_KEY) === 'on';
      setMaintenanceEnabled(value);
    };

    syncFromStorage();
    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('maintenance-mode-changed', syncFromStorage as EventListener);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('maintenance-mode-changed', syncFromStorage as EventListener);
    };
  }, []);

  const hideLayoutChrome = useMemo(() => {
    return (
      pathname.startsWith('/dashboard') ||
      pathname === '/login' ||
      pathname === '/admin' ||
      pathname === '/maintenance'
    );
  }, [pathname]);

  const maintenanceBypass = useMemo(() => {
    return pathname.startsWith('/dashboard/admin') || pathname === '/admin';
  }, [pathname]);

  const showMaintenanceScreen = maintenanceEnabled && !maintenanceBypass;
  const showChrome = !hideLayoutChrome && !showMaintenanceScreen;

  return (
    <>
      {showChrome && <Navbar />}
      <main className="min-h-screen">
        {showMaintenanceScreen ? (
          <section className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-xl w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 text-center">
              <p className="text-xs font-mono uppercase tracking-widest text-g-yellow mb-3">Maintenance Mode</p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">We&apos;ll Be Back Soon</h1>
              <p className="text-white/55">
                The platform is temporarily under maintenance. Please check back shortly.
              </p>
            </div>
          </section>
        ) : (
          children
        )}
      </main>
      {showChrome && <Footer />}
      {showChrome && <Chatbot />}
    </>
  );
}

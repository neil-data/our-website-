'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/community', label: 'Community' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/media', label: 'Media' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [studentLoggedIn, setStudentLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncState = () => {
      setAdminLoggedIn(Boolean(localStorage.getItem('gdgoc-admin-session')));
      setStudentLoggedIn(Boolean(localStorage.getItem('gdgoc-student-session')));
    };

    syncState();
    window.addEventListener('storage', syncState);
    const interval = setInterval(syncState, 2000);

    return () => {
      window.removeEventListener('storage', syncState);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/logo.png"
                alt="GDGOC IAR logo"
                width={28}
                height={28}
                className="rounded-sm"
                priority
              />
              <span className="font-heading font-bold text-white text-sm tracking-wide">
                GDGOC <span className="text-white/40">×</span>{' '}
                <span className="text-g-blue">IAR</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'animated-underline px-3 py-2 text-xs font-mono uppercase tracking-widest transition-colors',
                      active ? 'text-white' : 'text-white/50 hover:text-white'
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              {adminLoggedIn && (
                <Link
                  href="/dashboard/admin/overview"
                  className="text-xs font-mono uppercase tracking-widest text-g-red/80 hover:text-g-red transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              {studentLoggedIn && (
                <Link
                  href="/dashboard/student/overview"
                  className="text-xs font-mono uppercase tracking-widest text-g-green/80 hover:text-g-green transition-colors"
                >
                  Student Panel
                </Link>
              )}
              {!studentLoggedIn && !adminLoggedIn && (
                <>
                  <Link
                    href="/login"
                    className="text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login?mode=register"
                    className="btn-skew bg-g-blue border border-g-blue/80 text-white text-xs font-mono uppercase tracking-widest px-5 py-2 hover:bg-g-blue/80 transition-colors"
                  >
                    <span>Join Now</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#0a0a0a] border-l border-white/5 p-8 flex flex-col gap-2 pt-20">
              {NAV_LINKS.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={href}
                    className={cn(
                      'block py-3 px-4 text-sm font-mono uppercase tracking-widest border-l-2 transition-colors',
                      pathname === href
                        ? 'text-white border-g-blue'
                        : 'text-white/40 border-transparent hover:text-white hover:border-white/20'
                    )}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                {adminLoggedIn && (
                  <Link
                    href="/dashboard/admin/overview"
                    className="block w-full text-center btn-skew bg-g-red/90 text-white text-xs font-mono uppercase tracking-widest py-3 hover:bg-g-red transition-colors"
                  >
                    <span>Admin Panel</span>
                  </Link>
                )}
                {studentLoggedIn && (
                  <Link
                    href="/dashboard/student/overview"
                    className="block w-full text-center btn-skew bg-g-green/90 text-white text-xs font-mono uppercase tracking-widest py-3 hover:bg-g-green transition-colors"
                  >
                    <span>Student Panel</span>
                  </Link>
                )}
                {!studentLoggedIn && !adminLoggedIn && (
                  <Link
                    href="/login?mode=register"
                    className="block w-full text-center btn-skew bg-g-blue text-white text-xs font-mono uppercase tracking-widest py-3 hover:bg-g-blue/80 transition-colors"
                  >
                    <span>Join the Community</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const isIarEmail = (value: string) => {
  const clean = normalizeEmail(value);
  return clean.endsWith('@iar.ac.in') && clean.indexOf('@') === clean.lastIndexOf('@') && clean.indexOf('@') > 0;
};

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('leader');
  const [error, setError] = useState('');

  useEffect(() => {
    const adminSession = localStorage.getItem('gdgoc-admin-session');
    if (adminSession) router.replace('/dashboard/admin/overview');
  }, [router]);

  const signIn = (signInEmail: string) => {
    const cleanEmail = normalizeEmail(signInEmail);
    const displayName = cleanEmail.split('@')[0];
    localStorage.setItem('adminRole', role);
    localStorage.setItem('gdgoc-admin-session', JSON.stringify({ name: displayName, email: cleanEmail, role }));
    router.push('/dashboard/admin/overview');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isIarEmail(email)) {
      setError('Please use your @iar.ac.in email.');
      return;
    }
    setError('');
    signIn(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-bg">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-radial from-g-red/5 via-transparent to-transparent" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-g-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-g-red/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <Image
              src="/logo.png"
              alt="GDGOC IAR logo"
              width={30}
              height={30}
              className="rounded-sm"
              priority
            />
            <span className="font-heading font-bold text-white text-sm tracking-wide">
              GDGOC × <span className="text-g-red">ADMIN</span>
            </span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-white mt-2">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage the platform</p>
        </div>

        <div className="glass-card rounded-2xl p-8 glow-border-red">
          <AnimatePresence mode="wait">
            <motion.form
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="admin@iar.ac.in"
                  className="form-input"
                  autoComplete="email"
                  required
                />
              </div>

              {error && <p className="text-xs text-g-red font-mono">{error}</p>}

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Admin Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="form-input"
                >
                  <option value="leader" className="bg-dark-card">Leader (Full Access)</option>
                  <option value="tech" className="bg-dark-card">Tech</option>
                  <option value="marketing" className="bg-dark-card">Marketing</option>
                  <option value="documentation" className="bg-dark-card">Documentation</option>
                  <option value="operations" className="bg-dark-card">Operations</option>
                  <option value="outreach" className="bg-dark-card">Outreach</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="form-input pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-skew w-full text-center block text-white text-xs font-mono uppercase tracking-widest py-3.5 transition-all bg-g-red border border-g-red hover:bg-g-red/80"
              >
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck size={13} /> Access Admin Dashboard
                  <ArrowRight size={13} />
                </span>
              </button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-white/20 text-xs font-mono mt-6">© 2025 GDGOC IAR Admin</p>
      </div>
    </div>
  );
}

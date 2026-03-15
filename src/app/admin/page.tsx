'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react';

type Tab = 'student' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('student');
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('leader');

  const isAdmin = tab === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdmin) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminRole', role);
      }
      router.push('/dashboard/admin/overview');
    } else {
      router.push('/dashboard/student/overview');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-bg">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-radial from-g-blue/5 via-transparent to-transparent" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-g-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-g-green/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Logo */}
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
              GDGOC × <span className="text-g-blue">IAR</span>
            </span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-white mt-2">Welcome Back</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to your community account</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 glow-border-blue">
          {/* Tab Toggle */}
          <div className="flex gap-2 mb-8 p-1 glass-card rounded-xl">
            <button
              onClick={() => setTab('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${
                tab === 'student' ? 'bg-g-blue/20 text-white border border-g-blue/30' : 'text-white/40 hover:text-white'
              }`}
            >
              <GraduationCap size={14} />
              Student
            </button>
            <button
              onClick={() => setTab('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${
                tab === 'admin' ? 'bg-g-red/20 text-white border border-g-red/30' : 'text-white/40 hover:text-white'
              }`}
            >
              <ShieldCheck size={14} />
              Admin
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Email */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">
                  {isAdmin ? 'Admin Email' : 'Student Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={isAdmin ? 'admin@iar.ac.in' : 'student@iar.ac.in'}
                  className="form-input"
                  autoComplete="email"
                />
              </div>

              {/* Admin Role Select */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
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
                </motion.div>
              )}

              {/* Password */}
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

              {/* Forgot password */}
              {!isAdmin && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs font-mono text-white/35 hover:text-g-blue transition-colors">Forgot password?</a>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`btn-skew w-full text-center block text-white text-xs font-mono uppercase tracking-widest py-3.5 transition-all ${
                  isAdmin ? 'bg-g-red border border-g-red hover:bg-g-red/80' : 'bg-g-blue border border-g-blue hover:bg-g-blue/80'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isAdmin ? 'Access Admin Dashboard' : 'Sign In to Dashboard'}
                  <ArrowRight size={13} />
                </span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-white/6" />
                <span className="text-white/25 text-xs font-mono">OR</span>
                <div className="flex-1 h-px bg-white/6" />
              </div>

              {/* Google Sign-in */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 rounded border border-white/10 hover:border-white/25 hover:bg-white/3 transition-all text-sm text-white/70"
              >
                <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                  <path d="M47.532 24.552c0-1.636-.142-3.21-.408-4.728H24v9.013h13.204c-.569 3.067-2.298 5.669-4.892 7.414v6.164h7.92c4.635-4.272 7.3-10.567 7.3-17.863z" fill="#4285F4"/>
                  <path d="M24 48c6.636 0 12.198-2.202 16.264-5.972l-7.92-6.163c-2.194 1.47-5.001 2.338-8.344 2.338-6.418 0-11.854-4.337-13.8-10.167H2.012v6.364C6.06 43.117 14.452 48 24 48z" fill="#34A853"/>
                  <path d="M10.2 28.036A14.478 14.478 0 019.456 24c0-1.41.242-2.78.744-4.036v-6.364H2.012A23.989 23.989 0 000 24c0 3.87.927 7.526 2.012 10.4l8.188-6.364z" fill="#FBBC05"/>
                  <path d="M24 9.576c3.623 0 6.868 1.246 9.422 3.692l7.073-7.073C36.19 2.381 30.628 0 24 0 14.452 0 6.06 4.883 2.012 13.6l8.188 6.364C12.146 13.913 17.582 9.576 24 9.576z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {!isAdmin && (
                <p className="text-center text-xs text-white/30">
                  Don&apos;t have an account?{' '}
                  <Link href="/login" className="text-g-blue hover:text-white transition-colors">Join the community</Link>
                </p>
              )}
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-white/20 text-xs font-mono mt-6">
          © 2025 GDGOC IAR. Secured by Google Auth.
        </p>
      </div>
    </div>
  );
}

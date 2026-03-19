'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { getFirebaseAuth } from '@/lib/firebaseClient';
import { upsertUserFromSession } from '@/lib/adminData';

type Mode = 'signin' | 'register';

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const isIarEmail = (value: string) => {
  const clean = normalizeEmail(value);
  return clean.endsWith('@iar.ac.in') && clean.indexOf('@') === clean.lastIndexOf('@') && clean.indexOf('@') > 0;
};

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [iarNo, setIarNo] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'register') {
      setMode('register');
    }
  }, []);

  const signInStudent = async (signInEmail: string, profileName?: string) => {
    const cleanEmail = normalizeEmail(signInEmail);
    const displayName = profileName?.trim() || name.trim() || cleanEmail.split('@')[0];
    const sessionPayload = {
      name: displayName,
      email: cleanEmail,
      iarNo: iarNo.trim(),
      department: department.trim(),
      year,
    };
    const synced = await upsertUserFromSession(sessionPayload);
    if (!synced.user) {
      setError(synced.error || 'Unable to sign in.');
      return;
    }
    localStorage.setItem('gdgoc-student-session', JSON.stringify(sessionPayload));
    router.push('/dashboard/student/overview');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isIarEmail(email)) {
      setError('Please use your @iar.ac.in email.');
      return;
    }
    if (mode === 'register' && (!name.trim() || !iarNo.trim() || !department.trim() || !year)) {
      setError('Please fill all required registration details.');
      return;
    }
    setError('');
    await signInStudent(email, name);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
        hd: 'iar.ac.in',
      });

      const result = await signInWithPopup(auth, provider);
      const googleEmail = normalizeEmail(result.user.email || '');

      if (!isIarEmail(googleEmail)) {
        await signOut(auth);
        setError('Google sign-in is only allowed for @iar.ac.in accounts.');
        return;
      }

      const googleName = result.user.displayName || name;
      if (!name.trim() && result.user.displayName) {
        setName(result.user.displayName);
      }

      setEmail(googleEmail);
      await signInStudent(googleEmail, googleName);
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-bg">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-radial from-g-blue/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-g-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-g-green/5 rounded-full blur-3xl" />

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
              GDGOC x <span className="text-g-blue">IAR</span>
            </span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-white mt-2">{mode === 'register' ? 'Join the Community' : 'Welcome Back'}</h1>
          <p className="text-white/40 text-sm mt-1">{mode === 'register' ? 'Create your student account' : 'Sign in to your community account'}</p>
        </div>

        <div className="glass-card rounded-2xl p-8 glow-border-blue">
          <div className="flex gap-2 mb-6 p-1 glass-card rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${
                mode === 'signin' ? 'bg-g-blue/20 text-white border border-g-blue/30' : 'text-white/40 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${
                mode === 'register' ? 'bg-g-green/20 text-white border border-g-green/30' : 'text-white/40 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="form-input" autoComplete="name" required />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">IAR No</label>
                    <input type="text" value={iarNo} onChange={e => setIarNo(e.target.value)} placeholder="IAR student number" className="form-input" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Department</label>
                      <input type="text" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g., CSE" className="form-input" required />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Year</label>
                      <select value={year} onChange={e => setYear(e.target.value)} className="form-input" required>
                        <option value="" className="bg-dark-card">Select</option>
                        <option value="1st" className="bg-dark-card">1st Year</option>
                        <option value="2nd" className="bg-dark-card">2nd Year</option>
                        <option value="3rd" className="bg-dark-card">3rd Year</option>
                        <option value="4th" className="bg-dark-card">4th Year</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Student Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="student@iar.ac.in"
                  className="form-input"
                  autoComplete="email"
                  required
                />
              </div>

              {error && <p className="text-xs text-g-red font-mono">{error}</p>}

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="********"
                    className="form-input pr-10"
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
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

              {mode === 'signin' && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs font-mono text-white/35 hover:text-g-blue transition-colors">Forgot password?</a>
                </div>
              )}

              <button
                type="submit"
                className="btn-skew w-full text-center block text-white text-xs font-mono uppercase tracking-widest py-3.5 transition-all bg-g-blue border border-g-blue hover:bg-g-blue/80"
              >
                <span className="flex items-center justify-center gap-2">
                  {mode === 'register' ? 'Complete Registration' : 'Sign In to Dashboard'}
                  <ArrowRight size={13} />
                </span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-white/6" />
                <span className="text-white/25 text-xs font-mono">OR</span>
                <div className="flex-1 h-px bg-white/6" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded border border-white/10 hover:border-white/25 hover:bg-white/3 transition-all text-sm text-white/70"
              >
                <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
                  <path d="M47.532 24.552c0-1.636-.142-3.21-.408-4.728H24v9.013h13.204c-.569 3.067-2.298 5.669-4.892 7.414v6.164h7.92c4.635-4.272 7.3-10.567 7.3-17.863z" fill="#4285F4"/>
                  <path d="M24 48c6.636 0 12.198-2.202 16.264-5.972l-7.92-6.163c-2.194 1.47-5.001 2.338-8.344 2.338-6.418 0-11.854-4.337-13.8-10.167H2.012v6.364C6.06 43.117 14.452 48 24 48z" fill="#34A853"/>
                  <path d="M10.2 28.036A14.478 14.478 0 019.456 24c0-1.41.242-2.78.744-4.036v-6.364H2.012A23.989 23.989 0 000 24c0 3.87.927 7.526 2.012 10.4l8.188-6.364z" fill="#FBBC05"/>
                  <path d="M24 9.576c3.623 0 6.868 1.246 9.422 3.692l7.073-7.073C36.19 2.381 30.628 0 24 0 14.452 0 6.06 4.883 2.012 13.6l8.188 6.364C12.146 13.913 17.582 9.576 24 9.576z" fill="#EA4335"/>
                </svg>
                {googleLoading ? 'Signing in...' : 'Continue with Google'}
              </button>

              {mode === 'signin' ? (
                <p className="text-center text-xs text-white/30">
                  Don&apos;t have an account?{' '}
                  <button type="button" onClick={() => setMode('register')} className="text-g-blue hover:text-white transition-colors">Join the community</button>
                </p>
              ) : (
                <p className="text-center text-xs text-white/30">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setMode('signin')} className="text-g-blue hover:text-white transition-colors">Sign in</button>
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

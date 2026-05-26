'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="graph-background" />
      <div className="hero-gradient fixed inset-0 pointer-events-none" />

      {/* Floating orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#00f0ff]/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#eab308]/10 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center transition-all group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Zap className="w-6 h-6 text-[#00f0ff]" />
            </div>
            <span className="font-display text-3xl font-bold tracking-tight text-white">Orbyn</span>
          </Link>
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-white">Welcome back</h1>
          <p className="text-gray-400 mt-2">Sign in to your knowledge universe</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 bg-[#0a0a0c]/80 backdrop-blur-2xl border-t border-l border-t-white/10 border-l-white/10 border-b-black border-r-black rounded-2xl shadow-2xl">
          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className={cn(
              'w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border',
              'border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-semibold text-white',
              'hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={cn(
                  'w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10',
                  'text-white placeholder-gray-600 text-sm',
                  'focus:outline-none focus:border-[#eab308] focus:shadow-[0_0_15px_rgba(234,179,8,0.2)]',
                  'transition-all'
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={cn(
                    'w-full px-4 py-3 pr-10 rounded-xl bg-[#050505] border border-white/10',
                    'text-white placeholder-gray-600 text-sm',
                    'focus:outline-none focus:border-[#eab308] focus:shadow-[0_0_15px_rgba(234,179,8,0.2)]',
                    'transition-all'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-3.5 mt-4 rounded-xl bg-[#00f0ff] text-black font-bold text-sm',
                'hover:bg-[#00dbe9] transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(0,240,255,0.4)]',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
                'flex items-center justify-center gap-2'
              )}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-[#00f0ff] hover:text-white transition-colors font-semibold">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Loader2, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const PERKS = [
  'Visual knowledge graph — your ideas as connected bubbles',
  'Save links, notes, PDFs, videos, and more',
  'AI-powered topic classification and summaries',
  '4 stunning themes including Planets and Noir',
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      setLoading(false);
      return;
    }

    // Auto sign in after registration
    await signIn('credentials', { email, password, redirect: false });
    router.push('/dashboard');
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="graph-background" />
      <div className="hero-gradient fixed inset-0 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#00f0ff]/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#eab308]/10 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-4xl px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Value prop */}
          <div className="hidden lg:block">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center transition-all group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <Zap className="w-6 h-6 text-[#00f0ff]" />
              </div>
              <span className="font-display text-3xl font-bold tracking-tight text-white">Orbyn</span>
            </Link>
            <h1 className="text-5xl font-display font-extrabold mb-4 leading-tight text-white tracking-tight">
              Build your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00f0ff]">knowledge universe</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">
              Everything you save becomes a node in your personal knowledge graph. 
              Watch your ideas connect, cluster, and reveal patterns you never noticed.
            </p>
            <ul className="space-y-4">
              {PERKS.map((p, i) => (
                <li key={i} className="flex items-start gap-4 text-base">
                  <div className="mt-1 w-6 h-6 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                    <Check className="w-3.5 h-3.5 text-[#00f0ff]" />
                  </div>
                  <span className="text-gray-300">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form */}
          <div>
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center transition-all group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                  <Zap className="w-5 h-5 text-[#00f0ff]" />
                </div>
                <span className="font-display text-2xl font-bold tracking-tight text-white">Orbyn</span>
              </Link>
            </div>

            <div className="glass-card p-8 bg-[#0a0a0c]/80 backdrop-blur-2xl border-t border-l border-t-white/10 border-l-white/10 border-b-black border-r-black rounded-2xl shadow-2xl">
              <h2 className="text-2xl font-display font-extrabold mb-1 tracking-tight text-white">Create your account</h2>
              <p className="text-gray-400 text-sm mb-8">Free forever. No credit card.</p>

              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className={cn(
                  'w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border',
                  'border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-semibold text-white',
                  'hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {googleLoading ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Sign up with Google
              </button>

              <div className="flex items-center gap-3 my-8">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">or with email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#eab308] focus:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" htmlFor="signup-email">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#eab308] focus:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300" htmlFor="signup-password">Password</label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      className="w-full px-4 py-3 pr-10 rounded-xl bg-[#050505] border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#eab308] focus:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                      {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {password && (
                    <div className="flex gap-1 mt-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors',
                          password.length > i * 2 + 1 ? 'bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-white/10')} />
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 mt-4 rounded-xl bg-[#00f0ff] text-black font-bold text-sm hover:bg-[#00dbe9] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Create Account
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-8">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#00f0ff] hover:text-white transition-colors font-semibold">Sign in</Link>
              </p>

              <p className="text-center text-xs text-muted-foreground/60 mt-4">
                By creating an account you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

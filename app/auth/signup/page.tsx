'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Loader2, Zap, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const PERKS = [
  'Visual knowledge graph — your ideas as connected bubbles',
  'Save links, notes, PDFs, videos, and more',
  'AI-powered topic classification and summaries',
  'Stunning themes and intelligent insights',
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020617]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-4xl px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Value prop */}
          <div className="hidden lg:block space-y-8">
            <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] group transition-all duration-500 hover:scale-105 hover:bg-primary/20 hover:border-primary/40">
              <Zap className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] transition-all" />
            </Link>
            <h1 className="text-5xl font-display font-bold mb-6 leading-tight text-white tracking-tight">
              Build your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-400">knowledge universe</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed font-light">
              Everything you save becomes a node in your personal knowledge graph. 
              Watch your ideas connect, cluster, and reveal patterns you never noticed.
            </p>
            <ul className="space-y-5">
              {PERKS.map((p, i) => (
                <li key={i} className="flex items-start gap-4 text-base">
                  <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-gray-300 font-light">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form */}
          <div>
            <div className="lg:hidden text-center mb-10">
              <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
                <Zap className="w-8 h-8 text-primary" />
              </Link>
            </div>

            <div className="bg-[#09090b]/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />
              
              <h2 className="text-3xl font-display font-bold mb-2 tracking-tight text-white">Create your account</h2>
              <p className="text-gray-400 font-light mb-8">Free forever. No credit card required.</p>

              {/* Google OAuth */}
              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
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

              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-xs text-gray-500 font-medium">OR EMAIL</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300 shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1" htmlFor="signup-email">Email Address</label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300 shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300 ml-1" htmlFor="signup-password">Create Password</label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      className="w-full px-4 py-3.5 pr-12 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300 shadow-inner"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="flex gap-1.5 mt-3 px-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors duration-300',
                          password.length > i * 2 + 1 ? 'bg-primary shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-white/10')} />
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full py-3.5 mt-6 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-70"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>Create Account</span>
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-8">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-white hover:text-primary transition-colors font-medium">Sign in</Link>
              </p>

              <p className="text-center text-[10px] text-gray-600 mt-6 leading-relaxed font-light px-4">
                By creating an account you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

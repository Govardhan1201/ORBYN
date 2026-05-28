'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, Zap } from 'lucide-react';
import { Suspense } from 'react';

function ErrorCard() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration. Please check your environment variables.',
    AccessDenied: 'Access was denied. This usually happens if you cancel the login or if your account does not have permission.',
    Verification: 'The verification link has expired or has already been used.',
    Default: 'An unexpected authentication error occurred. Please try again.',
  };

  const message = error ? (errorMessages[error] || errorMessages.Default) : errorMessages.Default;

  return (
    <div className="relative z-10 w-full max-w-md px-6">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center transition-all group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Zap className="w-6 h-6 text-[#00f0ff]" />
          </div>
          <span className="font-display text-3xl font-bold tracking-tight text-white">Orbyn</span>
        </Link>
        <h1 className="text-3xl font-display font-extrabold tracking-tight text-white">Authentication Error</h1>
        <p className="text-gray-400 mt-2">Something went wrong during sign-in</p>
      </div>

      {/* Glassmorphic Error Card */}
      <div className="glass-card p-8 bg-[#0a0a0c]/80 backdrop-blur-2xl border-t border-l border-t-white/10 border-l-white/10 border-b-black border-r-black rounded-2xl shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Sign In Failed</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{message}</p>
          {error && (
            <p className="text-xs text-gray-600 font-mono mt-2 bg-black/40 py-1.5 px-3 rounded-lg border border-white/5 inline-block">
              Code: {error}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-white/5">
          <Link
            href="/auth/login"
            className="w-full py-3.5 rounded-xl bg-[#00f0ff] hover:bg-[#00dbe9] text-black font-bold text-sm transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="graph-background" />
      <div className="hero-gradient fixed inset-0 pointer-events-none" />

      {/* Floating Orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#00f0ff]/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-destructive/5 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      <Suspense fallback={
        <div className="relative z-10 w-full max-w-md px-6 text-center text-white">
          Loading error details...
        </div>
      }>
        <ErrorCard />
      </Suspense>
    </div>
  );
}

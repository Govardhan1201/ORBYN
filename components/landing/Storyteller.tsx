'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LandingUniverse3D } from '@/components/graph/LandingUniverse3D';
import Link from 'next/link';
import { BrainCircuit, Sparkles, Network, Rocket, Zap, ArrowRight, Database } from 'lucide-react';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export function Storyteller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLDivElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = [heroRef.current, saveRef.current, connectRef.current, exploreRef.current];
      
      sections.forEach((sec) => {
        if (!sec) return;
        ScrollTrigger.create({
          trigger: sec,
          start: "top top",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          animation: gsap.to(sec.querySelector('.content-block'), {
            opacity: 0,
            y: -50,
            ease: "power2.inOut",
          }),
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-transparent">
      {/* 3D Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <LandingUniverse3D />
      </div>

      {/* Floating Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#eab308]/10 border border-[#00f0ff]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] group-hover:border-[#00f0ff]/60">
              <Zap className="w-5 h-5 text-[#00f0ff]" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-white">
              Orbyn<span className="text-[#00f0ff]">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/auth/login" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors duration-300">
              Log in
            </Link>
            <Link 
              href="/auth/signup" 
              className="text-sm font-bold px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#eab308] to-[#facc15] text-black hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* SECTION 1: HERO */}
        <section ref={heroRef} className="h-screen w-full flex items-center justify-center px-6">
          <div className="content-block text-center max-w-4xl pt-24 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 text-[#00f0ff] text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.08)]"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>THE VISUAL KNOWLEDGE SYSTEM</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-6xl md:text-8xl font-display font-black leading-tight tracking-tight text-white drop-shadow-2xl"
            >
              Enter the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#00f0ff]">Universe.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed"
            >
              Orbyn transforms your scattered thoughts, links, and media into a living, breathing 3D knowledge graph.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="pt-4"
            >
              <Link 
                href="/auth/signup" 
                className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-[#eab308] text-black font-extrabold text-lg hover:bg-[#facc15] transition-all duration-300 shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95"
              >
                <Rocket className="w-5 h-5" />
                Launch Workspace
              </Link>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: SAVE ANYTHING */}
        <section ref={saveRef} className="h-screen w-full flex items-center justify-start px-6 md:px-24">
          <div className="content-block max-w-xl glass-card p-12 bg-[#0a0a0c]/40 border border-[#00f0ff]/15 hover:border-[#00f0ff]/40 shadow-[0_0_50px_rgba(0,240,255,0.05)] hover:shadow-[0_0_50px_rgba(0,240,255,0.15)] rounded-3xl transition-all duration-500 backdrop-blur-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f0ff]/5 rounded-full blur-3xl group-hover:bg-[#00f0ff]/10 transition-all duration-500 pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 flex items-center justify-center mb-8 border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.2)] group-hover:scale-110 transition-transform duration-500">
              <Database className="w-8 h-8 text-[#00f0ff]" />
            </div>
            <span className="text-xs font-mono tracking-widest text-[#00f0ff]/60 uppercase block mb-3">// MODULE_01 // SECURE CAPTURE</span>
            <h2 className="text-4xl md:text-5xl font-display font-black mb-6 tracking-tight bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">Save Anything.</h2>
            <p className="text-lg text-gray-300/80 leading-relaxed font-light">
              Drop PDFs, YouTube links, quick notes, and images directly into the void. Our AI automatically extracts meaning and generates beautiful constituent nodes for you.
            </p>
          </div>
        </section>

        {/* SECTION 3: CONNECT IDEAS */}
        <section ref={connectRef} className="h-screen w-full flex items-center justify-end px-6 md:px-24">
          <div className="content-block max-w-xl glass-card p-12 bg-[#0a0a0c]/40 border border-[#00f0ff]/15 hover:border-[#00f0ff]/40 shadow-[0_0_50px_rgba(0,240,255,0.05)] hover:shadow-[0_0_50px_rgba(0,240,255,0.15)] rounded-3xl transition-all duration-500 backdrop-blur-2xl relative overflow-hidden group text-right">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#00f0ff]/5 rounded-full blur-3xl group-hover:bg-[#00f0ff]/10 transition-all duration-500 pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 flex items-center justify-center mb-8 border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.2)] group-hover:scale-110 transition-transform duration-500 ml-auto">
              <Network className="w-8 h-8 text-[#00f0ff]" />
            </div>
            <span className="text-xs font-mono tracking-widest text-[#00f0ff]/60 uppercase block mb-3">// MODULE_02 // SYNERGIC MAPPING</span>
            <h2 className="text-4xl md:text-5xl font-display font-black mb-6 tracking-tight bg-gradient-to-bl from-white via-white to-gray-500 bg-clip-text text-transparent">Connect Ideas.</h2>
            <p className="text-lg text-gray-300/80 leading-relaxed font-light">
              No rigid folders. Orbyn uses elastic, physical wires to connect related ideas together. Watch your brain assemble itself in real-time as the physics engine structures your data.
            </p>
          </div>
        </section>

        {/* SECTION 4: EXPLORE MEANING */}
        <section ref={exploreRef} className="h-screen w-full flex items-center justify-start px-6 md:px-24">
          <div className="content-block max-w-xl glass-card p-12 bg-[#0a0a0c]/40 border border-[#00f0ff]/15 hover:border-[#00f0ff]/40 shadow-[0_0_50px_rgba(0,240,255,0.05)] hover:shadow-[0_0_50px_rgba(0,240,255,0.15)] rounded-3xl transition-all duration-500 backdrop-blur-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f0ff]/5 rounded-full blur-3xl group-hover:bg-[#00f0ff]/10 transition-all duration-500 pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 flex items-center justify-center mb-8 border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.2)] group-hover:scale-110 transition-transform duration-500">
              <BrainCircuit className="w-8 h-8 text-[#00f0ff]" />
            </div>
            <span className="text-xs font-mono tracking-widest text-[#00f0ff]/60 uppercase block mb-3">// MODULE_03 // NEURAL INSIGHTS</span>
            <h2 className="text-4xl md:text-5xl font-display font-black mb-6 tracking-tight bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">Explore Meaning.</h2>
            <p className="text-lg text-gray-300/80 leading-relaxed font-light">
              Dive into your nodes. When you select a thought, related concepts pull themselves closer, and the irrelevant noise fades into the dark vacuum of space.
            </p>
          </div>
        </section>

        {/* SECTION 5: CTA */}
        <section ref={ctaRef} className="min-h-screen w-full flex items-center justify-center px-6">
          <div className="content-block text-center max-w-3xl glass-card p-16 bg-[#0a0a0c]/60 border border-[#00f0ff]/20 shadow-[0_0_80px_rgba(0,240,255,0.1)] rounded-3xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#00f0ff]/15 to-transparent blur-[120px] -z-10 animate-pulse" />
            
            <h2 className="text-5xl md:text-6xl font-display font-black mb-6 text-white tracking-tight leading-tight">Your Second Brain <br />is Ready.</h2>
            <p className="text-xl text-gray-400 mb-12 font-light">Stop searching. Start exploring.</p>
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-[#00f0ff] text-black font-extrabold text-xl hover:bg-[#00dbe9] transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

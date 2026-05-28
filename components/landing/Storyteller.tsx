'use client';

import { LandingUniverse3D } from '@/components/graph/LandingUniverse3D';
import Link from 'next/link';
import { BrainCircuit, Sparkles, Network, Rocket, Zap, ArrowRight, Database, Search, Share2, Layers } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function Storyteller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax effects
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -150]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full min-h-[200vh] bg-transparent">
      {/* 3D Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <LandingUniverse3D />
      </div>

      {/* Floating Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Orbyn
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-300">
              Log in
            </Link>
            <Link 
              href="/auth/signup" 
              className="text-sm font-semibold px-5 py-2.5 rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <motion.section 
        style={{ y: yHero, opacity: opacityHero }}
        className="relative z-10 h-screen w-full flex flex-col items-center justify-center px-6"
      >
        <div className="text-center max-w-5xl space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/80 text-xs font-mono tracking-widest backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>ORBYN INTELLIGENCE ENGINE</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl"
          >
            Think in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Dimensions.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed tracking-wide"
          >
            The world's most advanced spatial knowledge graph. Connect your thoughts organically in a 3D physical space driven by AI.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/auth/signup" 
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-base hover:bg-gray-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Start Building
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/auth/login" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 text-white font-medium text-base hover:bg-white/10 backdrop-blur-md transition-all duration-300"
            >
              View Demo Graph
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* BENTO BOX GRID SECTION */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-40 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Bento Item 1: Large Capture (Spans 2 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-2 glass-card p-10 flex flex-col justify-between group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Database className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-2">Universal Capture</h3>
              <p className="text-white/50 text-lg max-w-md font-light leading-relaxed">Drop anything into the void. Articles, PDFs, videos, or fleeting thoughts. Orbyn parses everything instantly.</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 border border-white/5 rounded-3xl bg-black/50 backdrop-blur-md transform rotate-12 group-hover:rotate-6 transition-transform duration-700 bento-inner-shadow flex items-center justify-center">
              <span className="text-white/20 font-mono text-sm">DATA_STREAM_ACTIVE</span>
            </div>
          </motion.div>

          {/* Bento Item 2: Physics Engine */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glass-card p-10 flex flex-col justify-between group overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none group-hover:from-yellow-500/10 transition-all duration-700" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                <Network className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-2">Neural Link</h3>
              <p className="text-white/50 font-light leading-relaxed">Nodes naturally attract based on semantic meaning.</p>
            </div>
          </motion.div>

          {/* Bento Item 3: Deep Search */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-card p-10 flex flex-col justify-between group overflow-hidden relative"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />
             <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <Search className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">Omni Search</h3>
              <p className="text-white/50 font-light leading-relaxed">Find connections you didn't know existed.</p>
            </div>
          </motion.div>

          {/* Bento Item 4: Wide Feature (Spans 2 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="md:col-span-2 glass-card p-10 flex flex-col justify-between group overflow-hidden relative"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-emerald-500/10 blur-[60px] pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center h-full">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <BrainCircuit className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-display font-bold text-white mb-2">AI Architect</h3>
                <p className="text-white/50 text-lg max-w-sm font-light leading-relaxed">The embedded AI autonomously organizes, tags, and writes summaries for your knowledge clusters.</p>
              </div>
              <div className="hidden md:flex flex-1 justify-end">
                <div className="w-64 h-48 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl relative overflow-hidden bento-inner-shadow">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-400 shadow-[0_0_20px_#34d399]" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CALL TO ACTION BOTTOM */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="glass-card p-16 md:p-24 relative overflow-hidden group"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent blur-[120px] -z-10 group-hover:from-white/10 transition-all duration-700" />
          
          <h2 className="text-5xl md:text-6xl font-display font-black mb-6 text-white tracking-tighter">Your Mind, <br />Expanded.</h2>
          <p className="text-xl text-white/50 mb-10 font-light">Join the future of knowledge management.</p>
          <Link 
            href="/auth/signup" 
            className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95"
          >
            Create Free Account
            <Rocket className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

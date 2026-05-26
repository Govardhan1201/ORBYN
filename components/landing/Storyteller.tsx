'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LandingUniverse3D } from '@/components/graph/LandingUniverse3D';
import Link from 'next/link';
import { BrainCircuit, Sparkles, Network, Fingerprint, Layers, Rocket, Zap, ArrowRight, Database } from 'lucide-react';
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
      // Pinning the sections
      const sections = [heroRef.current, saveRef.current, connectRef.current, exploreRef.current];
      
      sections.forEach((sec, i) => {
        if (!sec) return;
        ScrollTrigger.create({
          trigger: sec,
          start: "top top",
          end: "+=100%", // Pin for 1 screen height
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
      {/* 3D Background - Fixed position so it stays behind everything */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <LandingUniverse3D />
      </div>

      {/* Floating Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#09090b]/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shadow-glow-blue">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">Orbyn</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link 
              href="/auth/signup" 
              className="text-sm font-medium px-4 py-2 rounded-md bg-white text-black hover:bg-white/90 transition-all shadow-glow-blue"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* SECTION 1: HERO */}
        <section ref={heroRef} className="h-screen w-full flex items-center justify-center px-6">
          <div className="content-block text-center max-w-4xl pt-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>The Visual Knowledge OS</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-6xl md:text-8xl font-display font-extrabold mb-6 leading-tight tracking-tight text-white drop-shadow-2xl"
            >
              Enter the <br />
              <span className="text-gradient">Universe.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light"
            >
              Orbyn transforms your scattered thoughts, links, and media into a living, breathing 3D knowledge graph.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <Link 
                href="/auth/signup" 
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-all shadow-glow-blue hover:scale-105 active:scale-95"
              >
                <Rocket className="w-5 h-5" />
                Launch Workspace
              </Link>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: SAVE ANYTHING */}
        <section ref={saveRef} className="h-screen w-full flex items-center justify-start px-6 md:px-20">
          <div className="content-block max-w-xl glass-card p-10 border-primary/20 backdrop-blur-2xl">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-8 border border-primary/30 shadow-glow-blue">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">Save Anything.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Drop PDFs, YouTube links, quick notes, and images directly into the void. Our AI automatically extracts meaning and generates beautiful constituent nodes for you.
            </p>
          </div>
        </section>

        {/* SECTION 3: CONNECT IDEAS */}
        <section ref={connectRef} className="h-screen w-full flex items-center justify-end px-6 md:px-20">
          <div className="content-block max-w-xl glass-card p-10 border-purple-500/20 backdrop-blur-2xl text-right">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-8 border border-purple-500/30 shadow-glow-purple ml-auto">
              <Network className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">Connect Ideas.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              No more rigid folders. Orbyn uses elastic, physical wires to connect related ideas together. Watch your brain assemble itself in real-time as the physics engine structures your data.
            </p>
          </div>
        </section>

        {/* SECTION 4: EXPLORE MEANING */}
        <section ref={exploreRef} className="h-screen w-full flex items-center justify-start px-6 md:px-20">
          <div className="content-block max-w-xl glass-card p-10 border-amber-500/20 backdrop-blur-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-8 border border-amber-500/30 shadow-glow-gold">
              <BrainCircuit className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">Explore Meaning.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Dive into your nodes. When you select a thought, related concepts pull themselves closer, and the irrelevant noise fades into the dark vacuum of space.
            </p>
          </div>
        </section>

        {/* SECTION 5: CTA */}
        <section ref={ctaRef} className="min-h-screen w-full flex items-center justify-center px-6">
          <div className="content-block text-center max-w-3xl glass-card p-16 border-white/10 backdrop-blur-3xl relative overflow-hidden">
            {/* Inner glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[100px] -z-10" />
            
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-8 text-white">Your Second Brain is Ready.</h2>
            <p className="text-2xl text-muted-foreground mb-10">Stop searching. Start exploring.</p>
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-white text-black font-bold text-xl hover:bg-white/90 transition-all shadow-glow-blue hover:scale-105 active:scale-95"
            >
              Start Building Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

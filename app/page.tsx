"use client";
import Link from "next/link";
import { ArrowRight, Code, Brain, Cpu, Sparkles, Zap, BookOpen, Layers } from "lucide-react";
import { motion, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import Magnetic from "@/components/Magnetic";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

// Dynamic Imports for below-the-fold sections
const StatsSection = dynamic(() => import("@/components/home/StatsSection"), { ssr: false });
const DisciplinesSection = dynamic(() => import("@/components/home/DisciplinesSection"), { ssr: false });
const FooterCTA = dynamic(() => import("@/components/home/FooterCTA"), { ssr: false });
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";

/* --- Animation Variants --- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

/* --- Typewriter --- */
function Typewriter({ words, isLight }: { words: string[]; isLight: boolean }) {
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    const speed = deleting ? 40 : 80;
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (chars < word.length) setChars(c => c + 1);
        else setTimeout(() => setDeleting(true), 2000);
      } else {
        if (chars > 0) setChars(c => c - 1);
        else { setDeleting(false); setIndex(i => (i + 1) % words.length); }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [chars, deleting, index, words]);

  return (
    <span className="inline-flex items-center">
      <span className={`text-transparent bg-clip-text ${isLight ? 'bg-gradient-to-r from-indigo-600 to-cyan-600' : 'bg-gradient-to-r from-indigo-400 to-cyan-400'}`}>
        {words[index].slice(0, chars)}
      </span>
      <motion.span 
        animate={{ opacity: [1, 0] }} 
        transition={{ duration: 0.8, repeat: Infinity }} 
        className={`w-[2px] h-[1em] ml-1 ${isLight ? "bg-indigo-600" : "bg-indigo-400"}`}
      />
    </span>
  );
}

const features = [
  { icon: <Zap size={18} />, label: "Real-time Simulations" },
  { icon: <BookOpen size={18} />, label: "Guided Learning Paths" },
  { icon: <Layers size={18} />, label: "Interactive Sandboxes" },
  { icon: <Sparkles size={18} />, label: "AI-Powered Insights" },
];

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.1], [1, 0.98]), { stiffness: 200, damping: 25 });
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to dark theme before mount to avoid blank screen
  const isLight = mounted && resolvedTheme === "light";

  return (
    <div className="relative min-h-screen selection:bg-indigo-500/30 overflow-x-hidden home-container">
      {/* --- HERO SECTION --- */}
      <motion.section
        style={{ scale, opacity }}
        className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between z-10 px-6 lg:px-16 pt-20 pb-16 overflow-hidden gap-12"
      >
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20 z-[1]"
          fill="white"
          fillOpacity="0.55"
        />

        <div className="hero-glow" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 max-w-2xl text-left relative z-10"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              Next-Gen Learning Engine V2.0
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={itemVariants} className="home-title mb-6 !text-left leading-tight">
            THINK++
          </motion.h1>

          {/* Subtitle */}
          <motion.div variants={itemVariants} className="flex flex-col items-start gap-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)] leading-snug" style={{ fontFamily: "'Outfit', sans-serif" }}>
              The ultimate high-fidelity laboratory for engineers.
            </h2>
            
            <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-xl leading-relaxed font-medium opacity-80">
              Master complex concepts through immersive interactivity. Learn algorithms, neural networks, and computer systems in a high-density, hands-on environment.
            </p>
            
            <p className="text-[var(--text-secondary)] text-xs md:text-sm max-w-xl leading-relaxed font-medium opacity-50">
              THINK++ brings dry engineering theories to life using real-time interactive simulations and stunning 3D visualizations.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-start gap-4 mt-8">
            <Magnetic>
              <Link href="/curriculum" className="btn-primary group !px-8 !py-4 !text-md">
                Start Learning
                <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/playground" className="btn-secondary !px-8 !py-4 !text-md">
                Playground
              </Link>
            </Magnetic>
          </motion.div>

          {/* Feature Pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-start gap-3 mt-10">
            {features.map((f, i) => (
              <div 
                key={i}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-black dark:text-white text-[9px] font-black uppercase tracking-widest transition-all hover:border-indigo-500/40 hover:-translate-y-0.5 shadow-premium"
              >
                <span className="text-indigo-600 dark:text-indigo-400">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right column: Graphic */}
        <div className="flex-1 w-full h-[400px] lg:h-[600px] relative z-10 flex items-center justify-center">
          <div className="w-full h-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
             <SplineScene 
               scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
               className="w-full h-full"
             />
          </div>
        </div>
      </motion.section>

      {/* --- BELOW THE FOLD SECTIONS (Optimized with dynamic imports) --- */}
      <StatsSection />
      <DisciplinesSection />
      <FooterCTA />
    </div>
  );
}
"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";
import { useTheme } from "next-themes";
import { SimulationStudio } from "@/components/SimulationStudio";
import { motion } from "framer-motion";
import { 
  Database, Activity, BookOpen, Target, ArrowRight, 
  Layers, Layout, Zap, Search, Box, List, Scissors
} from "lucide-react";

const COLORS = {
  bg: "#030712",
  textWhite: "#f3f4f6"
};

export default function RemoveDuplicates() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [array, setArray] = useState<number[]>([1, 1, 2, 2, 2, 3, 4, 4]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const steps = useMemo(() => [
    { type: "init", message: "Goal: Remove duplicates from sorted array in-place.", line: 0, k: 1, i: 1, arr: [1, 1, 2, 2, 2, 3, 4, 4] },
    { type: "check", message: "Index 1: 1 == 1. Duplicate found. Skip.", line: 1, k: 1, i: 1, arr: [1, 1, 2, 2, 2, 3, 4, 4] },
    { type: "move", message: "Index 2: 2 != 1. Unique found. Copy 2 to index 1. k++", line: 2, k: 2, i: 2, arr: [1, 2, 2, 2, 2, 3, 4, 4] },
    { type: "check", message: "Index 3: 2 == 2. Duplicate found. Skip.", line: 1, k: 2, i: 3, arr: [1, 2, 2, 2, 2, 3, 4, 4] },
    { type: "move", message: "Index 5: 3 != 2. Unique found. Copy 3 to index 2. k++", line: 2, k: 3, i: 5, arr: [1, 2, 3, 2, 2, 3, 4, 4] },
    { type: "done", message: "Duplicates removed. Unique count k = 4.", line: 3, k: 4, i: -1, arr: [1, 2, 3, 4, 2, 3, 4, 4] },
  ], []);

  const step = steps[Math.min(stepIdx, steps.length - 1)] || steps[0];

  const next = useCallback(() => setStepIdx(p => Math.min(p + 1, steps.length - 1)), [steps.length]);
  const prev = useCallback(() => setStepIdx(p => Math.max(0, p - 1)), []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(next, speed);
    return () => clearInterval(timer);
  }, [isPlaying, speed, next]);

  const visualization = (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 gap-8">
      <div className="bg-slate-900 border border-emerald-500/30 px-6 py-4 rounded-2xl flex flex-col gap-1 min-w-[140px]">
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Unique Count (k)</span>
        <span className="text-2xl font-black text-white">{step.k}</span>
      </div>
      <div className="flex gap-2 items-center">
        {step.arr.map((val, i) => (
          <div key={i} className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ 
                backgroundColor: i < step.k ? "#10B981" : i === step.i ? "#6366F1" : "rgba(255, 255, 255, 0.05)",
                scale: i === step.i ? 1.2 : 1,
                borderColor: i < step.k ? "#34D399" : i === step.i ? "#818CF8" : "rgba(255,255,255,0.1)",
                opacity: i >= step.k && i !== step.i ? 0.3 : 1
              }}
              className="w-14 h-14 rounded-xl border flex items-center justify-center text-lg font-bold shadow-2xl"
            >
              {val}
            </motion.div>
            <span className="text-[10px] text-slate-600 font-mono">[{i}]</span>
          </div>
        ))}
      </div>
    </div>
  );

  const explanation = (
    <div className="space-y-6">
      <h3 className="text-emerald-400 font-bold flex items-center gap-2">
        <Scissors size={18} /> In-Place Deduping
      </h3>
      <p className="text-sm text-slate-300 leading-relaxed">
        Removing duplicates from a sorted array can be done in O(n) time and O(1) space using a two-pointer approach. We maintain a pointer for the last unique element found.
      </p>
      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Algorithm Strategy</h4>
        <ul className="text-xs text-slate-400 space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
            <span>Since the array is sorted, duplicates are always adjacent.</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
            <span>Pointer <code>k</code> tracks the position for the next unique element.</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
            <span>Overwrite duplicates with the next unique element found during the scan.</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const complexity = (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-6 bg-slate-800/50 border border-white/5 rounded-3xl text-center">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time</div>
        <div className="text-3xl font-black text-emerald-400">O(n)</div>
      </div>
      <div className="p-6 bg-slate-800/50 border border-white/5 rounded-3xl text-center">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Space</div>
        <div className="text-3xl font-black text-indigo-400">O(1)</div>
      </div>
    </div>
  );

  const code = (
    <div className="bg-[#020617] p-6 rounded-3xl border border-white/5 font-mono text-xs text-slate-400 overflow-x-auto h-full">
      {[
        "int k = 1;",
        "for (int i = 1; i < n; i++) {",
        "  if (arr[i] != arr[i-1])",
        "    arr[k++] = arr[i];",
        "}",
        "return k;"
      ].map((line, i) => (
        <div key={i} className={`py-1 ${step.line === i ? "bg-indigo-500/20 text-indigo-100" : ""}`}>
          {i + 1}  {line}
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#030712] text-[#f3f4f6]">
      <section className="pt-40 px-6 pb-24 border-b border-white/5 bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.08),transparent_50%)]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 block">Array Operations • Cleanup</span>
          <h1 className="text-[clamp(48px,8vw,96px)] font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">Remove Duplicates</h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mb-12">
            The power of pointers. Learn the optimal way to clean up sorted datasets 
            by collapsing redundant values into a unique sequence.
          </p>
          <div className="flex gap-4 mb-16">
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex flex-col gap-1 min-w-[140px]">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">O(n)</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex flex-col gap-1 min-w-[140px]">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Space</span>
              <span className="text-2xl font-black text-indigo-400 font-mono">O(1)</span>
            </div>
          </div>
          <div className="flex">
            <a href="#simulator" className="bg-emerald-600 text-white px-10 py-4 font-black rounded-full uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)]">Launch Lab</a>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="bg-white/5 border border-white/5 p-12 rounded-[2rem]">
            <div className="mb-6"><ArrowRight size={24} className="text-emerald-400" /></div>
            <h2 className="text-xl font-black mb-4">In-Place Write</h2>
            <p className="text-sm text-slate-400 leading-relaxed">We reuse the existing array's memory, overwriting duplicates as we find new unique elements.</p>
          </article>
          <article className="bg-white/5 border border-white/5 p-12 rounded-[2rem]">
            <div className="mb-6"><Zap size={24} className="text-amber-400" /></div>
            <h2 className="text-xl font-black mb-4">Sorted Prerequisite</h2>
            <p className="text-sm text-slate-400 leading-relaxed">This algorithm leverages the fact that in a sorted array, all duplicates are grouped together.</p>
          </article>
          <article className="bg-white/5 border-b-4 border-emerald-500 p-12 rounded-[2rem] bg-gradient-to-br from-emerald-500/5 to-transparent">
            <div className="mb-6"><Activity size={24} className="text-indigo-400" /></div>
            <h2 className="text-xl font-black mb-4">Linear Scan</h2>
            <p className="text-sm text-slate-400 leading-relaxed">By processing each element exactly once, we achieve the theoretical best time complexity.</p>
          </article>
        </div>
      </section>

      <section id="simulator" className="px-6 pb-32 max-w-[1400px] mx-auto mt-[-40px]">
        <div className="h-[800px] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl bg-[#0a0d14]">
          <SimulationStudio
            title="Remove Duplicates Lab"
            topic="Arrays"
            description="Visualizing the unique element pointer strategy."
            visualization={visualization}
            explanation={explanation}
            complexity={complexity}
            code={code}
            notes={<div className="p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-[10px] text-slate-400 italic">"The elements beyond index k-1 are ignored in the final result."</div>}
            onNext={next}
            onPrev={prev}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onReset={() => { setStepIdx(0); setIsPlaying(false); }}
            onStepForward={next}
            onStepBackward={prev}
            isPlaying={isPlaying}
            speed={speed}
            onSpeedChange={setSpeed}
            activeTopicId="arrays"
          />
        </div>
      </section>
    </main>
 );
}

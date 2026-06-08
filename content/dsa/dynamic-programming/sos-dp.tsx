"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

// Sum Over Subsets (SOS) DP
interface SOSStep {
  type: string;
  i: number;
  mask: number;
  val: number;
  dp: number[];
  message: string;
  line?: number;
}

function simulateSOSDP(): SOSStep[] {
  const steps: SOSStep[] = [];
  const N = 2; // 2 bits
  const A = [1, 2, 4, 8]; // Values for mask 00, 01, 10, 11
  const dp = [...A];

  steps.push({ type: "init", i: -1, mask: -1, val: 0, dp: [...dp], message: "Initialize DP array with base values for each mask (00, 01, 10, 11).", line: 0 });

  for (let i = 0; i < N; i++) {
    steps.push({ type: "outer", i, mask: -1, val: 0, dp: [...dp], message: `Processing Bit ${i}. We want to add subset sums differing only at bit ${i}.`, line: 1 });
    
    for (let mask = 0; mask < (1 << N); mask++) {
      if ((mask & (1 << i))) {
        const subMask = mask ^ (1 << i); // Turn off the i-th bit
        steps.push({ type: "check", i, mask, val: 0, dp: [...dp], message: `Mask ${mask.toString(2).padStart(2, '0')} has bit ${i} ON. Its submask is ${subMask.toString(2).padStart(2, '0')}.`, line: 2 });
        
        dp[mask] += dp[subMask];
        steps.push({ type: "update", i, mask, val: dp[mask], dp: [...dp], message: `Add dp[${subMask.toString(2).padStart(2, '0')}] to dp[${mask.toString(2).padStart(2, '0')}]. New val: ${dp[mask]}.`, line: 3 });
      }
    }
  }

  steps.push({ type: "done", i: -1, mask: -1, val: 0, dp: [...dp], message: "Done. The array now holds the Sum Over Subsets for every mask.", line: 4 });
  return steps;
}

export default function SOSDPLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateSOSDP(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    if (!playing) return;
    timerRef.current = window.setInterval(() => {
      setStepIndex((cur) => {
        if (cur >= steps.length - 1) {
          setPlaying(false);
          return cur;
        }
        return cur + 1;
      });
    }, speed);
    return () => window.clearInterval(timerRef.current as number);
  }, [playing, speed, steps.length]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }, []);

  useEffect(() => {
    if (isSpeechEnabled && step) {
      speak(step.message);
    }
  }, [step, isSpeechEnabled, speak]);

  const codeSnippet = [
    "let dp = [...A];",
    "for (let i = 0; i < N; i++) {",
    "  for (let mask = 0; mask < (1 << N); mask++) {",
    "    if (mask & (1 << i)) {",
    "      dp[mask] += dp[mask ^ (1 << i)];",
    "    }",
    "  }",
    "}",
    "return dp;"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Bitmask</span>
          <h1>Sum Over Subsets (SOS DP)</h1>
          <p className="description">Efficiently compute the sum of all subsets of a given bitmask for all masks. SOS DP optimizes the naive O(3^N) approach to O(N * 2^N).</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N * 2^N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(2^N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>Given an array `A`, you want `F[mask] = SUM(A[i])` for all `i` that are subsets of `mask`. A naive loop over all submasks takes O(3^N).</p></article>
          <article className="guide-card"><h2>The Idea</h2><p>Instead of iterating all submasks at once, we add them dimension by dimension (bit by bit). This is essentially a multi-dimensional prefix sum over a hypercube.</p></article>
          <article className="guide-card"><h2>The Loop Structure</h2><p>The outer loop iterates over the bit index `i` (0 to N-1). The inner loop iterates over all masks. If the `i`-th bit is ON in the mask, we add the value of the mask where that bit is OFF.</p></article>
          <article className="guide-card highlight"><h2>Why it works</h2><p>By the time we process bit `i`, `dp[mask]` already contains the sum of subsets differing in bits `0` to `i-1`. Adding `dp[mask ^ (1 &lt;&lt; i)]` safely folds in the subsets that differ at bit `i`.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how the DP accumulates sums bit by bit (Dimension by Dimension in the boolean hypercube).</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="controls">
                <button onClick={() => setStepIndex(0)}>|&lt;</button>
                <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>&lt;</button>
                <button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
                <button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>&gt;</button>
                <button onClick={() => setStepIndex(steps.length - 1)}>&gt;|</button>
                <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "active" : ""} title="Toggle Voice Narration">
                  {isSpeechEnabled ? "🔊" : "🔇"}
                </button>
              </div>
              <label>Speed<input type="range" min="150" max="2500" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                 <div style={{ padding: '8px 16px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: 'var(--blue)' }}>
                   Processing Bit: {step.i === -1 ? 'None' : step.i}
                 </div>
               </div>

               <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                 {step.dp.map((val, mask) => {
                   const isActive = step.mask === mask;
                   const isSource = step.i !== -1 && isActive && step.type === "update";
                   const subMask = mask ^ (1 << step.i);
                   const isActualSource = step.mask !== -1 && mask === (step.mask ^ (1 << step.i)) && step.type === "update";
                   
                   let bg = 'var(--panel2)';
                   let border = 'var(--border)';
                   
                   if (isActive) {
                     border = 'var(--amber)';
                     if (step.type === "update") bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                   } else if (isActualSource) {
                     border = 'var(--blue)';
                     bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                   }

                   return (
                     <div key={mask} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px', fontFamily: 'monospace' }}>
                         {mask.toString(2).padStart(2, '0')}
                       </span>
                       <div style={{
                         width: '60px', height: '60px', borderRadius: '8px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: bg, border: `2px solid ${border}`,
                         fontSize: '20px', fontWeight: 'bold', transition: 'all 0.3s'
                       }}>
                         {val}
                       </div>
                     </div>
                   )
                 })}
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center', height: '240px', marginTop: 'auto' }}>
                 <CodeTracker code={codeSnippet} activeLine={step.line || 0} />
               </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel2: #172033; --border: #2b3447; --text: #e5e7eb; --muted: #98a2b3; --blue: #4f7ef8; --green: #35c486; --amber: #f5a623; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: Arial, sans-serif; }
        .page[data-theme="light"] { --bg: #f7f9fc; --panel: #ffffff; --panel2: #edf2f7; --border: #d7deea; --text: #172033; --muted: #526174; --blue: #285bd6; --green: #087f5b; --amber: #b76705; --red: #c92a2a; }
        .hero { padding: 120px 24px 80px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), radial-gradient(circle at 90% 80%, #35c48608, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); }
        .hero h1 { margin: 16px 0; font-size: clamp(48px, 9vw, 92px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 2px 10px rgba(0,0,0,0.1)); }
        .eyebrow { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--blue); }
        .content-width { max-width: 1200px; margin: 0 auto; }
        .description { font-size: 19px; max-width: 800px; margin: 24px 0 40px; line-height: 1.6; color: var(--muted); }
        .complexity-tag-group { display: flex; gap: 16px; margin-bottom: 48px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .complexity-tag .value { font-size: 20px; font-weight: 700; color: var(--blue); font-family: monospace; }
        .actions, .editor, .controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input, select, textarea { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 8px 12px; }
        button { cursor: pointer; display: flex; align-items: center; justify-content: center; }
        button.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 14%, transparent); }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; transition: all 0.3s; box-shadow: 0 4px 14px 0 rgba(79,126,248,0.39); display: inline-flex; text-decoration: none; }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79,126,248,0.5); filter: brightness(1.1); }
        .detailed-guide { width: min(1120px, calc(100% - 80px)); margin: 0 auto; padding: 100px 0; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px; margin-bottom: 80px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; transition: transform 0.3s, border-color 0.3s; }
        .guide-card:hover { transform: translateY(-4px); border-color: var(--blue); }
        .guide-card h2 { font-size: 18px; margin: 0 0 16px 0; color: var(--text); }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { background: linear-gradient(135deg, var(--panel), var(--panel2)); border-bottom: 4px solid var(--blue); }
        .simulator { padding: 60px 0 100px; margin-top: 40px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.5); margin-top: 24px; }
        aside { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
        .simulation-data { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
        .data-group h3 { font-size: 11px; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em; margin-bottom: 8px; }
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .counter { font-family: monospace; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

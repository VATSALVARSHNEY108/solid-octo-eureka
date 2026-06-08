"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface CompStep {
  type: string;
  n: number;
  mask: number;
  message: string;
  line?: number;
}

function simulateStateCompression(): CompStep[] {
  const steps: CompStep[] = [];
  
  // Tiling a 3xN grid with dominos. 
  // We just show how masks represent boundaries.
  
  steps.push({ type: "info", n: 0, mask: 0, message: "Bitmask DP compresses states (like 'used' vs 'empty' slots in a row) into an integer mask.", line: 0 });
  
  // Let's pretend N=3 columns. Mask is 3 bits.
  steps.push({ type: "eval", n: 1, mask: 0b000, message: "Col 1: Mask 000. All cells empty. We can place vertical or horizontal dominos.", line: 1 });
  
  steps.push({ type: "transition", n: 1, mask: 0b111, message: "We place dominos spanning into Col 2. Col 2's resulting mask is 111 (all cells filled).", line: 2 });
  
  steps.push({ type: "eval", n: 2, mask: 0b111, message: "Col 2: Mask 111. The previous column entirely covered us. We must leave this column empty, yielding mask 000 for Col 3.", line: 3 });
  
  steps.push({ type: "done", n: 3, mask: 0b000, message: "Done. The final answer is dp[N][0] (All N columns tiled perfectly, no spillage).", line: 4 });

  return steps;
}

export default function StateCompressionDPLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2500);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateStateCompression(), []);
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
    "// Tiling example: dp[col][mask]",
    "dp[0][0] = 1;",
    "for (let i = 0; i < N; i++) {",
    "  for (let mask = 0; mask < (1 << M); mask++) {",
    "    if (dp[i][mask] > 0) {",
    "      // Try all valid ways to tile this column",
    "      // resulting in next_mask for column i+1",
    "      dp[i + 1][next_mask] += dp[i][mask];",
    "    }",
    "  }",
    "}",
    "return dp[N][0];"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Bitmask</span>
          <h1>State Compression (Profile DP)</h1>
          <p className="description">Use an integer bitmask to represent a complex boundary state (like a jagged edge in a grid tiling problem) allowing O(1) state transitions.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N * 2^M)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N * 2^M)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>Also known as "Broken Profile DP". If you are filling a grid column by column, the boundary between the filled and unfilled sections can be jagged.</p></article>
          <article className="guide-card"><h2>The Mask</h2><p>Since the grid height `M` is usually very small (e.g., M ≤ 15), we can represent the jagged boundary as an `M`-bit integer. `1` means filled, `0` means empty.</p></article>
          <article className="guide-card"><h2>Transitions</h2><p>From `dp[col][mask]`, we try placing blocks that fill the `0`s in the current `mask`. Any blocks that spill over into the NEXT column will create the `next_mask`.</p></article>
          <article className="guide-card highlight"><h2>The Goal</h2><p>We usually want to tile the entire grid perfectly. This means we want the answer at `dp[N][0]` (after processing all N columns, 0 bits spill over into the void).</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to conceptualize how masks carry "spillover" state from one column to the next.</span>
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
              <label>Speed<input type="range" min="150" max="3500" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', alignItems: 'flex-end', height: '160px' }}>
                 {[1, 2, 3].map(col => {
                   const isActive = step.n === col;
                   const mask = isActive ? step.mask : 0;
                   const bits = mask.toString(2).padStart(3, '0').split('');
                   
                   return (
                     <div key={col} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                       <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Col {col}</span>
                       <div style={{ padding: '8px', background: 'var(--panel)', border: `2px solid ${isActive ? 'var(--blue)' : 'var(--border)'}`, borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                         {bits.map((bit, i) => (
                           <div key={i} style={{ width: '40px', height: '40px', background: bit === '1' ? 'var(--amber)' : 'var(--panel2)', borderRadius: '4px', border: '1px solid var(--border)' }}></div>
                         ))}
                       </div>
                       <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text)', fontFamily: 'monospace' }}>{bits.join('')}</span>
                     </div>
                   )
                 })}
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center', height: '200px', marginTop: 'auto' }}>
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

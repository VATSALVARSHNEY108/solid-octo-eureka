"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

export default function DPOnStocksLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  // General conceptual visualizer for Stock DP (State Machine)
  const steps = useMemo(() => {
    return [
      { msg: "Stock problems can be modeled as a Finite State Machine.", state: "START", hold: false, line: 0 },
      { msg: "We can transition from 'No Stock' to 'Holding Stock' by Buying.", state: "BUY", hold: true, line: 1 },
      { msg: "While holding, we can either Do Nothing (Hold) or transition back by Selling.", state: "HOLD", hold: true, line: 2 },
      { msg: "Selling returns us to the 'No Stock' state, realizing a profit.", state: "SELL", hold: false, line: 3 },
      { msg: "Some variations introduce a 'Cooldown' state or transaction fees.", state: "COOLDOWN", hold: false, line: 4 }
    ];
  }, []);
  
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
      speak(step.msg);
    }
  }, [step, isSpeechEnabled, speak]);

  const codeSnippet = [
    "// State Machine Transitions",
    "// dp[i][0] = max(dp[i-1][0], dp[i-1][1] + prices[i]) // Sell or Rest",
    "// dp[i][1] = max(dp[i-1][1], dp[i-1][0] - prices[i]) // Buy or Rest",
    "",
    "let hold = -Infinity, empty = 0;",
    "for (let p of prices) {",
    "  let prevEmpty = empty;",
    "  empty = Math.max(empty, hold + p); // Sell",
    "  hold = Math.max(hold, prevEmpty - p); // Buy",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Pattern</span>
          <h1>DP on Stocks</h1>
          <p className="description">Master the finite state machine approach to solve all variations of the "Best Time to Buy and Sell Stock" problems.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(1)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>Stock problems involve a sequence of prices. At any day, you can choose to Buy, Sell, or Rest, subject to constraints (e.g. only hold 1 share at a time).</p></article>
          <article className="guide-card"><h2>State Machine Modeling</h2><p>We represent the states as `dp[day][holding_status]`. `holding_status` is typically 0 (no stock) or 1 (holding 1 share).</p></article>
          <article className="guide-card"><h2>Transitions</h2><p>From `0` to `1` costs `prices[i]`. From `1` to `0` adds `prices[i]`. Staying in the same state means doing nothing.</p></article>
          <article className="guide-card highlight"><h2>Space Optimization</h2><p>Because the state on day `i` only depends on day `i-1`, we can optimize the O(N) space down to O(1) using a few variables.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to visualize the core State Machine transitions.</span>
              </div>
              <h2>Current Concept</h2>
              <p>{step?.msg || "Ready."}</p>
              
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
              <label>Speed<input type="range" min="150" max="1400" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px', gap: '40px' }}>
                 {/* State 0 */}
                 <div style={{
                   width: '80px', height: '80px', borderRadius: '50%',
                   display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                   background: !step.hold && step.state !== "COOLDOWN" ? 'color-mix(in srgb, var(--blue) 20%, transparent)' : 'var(--panel)',
                   border: `3px solid ${!step.hold && step.state !== "COOLDOWN" ? 'var(--blue)' : 'var(--border)'}`,
                   fontWeight: 'bold', transition: 'all 0.3s'
                 }}>
                   <span>State 0</span>
                   <span style={{ fontSize: '10px', color: 'var(--muted)' }}>(Empty)</span>
                 </div>
                 
                 {/* Transitions */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                   <div style={{ color: step.state === "BUY" ? 'var(--amber)' : 'var(--muted)', fontWeight: step.state === "BUY" ? 'bold' : 'normal' }}>
                     {step.state === "BUY" ? "➡️ Buy (-p)" : "➡️"}
                   </div>
                   <div style={{ color: step.state === "SELL" ? 'var(--green)' : 'var(--muted)', fontWeight: step.state === "SELL" ? 'bold' : 'normal' }}>
                     {step.state === "SELL" ? "⬅️ Sell (+p)" : "⬅️"}
                   </div>
                 </div>

                 {/* State 1 */}
                 <div style={{
                   width: '80px', height: '80px', borderRadius: '50%',
                   display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                   background: step.hold ? 'color-mix(in srgb, var(--amber) 20%, transparent)' : 'var(--panel)',
                   border: `3px solid ${step.hold ? 'var(--amber)' : 'var(--border)'}`,
                   fontWeight: 'bold', transition: 'all 0.3s'
                 }}>
                   <span>State 1</span>
                   <span style={{ fontSize: '10px', color: 'var(--muted)' }}>(Hold)</span>
                 </div>
               </div>
               
               {step.state === "COOLDOWN" && (
                 <div style={{ textAlign: 'center', color: 'var(--blue)', fontWeight: 'bold' }}>
                   * Transition intercepted by COOLDOWN state.
                 </div>
               )}
               
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

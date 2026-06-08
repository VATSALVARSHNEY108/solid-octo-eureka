"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

// This is an Interval DP problem similar to MCM
interface StickStep {
  type: string;
  len: number;
  i: number;
  j: number;
  k: number;
  dp: number[][];
  message: string;
  line?: number;
}

function simulateCutStick(): StickStep[] {
  const steps: StickStep[] = [];
  const cuts = [1, 3, 4]; // Original cuts
  const length = 7;
  
  // To do interval DP, we add 0 and 'length' to the cuts array and sort
  const c = [0, ...cuts.sort((a,b)=>a-b), length]; // [0, 1, 3, 4, 7]
  const m = c.length;
  
  const dp = Array.from({ length: m }, () => Array(m).fill(0));

  steps.push({ type: "init", len: -1, i: -1, j: -1, k: -1, dp: dp.map(r => [...r]), message: "Append 0 and stick length to the cuts array. Sort it. Initialize DP.", line: 0 });

  for (let len = 2; len < m; len++) {
    for (let i = 0; i < m - len; i++) {
      const j = i + len;
      dp[i][j] = Infinity;
      steps.push({ type: "eval", len, i, j, k: -1, dp: dp.map(r => [...r]), message: `Evaluating segment from cut index ${i} (pos ${c[i]}) to ${j} (pos ${c[j]}). Stick length = ${c[j] - c[i]}.`, line: 1 });
      
      for (let k = i + 1; k < j; k++) {
        steps.push({ type: "split", len, i, j, k, dp: dp.map(r => [...r]), message: `Trying to cut at index ${k} (pos ${c[k]}).`, line: 2 });
        
        const cost = dp[i][k] + dp[k][j] + (c[j] - c[i]);
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          steps.push({ type: "update", len, i, j, k, dp: dp.map(r => [...r]), message: `New minimum cost: ${cost} (left cost + right cost + stick length).`, line: 3 });
        }
      }
    }
  }

  steps.push({ type: "done", len: -1, i: 0, j: m-1, k: -1, dp: dp.map(r => [...r]), message: `Done. The minimum cost is ${dp[0][m-1]}.`, line: 4 });
  return steps;
}

export default function MinCostCutStickLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateCutStick(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  const c = [0, 1, 3, 4, 7]; // Positions

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
    "cuts.push(0, n);",
    "cuts.sort((a, b) => a - b);",
    "let m = cuts.length;",
    "let dp = Array.from({ length: m }, () => Array(m).fill(0));",
    "for (let len = 2; len < m; len++) {",
    "  for (let i = 0; i < m - len; i++) {",
    "    let j = i + len;",
    "    dp[i][j] = Infinity;",
    "    for (let k = i + 1; k < j; k++) {",
    "      let cost = dp[i][k] + dp[k][j] + (cuts[j] - cuts[i]);",
    "      dp[i][j] = Math.min(dp[i][j], cost);",
    "    }",
    "  }",
    "}",
    "return dp[0][m-1];"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Interval DP</span>
          <h1>Minimum Cost to Cut a Stick</h1>
          <p className="description">Given a stick of length n and an array of cuts, find the minimum cost to perform all cuts where the cost of a cut is the length of the current stick.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(M³)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(M²)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This is a classic Interval DP problem. Just like Matrix Chain Multiplication, the cost depends on which cut you make first (i.e. where you split the interval).</p></article>
          <article className="guide-card"><h2>Array Transformation</h2><p>To easily calculate stick lengths, we add the boundaries `0` and `n` to the cuts array and sort it. Now, cuts become interval boundaries.</p></article>
          <article className="guide-card"><h2>The Cost Function</h2><p>If we cut interval `[i, j]` at point `k`, the cost is the cost to cut the left piece `[i, k]` plus the right piece `[k, j]`, plus the length of the current stick `cuts[j] - cuts[i]`.</p></article>
          <article className="guide-card highlight"><h2>Length Iteration</h2><p>We process intervals by length, starting from length 2 (which means 1 cut in between). A length of 1 means no cuts are between `i` and `j`, so the cost is 0.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how different cut points `k` evaluate the cost for a given stick segment.</span>
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
              <label>Speed<input type="range" min="150" max="1400" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px', marginBottom: '20px', position: 'relative', width: '350px', margin: '0 auto' }}>
                 {/* Full stick background */}
                 <div style={{ position: 'absolute', top: '25px', left: 0, right: 0, height: '10px', background: 'var(--panel2)', borderRadius: '5px' }}></div>
                 
                 {/* Highlight active segment */}
                 {step.i !== -1 && (
                   <div style={{ position: 'absolute', top: '25px', left: `${(c[step.i]/7)*100}%`, width: `${((c[step.j] - c[step.i])/7)*100}%`, height: '10px', background: 'color-mix(in srgb, var(--green) 50%, transparent)', borderRadius: '5px', transition: 'all 0.3s' }}></div>
                 )}

                 {/* Cut marks */}
                 {c.map((pos, idx) => {
                   const isI = step.i === idx;
                   const isJ = step.j === idx;
                   const isK = step.k === idx;
                   
                   let bg = 'var(--panel)';
                   let border = 'var(--border)';
                   if (isK) { border = 'var(--amber)'; bg = 'var(--amber)'; }
                   else if (isI || isJ) { border = 'var(--blue)'; bg = 'var(--blue)'; }

                   return (
                     <div key={idx} style={{
                       position: 'absolute', left: `calc(${(pos/7)*100}% - 10px)`, top: '10px',
                       width: '20px', height: '40px', borderLeft: `3px dashed ${border}`,
                       display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', transition: 'all 0.3s'
                     }}>
                       <span style={{ fontSize: '10px', color: 'var(--muted)', transform: 'translateY(15px)' }}>{pos}</span>
                     </div>
                   )
                 })}
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center' }}>
                 <table style={{ borderCollapse: 'collapse' }}>
                   <tbody>
                     {step.dp.slice(0,4).map((row, i) => (
                       <tr key={i}>
                         <td style={{ padding: '8px', borderRight: '1px solid var(--border)', fontWeight: 'bold', color: step.i === i ? 'var(--blue)' : 'var(--text)' }}>
                           I={i}
                         </td>
                         {row.slice(1).map((val, jOffset) => {
                           const j = jOffset + 1;
                           const isActive = step.i === i && step.j === j;
                           let bg = 'transparent';
                           let border = '1px solid var(--border)';
                           
                           if (i >= j) {
                             bg = 'var(--bg)';
                             border = '1px solid transparent';
                           } else if (isActive) {
                             bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                             border = '1px solid var(--blue)';
                           }
                           
                           return (
                             <td key={j} style={{ 
                               padding: '8px', textAlign: 'center', width: '40px',
                               background: bg, border, transition: 'all 0.2s',
                               color: i >= j ? 'transparent' : 'var(--text)'
                             }}>
                               {val === Infinity ? '∞' : val}
                             </td>
                           );
                         })}
                       </tr>
                     ))}
                   </tbody>
                 </table>
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

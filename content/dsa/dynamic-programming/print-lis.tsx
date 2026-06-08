"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface LISPrintStep {
  type: string;
  idx: number;
  result: number[];
  message: string;
  line?: number;
}

function simulatePrintLIS(): LISPrintStep[] {
  const steps: LISPrintStep[] = [];
  const nums = [10, 9, 2, 5, 3, 7, 101, 18];
  const dp = [1, 1, 1, 2, 2, 3, 4, 4];
  const hash = [0, 1, 2, 2, 2, 4, 5, 5]; // Precomputed parent pointers
  
  const result: number[] = [];
  let idx = 6; // Index of the global max in dp (value 4 at index 6 which is 101)

  steps.push({ type: "init", idx, result: [...result], message: "Find the index with the maximum DP value. For this array, it's index 6 (value 101, length 4).", line: 0 });

  while (hash[idx] !== idx) {
    result.push(nums[idx]);
    steps.push({ type: "push", idx, result: [...result], message: `Add nums[${idx}] (${nums[idx]}) to result. Backtrack to its parent: hash[${idx}] = ${hash[idx]}.`, line: 1 });
    idx = hash[idx];
  }
  
  // Add the last element
  result.push(nums[idx]);
  steps.push({ type: "push_last", idx, result: [...result], message: `Add final element nums[${idx}] (${nums[idx]}). We've hit the start where hash[i] == i.`, line: 2 });
  
  // Reverse to get the correct order
  result.reverse();
  steps.push({ type: "done", idx: -1, result: [...result], message: `Reverse the result array to get the subsequence in correct order. Done.`, line: 3 });

  return steps;
}

export default function PrintLISLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulatePrintLIS(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  const nums = [10, 9, 2, 5, 3, 7, 101, 18];
  const dp = [1, 1, 1, 2, 2, 3, 4, 4];
  const hash = [0, 1, 2, 2, 2, 4, 5, 5];

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
    "let ans = [];",
    "// lastIndex is the index with max dp value",
    "let curr = lastIndex;",
    "while (hash[curr] !== curr) {",
    "  ans.push(nums[curr]);",
    "  curr = hash[curr];",
    "}",
    "ans.push(nums[curr]);",
    "ans.reverse();",
    "return ans;"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Traceback</span>
          <h1>Printing the Longest Increasing Subsequence</h1>
          <p className="description">Use a parent pointer array (hash array) to reconstruct the actual elements of the LIS in O(N) time after populating the DP array.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Traceback Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>Finding the length of the LIS is standard O(N²). But if you want to know *which* elements make up the sequence, you need to track how the sequence was built.</p></article>
          <article className="guide-card"><h2>The Hash Array</h2><p>We use an array `hash` initialized to `hash[i] = i`. Whenever we extend a subsequence (`dp[i] = dp[j] + 1`), we set `hash[i] = j`.</p></article>
          <article className="guide-card"><h2>The Starting Point</h2><p>We find the index in the `dp` array that has the maximum value. This is the end of our Longest Increasing Subsequence.</p></article>
          <article className="guide-card highlight"><h2>Backtracking</h2><p>We jump backwards: `curr = hash[curr]`, adding elements to our result array. Since we start at the end, the result is backwards, so we reverse it before returning.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the traceback jump from parent to parent using the pre-calculated `hash` array.</span>
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
               
               <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '20px' }}>
                 {nums.map((num, idx) => {
                   const isActive = step.idx === idx;
                   const inResult = step.result.includes(num);
                   
                   let bg = 'var(--panel)';
                   let border = 'var(--border)';
                   if (isActive) {
                     bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                     border = 'var(--amber)';
                   } else if (inResult) {
                     bg = 'color-mix(in srgb, var(--green) 20%, transparent)';
                     border = 'var(--green)';
                   }

                   return (
                     <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       <span style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '4px' }}>{idx}</span>
                       <div style={{
                         width: '45px', height: '45px', borderRadius: '8px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: bg, border: `2px solid ${border}`,
                         fontWeight: 'bold', fontSize: '16px', transition: 'all 0.3s'
                       }}>
                         {num}
                       </div>
                       
                       <div style={{ display: 'flex', gap: '4px', marginTop: '8px', fontSize: '10px', color: 'var(--muted)' }}>
                         <span>dp:{dp[idx]}</span>
                       </div>
                       <div style={{ display: 'flex', gap: '4px', fontSize: '10px', color: 'var(--blue)' }}>
                         <span>h:{hash[idx]}</span>
                       </div>
                     </div>
                   )
                 })}
               </div>

               <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                 <div style={{ padding: '16px', background: 'var(--panel2)', borderRadius: '8px', border: '2px solid var(--green)', minWidth: '300px', textAlign: 'center' }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Constructed Result Array</span>
                   <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--green)', marginTop: '8px', minHeight: '30px' }}>
                     [ {step.result.join(", ")} ]
                   </div>
                 </div>
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

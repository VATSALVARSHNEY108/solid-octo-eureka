"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface QStackStep {
  type: string;
  s1: number[];
  s2: number[];
  val?: number;
  message: string;
  line?: number;
}

function simulateQueueUsingStacks(): QStackStep[] {
  const steps: QStackStep[] = [];
  const s1: number[] = [];
  const s2: number[] = [];

  steps.push({ type: "init", s1: [...s1], s2: [...s2], message: `Initialize S1 (Input Stack) and S2 (Output Stack).`, line: 0 });

  function enqueue(val: number, lineIdx: number) {
    s1.push(val);
    steps.push({ type: "enqueue", s1: [...s1], s2: [...s2], val, message: `Enqueue ${val}: Always push directly to S1. O(1) time.`, line: lineIdx });
  }

  function dequeue(lineIdx: number) {
    steps.push({ type: "deq_start", s1: [...s1], s2: [...s2], message: `Dequeue called. Check if S2 is empty.`, line: lineIdx });
    
    if (s2.length === 0) {
      steps.push({ type: "s2_empty", s1: [...s1], s2: [...s2], message: `S2 is empty. We must transfer all elements from S1 to S2 to reverse the order!`, line: lineIdx + 1 });
      while (s1.length > 0) {
        const val = s1.pop()!;
        s2.push(val);
        steps.push({ type: "transfer", s1: [...s1], s2: [...s2], val, message: `Pop ${val} from S1, push to S2.`, line: lineIdx + 2 });
      }
    } else {
      steps.push({ type: "s2_ready", s1: [...s1], s2: [...s2], message: `S2 is NOT empty. We can pop directly without transferring.`, line: lineIdx + 6 });
    }

    if (s2.length > 0) {
      const val = s2.pop()!;
      steps.push({ type: "deq_done", s1: [...s1], s2: [...s2], val, message: `Pop from S2. We successfully dequeued ${val}.`, line: lineIdx + 7 });
    }
  }

  enqueue(10, 1);
  enqueue(20, 1);
  enqueue(30, 1);
  dequeue(5); // transfers 30, 20, 10 -> S2, pops 10
  enqueue(40, 1); // goes to S1
  dequeue(5); // S2 has 20, 30. No transfer needed. pops 20.

  return steps;
}

export default function QueueUsingStacksLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateQueueUsingStacks(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

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

  const codeSnippet = [
    "function enqueue(val) {",
    "  s1.push(val);",
    "}",
    "",
    "function dequeue() {",
    "  if (s2.length === 0) {",
    "    while (s1.length > 0) {",
    "      s2.push(s1.pop());",
    "    }",
    "  }",
    "  return s2.pop();",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Design Problems</span>
          <h1>Implement Queue using Stacks</h1>
          <p className="description">Design a First-In-First-Out (FIFO) queue using only two standard Last-In-First-Out (LIFO) stacks. This is a classic FAANG interview question.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Enqueue</span><span className="value">O(1)</span></div>
            <div className="complexity-tag"><span className="label">Dequeue</span><span className="value">Amortized O(1)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card highlight"><h2>The Two Stacks</h2><p>We designate `s1` as the <strong>Input Stack</strong> and `s2` as the <strong>Output Stack</strong>. Enqueuing is dead simple: just push to `s1`!</p></article>
          <article className="guide-card highlight" style={{ borderColor: 'var(--amber)' }}><h2>The Dequeue Trick</h2><p>When someone calls dequeue, we need the OLDEST element. But `s1` holds the NEWEST element on top. So, we pop everything from `s1` and push it to `s2`. This completely reverses the order!</p></article>
          <article className="guide-card"><h2>Amortized O(1)</h2><p>Transferring elements takes O(N) time. BUT, we only transfer when `s2` is totally empty. Most dequeue calls will just pop directly from `s2` in O(1) time. Over time, it averages out to O(1).</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how elements are buffered in S1, and only transferred to S2 (reversing them) when a dequeue is requested and S2 is empty.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="controls">
                <button onClick={() => setStepIndex(0)}>|&lt;</button>
                <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>&lt;</button>
                <button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
                <button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>&gt;</button>
                <button onClick={() => setStepIndex(steps.length - 1)}>&gt;|</button>
              </div>
              <label>Speed<input type="range" min="500" max="3000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px', alignItems: 'center' }}>
               
               <div style={{ display: 'flex', gap: '80px', width: '100%', justifyContent: 'center' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--blue)', marginBottom: '8px' }}>S1 (Input)</span>
                   <div style={{ 
                     width: '100px', height: '220px', border: '3px solid var(--border)', borderTop: 'none', 
                     borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                     display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '6px',
                     background: 'var(--panel2)'
                   }}>
                     {step.s1.map((val, idx) => (
                       <div key={idx} style={{
                         width: '100%', height: '35px', background: 'var(--panel)',
                         border: '2px solid var(--blue)', borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontWeight: 'bold', fontSize: '18px', color: 'var(--blue)'
                       }}>
                         {val}
                       </div>
                     ))}
                   </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--amber)', marginBottom: '8px' }}>S2 (Output)</span>
                   <div style={{ 
                     width: '100px', height: '220px', border: '3px solid var(--border)', borderTop: 'none', 
                     borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                     display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '6px',
                     background: 'var(--panel2)'
                   }}>
                     {step.s2.map((val, idx) => (
                       <div key={idx} style={{
                         width: '100%', height: '35px', background: 'var(--panel)',
                         border: '2px solid var(--amber)', borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontWeight: 'bold', fontSize: '18px', color: 'var(--amber)'
                       }}>
                         {val}
                       </div>
                     ))}
                   </div>
                 </div>
               </div>

               <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 'auto' }}>
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
        .actions, .controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 8px 12px; }
        button { cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; text-decoration: none; display: inline-flex; }
        .detailed-guide { width: min(1120px, calc(100% - 80px)); margin: 0 auto; padding: 100px 0; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; }
        .guide-card h2 { font-size: 18px; margin: 0 0 16px 0; color: var(--text); }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--blue); }
        .simulator { padding: 60px 0 100px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; margin: 24px auto 0; max-width: 1200px;}
        aside { display: flex; flex-direction: column; gap: 12px; }
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

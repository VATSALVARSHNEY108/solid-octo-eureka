"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface SpanStep {
  type: string;
  idx: number;
  stack: number[]; // storing indices
  result: number[];
  message: string;
  line?: number;
}

function simulateStockSpan(): SpanStep[] {
  const steps: SpanStep[] = [];
  const prices = [100, 80, 60, 70, 60, 75, 85];
  const n = prices.length;
  const stack: number[] = [];
  const result: number[] = new Array(n).fill(0);

  steps.push({ type: "init", idx: -1, stack: [...stack], result: [...result], message: `Calculate Stock Span for [100, 80, 60, 70, 60, 75, 85].`, line: 0 });

  for (let i = 0; i < n; i++) {
    steps.push({ type: "visit", idx: i, stack: [...stack], result: [...result], message: `Day ${i}: Price is ${prices[i]}.`, line: 1 });

    while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
      const popped = stack.pop()!;
      steps.push({ 
        type: "pop", idx: i, stack: [...stack], result: [...result], 
        message: `Price ${prices[popped]} on Day ${popped} is <= ${prices[i]}. It is part of today's span. Pop it.`,
        line: 2 
      });
    }

    if (stack.length === 0) {
      result[i] = i + 1;
      steps.push({ type: "empty", idx: i, stack: [...stack], result: [...result], message: `Stack is empty. This is the highest price so far. Span is ${i+1}.`, line: 5 });
    } else {
      const pgeIdx = stack[stack.length - 1];
      result[i] = i - pgeIdx;
      steps.push({ type: "found", idx: i, stack: [...stack], result: [...result], message: `Found Previous Greater Element at Day ${pgeIdx} (${prices[pgeIdx]}). Span is ${i} - ${pgeIdx} = ${result[i]}.`, line: 7 });
    }

    stack.push(i);
    steps.push({ type: "push", idx: i, stack: [...stack], result: [...result], message: `Push Day ${i} to stack.`, line: 9 });
  }

  steps.push({ type: "done", idx: -1, stack: [...stack], result: [...result], message: `Done! Result spans: [${result.join(', ')}].`, line: 11 });

  return steps;
}

export default function StockSpanLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateStockSpan(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  const prices = [100, 80, 60, 70, 60, 75, 85];

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
    "let stack = []; let span = new Array(n);",
    "for (let i = 0; i < n; i++) {",
    "  while (stack.length && prices[stack[stack.length - 1]] <= prices[i]) {",
    "    stack.pop();",
    "  }",
    "  if (stack.length === 0) {",
    "    span[i] = i + 1;",
    "  } else {",
    "    span[i] = i - stack[stack.length - 1];",
    "  }",
    "  stack.push(i);",
    "}",
    "return span;"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Monotonic Stack</span>
          <h1>The Stock Span Problem</h1>
          <p className="description">The span of the stock's price today is the maximum number of consecutive days (starting from today and going backward) for which the stock price was less than or equal to today's price.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Hidden Problem</h2><p>This is secretly just the <strong>Previous Greater Element</strong> problem! The span breaks on the exact day that a previous price was strictly greater than today's price.</p></article>
          <article className="guide-card highlight"><h2>Index Stack</h2><p>Instead of storing the actual stock prices in the stack, we MUST store their indices. To calculate the span, we just do `currentIndex - previousGreaterIndex`.</p></article>
          <article className="guide-card"><h2>Empty Stack Rule</h2><p>If the stack becomes empty, it means today's price is higher than ALL previous prices. Thus, the span is simply `currentIndex + 1`.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how popping elements naturally calculates the consecutive span.</span>
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
               
               <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
                 {prices.map((val, i) => {
                   const isCurrent = step.idx === i;
                   const isProcessed = step.idx !== -1 && i <= step.idx;
                   const isSpanned = step.idx !== -1 && i <= step.idx && i > step.idx - (step.result[step.idx] || 0);
                   
                   let bg = 'var(--panel2)';
                   let border = 'var(--border)';

                   if (isCurrent) {
                     border = 'var(--amber)';
                     bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                   } else if (isSpanned && isProcessed) {
                     bg = 'color-mix(in srgb, var(--green) 20%, transparent)';
                     border = 'var(--green)';
                   } else if (isProcessed) {
                     border = 'var(--blue)';
                   }

                   return (
                     <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                       <span style={{ fontSize: '10px', color: 'var(--muted)' }}>D{i}</span>
                       <div style={{
                         width: '40px', height: `${val}px`, background: bg, border: `2px solid ${border}`, borderBottom: 'none',
                         display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '4px',
                         fontSize: '14px', fontWeight: 'bold', color: 'var(--text)',
                         opacity: isProcessed || isCurrent ? 1 : 0.4, transition: 'all 0.3s'
                       }}>
                         {val}
                       </div>
                       <div style={{
                         width: '40px', height: '24px', background: 'var(--panel)', border: `2px solid var(--green)`, borderRadius: '4px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontSize: '14px', fontWeight: 'bold', color: 'var(--green)'
                       }}>
                         {step.result[i] === 0 ? '-' : step.result[i]}
                       </div>
                     </div>
                   )
                 })}
               </div>
               <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Top: Stock Prices | Bottom: Spans</span>

               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                 <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Stack (Stores Indices)</span>
                 <div style={{ 
                   width: '120px', minHeight: '150px', border: '3px solid var(--border)', borderTop: 'none', 
                   borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                   display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '6px',
                   background: 'var(--panel2)'
                 }}>
                   {step.stack.map((idx, i) => (
                     <div key={i} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                       <div style={{
                         width: '100%', height: '35px', background: 'var(--panel)',
                         border: '2px solid var(--blue)', borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontWeight: 'bold', fontSize: '16px', color: 'var(--blue)', animation: 'slideUp 0.3s'
                       }}>
                         idx: {idx}
                       </div>
                     </div>
                   ))}
                   {step.stack.length === 0 && <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontSize: '14px' }}>Empty</div>}
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
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

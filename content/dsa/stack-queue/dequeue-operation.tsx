"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface DequeueStep {
  type: string;
  front: number;
  rear: number;
  queue: (number | null)[];
  message: string;
  line?: number;
}

function simulateDequeue(): DequeueStep[] {
  const steps: DequeueStep[] = [];
  const size = 5;
  const q: (number | null)[] = [10, 20, 30, null, null];
  let front = 0;
  let rear = 2;

  steps.push({ type: "init", front, rear, queue: [...q], message: `Queue initialized. Front points to index ${front}, Rear points to index ${rear}.`, line: 0 });

  function dequeue(lineIdx: number) {
    if (front === -1 || front > rear) {
      steps.push({ type: "error", front, rear, queue: [...q], message: "Queue is EMPTY! Cannot dequeue (Underflow).", line: 1 });
      return;
    }

    const val = q[front];
    steps.push({ type: "access", front, rear, queue: [...q], message: `Read value ${val} at index ${front} (Front).`, line: 2 });
    
    q[front] = null; // Clear visually
    steps.push({ type: "remove", front, rear, queue: [...q], message: `Remove ${val} from the queue.`, line: 3 });
    
    front++;
    steps.push({ type: "update", front, rear, queue: [...q], message: `Increment Front to index ${front}.`, line: 4 });

    if (front > rear) {
      front = -1; rear = -1;
      steps.push({ type: "reset", front, rear, queue: [...q], message: `Queue is now completely empty. Reset Front and Rear to -1.`, line: 5 });
    }
  }

  dequeue(1);
  dequeue(1);
  dequeue(1);
  dequeue(1); // Triggers underflow

  return steps;
}

export default function DequeueOperationLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateDequeue(), []);
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
    "function dequeue() {",
    "  if (front === -1 || front > rear) {",
    "    console.log('Queue Underflow');",
    "    return;",
    "  }",
    "  let val = queue[front];",
    "  front++;",
    "  if (front > rear) { // Reset if empty",
    "    front = -1; rear = -1;",
    "  }",
    "  return val;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack & Queue • Operations</span>
          <h1>Dequeue Operation</h1>
          <p className="description">Dequeue is the process of removing an element from a Queue. In a FIFO structure, removals always happen at the 'Front'.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time Complexity</span><span className="value">O(1)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Underflow Check</h2><p>Before dequeuing, we must check if the queue is empty (`front == -1` or `front &gt; rear`). Dequeuing from an empty queue causes an Underflow error.</p></article>
          <article className="guide-card highlight"><h2>The Front Pointer</h2><p>We read the value at the `front` index, and then increment `front` by 1. The element isn't necessarily deleted from memory immediately, but it is ignored by the queue logic.</p></article>
          <article className="guide-card"><h2>Resetting</h2><p>If `front` overtakes `rear` after a dequeue, it means the queue has become completely empty. We reset both pointers to `-1`.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how Dequeue shifts the Front pointer to the right, virtually removing elements.</span>
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
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', alignItems: 'center' }}>
               
               <div style={{ display: 'flex', gap: '10px', marginTop: '40px' }}>
                 {step.queue.map((val, idx) => {
                   const isFront = step.front === idx;
                   const isRear = step.rear === idx;
                   
                   let borderColor = 'var(--border)';
                   if (isFront && isRear) borderColor = 'var(--green)';
                   else if (isFront) borderColor = 'var(--blue)';
                   else if (isRear) borderColor = 'var(--amber)';
                   
                   if (step.type === "error") borderColor = 'var(--red)';

                   return (
                     <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                       <div style={{ height: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                         {isFront && <span style={{ color: 'var(--blue)' }}>FRONT</span>}
                       </div>
                       
                       <div style={{
                         width: '50px', height: '50px', background: val !== null ? 'var(--panel2)' : 'transparent',
                         border: `3px solid ${borderColor}`, borderRadius: '8px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontSize: '20px', fontWeight: 'bold', color: 'var(--text)',
                         opacity: idx < step.front ? 0.3 : 1
                       }}>
                         {val !== null ? val : ''}
                       </div>
                       
                       <div style={{ height: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                         {isRear && <span style={{ color: 'var(--amber)' }}>REAR</span>}
                       </div>
                       <span style={{ fontSize: '10px', color: 'var(--muted)' }}>[{idx}]</span>
                     </div>
                   )
                 })}
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

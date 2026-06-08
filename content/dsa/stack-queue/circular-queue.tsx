"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface CQStep {
  type: string;
  front: number;
  rear: number;
  queue: (number | null)[];
  message: string;
  line?: number;
}

function simulateCircularQueue(): CQStep[] {
  const steps: CQStep[] = [];
  const size = 5;
  const q: (number | null)[] = new Array(size).fill(null);
  let front = -1;
  let rear = -1;

  steps.push({ type: "init", front, rear, queue: [...q], message: `Initialize Circular Queue of size ${size}. Front and Rear are -1.`, line: 0 });

  function enqueue(val: number, lineIndex: number) {
    if ((front === 0 && rear === size - 1) || (rear === (front - 1) % (size - 1))) {
      steps.push({ type: "error_full", front, rear, queue: [...q], message: `Queue is FULL! Cannot enqueue ${val}.`, line: 1 });
      return;
    }
    
    if (front === -1) {
      front = 0; rear = 0;
    } else if (rear === size - 1 && front !== 0) {
      rear = 0;
    } else {
      rear = rear + 1;
    }
    
    q[rear] = val;
    steps.push({ type: "enqueue", front, rear, queue: [...q], message: `Enqueued ${val} at index ${rear}.`, line: lineIndex });
  }

  function dequeue(lineIndex: number) {
    if (front === -1) {
      steps.push({ type: "error_empty", front, rear, queue: [...q], message: `Queue is EMPTY! Cannot dequeue.`, line: 7 });
      return;
    }

    const val = q[front];
    q[front] = null;
    
    steps.push({ type: "dequeue", front, rear, queue: [...q], message: `Dequeued ${val} from index ${front}.`, line: lineIndex });

    if (front === rear) {
      front = -1; rear = -1; // reset
    } else if (front === size - 1) {
      front = 0;
    } else {
      front = front + 1;
    }
    steps.push({ type: "update", front, rear, queue: [...q], message: `Updated front to ${front}.`, line: lineIndex + 1 });
  }

  enqueue(14, 2);
  enqueue(22, 2);
  enqueue(13, 2);
  enqueue(-6, 2);
  
  dequeue(8);
  dequeue(8);
  
  enqueue(9, 2);
  enqueue(20, 2); // This one wraps around to the front!

  return steps;
}

export default function CircularQueueLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateCircularQueue(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);
  
  const SIZE = 5;

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
    "  if (isFull()) return;",
    "  if (front === -1) { front = 0; rear = 0; }",
    "  else if (rear === size - 1 && front !== 0) rear = 0;",
    "  else rear++;",
    "  queue[rear] = val;",
    "}",
    "function dequeue() {",
    "  if (isEmpty()) return;",
    "  let val = queue[front];",
    "  if (front === rear) { front = -1; rear = -1; }",
    "  else if (front === size - 1) front = 0;",
    "  else front++;",
    "  return val;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack & Queue • Data Structures</span>
          <h1>Circular Queue</h1>
          <p className="description">A linear data structure that operates on FIFO but the last position is connected back to the first position to make a circle, overcoming the limitation of normal array-based queues.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Enqueue Time</span><span className="value">O(1)</span></div>
            <div className="complexity-tag"><span className="label">Dequeue Time</span><span className="value">O(1)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Problem</h2><p>In a standard Array-Queue, after enqueuing and dequeuing many times, the `front` and `rear` pointers hit the end of the array. Even if there are empty spots at the beginning, we can't use them!</p></article>
          <article className="guide-card highlight"><h2>The Solution</h2><p>A Circular Queue uses modulo arithmetic (or explicit checks) to wrap the `rear` pointer back to `0` if it hits the end and the front has advanced.</p></article>
          <article className="guide-card"><h2>Full vs Empty</h2><p>Empty: `front == -1`. Full: `(rear + 1) % size == front` (or `front == 0 && rear == size-1` along with `rear == front-1`).</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how the 'Rear' pointer wraps around to the beginning of the array when space frees up!</span>
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
                   if (isFront && isRear) borderColor = 'var(--green)'; // Both point here
                   else if (isFront) borderColor = 'var(--blue)';
                   else if (isRear) borderColor = 'var(--amber)';

                   return (
                     <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                       <div style={{ height: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                         {isFront && <span style={{ color: 'var(--blue)' }}>FRONT</span>}
                       </div>
                       
                       <div style={{
                         width: '50px', height: '50px', background: val !== null ? 'var(--panel2)' : 'transparent',
                         border: `3px solid ${borderColor}`, borderRadius: '8px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontSize: '20px', fontWeight: 'bold', color: 'var(--text)'
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

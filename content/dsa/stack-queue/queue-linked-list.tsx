"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface NodeState {
  id: number;
  val: number;
}

interface QLLStep {
  type: string;
  queue: NodeState[];
  frontId: number | null;
  rearId: number | null;
  message: string;
  line?: number;
}

function simulateQueueLL(): QLLStep[] {
  const steps: QLLStep[] = [];
  const q: NodeState[] = [];
  let idCounter = 1;

  steps.push({ type: "init", queue: [...q], frontId: null, rearId: null, message: `Initialize Queue using a Linked List. Front and Rear are NULL.`, line: 0 });

  function push(val: number, lineIdx: number) {
    const newNode = { id: idCounter++, val };
    steps.push({ type: "create", queue: [...q], frontId: q[0]?.id || null, rearId: q[q.length-1]?.id || null, message: `Push(${val}): Create new node with value ${val}.`, line: lineIdx + 1 });
    
    if (q.length === 0) {
      q.push(newNode);
      steps.push({ type: "push_first", queue: [...q], frontId: newNode.id, rearId: newNode.id, message: `Queue was empty. Front and Rear both point to the new node.`, line: lineIdx + 3 });
    } else {
      const oldRear = q[q.length - 1];
      q.push(newNode);
      steps.push({ type: "push", queue: [...q], frontId: q[0].id, rearId: newNode.id, message: `Rear.next points to new node. Update Rear to point to new node.`, line: lineIdx + 6 });
    }
  }

  function pop(lineIdx: number) {
    if (q.length === 0) {
      steps.push({ type: "underflow", queue: [...q], frontId: null, rearId: null, message: `Pop(): Underflow! Queue is empty.`, line: lineIdx + 1 });
      return;
    }
    const popped = q[0];
    steps.push({ type: "read", queue: [...q], frontId: popped.id, rearId: q[q.length-1].id, message: `Pop(): Front node has value ${popped.val}.`, line: lineIdx + 4 });
    
    q.shift();
    if (q.length === 0) {
      steps.push({ type: "pop_last", queue: [...q], frontId: null, rearId: null, message: `Pop(): Queue is now empty. Front and Rear are NULL.`, line: lineIdx + 7 });
    } else {
      steps.push({ type: "pop", queue: [...q], frontId: q[0].id, rearId: q[q.length-1].id, message: `Pop(): Move Front to Front.next.`, line: lineIdx + 5 });
    }
  }

  push(10, 1);
  push(20, 1);
  pop(9);
  push(30, 1);
  pop(9);
  pop(9); // Empties
  pop(9); // Underflow

  return steps;
}

export default function QueueLinkedListLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateQueueLL(), []);
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
    "function push(val) {",
    "  let newNode = new Node(val);",
    "  if (front === null) {",
    "    front = rear = newNode;",
    "    return;",
    "  }",
    "  rear.next = newNode;",
    "  rear = newNode;",
    "}",
    "function pop() {",
    "  if (front === null) return 'Underflow';",
    "  let val = front.val;",
    "  front = front.next;",
    "  if (front === null) rear = null;",
    "  return val;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Queue • Core Implementation</span>
          <h1>Queue using Linked List</h1>
          <p className="description">Implementing a Queue with a Linked List solves the "False Overflow" and fixed-size limitations of Array Queues. It grows dynamically as needed.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(1)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Two Pointers</h2><p>You maintain `front` pointing to the head of the list, and `rear` pointing to the tail. Both start as `NULL`.</p></article>
          <article className="guide-card highlight"><h2>Enqueue (Push)</h2><p>Always add to the `rear` (tail). `rear.next = new Node`, then `rear = new Node`. If the queue is empty, both pointers point to the new node.</p></article>
          <article className="guide-card"><h2>Dequeue (Pop)</h2><p>Always remove from the `front` (head). Save the value, then `front = front.next`. If `front` becomes `NULL` after popping, remember to set `rear = NULL` too!</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch nodes dynamically allocate and link. Enqueue at the Rear, Dequeue at the Front.</span>
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
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px', alignItems: 'center' }}>
               
               <div style={{ display: 'flex', gap: '30px', alignItems: 'center', minHeight: '120px', flexWrap: 'wrap', justifyContent: 'center' }}>
                 
                 {step.queue.length === 0 && step.type !== "underflow" && (
                   <span style={{ color: 'var(--muted)', fontSize: '20px', fontStyle: 'italic' }}>Queue is Empty</span>
                 )}

                 {step.queue.map((node, idx) => {
                   const isFront = step.frontId === node.id;
                   const isRear = step.rearId === node.id;
                   
                   return (
                     <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                         
                         {isFront && (
                           <div style={{ position: 'absolute', top: '-35px', color: 'var(--amber)', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                             <span>Front</span>
                             <span>▼</span>
                           </div>
                         )}

                         <div style={{
                           width: '60px', height: '60px', background: 'var(--panel)',
                           border: `3px solid var(--blue)`, borderRadius: '50%',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontWeight: 'bold', fontSize: '20px', color: 'var(--text)',
                           boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                         }}>
                           {node.val}
                         </div>

                         {isRear && (
                           <div style={{ position: 'absolute', bottom: '-35px', color: 'var(--green)', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                             <span>▲</span>
                             <span>Rear</span>
                           </div>
                         )}
                       </div>

                       {/* Arrow to next node */}
                       {idx < step.queue.length - 1 && (
                         <div style={{ color: 'var(--muted)', fontSize: '24px' }}>→</div>
                       )}
                     </div>
                   )
                 })}

               </div>

               {step.type === "underflow" && (
                 <div style={{ padding: '10px 20px', background: 'color-mix(in srgb, var(--red) 10%, transparent)', border: '2px solid var(--red)', color: 'var(--red)', borderRadius: '8px', fontWeight: 'bold' }}>
                   UNDERFLOW: Queue is Empty!
                 </div>
               )}

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

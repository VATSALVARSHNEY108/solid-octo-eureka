"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, MousePointer2, Languages, ListOrdered, Edit3 } from "lucide-react";

interface AlienStep {
  words: string[];
  edges: { from: string; to: string }[];
  indegree: Record<string, number>;
  queue: string[];
  sorted: string[];
  message: string;
}

const DEFAULT_WORDS = ["wrt", "wrf", "er", "ett", "rftt"];

function generateAlienSteps(words: string[]): AlienStep[] {
  const adj: Record<string, Set<string>> = {};
  const indegree: Record<string, number> = {};
  const chars = new Set<string>();
  words.forEach(w => w.split("").forEach(c => chars.add(c)));
  
  chars.forEach(c => { adj[c] = new Set(); indegree[c] = 0; });
  const edges: { from: string; to: string }[] = [];
  const steps: AlienStep[] = [];
  
  steps.push({ 
    words, edges: [], indegree: { ...indegree }, queue: [], sorted: [], 
    message: "Initializing: Analyzing lexicographical order to build character dependencies." 
  });

  // Build graph
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i];
    const w2 = words[i+1];
    const minLen = Math.min(w1.length, w2.length);
    
    // Check for invalid prefix case
    if (w1.length > w2.length && w1.startsWith(w2)) {
      steps.push({ words, edges: [...edges], indegree: { ...indegree }, queue: [], sorted: [], message: `Invalid Order! "${w1}" cannot come before its prefix "${w2}".` });
      return steps;
    }

    for (let j = 0; j < minLen; j++) {
      if (w1[j] !== w2[j]) {
        if (!adj[w1[j]].has(w2[j])) {
          adj[w1[j]].add(w2[j]);
          indegree[w2[j]]++;
          edges.push({ from: w1[j], to: w2[j] });
          steps.push({ 
            words, edges: [...edges], indegree: { ...indegree }, queue: [], sorted: [], 
            message: `Precedence found: "${w1}" vs "${w2}" reveals '${w1[j]}' comes before '${w2[j]}'.` 
          });
        }
        break;
      }
    }
  }

  // Kahn's algorithm
  const queue: string[] = [];
  Object.keys(indegree).forEach(c => { if (indegree[c] === 0) queue.push(c); });
  
  steps.push({ 
    words, edges: [...edges], indegree: { ...indegree }, queue: [...queue], sorted: [], 
    message: `Kahn's Initialization: Collected ${queue.length} characters with no dependencies.` 
  });

  const sorted: string[] = [];
  const qCopy = [...queue];
  const indCopy = { ...indegree };

  while (qCopy.length > 0) {
    const u = qCopy.shift()!;
    sorted.push(u);
    
    steps.push({ 
      words, edges: [...edges], indegree: { ...indCopy }, queue: [...qCopy], sorted: [...sorted], 
      message: `Processing '${u}'. Reducing in-degree for its neighbors.` 
    });

    for (const v of Array.from(adj[u]).sort()) {
      indCopy[v]--;
      if (indCopy[v] === 0) {
        qCopy.push(v);
        steps.push({ 
          words, edges: [...edges], indegree: { ...indCopy }, queue: [...qCopy], sorted: [...sorted], 
          message: `'${v}' dependency satisfied! Adding to queue.` 
        });
      }
    }
  }

  steps.push({ 
    words, edges: [...edges], indegree: { ...indCopy }, queue: [], sorted: [...sorted], 
    message: sorted.length === chars.size ? "Alphabet successfully decoded!" : "Error: Circular dependency detected in the language rules." 
  });

  return steps;
}

export default function AlienSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [wordsInput, setWordsInput] = useState(DEFAULT_WORDS.join(", "));
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  const words = useMemo(() => wordsInput.split(",").map(w => w.trim()).filter(w => w.length > 0), [wordsInput]);
  const steps = useMemo(() => generateAlienSteps(words), [words]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || (steps.length ? steps[0] : { words, edges: [], indegree: {}, queue: [], sorted: [], message: "Add words to start decoding." });

  // Initialize node positions in a circle
  useEffect(() => {
    const chars = new Set<string>();
    words.forEach(w => w.split("").forEach(c => chars.add(c)));
    const nodes = Array.from(chars).sort();
    const positions: Record<string, { x: number; y: number }> = {};
    nodes.forEach((c, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI;
      positions[c] = { x: 340 + 160 * Math.cos(angle), y: 240 + 120 * Math.sin(angle) };
    });
    setNodePositions(positions);
  }, [words]);

  useEffect(() => {
    let timer: number;
    if (playing && stepIndex < steps.length - 1) {
      timer = window.setInterval(() => setStepIndex(s => s + 1), 2100 - speed);
    } else if (stepIndex >= steps.length - 1) {
      setPlaying(false);
    }
    return () => clearInterval(timer);
  }, [playing, stepIndex, steps.length, speed]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.1;
    window.speechSynthesis.speak(utter);
  }, []);

  useEffect(() => {
    if (isSpeechEnabled && step) speak(step.message);
  }, [step, isSpeechEnabled, speak]);

  const svgPoint = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }, []);

  const handleMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const pt = svgPoint(e);
    setNodePositions(prev => ({ ...prev, [dragging]: { x: Math.max(40, Math.min(640, pt.x)), y: Math.max(45, Math.min(450, pt.y)) } }));
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Graph Algorithms • Decoding</span>
          <h1>Alien Dictionary</h1>
          <p className="description">
            Reconstruct the unknown alphabet of an alien language from a sorted dictionary. 
            Build a dependency graph and use <strong>Topological Sort</strong> to reveal the hidden sequence.
          </p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N + K)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(K)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card">
            <h2>Lexicography</h2>
            <p>Comparing adjacent words reveals precedence. If "abc" comes before "abd", then 'c' comes before 'd'.</p>
          </article>
          <article className="guide-card">
            <h2>Directed Edges</h2>
            <p>Each precedence relation <code>a → b</code> is a directed edge in our character graph.</p>
          </article>
          <article className="guide-card highlight">
            <h2>Topo Sort</h2>
            <p>We apply Kahn's Algorithm on the character graph. A valid sort order gives the alphabet. A cycle implies no valid order.</p>
          </article>
          <article className="guide-card">
            <h2>Complexity</h2>
            <p>Where N is total characters in words and K is alphabet size. We process every char once.</p>
          </article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="editor-bar">
          <div className="input-field">
            <Languages size={16} />
            <input value={wordsInput} onChange={(e) => { setWordsInput(e.target.value); setStepIndex(0); }} placeholder="e.g. wrt, wrf, er, ett" />
          </div>
          <button className="reset-btn" onClick={() => { setWordsInput(DEFAULT_WORDS.join(", ")); setStepIndex(0); setPlaying(false); }}>Reset</button>
        </div>

        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="status-panel">
                <div className="panel-header">
                   <Info size={14} />
                   <h2>Decoding Logic</h2>
                </div>
                <p className="status-msg">{step.message}</p>
                
                <div className="data-section">
                   <h3>BFS Queue</h3>
                   <div className="queue-viz">
                      {step.queue.map(c => <div key={c} className="q-item">{c}</div>)}
                      {step.queue.length === 0 && <span className="empty">No ready chars</span>}
                   </div>
                </div>

                <div className="playback-controls">
                  <button onClick={() => { setStepIndex(0); setPlaying(false); }} className="secondary"><RotateCcw size={16} /></button>
                  <button onClick={() => setStepIndex(i => Math.max(0, i-1))} className="secondary"><ChevronLeft size={20} /></button>
                  <button onClick={() => setPlaying(!playing)} className="play-btn">{playing ? <Pause size={20} /> : <Play size={20} />}</button>
                  <button onClick={() => setStepIndex(i => Math.min(steps.length-1, i+1))} className="secondary"><ChevronRight size={20} /></button>
                  <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "secondary active" : "secondary"}>{isSpeechEnabled ? "🔊" : "🔇"}</button>
                </div>
                <div className="speed-ctrl">
                  <span>Speed</span>
                  <input type="range" min="100" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
                </div>
              </div>
            </aside>

            <div className="canvas-area">
              <svg ref={svgRef} viewBox="0 0 680 480" onPointerMove={handleMove} onPointerUp={() => setDragging(null)}>
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="7" refX="24" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="currentColor" /></marker>
                </defs>
                {step.edges.map((edge, i) => {
                  const from = nodePositions[edge.from]; const to = nodePositions[edge.to];
                  if (!from || !to) return null;
                  return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge active" markerEnd="url(#arrow)" />;
                })}
                {Object.keys(step.indegree).map(c => {
                  const pos = nodePositions[c]; if (!pos) return null;
                  const sorted = step.sorted.includes(c); const queued = step.queue.includes(c);
                  return (
                    <g key={c} className={`node ${sorted ? 'visited' : ''} ${queued ? 'active' : ''}`} onPointerDown={() => setDragging(c)}>
                      <circle cx={pos.x} cy={pos.y} r="22" />
                      <text x={pos.x} y={pos.y + 5}>{c}</text>
                      {!sorted && <text x={pos.x} y={pos.y + 36} className="metrics-label">In: {step.indegree[c]}</text>}
                    </g>
                  );
                })}
              </svg>
              <div className="gesture-hint-canvas">
                 ↔️ Drag nodes to reposition • 🖱️ Update dictionary above
              </div>
            </div>

            <div className="inspector-panel movable-panel">
               <div className="inspector-group">
                  <div className="group-header"><Languages size={14} /> Dictionary</div>
                  <div className="word-list">
                    {words.map((w, i) => <div key={i} className="word-card">{w}</div>)}
                  </div>
               </div>
               <div className="inspector-group">
                  <div className="group-header"><ListOrdered size={14} /> Result</div>
                  <div className="alphabet-list">
                    {step.sorted.map((c, i) => (
                      <div key={i} className="alpha-item">
                        <span className="rank">{i+1}</span>
                        <span className="char">{c}</span>
                      </div>
                    ))}
                    {step.sorted.length === 0 && <span className="empty">Decoding...</span>}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel2: #172033; --border: #2b3447; --text: #e5e7eb; --muted: #98a2b3; --blue: #4f7ef8; --green: #35c486; --amber: #f5a623; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f7f9fc; --panel: #ffffff; --panel2: #edf2f7; --border: #d7deea; --text: #172033; --muted: #526174; --blue: #285bd6; --green: #087f5b; --amber: #b76705; --red: #c92a2a; }
        
        .hero { padding: 120px 24px 80px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); text-align: center; }
        .hero h1 { margin: 16px 0; font-size: clamp(48px, 9vw, 82px); font-weight: 800; letter-spacing: -0.04em; line-height: 1.1; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .eyebrow { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: var(--blue); }
        .content-width { max-width: 1200px; margin: 0 auto; }
        .description { font-size: 19px; max-width: 800px; margin: 24px auto 40px; line-height: 1.6; color: var(--muted); }
        .complexity-tag-group { display: flex; justify-content: center; gap: 16px; margin-bottom: 48px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .complexity-tag .value { font-size: 20px; font-weight: 700; color: var(--blue); font-family: monospace; }

        .detailed-guide { max-width: 1120px; margin: 0 auto; padding: 80px 24px; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; }
        .guide-card h2 { font-size: 18px; margin-bottom: 16px; font-weight: 700; }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--blue); }

        .simulator { padding: 60px 24px 100px; border-top: 1px solid var(--border); }
        .editor-bar { max-width: 1300px; margin: 0 auto 24px; display: flex; gap: 12px; align-items: center; }
        .input-field { flex: 1; height: 48px; background: var(--panel); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; padding: 0 16px; gap: 12px; }
        .input-field input { background: transparent; border: none; color: var(--text); flex: 1; outline: none; font-family: monospace; font-size: 14px; }
        .reset-btn { height: 48px; padding: 0 24px; border-radius: 12px; background: var(--panel); border: 1px solid var(--border); color: var(--muted); font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .reset-btn:hover { border-color: var(--red); color: var(--red); }

        .workspace { display: grid; grid-template-columns: 320px 1fr 240px; gap: 40px; max-width: 1300px; margin: 0 auto; background: var(--panel); padding: 40px; border: 1px solid var(--border); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 20px; }
        .status-panel { display: flex; flex-direction: column; gap: 20px; }
        .panel-header { display: flex; align-items: center; gap: 8px; color: var(--muted); }
        .panel-header h2 { font-size: 10px; font-weight: 800; text-transform: uppercase; }
        .status-msg { font-size: 14px; line-height: 1.5; min-height: 60px; color: var(--text); font-weight: 500; }
        
        .queue-viz { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; background: var(--bg); border-radius: 12px; border: 1px solid var(--border); }
        .q-item { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: var(--panel2); border: 1px solid var(--blue); color: var(--blue); border-radius: 8px; font-weight: 800; font-family: monospace; }

        .playback-controls { display: flex; flex-wrap: wrap; gap: 8px; }
        .playback-controls button { height: 40px; min-width: 40px; border-radius: 10px; background: var(--bg); display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .playback-controls button.play-btn { background: var(--blue); color: white; border: none; flex: 2; }
        .playback-controls button.active { border-color: var(--blue); color: var(--blue); }
        
        .speed-ctrl { display: flex; flex-direction: column; gap: 8px; font-size: 11px; color: var(--muted); font-weight: 700; }
        .speed-ctrl input { width: 100%; accent-color: var(--blue); }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 16px; border: 1px solid var(--border); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        svg { width: 100%; height: 500px; cursor: crosshair; }
        .edge { stroke: var(--border); stroke-width: 2.5; opacity: 0.3; transition: all 0.3s; }
        .edge.active { opacity: 1; stroke: var(--blue); }
        .node circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; cursor: grab; }
        .node.visited circle { fill: var(--green); stroke: var(--green); }
        .node.active circle { stroke: var(--amber); stroke-width: 5; stroke-dasharray: 4; animation: rotate 10s linear infinite; }
        .node:active circle { cursor: grabbing; }
        .node text { fill: var(--text); font-size: 15px; text-anchor: middle; font-weight: 800; pointer-events: none; font-family: monospace; }
        .node.visited text { fill: white; }
        .metrics-label { font-size: 10px; fill: var(--muted); font-weight: 700; text-anchor: middle; font-family: monospace; }

        .inspector-panel { display: flex; flex-direction: column; gap: 40px; border-left: 1px solid var(--border); padding-left: 24px; }
        .inspector-group { display: flex; flex-direction: column; gap: 12px; }
        .group-header { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
        .word-list { display: flex; flex-direction: column; gap: 6px; }
        .word-card { padding: 8px 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; font-family: monospace; font-size: 13px; color: var(--muted); }
        .alphabet-list { display: flex; flex-direction: column; gap: 4px; }
        .alpha-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: color-mix(in srgb, var(--green) 10%, transparent); border-radius: 8px; color: var(--green); }
        .alpha-item .rank { font-size: 10px; opacity: 0.6; }
        .alpha-item .char { font-weight: 900; font-family: monospace; font-size: 16px; }
        .empty { font-size: 11px; color: var(--muted); font-style: italic; }
        .gesture-hint-canvas { position: absolute; bottom: 12px; right: 12px; font-size: 9px; color: var(--muted); }

        .workspace > aside,
        .workspace > .inspector-panel,
        .workspace > .side-panel,
        .workspace > .control-panel,
        .workspace > .visual-panel,
        .workspace > .data-panel {
          resize: both;
          overflow: auto;
          min-width: 180px;
          min-height: 140px;
          max-width: 640px;
          max-height: 720px;
        }
        .movable-panel { cursor: grab; }
        .movable-panel:active { cursor: grabbing; }

        @media (max-width: 1400px) { .workspace { grid-template-columns: 1fr; } .inspector-panel { border-left: none; border-top: 1px solid var(--border); padding-left: 0; padding-top: 24px; } }
      `}</style>
    </main>
  );
}


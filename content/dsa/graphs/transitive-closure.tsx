"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, Table, Share2, MousePointer2, Grid3X3 } from "lucide-react";

interface TransitiveStep {
  matrix: number[][];
  i?: number;
  j?: number;
  k?: number;
  message: string;
}

const INITIAL_NODES = [
  { id: 0, x: 100, y: 150 },
  { id: 1, x: 300, y: 100 },
  { id: 2, x: 300, y: 250 },
  { id: 3, x: 500, y: 150 },
];

const INITIAL_ADJ = [
  [1, 1, 0, 1],
  [0, 1, 1, 0],
  [0, 0, 1, 1],
  [0, 0, 0, 1],
];

function generateTransitiveSteps(adj: number[][]): TransitiveStep[] {
  const n = adj.length;
  const matrix = adj.map(row => [...row]);
  const steps: TransitiveStep[] = [];

  steps.push({
    matrix: matrix.map(row => [...row]),
    message: "Initializing reachability matrix from the input adjacency matrix. Reflexive paths (nodes to themselves) are pre-filled."
  });

  for (let k = 0; k < n; k++) {
    steps.push({
      matrix: matrix.map(row => [...row]),
      k,
      message: `Phase ${k}: Checking if any pair of nodes (i, j) can now reach each other via intermediate node ${k}.`
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (!matrix[i][j] && (matrix[i][k] && matrix[k][j])) {
          matrix[i][j] = 1;
          steps.push({
            matrix: matrix.map(row => [...row]),
            i, j, k,
            message: `New reachability discovered! Path found from ${i} to ${j} through intermediate ${k}.`
          });
        }
      }
    }
  }

  steps.push({
    matrix: matrix.map(row => [...row]),
    message: "Transitive Closure complete. The matrix now reflects all possible indirect connections in the graph."
  });

  return steps;
}

export default function TransitiveClosureSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [adj, setAdj] = useState<number[][]>(INITIAL_ADJ);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [dragging, setDragging] = useState<number | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const steps = useMemo(() => generateTransitiveSteps(adj), [adj]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

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

  const toggleEdge = (i: number, j: number) => {
    if (playing) return;
    const newAdj = adj.map((row, ri) => ri === i ? row.map((val, ci) => ci === j ? (val === 1 ? 0 : 1) : val) : [...row]);
    setAdj(newAdj);
    setStepIndex(0);
  };

  const svgPoint = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }, []);

  const handleMove = (e: React.PointerEvent) => {
    if (dragging === null) return;
    const pt = svgPoint(e);
    setNodes(prev => prev.map(n => n.id === dragging ? { ...n, x: Math.max(40, Math.min(560, pt.x)), y: Math.max(40, Math.min(410, pt.y)) } : n));
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Matrix Algorithms</div>
          <h1>Transitive Closure</h1>
          <p className="description">
            Determine reachability between all pairs of vertices in a directed graph. 
            Using a variation of the <strong>Floyd-Warshall</strong> algorithm, we iteratively discover transitive paths <code>i → k → j</code> in <code>O(V³)</code>.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Time Complexity</span>
              <span className="value">O(V³)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Space Complexity</span>
              <span className="value">O(V²)</span>
            </div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Start Interactive Simulator</a></div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Table size={20} /></div>
            <h3>Reachability Matrix</h3>
            <p>The output is a boolean matrix where <code>M[i][j] = 1</code> indicates that a path exists from <code>i</code> to <code>j</code>, no matter how many edges it takes.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Share2 size={20} /></div>
            <h3>Path Materialization</h3>
            <p>This algorithm "materializes" abstract connectivity into direct matrix entries, which is crucial for static analysis and logic inference.</p>
          </div>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Logic Pipeline</h2>
            </div>
            
            <div className="status-message">
              {step.message}
            </div>

            <div className="data-section">
              <div className="section-header">
                <Grid3X3 size={14} />
                <h3>Reachability Matrix</h3>
              </div>
              <div className="matrix-wrapper">
                <table>
                  <thead>
                    <tr><th></th>{adj.map((_, i) => <th key={i}>{i}</th>)}</tr>
                  </thead>
                  <tbody>
                    {step.matrix.map((row, i) => (
                      <tr key={i}>
                        <th>{i}</th>
                        {row.map((val, j) => {
                          const isCurrent = step.i === i && step.j === j;
                          const isK = step.k === i || step.k === j;
                          const isEditable = stepIndex === 0 && !playing;
                          return (
                            <td key={j} 
                              className={`${val ? 'active' : ''} ${isCurrent ? 'target' : ''} ${isK ? 'intermediate' : ''} ${isEditable ? 'editable' : ''}`}
                              onClick={() => isEditable && toggleEdge(i, j)}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="playback-controls">
              <div className="buttons">
                <button onClick={() => { setStepIndex(0); setPlaying(false); }} className="secondary"><RotateCcw size={16} /></button>
                <button onClick={() => setStepIndex(i => Math.max(0, i - 1))} className="secondary"><ChevronLeft size={20} /></button>
                <button onClick={() => setPlaying(!playing)} className="primary">
                  {playing ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={() => setStepIndex(i => Math.min(steps.length - 1, i + 1))} className="secondary"><ChevronRight size={20} /></button>
                <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "secondary active" : "secondary"}>{isSpeechEnabled ? "🔊" : "🔇"}</button>
              </div>
              <div className="speed-slider">
                <span>Speed</span>
                <input type="range" min="100" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
              </div>
              <button className="reset-btn" onClick={() => { setAdj(INITIAL_ADJ); setStepIndex(0); setPlaying(false); }}>Reset Matrix</button>
            </div>
          </aside>

          <div className="canvas-area">
            <svg ref={svgRef} viewBox="0 0 600 450" onPointerMove={handleMove} onPointerUp={() => setDragging(null)}>
              <defs>
                <marker id="tc-arrow" markerWidth="10" markerHeight="7" refX="24" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
                <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {step.matrix.map((row, i) => row.map((val, j) => {
                if (i === j || !val) return null;
                const from = nodes[i];
                const to = nodes[j];
                const isDirect = adj[i][j];
                const isCurrent = step.i === i && step.j === j;
                
                return (
                  <line key={`${i}-${j}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                    className={`edge ${isDirect ? 'direct' : 'transitive'} ${isCurrent ? 'active' : ''}`} 
                    markerEnd="url(#tc-arrow)"
                  />
                );
              }))}

              {nodes.map(node => {
                const i = node.id;
                const isI = step.i === i;
                const isJ = step.j === i;
                const isK = step.k === i;

                return (
                  <g key={node.id} className={`node-group ${isI ? 'node-i' : ''} ${isJ ? 'node-j' : ''} ${isK ? 'node-k' : ''}`}
                    onPointerDown={(e) => { e.stopPropagation(); setDragging(node.id); }}
                  >
                    <circle cx={node.x} cy={node.y} r="25" className="node-circle" />
                    <text x={node.x} y={node.y} dy="0.35em" className="node-text">{node.id}</text>
                  </g>
                );
              })}
            </svg>
            <div className="gesture-hint-canvas">
               🖱️ Click Matrix cells to toggle connections • ↔️ Drag nodes to move
            </div>
            <div className="legend">
              <div className="legend-item"><span className="line direct"></span> Direct Edge</div>
              <div className="legend-item"><span className="line transitive"></span> Transitive Path</div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #4f46e5; --accent-light: #818cf8; --green: #10b981; --amber: #f59e0b; --purple: #a855f7; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f8fafc; --panel: #ffffff; --panel-light: #f1f5f9; --border: #e2e8f0; --text: #0f172a; --text-dim: #64748b; --accent: #4f46e5; --accent-light: #6366f1; --purple: #9333ea; }
        
        .hero { padding: 80px 24px; text-align: center; border-bottom: 1px solid var(--border); }
        .hero .content-width { max-width: 800px; margin: 0 auto; }
        .badge { display: inline-block; padding: 4px 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent-light); border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
        .hero h1 { font-size: 56px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 24px; }
        .description { font-size: 18px; color: var(--text-dim); line-height: 1.6; margin-bottom: 40px; }
        .complexity-grid { display: flex; justify-content: center; gap: 40px; }
        .complexity-item { display: flex; flex-direction: column; align-items: center; }
        .complexity-item .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-dim); margin-bottom: 4px; }
        .complexity-item .value { font-size: 24px; font-weight: 800; color: var(--accent-light); font-family: monospace; }

        .guide { padding: 60px 24px; background: color-mix(in srgb, var(--panel) 50%, transparent); }
        .guide-content { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .card { padding: 48px; background: var(--panel); border: 1px solid var(--border); border-radius: 24px; }
        .card.highlight { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 5%, var(--panel)); }
        .card-icon { width: 40px; height: 40px; border-radius: 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent-light); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .card p { color: var(--text-dim); font-size: 14px; line-height: 1.6; }

        .simulator { padding: 60px 24px; }
        .workspace { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 360px 1fr; gap: 48px; background: var(--panel); padding: 48px; border-radius: 32px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 40px; }
        .panel-header { display: flex; align-items: center; gap: 12px; color: var(--text-dim); }
        .panel-header h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-message { padding: 20px; background: var(--panel-light); border-radius: 16px; border: 1px solid var(--border); font-size: 14px; line-height: 1.5; color: var(--text); font-weight: 500; min-height: 80px; }
        
        .section-header { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px; }
        .matrix-wrapper { overflow-x: auto; padding: 12px; background: var(--bg); border-radius: 16px; border: 1px solid var(--border); }
        table { width: 100%; border-collapse: separate; border-spacing: 4px; }
        th, td { width: 36px; height: 36px; text-align: center; font-family: monospace; font-size: 14px; border-radius: 6px; }
        th { color: var(--text-dim); font-size: 10px; font-weight: 800; }
        td { background: var(--panel-light); border: 1px solid var(--border); color: var(--text-dim); transition: all 0.2s; cursor: default; }
        td.editable { cursor: pointer; }
        td.editable:hover { border-color: var(--accent); color: var(--accent); }
        td.active { background: color-mix(in srgb, var(--accent) 15%, var(--panel-light)); color: var(--accent-light); border-color: var(--accent); font-weight: 900; }
        td.target { background: var(--accent); color: white; border-color: var(--accent); box-shadow: 0 0 15px var(--accent); }
        td.intermediate { border: 2px solid var(--purple); color: var(--purple); }

        .playback-controls { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 16px; }
        .buttons { display: flex; flex-wrap: wrap; gap: 12px; }
        .buttons button { flex: 1; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; border: none; }
        .buttons button.primary { background: var(--accent); color: white; }
        .buttons button.secondary { background: var(--panel-light); color: var(--text); border: 1px solid var(--border); }
        .buttons button.active { border-color: var(--accent); color: var(--accent-light); }
        .speed-slider { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-dim); }
        .speed-slider input { flex: 1; accent-color: var(--accent); }
        .reset-btn { height: 38px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border); color: var(--text-dim); font-size: 11px; font-weight: 700; cursor: pointer; }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); position: relative; overflow: hidden; padding: 20px; }
        svg { width: 100%; height: 450px; background: radial-gradient(var(--border) 1px, transparent 1px); background-size: 30px 30px; }
        .edge { stroke: var(--border); stroke-width: 2.5; opacity: 0.3; transition: all 0.3s; pointer-events: none; }
        .edge.direct { stroke: var(--accent-light); opacity: 0.4; }
        .edge.transitive { stroke: var(--purple); stroke-dasharray: 4; opacity: 0.4; }
        .edge.active { stroke: var(--accent); stroke-width: 5; opacity: 1; stroke-dasharray: 8 4; animation: flow 1s linear infinite; }
        @keyframes flow { to { stroke-dashoffset: -12; } }
        
        .node-group { transition: all 0.4s; cursor: grab; }
        .node-circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; }
        .node-text { fill: var(--text); font-weight: 800; font-size: 14px; text-anchor: middle; pointer-events: none; }
        
        .node-group.node-i .node-circle, .node-group.node-j .node-circle { stroke: var(--accent); stroke-width: 5; }
        .node-group.node-k .node-circle { fill: var(--purple); stroke: var(--purple); filter: url(#node-glow); }
        .node-group.node-k .node-text { fill: white; }
        
        .legend { display: flex; gap: 16px; margin-top: 12px; justify-content: center; position: absolute; bottom: 20px; width: 100%; }
        .legend-item { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: var(--text-dim); }
        .line { width: 24px; height: 2px; border-radius: 2px; }
        .line.direct { background: var(--accent-light); opacity: 0.4; }
        .line.transitive { border-bottom: 2px dashed var(--purple); opacity: 0.6; }
        .gesture-hint-canvas { position: absolute; top: 12px; right: 12px; font-size: 8px; color: var(--text-dim); }
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
      `}</style>
    </main>
  );
}


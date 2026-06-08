"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Network, MousePointer2, Zap, LayoutGrid, Link2 } from "lucide-react";

interface DSUState {
  parent: Record<string, string>;
  rank: Record<string, number>;
  message: string;
  op?: "find" | "union" | "init";
  x?: string;
  y?: string;
  activePath?: string[];
  activeNodes?: string[];
}

const NODES = ["A", "B", "C", "D", "E", "F"];

export default function DSUSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [parent, setParent] = useState<Record<string, string>>(() => {
    const p: Record<string, string> = {};
    NODES.forEach(n => p[n] = n);
    return p;
  });
  const [rank, setRank] = useState<Record<string, number>>(() => {
    const r: Record<string, number> = {};
    NODES.forEach(n => r[n] = 0);
    return r;
  });
  
  const [steps, setSteps] = useState<DSUState[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [selected, setSelected] = useState<string[]>([]);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [dragging, setDragging] = useState<string | null>(null);

  // Initialize node positions
  useEffect(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    NODES.forEach((node, i) => {
       const angle = (i / NODES.length) * 2 * Math.PI;
       positions[node] = { x: 340 + 180 * Math.cos(angle), y: 240 + 120 * Math.sin(angle) };
    });
    setNodePositions(positions);
  }, []);

  const step = steps[Math.min(stepIndex, steps.length - 1)] || { parent, rank, message: "Click two nodes to perform a Union operation, or one node to Find its root." };

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

  const runFind = (node: string) => {
     const history: DSUState[] = [];
     const p = { ...parent };
     const r = { ...rank };

     function findWithSteps(i: string, path: string[] = []): string {
        path.push(i);
        if (p[i] === i) {
           history.push({ parent: { ...p }, rank: { ...r }, op: "find", x: node, activePath: [...path], message: `Found root for '${node}' at '${i}'.` });
           return i;
        }
        history.push({ parent: { ...p }, rank: { ...r }, op: "find", x: node, activePath: [...path], message: `Traversing path from '${i}' to parent '${p[i]}'.` });
        const root = findWithSteps(p[i], path);
        
        // Path Compression
        if (p[i] !== root) {
           p[i] = root;
           history.push({ parent: { ...p }, rank: { ...r }, op: "find", x: node, activePath: [...path], message: `Path Compression: Setting parent of '${i}' directly to root '${root}'.` });
        }
        return root;
     }

     findWithSteps(node);
     setSteps(history);
     setStepIndex(0);
     setPlaying(true);
     setParent(p); // Final state after compression
  };

  const runUnion = (u: string, v: string) => {
    const history: DSUState[] = [];
    const p = { ...parent };
    const r = { ...rank };

    function findRoot(i: string, path: string[]): string {
      path.push(i);
      if (p[i] === i) return i;
      return findRoot(p[i], path);
    }

    const pathU: string[] = [];
    const rootU = findRoot(u, pathU);
    const pathV: string[] = [];
    const rootV = findRoot(v, pathV);

    history.push({ parent: { ...p }, rank: { ...r }, op: "union", x: u, y: v, activeNodes: [u, v], activePath: [...pathU, ...pathV], message: `Locating roots for Union(${u}, ${v}). Roots are ${rootU} and ${rootV}.` });

    if (rootU !== rootV) {
      if (r[rootU] < r[rootV]) {
        p[rootU] = rootV;
        history.push({ parent: { ...p }, rank: { ...r }, op: "union", x: u, y: v, activeNodes: [rootU, rootV], message: `Union by Rank: Root ${rootU} (smaller) now points to Root ${rootV}.` });
      } else if (r[rootU] > r[rootV]) {
        p[rootV] = rootU;
        history.push({ parent: { ...p }, rank: { ...r }, op: "union", x: u, y: v, activeNodes: [rootU, rootV], message: `Union by Rank: Root ${rootV} (smaller) now points to Root ${rootU}.` });
      } else {
        p[rootV] = rootU;
        r[rootU]++;
        history.push({ parent: { ...p }, rank: { ...r }, op: "union", x: u, y: v, activeNodes: [rootU, rootV], message: `Ranks equal. Merging Root ${rootV} into ${rootU} and incrementing ${rootU}'s rank.` });
      }
    } else {
      history.push({ parent: { ...p }, rank: { ...r }, op: "union", x: u, y: v, activeNodes: [rootU], message: `${u} and ${v} are already in the same connected component.` });
    }

    setSteps(history);
    setStepIndex(0);
    setPlaying(true);
    setParent(p);
    setRank(r);
  };

  const handleNodeClick = (node: string) => {
    if (playing) return;
    const nextSelected = [...selected, node];
    if (nextSelected.length === 1) {
       setSelected(nextSelected);
    } else {
       if (nextSelected[0] === nextSelected[1]) {
          runFind(node);
       } else {
          runUnion(nextSelected[0], nextSelected[1]);
       }
       setSelected([]);
    }
  };

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
    setNodePositions(prev => ({ ...prev, [dragging]: { x: Math.max(40, Math.min(640, pt.x)), y: Math.max(40, Math.min(440, pt.y)) } }));
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Data Structures • Connectivity</span>
          <h1>Disjoint Set Union (DSU)</h1>
          <p className="description">
            Efficiently manage a collection of disjoint sets. DSU supports <strong>Union</strong> (merging two sets) and <strong>Find</strong> (identifying which set an element belongs to).
          </p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(α(N))</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Start Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card">
            <h2>Find Operation</h2>
            <p>Determines the representative (root) of the set containing an element. Includes path compression for O(1) amortized lookup.</p>
          </article>
          <article className="guide-card">
            <h2>Union Operation</h2>
            <p>Merges two sets by making one root point to the other. Uses rank or size to keep the trees balanced.</p>
          </article>
          <article className="guide-card highlight">
            <h2>Path Compression</h2>
            <p>As we find the root, we update every node on the path to point directly to the root, significantly flattening the tree structure.</p>
          </article>
          <article className="guide-card">
            <h2>Applications</h2>
            <p>Crucial for Kruskal's MST algorithm, cycle detection in undirected graphs, and dynamic connectivity problems.</p>
          </article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="status-panel">
                <div className="panel-header">
                   <Zap size={14} />
                   <h2>Control Center</h2>
                </div>
                <p className="status-msg">{step.message}</p>
                
                <div className="action-feedback">
                  {selected.length === 1 && <div className="hint">Click <b>{selected[0]}</b> again to Find, or another node to Union.</div>}
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
                <button className="reset-btn" onClick={() => { 
                   const p: Record<string, string> = {}; const r: Record<string, number> = {};
                   NODES.forEach(n => { p[n] = n; r[n] = 0; });
                   setParent(p); setRank(r); setSteps([]); setStepIndex(0); setPlaying(false); setSelected([]);
                }}>Reset Structures</button>
              </div>
            </aside>

            <div className="canvas-area">
              <svg ref={svgRef} viewBox="0 0 680 480" onPointerMove={handleMove} onPointerUp={() => setDragging(null)}>
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="22" refY="4" orient="auto"><path d="M0,0 L0,8 L8,4 z" fill="currentColor" /></marker>
                </defs>
                {NODES.map(node => {
                  const p = step.parent[node];
                  if (p === node) return null;
                  const from = nodePositions[node]; const to = nodePositions[p];
                  if (!from || !to) return null;
                  const active = step.activePath?.includes(node) && step.parent[node] === p;
                  const dx = to.x - from.x;
                  const dy = to.y - from.y;
                  const dist = Math.sqrt(dx*dx + dy*dy);
                  const midX = (from.x + to.x) / 2 - (dy / dist) * 15;
                  const midY = (from.y + to.y) / 2 + (dx / dist) * 15;
                  
                  return (
                    <path key={node} d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`} className={`edge ${active ? 'active' : ''}`} markerEnd="url(#arrow)" />
                  );
                })}
                {NODES.map(node => {
                  const pos = nodePositions[node]; if (!pos) return null;
                  const isRoot = step.parent[node] === node;
                  const isSelected = selected.includes(node);
                  const isActive = step.activeNodes?.includes(node) || step.x === node || step.y === node;
                  const inPath = step.activePath?.includes(node);
                  
                  return (
                    <g key={node} className={`node ${isRoot ? 'root' : ''} ${isActive ? 'active' : ''} ${inPath ? 'path' : ''} ${isSelected ? 'selected' : ''}`} 
                       onPointerDown={(e) => { e.stopPropagation(); setDragging(node); }}
                       onClick={() => handleNodeClick(node)}
                    >
                      <circle cx={pos.x} cy={pos.y} r="22" />
                      <text x={pos.x} y={pos.y + 5}>{node}</text>
                      {isRoot && <text x={pos.x} y={pos.y - 32} className="root-label">RANK: {step.rank[node]}</text>}
                    </g>
                  );
                })}
              </svg>
              <div className="gesture-hint-canvas">
                 🖱️ Click to Select • ↔️ Drag to Move • ⌖ Two nodes for Union
              </div>
            </div>

            <div className="inspector-panel movable-panel">
               <div className="panel-header">
                  <LayoutGrid size={14} />
                  <span>State Registry</span>
               </div>
               <div className="registry-table">
                  <div className="reg-row header">
                     <span>Node</span><span>Parent</span><span>Rank</span>
                  </div>
                  {NODES.map(node => (
                    <div key={node} className={`reg-row ${step.activePath?.includes(node) ? 'active' : ''}`}>
                       <span className="node-id">{node}</span>
                       <span className="parent-id">{step.parent[node]}</span>
                       <span className="rank-val">{step.rank[node]}</span>
                    </div>
                  ))}
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
        .guide-card.highlight { border-bottom: 4px solid var(--amber); }

        .simulator { padding: 60px 24px 100px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 320px 1fr 220px; gap: 40px; max-width: 1300px; margin: 0 auto; background: var(--panel); padding: 40px; border: 1px solid var(--border); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 20px; }
        .status-panel { display: flex; flex-direction: column; gap: 16px; }
        .panel-header { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
        .status-msg { font-size: 14px; line-height: 1.5; min-height: 60px; color: var(--text); font-weight: 500; }
        
        .action-feedback { min-height: 40px; }
        .hint { font-size: 11px; padding: 10px; background: color-mix(in srgb, var(--blue) 10%, transparent); border-radius: 8px; border: 1px solid var(--blue); color: var(--blue); }

        .playback-controls { display: flex; flex-wrap: wrap; gap: 8px; }
        .playback-controls button { height: 40px; min-width: 40px; border-radius: 10px; background: var(--bg); display: flex; align-items: center; justify-content: center; }
        .playback-controls button.play-btn { background: var(--blue); color: white; border: none; flex: 2; }
        .playback-controls button.active { color: var(--blue); border-color: var(--blue); }
        
        .speed-ctrl { display: flex; flex-direction: column; gap: 8px; font-size: 11px; color: var(--muted); font-weight: 700; }
        .speed-ctrl input { width: 100%; accent-color: var(--blue); }
        .reset-btn { width: 100%; height: 36px; border-radius: 8px; font-size: 11px; font-weight: 700; background: var(--bg); border: 1px solid var(--border); color: var(--muted); }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 16px; border: 1px solid var(--border); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        svg { width: 100%; height: 480px; background: radial-gradient(var(--border) 1px, transparent 1px); background-size: 30px 30px; }
        .edge { fill: none; stroke: var(--border); stroke-width: 2.5; opacity: 0.6; transition: all 0.4s; }
        .edge.active { stroke: var(--blue); stroke-width: 4; opacity: 1; }

        .node circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; cursor: pointer; }
        .node.root circle { stroke: var(--green); stroke-width: 4; }
        .node.active circle { fill: var(--blue); stroke: var(--blue); }
        .node.path circle { stroke: var(--blue); stroke-dasharray: 4; }
        .node.selected circle { stroke: var(--amber); stroke-width: 5; }
        .node text { fill: var(--text); font-size: 13px; text-anchor: middle; font-weight: 800; pointer-events: none; }
        .root-label { font-size: 9px; font-weight: 900; fill: var(--green); text-anchor: middle; }

        .inspector-panel { border-left: 1px solid var(--border); padding-left: 24px; display: flex; flex-direction: column; gap: 16px; }
        .registry-table { display: flex; flex-direction: column; gap: 4px; }
        .reg-row { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 6px 10px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; font-size: 11px; font-family: monospace; }
        .reg-row.header { border: none; background: transparent; color: var(--muted); font-weight: 800; text-transform: uppercase; font-size: 9px; }
        .reg-row.active { border-color: var(--blue); color: var(--blue); }
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


"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, Copy, Cpu, Layers } from "lucide-react";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { from: string; to: string; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; }

interface CloneStep {
  originalNodes: string[];
  clonedNodes: string[];
  clonedEdges: { from: string; to: string }[];
  visited: Record<string, string>; // original -> cloned
  u?: string;
  message: string;
}

const INITIAL_NODES: GraphNode[] = [
  { id: "1", x: 150, y: 50 },
  { id: "2", x: 250, y: 150 },
  { id: "3", x: 150, y: 250 },
  { id: "4", x: 50, y: 150 },
  { id: "5", x: 150, y: 150 },
];

const INITIAL_EDGES: GraphEdge[] = [
  { from: "1", to: "2" },
  { from: "2", to: "3" },
  { from: "3", to: "4" },
  { from: "4", to: "1" },
  { from: "1", to: "5" },
  { from: "5", to: "3" },
];

function generateCloneSteps(nodes: GraphNode[], edges: GraphEdge[]): CloneStep[] {
  const visited: Record<string, string> = {};
  const clonedEdges: { from: string; to: string }[] = [];
  const steps: CloneStep[] = [];
  const nodeIds = nodes.map(n => n.id);

  if (nodeIds.length === 0) return [];

  steps.push({
    originalNodes: nodeIds,
    clonedNodes: [],
    clonedEdges: [],
    visited: {},
    message: "Initialization: Preparing to perform a deep copy of the graph using DFS traversal."
  });

  const adj: Record<string, string[]> = {};
  nodeIds.forEach(id => adj[id] = []);
  edges.forEach(e => {
    if (adj[e.from]) adj[e.from].push(e.to);
    if (adj[e.to]) adj[e.to].push(e.from);
  });

  function clone(u: string) {
    const clonedId = `C${u}`;
    visited[u] = clonedId;

    steps.push({
      originalNodes: nodeIds,
      clonedNodes: Object.values(visited),
      clonedEdges: [...clonedEdges],
      visited: { ...visited },
      u,
      message: `Cloning node ${u}. Created new instance ${clonedId} and registered in the reference map.`
    });

    for (const v of adj[u]) {
      if (!visited[v]) {
        clone(v);
      }
      
      const fromClone = visited[u];
      const toClone = visited[v];

      const exists = clonedEdges.some(e => 
        (e.from === fromClone && e.to === toClone) || 
        (e.from === toClone && e.to === fromClone)
      );

      if (!exists) {
        clonedEdges.push({ from: fromClone, to: toClone });
        steps.push({
          originalNodes: nodeIds,
          clonedNodes: Object.values(visited),
          clonedEdges: [...clonedEdges],
          visited: { ...visited },
          u,
          message: `Mapping edge: (${u} ↔ ${v}) in original to (${fromClone} ↔ ${toClone}) in the deep copy.`
        });
      }
    }
  }

  clone(nodeIds[0]);

  steps.push({
    originalNodes: nodeIds,
    clonedNodes: Object.values(visited),
    clonedEdges: [...clonedEdges],
    visited: { ...visited },
    message: "Deep copy successful. All nodes and edges have been recreated as independent objects in memory."
  });

  return steps;
}

export default function CloneGraphSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [graph, setGraph] = useState<GraphData>(() => ({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const steps = useMemo(() => generateCloneSteps(graph.nodes, graph.edges), [graph]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || (steps.length ? steps[0] : { originalNodes: [], clonedNodes: [], clonedEdges: [], visited: {}, message: "Add nodes to original graph." });

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

  const handleCanvasClick = (e: React.PointerEvent) => {
    if (e.target !== svgRef.current) return;
    const pt = svgPoint(e);
    const id = nodeName.trim() || `${graph.nodes.length + 1}`;
    if (graph.nodes.some(n => n.id === id)) return;
    setGraph(g => ({ ...g, nodes: [...g.nodes, { id, x: pt.x, y: pt.y }] }));
    setNodeName("");
    setSelected(null);
  };

  const handleNodePointerDown = (e: React.PointerEvent, node: GraphNode) => {
    e.stopPropagation();
    if (e.shiftKey) { setEdgeSource(node.id); setSelected({ type: "node", id: node.id }); } 
    else if (edgeSource && edgeSource !== node.id) {
      const exists = graph.edges.some(ed => (ed.from === edgeSource && ed.to === node.id) || (ed.from === node.id && ed.to === edgeSource));
      if (!exists) setGraph(g => ({ ...g, edges: [...g.edges, { from: edgeSource, to: node.id }] }));
      setEdgeSource(null);
    } else { setDragging(node.id); setSelected({ type: "node", id: node.id }); setEdgeSource(node.id); }
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const pt = svgPoint(e);
    setGraph(g => ({ ...g, nodes: g.nodes.map(n => n.id === dragging ? { ...n, x: Math.max(20, Math.min(280, pt.x)), y: Math.max(20, Math.min(280, pt.y)) } : n) }));
  };

  const handleContextMenu = (e: React.MouseEvent, item: { type: "node" | "edge"; id: string }) => {
    e.preventDefault(); e.stopPropagation();
    if (item.type === "node") {
      setGraph(g => ({ nodes: g.nodes.filter(n => n.id !== item.id), edges: g.edges.filter(ed => ed.from !== item.id && ed.to !== item.id) }));
    } else {
      const [from, to] = item.id.split("-");
      setGraph(g => ({ ...g, edges: g.edges.filter(ed => !((ed.from === from && ed.to === to) || (ed.from === to && ed.to === from))) }));
    }
    setSelected(null);
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Graph Manipulation</div>
          <h1>Clone Graph</h1>
          <p className="description">
            Create a <strong>Deep Copy</strong> of a graph where every node and edge is a new object in memory. 
            We use a reference map to track correspondence during DFS traversal.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Time Complexity</span>
              <span className="value">O(V + E)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Memory Pattern</span>
              <span className="value">Deep Copy</span>
            </div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Start Interactive Simulator</a></div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Copy size={20} /></div>
            <h3>Deep vs Shallow</h3>
            <p>A shallow copy only copies references. A deep copy (cloning) creates entirely new objects so changes to one don't affect the other.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Cpu size={20} /></div>
            <h3>Mapping Table</h3>
            <p>The core is a <code>Map&#60;OriginalNode, ClonedNode&#62;</code>. This prevents infinite cycles and ensures nodes are only cloned once.</p>
          </div>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Clone Inspector</h2>
            </div>
            
            <div className="status-message">
              {step.message}
            </div>

            <div className="data-section">
              <h3>Memory Registry</h3>
              <div className="mapping-table">
                <div className="table-header">
                  <span>Original</span>
                  <span></span>
                  <span>Clone</span>
                </div>
                {Object.entries(step.visited).map(([orig, cloned]) => (
                  <div key={orig} className="table-row">
                    <span className="orig-tag">Node {orig}</span>
                    <span className="arrow">→</span>
                    <span className="clone-tag">Ref {cloned}</span>
                  </div>
                ))}
                {Object.keys(step.visited).length === 0 && <div className="empty">Registry Empty</div>}
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
              <button className="reset-btn" onClick={() => { setGraph({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }); setStepIndex(0); setPlaying(false); }}>Reset Original</button>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="split-view">
              <div className="canvas-pane">
                <span className="pane-label">Original Graph</span>
                <svg ref={svgRef} viewBox="0 0 300 300" onPointerDown={handleCanvasClick} onPointerMove={handleMove} onPointerUp={() => setDragging(null)}>
                  {graph.edges.map((e, i) => {
                    const from = graph.nodes.find(n => n.id === e.from);
                    const to = graph.nodes.find(n => n.id === e.to);
                    if (!from || !to) return null;
                    return (
                      <line key={`${e.from}-${e.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge" onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: `${from.id}-${to.id}` })} />
                    );
                  })}
                  {graph.nodes.map((n) => {
                    const isCurrent = step.u === n.id;
                    const isMapped = !!step.visited[n.id];
                    const isSelected = selected?.id === n.id;
                    return (
                      <g key={n.id} className={`node-group ${isCurrent ? 'active' : ''} ${isMapped ? 'mapped' : ''} ${isSelected ? 'selected' : ''}`}
                        onPointerDown={(e) => handleNodePointerDown(e, n)}
                        onContextMenu={(e) => handleContextMenu(e, { type: "node", id: n.id })}
                      >
                        <circle cx={n.x} cy={n.y} r="18" className="node-circle" />
                        <text x={n.x} y={n.y} dy="0.35em" className="node-text">{n.id}</text>
                      </g>
                    );
                  })}
                </svg>
                <div className="gesture-hint-canvas">
                   🖱️ Click Canvas: Add Node • ↔️ Drag: Move • ⌨️ Shift+Click: Join
                </div>
              </div>

              <div className="canvas-pane accent">
                <span className="pane-label">Cloned Memory</span>
                <svg viewBox="0 0 300 300">
                  {step.clonedEdges.map((e, i) => {
                    const fromId = e.from.replace('C', '');
                    const toId = e.to.replace('C', '');
                    const from = graph.nodes.find(n => n.id === fromId);
                    const to = graph.nodes.find(n => n.id === toId);
                    if (!from || !to) return null;
                    return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge clone-edge" />;
                  })}
                  {step.clonedNodes.map((n) => {
                    const origId = n.replace('C', '');
                    const orig = graph.nodes.find(node => node.id === origId);
                    if (!orig) return null;
                    return (
                      <g key={n} className="node-group cloned">
                        <circle cx={orig.x} cy={orig.y} r="18" className="node-circle" />
                        <text x={orig.x} y={orig.y} dy="0.35em" className="node-text">{n}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #4f46e5; --accent-light: #818cf8; --green: #10b981; --purple: #a855f7; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
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
        
        .mapping-table { background: var(--bg); border: 1px solid var(--border); border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto; }
        .table-header { display: flex; justify-content: space-between; font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--text-dim); padding: 0 8px 8px; border-bottom: 1px solid var(--border); margin-bottom: 4px; }
        .table-row { display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--panel-light); border-radius: 10px; border: 1px solid transparent; transition: all 0.2s; }
        .orig-tag { color: var(--accent-light); font-weight: 800; font-size: 12px; font-family: monospace; }
        .clone-tag { color: var(--purple); font-weight: 800; font-size: 12px; font-family: monospace; }

        .playback-controls { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 16px; }
        .buttons { display: flex; flex-wrap: wrap; gap: 12px; }
        .buttons button { flex: 1; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; border: none; }
        .buttons button.primary { background: var(--accent); color: white; }
        .buttons button.secondary { background: var(--panel-light); color: var(--text); border: 1px solid var(--border); }
        .buttons button.active { border-color: var(--accent); color: var(--accent-light); }
        .speed-slider { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-dim); }
        .speed-slider input { flex: 1; accent-color: var(--accent); }
        .reset-btn { height: 38px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border); color: var(--text-dim); font-size: 11px; font-weight: 700; cursor: pointer; }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); overflow: hidden; padding: 40px; }
        .split-view { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; height: 100%; }
        .canvas-pane { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; display: flex; flex-direction: column; align-items: center; padding: 16px; position: relative; }
        .canvas-pane.accent { border-color: var(--purple); background: color-mix(in srgb, var(--purple) 2%, var(--panel)); }
        .pane-label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px; letter-spacing: 0.1em; }
        svg { width: 100%; height: auto; max-width: 300px; min-height: 300px; background: radial-gradient(var(--border) 1px, transparent 1px); background-size: 20px 20px; }
        
        .edge { stroke: var(--border); stroke-width: 3; stroke-linecap: round; opacity: 0.4; pointer-events: none; }
        .clone-edge { stroke: var(--purple); opacity: 0.8; stroke-dasharray: 4 2; }
        
        .node-group { transition: all 0.4s; cursor: grab; }
        .node-circle { fill: var(--panel-light); stroke: var(--border); stroke-width: 3; }
        .node-text { fill: var(--text); font-weight: 800; font-size: 12px; text-anchor: middle; font-family: monospace; pointer-events: none; }
        
        .node-group.active .node-circle { stroke: var(--accent-light); stroke-width: 5; fill: var(--accent); }
        .node-group.active .node-text { fill: white; }
        .node-group.mapped .node-circle { border-color: var(--accent); stroke: var(--accent-light); }
        .node-group.selected .node-circle { stroke: var(--amber); stroke-width: 4; }
        
        .node-group.cloned .node-circle { fill: color-mix(in srgb, var(--purple) 15%, var(--panel-light)); stroke: var(--purple); stroke-width: 3; }
        .node-group.cloned .node-text { fill: var(--purple); }
        .gesture-hint-canvas { position: absolute; bottom: 8px; right: 8px; font-size: 8px; color: var(--text-dim); pointer-events: none; }
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


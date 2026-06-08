"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, Box, Share2, Layers } from "lucide-react";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; }

interface CondensationStep {
  originalEdges: { from: string; to: string }[];
  sccs: string[][];
  condensedEdges: { from: string; to: string }[];
  currentEdge?: { from: string; to: string };
  message: string;
}

const INITIAL_NODES: GraphNode[] = [
  { id: "A", x: 50, y: 80 },
  { id: "B", x: 170, y: 80 },
  { id: "C", x: 110, y: 200 },
  { id: "D", x: 50, y: 320 },
  { id: "E", x: 170, y: 320 },
  { id: "F", x: 110, y: 440 },
];

const INITIAL_EDGES: GraphEdge[] = [
  { id: "e1", from: "A", to: "B" },
  { id: "e2", from: "B", to: "C" },
  { id: "e3", from: "C", to: "A" },
  { id: "e4", from: "C", to: "D" },
  { id: "e5", from: "D", to: "E" },
  { id: "e6", from: "E", to: "F" },
  { id: "e7", from: "F", to: "D" },
];

function findSCCs(nodes: string[], edges: { from: string; to: string }[]): string[][] {
  let index = 0;
  const stack: string[] = [];
  const onStack: Record<string, boolean> = {};
  const indices: Record<string, number> = {};
  const lowlink: Record<string, number> = {};
  const result: string[][] = [];

  const adj: Record<string, string[]> = {};
  nodes.forEach(n => adj[n] = []);
  edges.forEach(e => { if (adj[e.from]) adj[e.from].push(e.to); });

  function strongconnect(u: string) {
    indices[u] = index;
    lowlink[u] = index;
    index++;
    stack.push(u);
    onStack[u] = true;

    for (const v of adj[u]) {
      if (indices[v] === undefined) {
        strongconnect(v);
        lowlink[u] = Math.min(lowlink[u], lowlink[v]);
      } else if (onStack[v]) {
        lowlink[u] = Math.min(lowlink[u], indices[v]);
      }
    }

    if (lowlink[u] === indices[u]) {
      const component: string[] = [];
      let v: string;
      do {
        v = stack.pop()!;
        onStack[v] = false;
        component.push(v);
      } while (u !== v);
      result.push(component);
    }
  }

  for (const node of nodes) {
    if (indices[node] === undefined) {
      strongconnect(node);
    }
  }
  return result;
}

function generateCondensationSteps(nodes: GraphNode[], edges: GraphEdge[]): CondensationStep[] {
  const nodeIds = nodes.map(n => n.id);
  const sccs = findSCCs(nodeIds, edges);
  const steps: CondensationStep[] = [];
  const condensedEdges: { from: string; to: string }[] = [];

  steps.push({
    originalEdges: edges,
    sccs,
    condensedEdges: [],
    message: "Decompose the graph into Strongly Connected Components (SCCs). Each component will become a single node in the condensed graph."
  });

  for (const edge of edges) {
    const uSCC = sccs.findIndex(scc => scc.includes(edge.from));
    const vSCC = sccs.findIndex(scc => scc.includes(edge.to));

    if (uSCC !== -1 && vSCC !== -1 && uSCC !== vSCC) {
      const from = `SCC ${uSCC + 1}`;
      const to = `SCC ${vSCC + 1}`;
      
      const isNew = !condensedEdges.some(e => e.from === from && e.to === to);
      if (isNew) {
        condensedEdges.push({ from, to });
      }

      steps.push({
        originalEdges: edges,
        sccs,
        condensedEdges: [...condensedEdges],
        currentEdge: edge,
        message: `Edge ${edge.from} → ${edge.to} connects two different components. Adding a super-edge from ${from} to ${to}.`
      });
    } else {
      steps.push({
        originalEdges: edges,
        sccs,
        condensedEdges: [...condensedEdges],
        currentEdge: edge,
        message: `Edge ${edge.from} → ${edge.to} is internal to its SCC. No cross-edge needed.`
      });
    }
  }

  steps.push({
    originalEdges: edges,
    sccs,
    condensedEdges: [...condensedEdges],
    message: "Condensation complete! The resulting graph is always a Directed Acyclic Graph (DAG), simplifying complex structures."
  });

  return steps;
}

export default function GraphCondensationSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [graph, setGraph] = useState<GraphData>(() => ({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("A");
  const [edgeTo, setEdgeTo] = useState("B");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const steps = useMemo(() => generateCondensationSteps(graph.nodes, graph.edges), [graph]);
  const step: CondensationStep = steps[Math.min(stepIndex, steps.length - 1)] || (steps.length ? steps[0] : { originalEdges: [], sccs: [], currentEdge: undefined, condensedEdges: [], message: "Add nodes to start." });

  useEffect(() => {
    let timer: number;
    if (playing && stepIndex < steps.length - 1) {
      timer = window.setInterval(() => setStepIndex(s => s + 1), speed);
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
    const id = nodeName.trim().toUpperCase() || `V${graph.nodes.length}`;
    if (graph.nodes.some(n => n.id === id)) return;
    setGraph(g => ({ ...g, nodes: [...g.nodes, { id, x: pt.x, y: pt.y }] }));
    setNodeName("");
    setSelected(null);
    setEdgeSource(null);
  };

  const addEdge = useCallback((from = edgeFrom, to = edgeTo) => {
    if (!from || !to || from === to) return;
    const edge = { id: `e${graph.edges.length + 1}`, from, to };
    setGraph(g => ({ ...g, edges: [...g.edges, edge] }));
    setSelected({ type: "edge", id: edge.id });
    setEdgeSource(null);
  }, [edgeFrom, edgeTo, graph.edges]);

  const removeSelected = useCallback(() => {
    if (!selected) return;
    setGraph((current) => {
      if (selected.type === "edge") {
        return { ...current, edges: current.edges.filter((e) => e.id !== selected.id) };
      }
      if (current.nodes.length <= 1) return current;
      const nodes = current.nodes.filter((n) => n.id !== selected.id);
      const edges = current.edges.filter((e) => e.from !== selected.id && e.to !== selected.id);
      return { nodes, edges };
    });
    setSelected(null);
  }, [selected]);

  const handleNodePointerDown = (e: React.PointerEvent, node: GraphNode) => {
    e.stopPropagation();
    if (edgeSource === node.id) { setEdgeSource(null); setSelected(null); return; }
    if (edgeSource && edgeSource !== node.id) { addEdge(edgeSource, node.id); setEdgeSource(null); setSelected(null); return; }
    if (e.shiftKey) { setEdgeSource(node.id); setSelected({ type: "node", id: node.id }); } 
    else { setEdgeSource(node.id); setSelected({ type: "node", id: node.id }); setDragging(node.id); }
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const pt = svgPoint(e);
    setGraph(g => ({ ...g, nodes: g.nodes.map(n => n.id === dragging ? { ...n, x: Math.max(20, Math.min(230, pt.x)), y: Math.max(20, Math.min(480, pt.y)) } : n) }));
  };

  const handleContextMenu = (e: React.MouseEvent, item: { type: "node" | "edge"; id: string }) => {
    e.preventDefault(); e.stopPropagation();
    if (item.type === "node") {
      setGraph(g => {
        if (g.nodes.length <= 1) return g;
        const nodes = g.nodes.filter(n => n.id !== item.id);
        const edges = g.edges.filter(ed => ed.from !== item.id && ed.to !== item.id);
        return { nodes, edges };
      });
    } else {
      setGraph(g => ({ ...g, edges: g.edges.filter(ed => ed.id !== item.id) }));
    }
    setSelected(null);
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Graph Theory</div>
          <h1>Graph Condensation</h1>
          <p className="description">
            Transform any directed graph into a <strong>Directed Acyclic Graph (DAG)</strong> by contracting every strongly connected component into a single "super-vertex". 
            This structural abstraction reveals the high-level reachability without the noise of internal cycles.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Complexity</span>
              <span className="value">O(V + E)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Result Type</span>
              <span className="value">DAG</span>
            </div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Layers size={20} /></div>
            <h3>Component Contraction</h3>
            <p>Every node belonging to the same SCC is merged. Internal edges are discarded, and cross-component edges become super-edges.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Share2 size={20} /></div>
            <h3>Hierarchical View</h3>
            <p>Condensation provides a roadmap of the graph's dependency structure, making it easier to perform topological analysis on complex systems.</p>
          </div>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="editor">
          <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node ID" />
          <select value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)}>
            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
          <select value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)}>
            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
          <button onClick={() => addEdge()}>Join</button>
          <button onClick={removeSelected} disabled={!selected}>Remove</button>
          <button onClick={() => { setGraph({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }); setStepIndex(0); setPlaying(false); }}>Reset</button>
        </div>
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Condensation Logic</h2>
            </div>
            
            <div className="status-message">
              {step.message}
            </div>

            <div className="data-section">
              <h3>Strongly Connected Components</h3>
              <div className="scc-stack">
                {step.sccs.map((scc, i) => (
                  <div key={i} className={`scc-group scc-color-${i % 6}`}>
                    <span className="label">SCC {i + 1}</span>
                    <span className="nodes">{scc.join(", ")}</span>
                  </div>
                ))}
                {step.sccs.length === 0 && <span className="empty">No SCCs detected.</span>}
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
                <input type="range" min="100" max="2000" step="100" value={2100 - speed} onChange={(e) => setSpeed(2100 - Number(e.target.value))} />
              </div>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="dual-view">
              <div className="view-panel">
                <h3>Input Graph</h3>
                <svg ref={svgRef} viewBox="0 0 250 500" onPointerDown={handleCanvasClick} onPointerMove={handleMove} onPointerUp={() => setDragging(null)}>
                  <defs>
                    <marker id="input-arrow" markerWidth="8" markerHeight="6" refX="20" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
                    </marker>
                  </defs>
                  {graph.edges.map((edge, i) => {
                    const from = graph.nodes.find(n => n.id === edge.from);
                    const to = graph.nodes.find(n => n.id === edge.to);
                    if (!from || !to) return null;
                    const isActive = step.currentEdge?.from === edge.from && step.currentEdge?.to === edge.to;
                    const isSelected = selected?.type === "edge" && selected.id === edge.id;
                    return (
                      <g key={i} onPointerDown={(e) => { e.stopPropagation(); setSelected({ type: "edge", id: edge.id }); }} onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: edge.id })}>
                        <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`edge ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`} markerEnd="url(#input-arrow)" />
                        <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge-hit" />
                      </g>
                    );
                  })}
                  {graph.nodes.map((n, i) => {
                    const sccIdx = step.sccs.findIndex(scc => scc.includes(n.id));
                    const isSelected = selected?.type === "node" && selected.id === n.id;
                    return (
                      <g key={n.id} transform={`translate(${n.x}, ${n.y})`}
                        onPointerDown={(e) => handleNodePointerDown(e, n)}
                        onContextMenu={(e) => handleContextMenu(e, { type: "node", id: n.id })}
                        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
                      >
                        <circle r="18" className={`node-circle scc-node-${sccIdx === -1 ? 'none' : sccIdx % 6} ${isSelected ? 'selected' : ''}`} />
                        <text dy="0.35em" textAnchor="middle" className="node-text">{n.id}</text>
                      </g>
                    );
                  })}
                </svg>
                <div className="gesture-hint-canvas">
                   🖱️ Click to Add • ↔️ Drag to Move • ⌨️ Shift+Drag to Join
                </div>
              </div>

              <div className="view-panel">
                <h3>Super Graph (DAG)</h3>
                <svg viewBox="0 0 250 500">
                  <defs>
                    <marker id="super-arrow" markerWidth="10" markerHeight="8" refX="35" refY="4" orient="auto">
                      <polygon points="0 0, 10 4, 0 8" fill="currentColor" />
                    </marker>
                    <filter id="super-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  {step.condensedEdges.map((e, i) => {
                    const fromIdx = step.sccs.findIndex(scc => `SCC ${step.sccs.indexOf(scc) + 1}` === e.from);
                    const toIdx = step.sccs.findIndex(scc => `SCC ${step.sccs.indexOf(scc) + 1}` === e.to);
                    if (fromIdx === -1 || toIdx === -1) return null;
                    const fromY = 60 + fromIdx * 70;
                    const toY = 60 + toIdx * 70;
                    return <line key={i} x1="125" y1={fromY} x2="125" y2={toY} className="edge super" markerEnd="url(#super-arrow)" />;
                  })}
                  {step.sccs.map((_, i) => (
                    <g key={i} transform={`translate(125, ${60 + i * 70})`}>
                      <rect x="-45" y="-20" width="90" height="40" rx="10" className={`super-node scc-node-${i % 6}`} />
                      <text dy="0.35em" textAnchor="middle" className="node-text">SCC {i + 1}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #4f46e5; --accent-light: #818cf8; --green: #10b981; --purple: #a855f7; --amber: #f59e0b; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f8fafc; --panel: #ffffff; --panel-light: #f1f5f9; --border: #e2e8f0; --text: #0f172a; --text-dim: #64748b; --accent: #4f46e5; --accent-light: #6366f1; }
        
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
        
        .scc-stack { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; }
        .scc-group { padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 4px; }
        .scc-group .label { font-size: 10px; font-weight: 800; text-transform: uppercase; opacity: 0.6; }
        .scc-group .nodes { font-weight: 700; font-family: monospace; font-size: 15px; }
        
        .scc-color-0 { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, transparent); color: var(--accent-light); }
        .scc-color-1 { border-color: var(--green); background: color-mix(in srgb, var(--green) 10%, transparent); color: var(--green); }
        .scc-color-2 { border-color: var(--amber); background: color-mix(in srgb, var(--amber) 10%, transparent); color: var(--amber); }
        .scc-color-3 { border-color: var(--purple); background: color-mix(in srgb, var(--purple) 10%, transparent); color: var(--purple); }

        .playback-controls { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); }
        .buttons { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
        .buttons button { flex: 1; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; border: none; }
        .buttons button.primary { background: var(--accent); color: white; }
        .buttons button.secondary { background: var(--panel-light); color: var(--text); border: 1px solid var(--border); }
        .buttons button.active { border-color: var(--accent); color: var(--accent-light); }
        .speed-slider { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-dim); }
        .speed-slider input { flex: 1; accent-color: var(--accent); }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); position: relative; overflow: hidden; }
        .dual-view { display: flex; height: 100%; min-height: 500px; }
        .view-panel { flex: 1; display: flex; flex-direction: column; padding: 20px; border-right: 1px solid var(--border); position: relative; }
        .view-panel:last-child { border-right: none; }
        .view-panel h3 { font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--text-dim); margin-bottom: 20px; text-align: center; }
        svg { flex: 1; width: 100%; background: radial-gradient(var(--border) 1px, transparent 1px); background-size: 20px 20px; }
        
        .edge { stroke: var(--border); stroke-width: 2.5; opacity: 0.4; transition: all 0.3s; pointer-events: none; }
        .edge.active { stroke: var(--accent-light); stroke-width: 5; opacity: 1; stroke-dasharray: 8 4; animation: flow 1s linear infinite; }
        .edge.selected { stroke: var(--amber); opacity: 1; stroke-width: 4; }
        .edge.super { stroke: var(--purple); stroke-width: 4; opacity: 1; filter: url(#super-glow); }
        @keyframes flow { to { stroke-dashoffset: -12; } }
        .edge-hit { stroke: transparent; stroke-width: 20; fill: none; cursor: pointer; }

        .node-circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; }
        .super-node { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; }
        .node-text { fill: var(--text); font-weight: 800; font-size: 13px; pointer-events: none; text-anchor: middle; font-family: monospace; }
        
        .scc-node-0 { stroke: var(--accent); }
        .scc-node-1 { stroke: var(--green); }
        .scc-node-2 { stroke: var(--amber); }
        .scc-node-3 { stroke: var(--purple); }
        .node-circle.selected { stroke-width: 6; }

        .editor { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; max-width: 1400px; margin-left: auto; margin-right: auto; }
        .editor input, .editor select, .editor button { height: 38px; border-radius: 8px; border: 1px solid var(--border); background: var(--panel); color: var(--text); padding: 0 12px; }
        .editor button:hover { border-color: var(--accent); }
        .gesture-hint-canvas { position: absolute; bottom: 8px; right: 8px; font-size: 9px; color: var(--text-dim); pointer-events: none; }
        .empty { font-size: 11px; color: var(--text-dim); font-style: italic; }
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


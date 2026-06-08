"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, Waypoints, GitCommit } from "lucide-react";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; }

interface HamiltonStep {
  path: string[];
  visited: string[];
  u?: string;
  isCycle: boolean;
  message: string;
}

const INITIAL_NODES: GraphNode[] = [
  { id: "A", x: 300, y: 80 },
  { id: "B", x: 120, y: 220 },
  { id: "C", x: 480, y: 220 },
  { id: "D", x: 210, y: 380 },
  { id: "E", x: 390, y: 380 },
];

const INITIAL_EDGES: GraphEdge[] = [
  { id: "e1", from: "A", to: "B" }, { id: "e2", from: "A", to: "C" },
  { id: "e3", from: "B", to: "C" }, { id: "e4", from: "B", to: "D" },
  { id: "e5", from: "C", to: "E" }, { id: "e6", from: "D", to: "E" },
  { id: "e7", from: "A", to: "D" }, { id: "e8", from: "C", to: "D" },
  { id: "e9", from: "B", to: "E" },
];

function cloneGraph(graph: GraphData): GraphData {
  return {
    nodes: graph.nodes.map(n => ({ ...n })),
    edges: graph.edges.map(e => ({ ...e })),
  };
}

function nextNodeId(nodes: GraphNode[]) {
  const ids = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (const id of ids) {
    if (!nodes.some(n => n.id === id)) return id;
  }
  return `V${nodes.length}`;
}

function nextEdgeId(edges: GraphEdge[]) {
  let index = edges.length + 1;
  while (edges.some(e => e.id === `e${index}`)) index++;
  return `e${index}`;
}

function generateHamiltonSteps(nodes: GraphNode[], edges: GraphEdge[]): HamiltonStep[] {
  const steps: HamiltonStep[] = [];
  if (nodes.length === 0) return [];
  
  const adj: Record<string, string[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    if (adj[e.from] && adj[e.to]) {
      adj[e.from].push(e.to);
      adj[e.to].push(e.from);
    }
  });

  const startNode = nodes[0].id;

  function solve(u: string, path: string[], visited: Set<string>) {
    path.push(u);
    visited.add(u);

    steps.push({
      path: [...path],
      visited: Array.from(visited),
      u,
      isCycle: false,
      message: `Visiting ${u}. Path length: ${path.length}.`
    });

    if (path.length === nodes.length) {
      const first = path[0];
      const last = path[path.length - 1];
      if (adj[last].includes(first)) {
        steps.push({
          path: [...path, first],
          visited: Array.from(visited),
          u: first,
          isCycle: true,
          message: `Success! Every vertex visited exactly once, and an edge exists back to ${first}. Hamiltonian Cycle found!`
        });
        return true;
      } else {
        steps.push({
          path: [...path],
          visited: Array.from(visited),
          u,
          isCycle: false,
          message: "Success! Hamiltonian Path discovered. Every vertex visited once."
        });
        return true;
      }
    }

    for (const v of adj[u]) {
      if (!visited.has(v)) {
        if (solve(v, path, visited)) return true;
      }
    }

    path.pop();
    visited.delete(u);
    steps.push({
      path: [...path],
      visited: Array.from(visited),
      u,
      isCycle: false,
      message: `Backtracking from ${u}. No path found from this branch.`
    });
    return false;
  }

  solve(startNode, [], new Set());
  return steps;
}

export default function HamiltonianSimulation() {
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
  const [speed, setSpeed] = useState(1000);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const steps = useMemo(() => generateHamiltonSteps(graph.nodes, graph.edges), [graph]);
  const step: HamiltonStep = steps[Math.min(stepIndex, steps.length - 1)] || (steps.length ? steps[0] : { u: undefined, path: [], visited: [], isCycle: false, message: "Add nodes to start." });

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
    const id = nodeName.trim().toUpperCase() || nextNodeId(graph.nodes);
    if (graph.nodes.some(n => n.id === id)) return;
    setGraph(g => ({ ...g, nodes: [...g.nodes, { id, x: pt.x, y: pt.y }] }));
    setNodeName("");
    setSelected(null);
    setEdgeSource(null);
  };

  const addEdge = useCallback((from = edgeFrom, to = edgeTo) => {
    if (!from || !to || from === to) return;
    const edge = { id: nextEdgeId(graph.edges), from, to };
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
    setGraph(g => ({ ...g, nodes: g.nodes.map(n => n.id === dragging ? { ...n, x: Math.max(40, Math.min(640, pt.x)), y: Math.max(45, Math.min(450, pt.y)) } : n) }));
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
          <div className="badge">Computational Complexity</div>
          <h1>Hamiltonian Path & Cycle</h1>
          <p className="description">
            The problem of finding a path that visits every <strong>vertex</strong> exactly once. 
            This is an <strong>NP-Complete</strong> problem, typically solved using backtracking with exponential time complexity O(N!).
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Complexity</span>
              <span className="value">NP-Complete</span>
            </div>
            <div className="complexity-item">
              <span className="label">Technique</span>
              <span className="value">Backtracking</span>
            </div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Waypoints size={20} /></div>
            <h3>Vertex Visit</h3>
            <p>Unlike Eulerian paths (edges), Hamiltonian paths must cover all vertices exactly once.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><GitCommit size={20} /></div>
            <h3>Backtracking Search</h3>
            <p>The algorithm explores every possible permutation of vertices until it finds a valid sequence or exhausts all options.</p>
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
              <h2>Search Tracker</h2>
            </div>
            
            <div className={`status-message ${step.isCycle ? 'success' : ''}`}>
              {step.message}
            </div>

            <div className="data-section">
              <h3>Current Exploration Path</h3>
              <div className="path-stack">
                {step.path.map((id, i) => (
                  <div key={i} className={`path-node ${i === step.path.length-1 ? 'active' : ''}`}>{id}</div>
                ))}
                {step.path.length === 0 && <span className="empty">Searching...</span>}
              </div>
            </div>

            <div className="data-section">
              <h3>Visitation Status</h3>
              <div className="visit-grid">
                {graph.nodes.map(n => {
                  const isVisited = step.visited.includes(n.id);
                  return (
                    <div key={n.id} className={`visit-box ${isVisited ? 'checked' : ''}`}>
                      <span className="node-id">{n.id}</span>
                      <span className="status-dot" />
                    </div>
                  );
                })}
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
            </div>
          </aside>

          <div className="canvas-area">
            <svg ref={svgRef} viewBox="0 0 600 500" onPointerDown={handleCanvasClick} onPointerMove={handleMove} onPointerUp={() => setDragging(null)}>
              <defs>
                <filter id="h-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {graph.edges.map((edge, i) => {
                const from = graph.nodes.find(n => n.id === edge.from)!;
                const to = graph.nodes.find(n => n.id === edge.to)!;
                if (!from || !to) return null;
                
                const idx1 = step.path.indexOf(edge.from);
                const idx2 = step.path.indexOf(edge.to);
                const isPath = (idx1 !== -1 && idx2 !== -1 && Math.abs(idx1 - idx2) === 1) ||
                               (step.isCycle && ((edge.from === step.path[0] && edge.to === step.path[step.path.length-1]) || (edge.to === step.path[0] && edge.from === step.path[step.path.length-1])));
                const isSelected = selected?.type === "edge" && selected.id === edge.id;

                return (
                  <g key={i} onPointerDown={(e) => { e.stopPropagation(); setSelected({ type: "edge", id: edge.id }); }} onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: edge.id })}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                      className={`edge ${isPath ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                    />
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge-hit" />
                  </g>
                );
              })}

              {graph.nodes.map((node) => {
                const isCurrent = step.u === node.id;
                const isVisited = step.visited.includes(node.id);
                const posInPath = step.path.indexOf(node.id);
                const isSelected = selected?.type === "node" && selected.id === node.id;

                return (
                  <g key={node.id} className={`node-group ${isCurrent ? 'active' : ''} ${isVisited ? 'visited' : ''} ${isSelected ? 'selected' : ''}`}
                    onPointerDown={(e) => handleNodePointerDown(e, node)}
                    onContextMenu={(e) => handleContextMenu(e, { type: "node", id: node.id })}
                    style={{ cursor: dragging ? 'grabbing' : 'grab' }}
                  >
                    <circle cx={node.x} cy={node.y} r="26" className="node-circle" />
                    <text x={node.x} y={node.y} dy="0.35em" className="node-text">{node.id}</text>
                    {posInPath !== -1 && <text x={node.x + 20} y={node.y - 20} className="order-badge">{posInPath + 1}</text>}
                  </g>
                );
              })}
            </svg>
            <div className="gesture-hint-canvas">
               🖱️ Click to Add • ↔️ Drag to Move • ⌨️ Shift+Drag to Join
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #f59e0b; --accent-light: #fbbf24; --green: #10b981; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f8fafc; --panel: #ffffff; --panel-light: #f1f5f9; --border: #e2e8f0; --text: #0f172a; --text-dim: #64748b; --accent: #d97706; --accent-light: #f59e0b; }
        
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
        .status-message.success { border-color: var(--green); color: var(--green); background: color-mix(in srgb, var(--green) 10%, var(--panel-light)); }
        
        .path-stack { display: flex; gap: 8px; flex-wrap: wrap; background: var(--bg); padding: 12px; border-radius: 16px; border: 1px solid var(--border); max-height: 150px; overflow-y: auto; }
        .path-node { padding: 6px 12px; background: var(--panel-light); border-radius: 8px; font-weight: 800; font-size: 12px; color: var(--text-dim); border: 1px solid var(--border); position: relative; }
        .path-node.active { background: var(--accent); color: white; border-color: var(--accent-light); box-shadow: 0 0 15px var(--accent); }
        .path-node:not(:last-child)::after { content: '→'; position: absolute; right: -12px; top: 50%; transform: translateY(-50%); color: var(--text-dim); font-size: 10px; }

        .visit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-height: 150px; overflow-y: auto; }
        .visit-box { background: var(--bg); border: 1px solid var(--border); padding: 12px; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; }
        .visit-box.checked { border-color: var(--green); background: color-mix(in srgb, var(--green) 5%, var(--bg)); }
        .visit-box .node-id { font-weight: 800; font-size: 12px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); }
        .checked .status-dot { background: var(--green); box-shadow: 0 0 8px var(--green); }

        .playback-controls { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); }
        .buttons { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
        .buttons button { flex: 1; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; border: none; }
        .buttons button.primary { background: var(--accent); color: white; }
        .buttons button.secondary { background: var(--panel-light); color: var(--text); border: 1px solid var(--border); }
        .buttons button.active { border-color: var(--accent); color: var(--accent-light); }
        .speed-slider { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-dim); }
        .speed-slider input { flex: 1; accent-color: var(--accent); }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); overflow: hidden; position: relative; }
        svg { width: 100%; height: 500px; background: radial-gradient(var(--border) 1px, transparent 1px); background-size: 34px 34px; }
        .edge { stroke: var(--border); stroke-width: 2.5; opacity: 0.3; transition: all 0.3s; pointer-events: none; }
        .edge.active { stroke: var(--green); stroke-width: 5; opacity: 1; filter: url(#h-glow); }
        .edge.selected { stroke: var(--amber); opacity: 1; stroke-width: 4; }
        .edge-hit { stroke: transparent; stroke-width: 20; fill: none; cursor: pointer; }
        
        .node-group { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: grab; }
        .node-circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; }
        .node-text { fill: var(--text); font-weight: 800; font-size: 14px; text-anchor: middle; font-family: monospace; pointer-events: none; }
        .order-badge { font-size: 10px; font-weight: 900; fill: var(--accent-light); }
        
        .node-group.visited .node-circle { stroke: var(--green); background: color-mix(in srgb, var(--green) 5%, var(--panel)); }
        .node-group.active .node-circle { stroke: var(--accent-light); stroke-width: 5; fill: var(--accent); }
        .node-group.active .node-text { fill: white; }
        .node-group.selected .node-circle { stroke: var(--amber); stroke-width: 5; }

        .editor { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; max-width: 1400px; margin-left: auto; margin-right: auto; }
        .editor input, .editor select, .editor button { height: 38px; border-radius: 8px; border: 1px solid var(--border); background: var(--panel); color: var(--text); padding: 0 12px; }
        .editor button:hover { border-color: var(--accent); }
        .gesture-hint-canvas { position: absolute; bottom: 12px; right: 12px; font-size: 10px; color: var(--text-dim); pointer-events: none; }
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


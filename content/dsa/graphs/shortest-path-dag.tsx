"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, ListOrdered, Navigation } from "lucide-react";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; weight: number; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; }

interface DAGStep {
  type: string;
  topoOrder: string[];
  dist: Record<string, number>;
  u?: string;
  v?: string;
  message: string;
}

const INITIAL_GRAPH: GraphData = {
  nodes: [
    { id: "A", x: 80, y: 250 },
    { id: "B", x: 230, y: 150 },
    { id: "C", x: 230, y: 350 },
    { id: "D", x: 380, y: 150 },
    { id: "E", x: 380, y: 350 },
    { id: "F", x: 520, y: 250 },
  ],
  edges: [
    { id: "e1", from: "A", to: "B", weight: 2 },
    { id: "e2", from: "A", to: "C", weight: 4 },
    { id: "e3", from: "B", to: "C", weight: 1 },
    { id: "e4", from: "B", to: "D", weight: 7 },
    { id: "e5", from: "C", to: "E", weight: 3 },
    { id: "e6", from: "D", to: "E", weight: 2 },
    { id: "e7", from: "D", to: "F", weight: 1 },
    { id: "e8", from: "E", to: "F", weight: 5 },
  ],
};

function cloneGraph(graph: GraphData): GraphData {
  return {
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: graph.edges.map((edge) => ({ ...edge })),
  };
}

function nextNodeId(nodes: GraphNode[]) {
  const ids = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (const id of ids) {
    if (!nodes.some((n) => n.id === id)) return id;
  }
  return `V${nodes.length}`;
}

function nextEdgeId(edges: GraphEdge[]) {
  let index = edges.length + 1;
  while (edges.some((e) => e.id === `e${index}`)) index += 1;
  return `e${index}`;
}

function getTopologicalOrder(nodes: GraphNode[], edges: GraphEdge[]): string[] {
  const order: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();
  let hasCycle = false;

  const adj: Record<string, string[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => adj[e.from].push(e.to));

  function dfs(u: string) {
    if (visiting.has(u)) { hasCycle = true; return; }
    if (visited.has(u)) return;
    visiting.add(u);
    for (const v of adj[u]) {
      dfs(v);
    }
    visiting.delete(u);
    visited.add(u);
    order.push(u);
  }

  nodes.forEach(n => {
    if (!visited.has(n.id)) dfs(n.id);
  });

  return hasCycle ? [] : order.reverse();
}

function generateDAGSteps(nodes: GraphNode[], edges: GraphEdge[]): DAGStep[] {
  const steps: DAGStep[] = [];
  const topoOrder = getTopologicalOrder(nodes, edges);
  if (topoOrder.length === 0 && nodes.length > 0) {
    steps.push({ type: "error", topoOrder: [], dist: {}, message: "Cycle detected! Topological sort only works on DAGs." });
    return steps;
  }

  const dist: Record<string, number> = {};
  nodes.forEach(n => dist[n.id] = Infinity);
  if (topoOrder.length > 0) dist[topoOrder[0]] = 0;

  steps.push({
    type: "init",
    topoOrder,
    dist: { ...dist },
    message: `Initialize: Set Source (${topoOrder[0]}) distance to 0 and others to ∞. Topological order identified.`
  });

  for (const u of topoOrder) {
    if (dist[u] === Infinity) continue;

    steps.push({
      type: "process",
      topoOrder,
      dist: { ...dist },
      u,
      message: `Extracting node ${u} from topological sequence.`
    });

    const neighbors = edges.filter(e => e.from === u);
    for (const edge of neighbors) {
      const v = edge.to;
      const oldDist = dist[v];
      const newDist = dist[u] + edge.weight;
      
      if (newDist < dist[v]) {
        dist[v] = newDist;
        steps.push({
          type: "relax",
          topoOrder,
          dist: { ...dist },
          u, v,
          message: `Relaxing ${u}→${v}: New distance is ${newDist} (was ${oldDist === Infinity ? '∞' : oldDist}).`
        });
      } else {
        steps.push({
          type: "skip",
          topoOrder,
          dist: { ...dist },
          u, v,
          message: `Relaxing ${u}→${v}: No update needed. Current dist[${v}] (${dist[v]}) is optimal.`
        });
      }
    }
  }

  steps.push({
    type: "done",
    topoOrder,
    dist: { ...dist },
    message: "Shortest path computation complete for all reachable nodes in the DAG."
  });

  return steps;
}

export default function ShortestPathDAGSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [graph, setGraph] = useState(() => cloneGraph(INITIAL_GRAPH));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("A");
  const [edgeTo, setEdgeTo] = useState("B");
  const [edgeWeight, setEdgeWeight] = useState(5);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState("");

  const steps = useMemo(() => generateDAGSteps(graph.nodes, graph.edges), [graph]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || (steps.length ? steps[0] : { type: "empty", topoOrder: [], dist: {}, message: "Add nodes to start." });

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
    if (isSpeechEnabled && step) {
      speak(step.message);
    }
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
    const weight = Number(edgeWeight);
    if (!from || !to || from === to || !Number.isFinite(weight)) return;
    const edge = { id: nextEdgeId(graph.edges), from, to, weight };
    setGraph(g => ({ ...g, edges: [...g.edges, edge] }));
    setSelected({ type: "edge", id: edge.id });
    setEdgeSource(null);
  }, [edgeFrom, edgeTo, edgeWeight, graph.edges]);

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
          <div className="badge">DAG Optimization</div>
          <h1>Shortest Path (DAG)</h1>
          <p className="description">
            Find the shortest paths from a source in a <strong>Directed Acyclic Graph</strong> in <code>O(V + E)</code>. 
            By relaxing edges in <strong>topological order</strong>, we guarantee that each node's shortest path is finalized in a single pass.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Time Complexity</span>
              <span className="value">O(V + E)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Space Complexity</span>
              <span className="value">O(V)</span>
            </div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><ListOrdered size={20} /></div>
            <h3>Topological Order</h3>
            <p>Processing nodes in topological order ensures that when we relax edges from node <code>u</code>, its own shortest path distance is already finalized.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Zap size={20} /></div>
            <h3>Linear Efficiency</h3>
            <p>Unlike Dijkstra's, this algorithm doesn't need a priority queue. It simply visits each node and its outgoing edges once, making it optimal for DAGs.</p>
          </div>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-controls editor">
          <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node ID" />
          <select value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)}>
            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
          <select value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)}>
            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
          <input type="number" value={edgeWeight} onChange={(e) => setEdgeWeight(Number(e.target.value))} />
          <button onClick={() => addEdge()}>Join</button>
          <button onClick={removeSelected} disabled={!selected}>Remove</button>
          <button onClick={() => { setGraph(cloneGraph(INITIAL_GRAPH)); setStepIndex(0); setPlaying(false); }}>Reset</button>
        </div>
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Relaxation Pipeline</h2>
            </div>
            
            <div className="status-message">
              {step.message}
            </div>

            <div className="data-section">
              <h3>Topological Sequence</h3>
              <div className="topo-row">
                {step.topoOrder.map((id, idx) => (
                  <div key={idx} className={`topo-token ${step.u === id ? 'active' : ''} ${step.topoOrder.indexOf(step.u!) > idx ? 'finished' : ''}`}>
                    {id}
                  </div>
                ))}
                {step.topoOrder.length === 0 && <div className="error-msg">Cycle Detected!</div>}
              </div>
            </div>

            <div className="data-section">
              <h3>Distance Table</h3>
              <div className="dist-table">
                {graph.nodes.map(n => (
                  <div key={n.id} className={`dist-row ${step.u === n.id ? 'highlight' : ''}`}>
                    <span className="node-id">{n.id}</span>
                    <span className="dist-val">{step.dist?.[n.id] === undefined || step.dist[n.id] === Infinity ? '∞' : step.dist[n.id]}</span>
                  </div>
                ))}
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
            <svg ref={svgRef} viewBox="0 0 600 500" onPointerDown={handleCanvasClick} onPointerMove={handleMove} onPointerUp={() => setDragging(null)}>
              <defs>
                <marker id="dag-arrow" markerWidth="10" markerHeight="7" refX="24" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
                <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {graph.edges.map(edge => {
                const from = graph.nodes.find(n => n.id === edge.from)!;
                const to = graph.nodes.find(n => n.id === edge.to)!;
                if (!from || !to) return null;
                const isActive = step.u === edge.from && step.v === edge.to;
                const isRelaxed = step.dist?.[edge.to] !== undefined && step.dist[edge.to] !== Infinity && step.topoOrder.indexOf(step.u!) > step.topoOrder.indexOf(edge.from);
                const isSelected = selected?.type === "edge" && selected.id === edge.id;

                const edit = (e: React.MouseEvent) => { e.stopPropagation(); setEditingEdgeId(edge.id); setEditingWeight(String(edge.weight)); };
                const commit = () => { const w = Number(editingWeight); if (Number.isFinite(w)) setGraph(g => ({ ...g, edges: g.edges.map(ed => ed.id === editingEdgeId ? { ...ed, weight: w } : ed) })); setEditingEdgeId(null); };

                return (
                  <g key={edge.id} onPointerDown={(e) => { e.stopPropagation(); setSelected({ type: "edge", id: edge.id }); }} onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: edge.id })} onDoubleClick={edit}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                      className={`edge ${isActive ? 'active' : ''} ${isRelaxed ? 'relaxed' : ''} ${isSelected ? 'selected' : ''}`} 
                      markerEnd="url(#dag-arrow)"
                    />
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge-hit" />
                    {editingEdgeId === edge.id ? (
                      <foreignObject x={(from.x+to.x)/2 - 25} y={(from.y+to.y)/2 - 15} width="50" height="30"><input autoFocus className="inline-edit" value={editingWeight} onChange={(e) => setEditingWeight(e.target.value)} onBlur={commit} onKeyDown={(ev) => ev.key === "Enter" && commit()} /></foreignObject>
                    ) : (
                      <g>
                        <rect x={(from.x + to.x)/2 - 12} y={(from.y + to.y)/2 - 10} width="24" height="20" rx="4" className="weight-bg" />
                        <text x={(from.x + to.x)/2} y={(from.y + to.y)/2 + 4} className="edge-weight">{edge.weight}</text>
                      </g>
                    )}
                  </g>
                );
              })}

              {graph.nodes.map(node => {
                const isReached = step.dist?.[node.id] !== undefined && step.dist[node.id] !== Infinity;
                const isCurrent = step.u === node.id;
                const isRelaxing = step.v === node.id;
                const isSelected = selected?.type === "node" && selected.id === node.id;

                return (
                  <g key={node.id} className={`node-group ${isReached ? 'reached' : ''} ${isCurrent ? 'active' : ''} ${isRelaxing ? 'relaxing' : ''} ${isSelected ? 'selected' : ''}`}
                    onPointerDown={(e) => handleNodePointerDown(e, node)}
                    onContextMenu={(e) => handleContextMenu(e, { type: "node", id: node.id })}
                    style={{ cursor: dragging ? 'grabbing' : 'grab' }}
                  >
                    <circle cx={node.x} cy={node.y} r="25" className="node-circle" />
                    <text x={node.x} y={node.y} dy="0.35em" className="node-text">{node.id}</text>
                    <text x={node.x} y={node.y + 40} className="node-dist">dist: {step.dist?.[node.id] === undefined || step.dist[node.id] === Infinity ? '∞' : step.dist[node.id]}</text>
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
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #4f46e5; --accent-light: #818cf8; --green: #10b981; --amber: #f59e0b; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f8fafc; --panel: #ffffff; --panel-light: #f1f5f9; --border: #e2e8f0; --text: #0f172a; --text-dim: #64748b; --accent: #4f46e5; --accent-light: #6366f1; --green: #059669; }
        
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
        
        .topo-row { display: flex; gap: 8px; padding: 12px; background: var(--bg); border-radius: 16px; border: 1px solid var(--border); overflow-x: auto; }
        .topo-token { padding: 6px 12px; background: var(--panel-light); border: 1px solid var(--border); border-radius: 8px; font-weight: 800; font-family: monospace; color: var(--text-dim); }
        .topo-token.active { border-color: var(--accent); color: var(--accent-light); background: color-mix(in srgb, var(--accent) 15%, var(--panel-light)); }
        .topo-token.finished { color: var(--green); border-color: var(--green); opacity: 0.6; }
        .error-msg { color: var(--red); font-size: 12px; font-weight: 700; }

        .dist-table { display: flex; flex-direction: column; gap: 4px; padding: 12px; background: var(--bg); border-radius: 16px; border: 1px solid var(--border); }
        .dist-row { display: flex; justify-content: space-between; padding: 8px 12px; border-radius: 8px; font-family: monospace; transition: all 0.2s; }
        .dist-row.highlight { background: color-mix(in srgb, var(--accent) 15%, transparent); }
        .node-id { font-weight: 800; color: var(--accent-light); }
        .dist-val { font-weight: 900; color: var(--green); }

        .playback-controls { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); }
        .buttons { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
        .buttons button { flex: 1; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; border: none; }
        .buttons button.primary { background: var(--accent); color: white; }
        .buttons button.secondary { background: var(--panel-light); color: var(--text); border: 1px solid var(--border); }
        .buttons button.active { border-color: var(--accent); color: var(--accent-light); }
        .speed-slider { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-dim); }
        .speed-slider input { flex: 1; accent-color: var(--accent); }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); position: relative; overflow: hidden; }
        svg { width: 100%; height: 500px; display: block; background: radial-gradient(var(--border) 1px, transparent 1px); background-size: 34px 34px; }
        .edge { stroke: var(--border); stroke-width: 2.5; opacity: 0.3; transition: all 0.3s; pointer-events: none; }
        .edge.active { stroke: var(--accent-light); stroke-width: 5; opacity: 1; stroke-dasharray: 8 4; animation: flow 1s linear infinite; }
        .edge.relaxed { stroke: var(--green); opacity: 0.8; }
        .edge.selected { stroke: var(--amber); opacity: 1; stroke-width: 4; }
        @keyframes flow { to { stroke-dashoffset: -12; } }
        .edge-hit { stroke: transparent; stroke-width: 20; fill: none; cursor: pointer; }
        
        .weight-bg { fill: var(--panel); stroke: var(--border); stroke-width: 1; }
        .edge-weight { fill: var(--text-dim); font-size: 10px; font-weight: 800; text-anchor: middle; font-family: monospace; }

        .node-group { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: grab; }
        .node-circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; }
        .node-text { fill: var(--text); font-weight: 800; font-size: 14px; text-anchor: middle; pointer-events: none; }
        .node-dist { fill: var(--text-dim); font-size: 10px; font-weight: 700; text-anchor: middle; font-family: monospace; }
        
        .node-group.reached .node-circle { stroke: var(--green); }
        .node-group.active .node-circle { fill: var(--accent); stroke: var(--accent); filter: url(#node-glow); }
        .node-group.active .node-text { fill: white; }
        .node-group.relaxing .node-circle { stroke: var(--accent-light); stroke-width: 5; }
        .node-group.selected .node-circle { stroke: var(--amber); stroke-width: 5; }

        .editor { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; max-width: 1400px; margin-left: auto; margin-right: auto; }
        .editor input, .editor select, .editor button { height: 38px; border-radius: 8px; border: 1px solid var(--border); background: var(--panel); color: var(--text); padding: 0 12px; }
        .editor button:hover { border-color: var(--accent); }
        .gesture-hint-canvas { position: absolute; bottom: 12px; right: 12px; font-size: 10px; color: var(--text-dim); pointer-events: none; }
        .inline-edit { width: 100%; height: 100%; background: var(--panel-light); border: 1px solid var(--accent); color: var(--text); text-align: center; border-radius: 4px; font-size: 12px; }
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


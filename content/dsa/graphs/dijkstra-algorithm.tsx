"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Activity, Zap, MousePointer2 } from "lucide-react";
import { CodeTracker } from "@/components/CodeTracker";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; weight: number; }
interface GraphData { source: string; nodes: GraphNode[]; edges: GraphEdge[]; }

interface DijkstraStep {
  type: string;
  dist: Record<string, number>;
  prev: Record<string, string | null>;
  visited: string[];
  pq: { id: string; dist: number }[];
  u?: string;
  v?: string;
  edge?: string;
  weight?: number;
  line?: number;
}

const initialGraph: GraphData = {
  source: "A",
  nodes: [
    { id: "A", x: 90, y: 190 },
    { id: "B", x: 250, y: 90 },
    { id: "C", x: 450, y: 150 },
    { id: "D", x: 280, y: 305 },
    { id: "E", x: 520, y: 300 },
  ],
  edges: [
    { id: "e1", from: "A", to: "B", weight: 4 },
    { id: "e2", from: "A", to: "D", weight: 8 },
    { id: "e3", from: "B", to: "C", weight: 3 },
    { id: "e4", from: "B", to: "D", weight: 2 },
    { id: "e5", from: "D", to: "E", weight: 1 },
    { id: "e6", from: "C", to: "E", weight: 5 },
  ],
};

function cloneGraph(graph: GraphData): GraphData {
  return {
    source: graph.source,
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: graph.edges.map((edge) => ({ ...edge })),
  };
}

function dijkstraSteps(nodes: GraphNode[], edges: GraphEdge[], source: string): DijkstraStep[] {
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited: string[] = [];
  const steps: DijkstraStep[] = [];

  nodes.forEach((node) => {
    dist[node.id] = node.id === source ? 0 : Infinity;
    prev[node.id] = null;
  });

  const pq = [{ id: source, dist: 0 }];

  steps.push({ type: "init", dist: { ...dist }, prev: { ...prev }, visited: [], pq: [...pq], line: 0 });

  while (pq.length > 0) {
    steps.push({ type: "loop", dist: { ...dist }, prev: { ...prev }, visited: [...visited], pq: [...pq], line: 2 });
    pq.sort((a, b) => a.dist - b.dist);
    const { id: u } = pq.shift()!;
    if (visited.includes(u)) {
      steps.push({ type: "skip", u, dist: { ...dist }, prev: { ...prev }, visited: [...visited], pq: [...pq], line: 4 });
      continue;
    }

    steps.push({ type: "extract_min", u, dist: { ...dist }, prev: { ...prev }, visited: [...visited], pq: [...pq], line: 3 });
    visited.push(u);
    steps.push({ type: "visit", u, dist: { ...dist }, prev: { ...prev }, visited: [...visited], pq: [...pq], line: 3 });

    const neighbors = edges.filter(e => e.from === u);
    for (const edge of neighbors) {
      const v = edge.to;
      const weight = edge.weight;
      steps.push({ type: "check", u, v, edge: edge.id, weight, dist: { ...dist }, prev: { ...prev }, visited: [...visited], pq: [...pq], line: 5 });

      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        prev[v] = u;
        pq.push({ id: v, dist: dist[v] });
        steps.push({ type: "relax", u, v, edge: edge.id, weight, dist: { ...dist }, prev: { ...prev }, visited: [...visited], pq: [...pq], line: 7 });
        steps.push({ type: "enqueue", u, v, edge: edge.id, weight, dist: { ...dist }, prev: { ...prev }, visited: [...visited], pq: [...pq], line: 8 });
      }
    }
  }

  steps.push({ type: "done", dist: { ...dist }, prev: { ...prev }, visited: [...visited], pq: [], line: 2 });
  return steps;
}

function describeStep(step: DijkstraStep) {
  if (!step) return "Ready.";
  if (step.type === "init") return "Initialize source distance to 0 and all others to infinity.";
  if (step.type === "extract_min") return `Extract node ${step.u} with minimum distance from Priority Queue.`;
  if (step.type === "visit") return `Visiting node ${step.u}. Explore its outgoing edges.`;
  if (step.type === "check") return `Checking edge from ${step.u} to ${step.v} (weight ${step.weight}).`;
  if (step.type === "relax") return `Relaxed ${step.v}. Shorter path found! Updated distance to ${step.dist[step.v!]}.`;
  if (step.type === "done") return "Algorithm finished. All shortest paths have been calculated.";
  return "Ready.";
}

function formatDistance(value: number) {
  return value === Infinity ? "∞" : String(value);
}

function nextNodeId(nodes: GraphNode[]) {
  for (let code = 65; code <= 90; code++) {
    const id = String.fromCharCode(code);
    if (!nodes.some((n) => n.id === id)) return id;
  }
  return `N${nodes.length + 1}`;
}

function nextEdgeId(edges: GraphEdge[]) {
  let index = edges.length + 1;
  while (edges.some((e) => e.id === `e${index}`)) index += 1;
  return `e${index}`;
}

export default function DijkstraSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [graph, setGraph] = useState(() => cloneGraph(initialGraph));
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

  const [pqPos, setPqPos] = useState({ x: 20, y: 20 });
  const [distPos, setDistPos] = useState({ x: 440, y: 20 });
  const [codePos, setCodePos] = useState({ x: 20, y: 220 });
  const [activeDragPanel, setActiveDragPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const steps = useMemo(() => dijkstraSteps(graph.nodes, graph.edges, graph.source), [graph]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    let timer: number;
    if (playing && stepIndex < steps.length - 1) {
      timer = window.setInterval(() => {
        setStepIndex((s) => s + 1);
      }, speed);
    } else if (stepIndex >= steps.length - 1) {
      setPlaying(false);
    }
    return () => clearInterval(timer);
  }, [playing, stepIndex, steps.length, speed]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (isSpeechEnabled && step) speak(describeStep(step));
  }, [step, isSpeechEnabled, speak]);

  const nodeMap = useMemo(() => Object.fromEntries(graph.nodes.map((n) => [n.id, n])), [graph.nodes]);

  const svgPoint = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }, []);

  const handleCanvasClick = (e: React.PointerEvent) => {
    if (e.target !== svgRef.current) return;
    const pt = svgPoint(e);
    const id = (nodeName.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3)) || nextNodeId(graph.nodes);
    if (graph.nodes.some(n => n.id === id)) return;
    setGraph(g => ({ ...g, nodes: [...g.nodes, { id, x: pt.x, y: pt.y }], source: g.source || id }));
    setNodeName("");
    setSelected(null);
    setEdgeSource(null);
  };

  const addEdge = useCallback((from = edgeFrom, to = edgeTo) => {
    const weight = Number(edgeWeight);
    if (!from || !to || !Number.isFinite(weight)) return;
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
      return { source: current.source === selected.id ? nodes[0].id : current.source, nodes, edges };
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
    if (!dragging && !activeDragPanel) return;
    const pt = svgPoint(e);
    if (dragging) {
      setGraph(g => ({ ...g, nodes: g.nodes.map(n => n.id === dragging ? { ...n, x: Math.max(40, Math.min(640, pt.x)), y: Math.max(45, Math.min(390, pt.y)) } : n) }));
    } else if (activeDragPanel === "pq") {
      setPqPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    } else if (activeDragPanel === "dist") {
      setDistPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    } else if (activeDragPanel === "code") {
      setCodePos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    }
  };

  const startPanelDrag = (e: React.PointerEvent, panelId: string, currentPos: { x: number, y: number }) => {
    e.stopPropagation();
    const pt = svgPoint(e);
    setActiveDragPanel(panelId);
    setDragOffset({ x: pt.x - currentPos.x, y: pt.y - currentPos.y });
  };

  const handleContextMenu = (e: React.MouseEvent, item: { type: "node" | "edge"; id: string }) => {
    e.preventDefault(); e.stopPropagation();
    if (item.type === "node") {
      setGraph(g => {
        if (g.nodes.length <= 1) return g;
        const nodes = g.nodes.filter(n => n.id !== item.id);
        const edges = g.edges.filter(ed => ed.from !== item.id && ed.to !== item.id);
        return { source: g.source === item.id ? nodes[0].id : g.source, nodes, edges };
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
          <span className="eyebrow">Graph Algorithms • SSSP</span>
          <h1>Dijkstra's Algorithm</h1>
          <p className="description">
            The <strong>Dijkstra</strong> algorithm finds the <strong>shortest path</strong> from a source vertex to all other vertices in a graph with non‑negative edge weights. It greedily selects the closest unvisited node at each step, guaranteeing optimal distances.
          </p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O((V+E) log V)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(V)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card">
            <h2>Mechanism</h2>
            <p>Maintain tentative distances and visited nodes. Always pick the unvisited node with the smallest distance to explore next.</p>
          </article>
          <article className="guide-card">
            <h2>Priority Queue</h2>
            <p>A Min-Priority Queue efficiently provides the next node. Without it, finding the next node would take O(V) instead of O(log V).</p>
          </article>
          <article className="guide-card highlight">
            <h2>Relaxation</h2>
            <p>When checking edge (u, v), if <code>dist[u] + weight &lt; dist[v]</code>, we update <code>dist[v]</code>. This is the core of path finding.</p>
          </article>
          <article className="guide-card">
            <h2>Constraints</h2>
            <p>Dijkstra fails with negative edge weights. For graphs with negative costs, use Bellman-Ford instead.</p>
          </article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor">
            <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node ID" />
            <select value={graph.source} onChange={(e) => setGraph(g => ({ ...g, source: e.target.value }))}>
              {graph.nodes.map(n => <option key={n.id}>{n.id}</option>)}
            </select>
            <input type="number" value={edgeWeight} onChange={(e) => setEdgeWeight(Number(e.target.value))} />
            <button onClick={() => addEdge()}>Join Nodes</button>
            <button onClick={removeSelected} disabled={!selected}>Remove</button>
            <button onClick={() => setGraph(cloneGraph(initialGraph))}>Reset</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Click background to <b>Add Node</b></span>
                <span>↔️ Drag to <b>Move</b> • ⌨️ Shift+Drag to <b>Join</b></span>
                <span>✏️ Double-Click weight to <b>Edit</b></span>
                <span>📌 Drag <b>Panel Headers</b> to rearrange</span>
              </div>
              <div className="status-panel">
                <h2>Current Step</h2>
                <p className="status-msg">{describeStep(step)}</p>
                <div className="playback-controls">
                  <button onClick={() => setStepIndex(0)}><RotateCcw size={16} /></button>
                  <button onClick={() => setStepIndex(i => Math.max(0, i-1))}><ChevronLeft size={20} /></button>
                  <button onClick={() => setPlaying(!playing)} className="play-btn">{playing ? <Pause size={20} /> : <Play size={20} />}</button>
                  <button onClick={() => setStepIndex(i => Math.min(steps.length-1, i+1))}><ChevronRight size={20} /></button>
                  <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "active" : ""}>{isSpeechEnabled ? "🔊" : "🔇"}</button>
                </div>
                <div className="speed-ctrl">
                  <span>Speed</span>
                  <input type="range" min="100" max="2000" step="100" value={2100 - speed} onChange={(e) => setSpeed(2100 - Number(e.target.value))} />
                </div>
              </div>
            </aside>
            <svg ref={svgRef} viewBox="0 0 680 430" onPointerDown={handleCanvasClick} onPointerMove={handleMove} onPointerUp={() => { setDragging(null); setActiveDragPanel(null); }}>
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="currentColor" /></marker>
              </defs>
              {graph.edges.map((edge) => {
                const from = nodeMap[edge.from]; const to = nodeMap[edge.to];
                if (!from || !to) return null;
                const dx = to.x - from.x; const dy = to.y - from.y;
                const length = Math.hypot(dx, dy) || 1;
                const endX = to.x - (dx / length) * 30; const endY = to.y - (dy / length) * 30;
                const midX = (from.x + to.x) / 2 - dy * 0.1; const midY = (from.y + to.y) / 2 + dx * 0.1;
                const path = `M ${from.x} ${from.y} Q ${midX} ${midY} ${endX} ${endY}`;
                const active = step?.edge === edge.id; const isSelected = selected?.type === "edge" && selected.id === edge.id;
                
                const edit = (e: React.MouseEvent) => { e.stopPropagation(); setEditingEdgeId(edge.id); setEditingWeight(String(edge.weight)); };
                const commit = () => { const w = Number(editingWeight); if (Number.isFinite(w)) setGraph(g => ({ ...g, edges: g.edges.map(ed => ed.id === editingEdgeId ? { ...ed, weight: w } : ed) })); setEditingEdgeId(null); };

                return (
                  <g key={edge.id} onPointerDown={(e) => { e.stopPropagation(); setSelected({ type: "edge", id: edge.id }); setEdgeFrom(edge.from); setEdgeTo(edge.to); setEdgeWeight(edge.weight); }} onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: edge.id })} onDoubleClick={edit}>
                    <path className="edge-hit" d={path} />
                    <path className={`edge ${active ? "active" : ""} ${isSelected ? "selected" : ""}`} d={path} markerEnd="url(#arrow)" />
                    <g className="weight-box">
                      {editingEdgeId === edge.id ? (
                        <foreignObject x={midX - 25} y={midY - 15} width="50" height="30"><input autoFocus className="inline-edit" value={editingWeight} onChange={(e) => setEditingWeight(e.target.value)} onBlur={commit} onKeyDown={(ev) => ev.key === "Enter" && commit()} /></foreignObject>
                      ) : (
                        <>
                          <rect x={midX - 14} y={midY - 11} width="28" height="20" rx="5" />
                          <text x={midX} y={midY + 5}>{edge.weight}</text>
                        </>
                      )}
                    </g>
                  </g>
                );
              })}
              {graph.nodes.map((node) => {
                const isVisited = step.visited.includes(node.id); const isCurrent = step.u === node.id;
                const classes = ["node", node.id === graph.source ? "source" : "", isVisited ? "reached" : "", isCurrent ? "current" : "", selected?.type === "node" && selected.id === node.id ? "selected" : ""].join(" ");
                return (
                  <g key={node.id} className={classes} onPointerDown={(e) => handleNodePointerDown(e, node)} onPointerUp={() => setDragging(null)} onContextMenu={(e) => handleContextMenu(e, { type: "node", id: node.id })}>
                    <circle cx={node.x} cy={node.y} r="27" />
                    <text x={node.x} y={node.y + 5}>{node.id}</text>
                    <text x={node.x} y={node.y + 46} className="dist-label">{formatDistance(step.dist[node.id])}</text>
                  </g>
                );
              })}

              <foreignObject x={pqPos.x} y={pqPos.y} width="160" height="220" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "pq", pqPos)}>
                    <span>Priority Queue</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content pq-viz">
                    {step.pq.map((item, i) => (
                      <div key={`${item.id}-${i}`} className="pq-item">{item.id} <small>({item.dist})</small></div>
                    ))}
                    {step.pq.length === 0 && <span className="empty-msg">Empty</span>}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={distPos.x} y={distPos.y} width="180" height="220" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "dist", distPos)}>
                    <span>Distances</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content dist-viz">
                    {graph.nodes.map(n => (
                      <div key={n.id} className={`dist-row ${step.visited.includes(n.id) ? 'done' : ''} ${step.u === n.id ? 'current' : ''}`}>
                        <span className="node-id">{n.id}</span>
                        <span className="dist-val">{formatDistance(step.dist[n.id])}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={codePos.x} y={codePos.y} width="220" height="180" className="movable-panel">
                <div onPointerDown={(e) => startPanelDrag(e, "code", codePos)} className="h-full">
                  <CodeTracker 
                    code={[
                      "dist[source] = 0",
                      "pq.push(source, 0)",
                      "while pq is not empty:",
                      "  u = pq.pop_min()",
                      "  if u is visited: continue",
                      "  for each neighbor v of u:",
                      "    if dist[u] + w < dist[v]:",
                      "      dist[v] = dist[u] + w",
                      "      pq.push(v, dist[v])"
                    ]} 
                    activeLine={step.line || 0} 
                  />
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel2: #172033; --border: #2b3447; --text: #e5e7eb; --muted: #98a2b3; --blue: #4f7ef8; --green: #35c486; --amber: #f5a623; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: Arial, sans-serif; }
        .page[data-theme="light"] { --bg: #f7f9fc; --panel: #ffffff; --panel2: #edf2f7; --border: #d7deea; --text: #172033; --muted: #526174; --blue: #285bd6; --green: #087f5b; --amber: #b76705; --red: #c92a2a; }
        .hero { padding: 120px 24px 80px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); }
        .hero h1 { margin: 16px 0; font-size: clamp(48px, 9vw, 92px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .content-width { max-width: 1200px; margin: 0 auto; }
        .description { font-size: 19px; max-width: 800px; margin: 24px 0 40px; line-height: 1.6; color: var(--muted); }
        .complexity-tag-group { display: flex; gap: 16px; margin-bottom: 48px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .complexity-tag .value { font-size: 20px; font-weight: 700; color: var(--blue); font-family: monospace; }
        .actions, .editor, .playback-controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input, select { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 0 12px; transition: all 0.2s; }
        button:hover { border-color: var(--blue); }
        button.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 12%, transparent); }
        .play-btn { width: 48px; height: 48px; border-radius: 50%; background: var(--blue) !important; color: white !important; display: flex; align-items: center; justify-content: center; }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; box-shadow: 0 4px 14px 0 rgba(79,126,248,0.39); }
        .detailed-guide { max-width: 1120px; margin: 0 auto; padding: 80px 24px; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; }
        .guide-card h2 { font-size: 18px; margin-bottom: 16px; }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--amber); }
        .simulator { padding: 60px 0 100px; border-top: 1px solid var(--border); }
        .simulator-content { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.5); }
        aside { display: flex; flex-direction: column; gap: 20px; }
        .status-msg { font-size: 14px; line-height: 1.5; min-height: 60px; color: var(--text); font-weight: 500; }
        .speed-ctrl, .timeline { display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: var(--muted); }
        svg { width: 100%; min-height: 500px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 8px; }
        .edge { fill: none; stroke: var(--muted); stroke-width: 2; transition: all 0.3s; opacity: 0.6; }
        .edge.active { stroke: var(--blue); stroke-width: 4; opacity: 1; filter: drop-shadow(0 0 8px var(--blue)); }
        .edge.selected { stroke: var(--amber); stroke-width: 3; }
        .edge-hit { fill: none; stroke: transparent; stroke-width: 20; cursor: pointer; }
        .weight-box rect { fill: var(--panel); stroke: var(--border); stroke-width: 1; }
        .weight-box text { font-size: 11px; fill: var(--text); font-weight: 700; text-anchor: middle; }
        .node circle { fill: var(--panel); stroke: var(--muted); stroke-width: 2; transition: all 0.3s; }
        .node.source circle { stroke: var(--blue); stroke-width: 4; }
        .node.reached circle { fill: color-mix(in srgb, var(--green) 15%, transparent); stroke: var(--green); stroke-width: 3; }
        .node.current circle { fill: var(--blue); stroke: var(--blue); filter: drop-shadow(0 0 12px var(--blue)); }
        .node.current text { fill: white; }
        .node.selected circle { stroke: var(--amber); stroke-width: 3; }
        text { fill: var(--text); font-size: 13px; text-anchor: middle; font-weight: 800; user-select: none; }
        .dist-label { font-size: 11px; fill: var(--muted); font-family: monospace; }
        .movable-panel { cursor: grab; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); overflow: visible; }
        .movable-panel:active { cursor: grabbing; }
        .movable-panel > div { resize: both; overflow: auto; min-width: 140px; min-height: 110px; max-width: 620px; max-height: 430px; }
        .panel-container { background: color-mix(in srgb, var(--panel) 85%, transparent); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
        .panel-header { background: var(--panel2); padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .panel-header span { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
        .drag-handle { opacity: 0.5; }
        .panel-content { padding: 10px; flex: 1; overflow-y: auto; }
        .pq-item { background: var(--blue); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-family: monospace; margin-bottom: 4px; font-weight: 700; }
        .dist-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--border); font-size: 12px; font-family: monospace; }
        .dist-row.done { color: var(--green); }
        .dist-row.current { background: color-mix(in srgb, var(--blue) 10%, transparent); color: var(--blue); font-weight: 700; }
        .empty-msg { font-size: 11px; color: var(--muted); font-style: italic; }
        .inline-edit { width: 100%; height: 100%; background: var(--panel2); border: 1px solid var(--blue); color: var(--text); text-align: center; border-radius: 4px; }
        .gesture-hint { background: var(--panel2); padding: 12px; border-radius: 8px; font-size: 11px; color: var(--muted); display: flex; flex-direction: column; gap: 4px; border: 1px solid var(--border); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}


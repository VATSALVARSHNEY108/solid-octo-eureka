"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Activity, Zap, MousePointer2 } from "lucide-react";
import { CodeTracker } from "@/components/CodeTracker";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; weight: number; }
interface GraphData { source: string; nodes: GraphNode[]; edges: GraphEdge[]; }

interface BFStep {
  type: string;
  dist: Record<string, number>;
  prev: Record<string, string | null>;
  iteration?: number;
  edge?: string;
  u?: string;
  v?: string;
  weight?: number;
  relaxed?: string;
  negativeCycle?: boolean;
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
    { id: "e2", from: "A", to: "D", weight: 5 },
    { id: "e3", from: "B", to: "C", weight: 3 },
    { id: "e4", from: "B", to: "D", weight: -2 },
    { id: "e5", from: "D", to: "E", weight: 1 },
    { id: "e6", from: "C", to: "E", weight: 2 },
  ],
};

function cloneGraph(graph: GraphData): GraphData {
  return {
    source: graph.source,
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: graph.edges.map((edge) => ({ ...edge })),
  };
}

function bellmanFordSteps(nodes: GraphNode[], edges: GraphEdge[], source: string): BFStep[] {
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const steps: BFStep[] = [];

  nodes.forEach((node) => {
    dist[node.id] = node.id === source ? 0 : Infinity;
    prev[node.id] = null;
  });

  steps.push({ type: "init", dist: { ...dist }, prev: { ...prev }, line: 0 });

  for (let i = 0; i < nodes.length - 1; i++) {
    steps.push({ type: "iteration", iteration: i + 1, dist: { ...dist }, prev: { ...prev }, line: 1 });
    for (const edge of edges) {
      steps.push({ type: "check", edge: edge.id, u: edge.from, v: edge.to, weight: edge.weight, dist: { ...dist }, prev: { ...prev }, line: 2 });
      if (dist[edge.from] !== Infinity && dist[edge.from] + edge.weight < dist[edge.to]) {
        dist[edge.to] = dist[edge.from] + edge.weight;
        prev[edge.to] = edge.from;
        steps.push({ type: "relax", edge: edge.id, relaxed: edge.to, u: edge.from, v: edge.to, weight: edge.weight, dist: { ...dist }, prev: { ...prev }, line: 4 });
      }
    }
  }

  let negativeCycle = false;
  steps.push({ type: "check_cycle", dist: { ...dist }, prev: { ...prev }, line: 5 });
  for (const edge of edges) {
    if (dist[edge.from] !== Infinity && dist[edge.from] + edge.weight < dist[edge.to]) {
      negativeCycle = true;
      steps.push({ type: "negative_cycle", edge: edge.id, u: edge.from, v: edge.to, weight: edge.weight, dist: { ...dist }, prev: { ...prev }, line: 7 });
      break;
    }
  }

  steps.push({ type: "done", negativeCycle, dist: { ...dist }, prev: { ...prev }, line: 1 });
  return steps;
}

function describeStep(step: BFStep) {
  if (!step) return "Ready.";
  if (step.type === "init") return "Initialize source distance to 0 and all others to infinity.";
  if (step.type === "iteration") return `Pass ${step.iteration}: Scanning all edges to find potential improvements.`;
  if (step.type === "check") return `Checking edge from ${step.u} to ${step.v} (weight ${step.weight}).`;
  if (step.type === "relax") return `Relaxed ${step.v}. New shortest distance is ${step.dist[step.v!]}.`;
  if (step.type === "negative_cycle") return "Negative cycle detected! This graph contains a loop with negative net weight.";
  if (step.type === "done") return step.negativeCycle ? "Simulation ended with negative cycle detection." : "Simulation complete. All shortest paths verified.";
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

export default function BellmanFordSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [graph, setGraph] = useState(() => cloneGraph(initialGraph));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("A");
  const [edgeTo, setEdgeTo] = useState("B");
  const [edgeWeight, setEdgeWeight] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState("");

  const [distPos, setDistPos] = useState({ x: 20, y: 20 });
  const [infoPos, setInfoPos] = useState({ x: 440, y: 20 });
  const [codePos, setCodePos] = useState({ x: 20, y: 220 });
  const [activeDragPanel, setActiveDragPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const steps = useMemo(() => bellmanFordSteps(graph.nodes, graph.edges, graph.source), [graph]);
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
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }, []);

  const addNode = useCallback((x = 330, y = 215) => {
    const id = (nodeName.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3)) || nextNodeId(graph.nodes);
    if (graph.nodes.some(n => n.id === id)) return;
    setGraph(g => ({ ...g, nodes: [...g.nodes, { id, x, y }], source: g.source || id }));
    setSelected({ type: "node", id });
    setNodeName("");
  }, [graph.nodes, nodeName]);

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
      if (selected.type === "edge") return { ...current, edges: current.edges.filter((e) => e.id !== selected.id) };
      if (current.nodes.length <= 1) return current;
      const nodes = current.nodes.filter((n) => n.id !== selected.id);
      const edges = current.edges.filter((e) => e.from !== selected.id && e.to !== selected.id);
      return { source: current.source === selected.id ? nodes[0].id : current.source, nodes, edges };
    });
    setSelected(null);
  }, [selected]);

  const handleCanvasClick = (e: React.PointerEvent) => {
    if (e.target !== svgRef.current) return;
    const pt = svgPoint(e);
    addNode(pt.x, pt.y);
    setSelected(null);
    setEdgeSource(null);
  };

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
    } else if (activeDragPanel === "dist") {
      setDistPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    } else if (activeDragPanel === "info") {
      setInfoPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    } else if (activeDragPanel === "code") {
      setCodePos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    }
  };

  const startPanelDrag = (e: React.PointerEvent, id: string, pos: { x: number, y: number }) => {
    e.stopPropagation();
    const pt = svgPoint(e);
    setActiveDragPanel(id);
    setDragOffset({ x: pt.x - pos.x, y: pt.y - pos.y });
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
          <h1>Bellman–Ford Algorithm</h1>
          <p className="description">
            The <strong>Bellman-Ford algorithm</strong> computes shortest paths from a single source vertex to all others. 
            Unlike Dijkstra, it handles <strong>negative edge weights</strong> and detects <strong>negative cycles</strong>.
          </p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(V × E)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(V)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card">
            <h2>Why it exists</h2>
            <p>Dijkstra's greedy approach fails on negative edges. Bellman-Ford scans all edges repeatedly to find shortcuts that negative weights might offer.</p>
          </article>
          <article className="guide-card">
            <h2>Relaxation</h2>
            <p>For each edge (u, v), if the distance to u plus the weight to v is less than the current distance to v, we update it. We do this V-1 times.</p>
          </article>
          <article className="guide-card highlight">
            <h2>Cycle Detection</h2>
            <p>If any distance can still be reduced after V-1 passes, the graph contains a negative loop that reduces distances infinitely.</p>
          </article>
          <article className="guide-card">
            <h2>Performance</h2>
            <p>At O(VE), it is slower than Dijkstra's O(E log V). It is only preferred when negative edge weights are possible.</p>
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
            <svg ref={svgRef} viewBox="0 0 680 430" onPointerDown={(e) => e.target === svgRef.current && handleCanvasClick(e)} onPointerMove={handleMove} onPointerUp={() => { setDragging(null); setActiveDragPanel(null); }}>
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
                          <text x={midX} y={midY + 5} className={edge.weight < 0 ? "negative" : ""}>{edge.weight}</text>
                        </>
                      )}
                    </g>
                  </g>
                );
              })}
              {graph.nodes.map((node) => {
                const dist = step.dist[node.id]; const isCurrent = step.u === node.id || step.v === node.id;
                const classes = ["node", node.id === graph.source ? "source" : "", dist !== Infinity ? "reached" : "", isCurrent ? "current" : "", selected?.type === "node" && selected.id === node.id ? "selected" : ""].join(" ");
                return (
                  <g key={node.id} className={classes} onPointerDown={(e) => handleNodePointerDown(e, node)} onPointerUp={() => setDragging(null)} onContextMenu={(e) => handleContextMenu(e, { type: "node", id: node.id })}>
                    <circle cx={node.x} cy={node.y} r="27" />
                    <text x={node.x} y={node.y + 5}>{node.id}</text>
                    <text x={node.x} y={node.y + 46} className="dist-label">{formatDistance(dist)}</text>
                  </g>
                );
              })}

              <foreignObject x={distPos.x} y={distPos.y} width="160" height="250" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "dist", distPos)}>
                    <span>Distances</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content dist-viz">
                    {graph.nodes.map(n => (
                      <div key={n.id} className={`dist-row ${step.dist[n.id] !== Infinity ? 'done' : ''} ${step.relaxed === n.id ? 'relaxed' : ''}`}>
                        <span className="node-id">{n.id}</span>
                        <span className="dist-val">{formatDistance(step.dist[n.id])}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={infoPos.x} y={infoPos.y} width="180" height="200" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "info", infoPos)}>
                    <span>Pass Info</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content info-viz">
                    <div className="info-stat"><span>Pass</span><b>{step.iteration || '-'} / {graph.nodes.length - 1}</b></div>
                    <div className="info-stat"><span>Edge Check</span><b>{step.u || '-'}{step.v ? ' → ' + step.v : ''}</b></div>
                    {step.negativeCycle && <div className="info-alert">Negative Cycle Found!</div>}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={codePos.x} y={codePos.y} width="220" height="180" className="movable-panel">
                <div onPointerDown={(e) => startPanelDrag(e, "code", codePos)} className="h-full">
                  <CodeTracker 
                    code={[
                      "dist[source] = 0",
                      "for i from 1 to V-1:",
                      "  for each edge (u, v, w):",
                      "    if dist[u] + w < dist[v]:",
                      "      dist[v] = dist[u] + w",
                      "for each edge (u, v, w):",
                      "  if dist[u] + w < dist[v]:",
                      "    return \"Cycle Detected\""
                    ]} 
                    activeLine={step.line || 0} 
                  />
                </div>
              </foreignObject>

              <foreignObject x={codePos.x} y={codePos.y} width="220" height="180" className="movable-panel">
                <div onPointerDown={(e) => startPanelDrag(e, "code", codePos)} className="h-full">
                  <CodeTracker 
                    code={[
                      "dist[source] = 0",
                      "for i from 1 to V-1:",
                      "  for each edge (u, v, w):",
                      "    if dist[u] + w < dist[v]:",
                      "      dist[v] = dist[u] + w",
                      "for each edge (u, v, w):",
                      "  if dist[u] + w < dist[v]:",
                      "    return \"Cycle Detected\""
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
        .hero { padding: 140px 24px 100px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); }
        .hero h1 { margin: 20px 0; font-size: clamp(54px, 10vw, 100px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .content-width { max-width: 1400px; margin: 0 auto; }
        .description { font-size: 20px; max-width: 900px; margin: 32px 0 48px; line-height: 1.6; color: var(--muted); }
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
        .detailed-guide { max-width: 1280px; margin: 0 auto; padding: 100px 24px; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 48px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 20px; padding: 40px; }
        .guide-card h2 { font-size: 20px; margin-bottom: 20px; }
        .guide-card p { font-size: 15px; line-height: 1.8; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--amber); }
        .simulator { padding: 100px 0 140px; border-top: 1px solid var(--border); }
        .simulator-content { max-width: 1400px; margin: 0 auto; padding: 0 32px; }
        .workspace { display: grid; grid-template-columns: 360px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 24px; box-shadow: 0 25px 60px -20px rgba(0,0,0,0.6); }
        aside { display: flex; flex-direction: column; gap: 48px; }
        .status-msg { font-size: 15px; line-height: 1.6; min-height: 80px; color: var(--text); font-weight: 500; }
        .speed-ctrl { display: flex; flex-direction: column; gap: 12px; font-size: 13px; color: var(--muted); }
        svg { width: 100%; min-height: 600px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 12px; }
        .edge { fill: none; stroke: var(--muted); stroke-width: 2; transition: all 0.3s; opacity: 0.6; }
        .edge.active { stroke: var(--blue); stroke-width: 4; opacity: 1; filter: drop-shadow(0 0 8px var(--blue)); }
        .edge.selected { stroke: var(--amber); stroke-width: 3; }
        .edge-hit { fill: none; stroke: transparent; stroke-width: 20; cursor: pointer; }
        .weight-box rect { fill: var(--panel); stroke: var(--border); stroke-width: 1; }
        .weight-box text { font-size: 11px; fill: var(--text); font-weight: 700; text-anchor: middle; }
        .weight-box text.negative { fill: var(--red); }
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
        .panel-container { background: color-mix(in srgb, var(--panel) 90%, transparent); backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
        .panel-header { background: var(--panel2); padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .panel-header span { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--muted); letter-spacing: 0.5px; }
        .drag-handle { opacity: 0.5; cursor: grab; }
        .panel-content { padding: 16px; flex: 1; overflow-y: auto; }
        .dist-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--border); font-size: 12px; font-family: monospace; }
        .dist-row.done { color: var(--green); }
        .dist-row.relaxed { background: color-mix(in srgb, var(--amber) 12%, transparent); color: var(--amber); font-weight: 700; }
        .info-stat { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
        .info-stat span { font-size: 10px; text-transform: uppercase; color: var(--muted); }
        .info-stat b { font-size: 14px; color: var(--blue); }
        .info-alert { background: var(--red); color: white; padding: 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-align: center; }
        .empty-msg { font-size: 11px; color: var(--muted); font-style: italic; }
        .inline-edit { width: 100%; height: 100%; background: var(--panel2); border: 1px solid var(--blue); color: var(--text); text-align: center; border-radius: 4px; }
        .gesture-hint { background: var(--panel2); padding: 12px; border-radius: 8px; font-size: 11px; color: var(--muted); display: flex; flex-direction: column; gap: 4px; border: 1px solid var(--border); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}


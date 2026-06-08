"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; }
interface GraphData { source: string; isDirected: boolean; nodes: GraphNode[]; edges: GraphEdge[]; }

interface BFStep {
  type: string;
  dist: Record<string, number>;
  queue: string[];
  visited: string[];
  message: string;
  line?: number;
  node?: string;
  u?: string;
  v?: string;
  edge?: string;
}

const initialGraph: GraphData = {
  source: "A",
  isDirected: false,
  nodes: [
    { id: "A", x: 90, y: 190 },
    { id: "B", x: 250, y: 90 },
    { id: "C", x: 450, y: 150 },
    { id: "D", x: 280, y: 305 },
    { id: "E", x: 520, y: 300 },
  ],
  edges: [
    { id: "e1", from: "A", to: "B" },
    { id: "e2", from: "A", to: "D" },
    { id: "e3", from: "B", to: "C" },
    { id: "e4", from: "B", to: "D" },
    { id: "e5", from: "D", to: "E" },
    { id: "e6", from: "C", to: "E" },
  ],
};

function cloneGraph(graph: GraphData) {
  return {
    source: graph.source,
    isDirected: graph.isDirected,
    nodes: graph.nodes.map((n) => ({ ...n })),
    edges: graph.edges.map((e) => ({ ...e })),
  };
}

function bfsSteps(nodes: GraphNode[], edges: GraphEdge[], source: string, isDirected: boolean): BFStep[] {
  const dist: Record<string, number> = {};
  const visited = new Set<string>();
  const queue: string[] = [];
  const steps: BFStep[] = [];

  nodes.forEach((node) => {
    dist[node.id] = node.id === source ? 0 : Infinity;
  });

  steps.push({ type: "init", line: 0, dist: { ...dist }, queue: [], visited: [], message: "Initialize distances and visited set." });

  queue.push(source);
  visited.add(source);
  steps.push({ type: "enqueue", line: 1, dist: { ...dist }, queue: [...queue], visited: Array.from(visited), message: `Enqueue source ${source} and mark as visited.` });

  while (queue.length > 0) {
    steps.push({ type: "loop", line: 2, dist: { ...dist }, queue: [...queue], visited: Array.from(visited), message: "Checking if queue is empty." });
    
    const u = queue.shift() as string;
    steps.push({ type: "dequeue", line: 3, dist: { ...dist }, queue: [...queue], visited: Array.from(visited), node: u, message: `Dequeue ${u} for exploration.` });

    const neighbors = edges
      .filter((e) => e.from === u || (!isDirected && e.to === u))
      .map((e) => ({
        v: e.from === u ? e.to : e.from,
        edgeId: e.id
      }));

    for (const { v, edgeId } of neighbors) {
      steps.push({ 
        type: "check_neighbor", 
        line: 4, 
        dist: { ...dist }, 
        queue: [...queue], 
        visited: Array.from(visited), 
        u, 
        v, 
        edge: edgeId,
        message: `Inspect neighbor ${v} of ${u}.` 
      });
      
      steps.push({ 
        type: "check_visited", 
        line: 5, 
        dist: { ...dist }, 
        queue: [...queue], 
        visited: Array.from(visited), 
        u, 
        v, 
        edge: edgeId,
        message: `Checking if ${v} is visited.` 
      });

      if (!visited.has(v)) {
        visited.add(v);
        dist[v] = dist[u] + 1;
        queue.push(v);
        steps.push({ 
          type: "visit", 
          line: 6, 
          dist: { ...dist }, 
          queue: [...queue], 
          visited: Array.from(visited), 
          u, 
          v, 
          edge: edgeId,
          message: `Visit ${v}; mark as visited.` 
        });
        steps.push({ 
          type: "enqueue_neighbor", 
          line: 7, 
          dist: { ...dist }, 
          queue: [...queue], 
          visited: Array.from(visited), 
          u, 
          v, 
          edge: edgeId,
          message: `Set distance ${dist[v]} and enqueue ${v}.` 
        });
      }
    }
  }

  steps.push({ type: "done", line: 2, dist: { ...dist }, queue: [], visited: Array.from(visited), message: "BFS traversal complete." });
  return steps;
}

function describeStep(step: BFStep) {
  return step?.message || "Ready.";
}

function formatDistance(value: number) {
  return value === Infinity ? "inf" : String(value);
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

export default function BFSSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const timerRef = useRef<number | null>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [graph, setGraph] = useState<GraphData>(() => cloneGraph(initialGraph));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("A");
  const [edgeTo, setEdgeTo] = useState("B");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [queuePos, setQueuePos] = useState({ x: 20, y: 20 });
  const [visitedPos, setVisitedPos] = useState({ x: 420, y: 20 });
  const [codePos, setCodePos] = useState({ x: 20, y: 220 });
  const [draggingPanel, setDraggingPanel] = useState<"queue" | "visited" | "code" | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const steps = useMemo(() => bfsSteps(graph.nodes, graph.edges, graph.source, graph.isDirected), [graph]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [graph]);

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

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }, []);

  useEffect(() => {
    if (isSpeechEnabled && step) {
      speak(describeStep(step as BFStep));
    }
  }, [step, isSpeechEnabled, speak]);

  const nodeMap = useMemo(() => Object.fromEntries(graph.nodes.map((n) => [n.id, n])), [graph.nodes]);

  const svgPoint = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }, []);

  const addNode = useCallback((x = 330, y = 215) => {
    const id = (nodeName.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3)) || nextNodeId(graph.nodes);
    if (graph.nodes.some((n) => n.id === id)) return;
    setGraph((g) => ({
      ...g,
      nodes: [...g.nodes, { id, x, y }],
      source: g.source || id,
    }));
    setSelected({ type: "node", id });
    setNodeName("");
  }, [graph.nodes, nodeName]);

  const addEdge = useCallback((from = edgeFrom, to = edgeTo) => {
    const edge = { id: nextEdgeId(graph.edges), from, to };
    setGraph((g) => ({ ...g, edges: [...g.edges, edge] }));
    setSelected({ type: "edge", id: edge.id });
    setEdgeSource(null);
  }, [edgeFrom, edgeTo, graph.edges]);

  const removeSelected = useCallback(() => {
    if (!selected) return;
    setGraph((g) => {
      if (selected.type === "edge") {
        return { ...g, edges: g.edges.filter((e) => e.id !== selected.id) };
      }
      const nodes = g.nodes.filter((n) => n.id !== selected.id);
      const edges = g.edges.filter((e) => e.from !== selected.id && e.to !== selected.id);
      return { ...g, nodes, edges, source: g.source === selected.id ? nodes[0].id : g.source };
    });
    setSelected(null);
  }, [selected]);

  const handleCanvasClick = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.target !== svgRef.current) return;
    const pt = svgPoint(e);
    addNode(pt.x, pt.y);
    setSelected(null);
    setEdgeSource(null);
  };

  const handleNodePointerDown = (e: React.PointerEvent, node: GraphNode) => {
    e.stopPropagation();
    if (edgeSource === node.id) {
      setEdgeSource(null);
      setSelected(null);
      return;
    }
    if (edgeSource && edgeSource !== node.id) {
      addEdge(edgeSource, node.id);
      setEdgeSource(null);
      setSelected(null);
      return;
    }
    if (e.shiftKey) {
      setEdgeSource(node.id);
      setSelected({ type: "node", id: node.id });
    } else {
      setEdgeSource(node.id);
      setSelected({ type: "node", id: node.id });
      setDragging(node.id);
    }
  };

  const handleNodePointerUp = (e: React.PointerEvent, node: GraphNode) => {
    if (e.shiftKey && edgeSource && edgeSource !== node.id) {
      addEdge(edgeSource, node.id);
      setEdgeSource(null);
    }
    setDragging(null);
  };

  const handleContextMenu = (e: React.MouseEvent, item: { type: "node" | "edge"; id: string }) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.type === "node") {
      setGraph((g) => {
        if (g.nodes.length <= 1) return g;
        const nodes = g.nodes.filter((n) => n.id !== item.id);
        const edges = g.edges.filter((ed) => ed.from !== item.id && ed.to !== item.id);
        return { ...g, nodes, edges, source: g.source === item.id ? nodes[0].id : g.source };
      });
    } else {
      setGraph((g) => ({ ...g, edges: g.edges.filter((ed) => ed.id !== item.id) }));
    }
    setSelected(null);
  };

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging && !draggingPanel) return;
    const pt = svgPoint(e);
    if (dragging) {
      setGraph((g) => ({
        ...g,
        nodes: g.nodes.map((n) => n.id === dragging ? { ...n, x: Math.max(40, Math.min(640, pt.x)), y: Math.max(45, Math.min(390, pt.y)) } : n),
      }));
    } else if (draggingPanel === "queue") {
      setQueuePos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    } else if (draggingPanel === "visited") {
      setVisitedPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    } else if (draggingPanel === "code") {
      setCodePos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    }
  };

  const startPanelDrag = (e: React.PointerEvent, panel: "queue" | "visited" | "code", pos: { x: number, y: number }) => {
    e.stopPropagation();
    const pt = svgPoint(e as any);
    setDraggingPanel(panel);
    setDragOffset({ x: pt.x - pos.x, y: pt.y - pos.y });
  };

  const selectedNode = selected?.type === "node" ? graph.nodes.find((n) => n.id === selected.id) : null;
  const selectedEdge = selected?.type === "edge" ? graph.edges.find((e) => e.id === selected.id) : null;

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Graph Algorithms • SSSP</span>
          <h1>Breadth‑First Search (BFS)</h1>
          <p className="description">Explore BFS step‑by‑step on a custom graph.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(V+E)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(V)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>BFS explores a graph level‑by‑level, finding the shortest number of edges from a source to every reachable vertex.</p></article>
          <article className="guide-card"><h2>Queue Mechanics</h2><p>The queue stores frontier nodes. Dequeue → process → enqueue unvisited neighbors ensures a breadth‑first expansion.</p></article>
          <article className="guide-card"><h2>Visited Set</h2><p>A visited set prevents re‑exploration, guaranteeing O(V + E) runtime.</p></article>
          <article className="guide-card highlight"><h2>Applications</h2><p>Shortest path in unweighted graphs, level order traversal, connectivity checks, and more.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor">
            <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node ID" />
            <button onClick={() => addNode()}>Add Node</button>
            <select value={graph.source} onChange={(e) => setGraph({ ...graph, source: e.target.value })}>
              {graph.nodes.map((n) => (<option key={n.id}>{n.id}</option>))}
            </select>
            <select value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)}>
              {graph.nodes.map((n) => (<option key={n.id}>{n.id}</option>))}
            </select>
            <select value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)}>
              {graph.nodes.map((n) => (<option key={n.id}>{n.id}</option>))}
            </select>
            <button onClick={() => addEdge()}>Join Nodes</button>
            <button 
              onClick={() => setGraph(g => ({ ...g, isDirected: !g.isDirected }))}
              className={graph.isDirected ? "active" : ""}
            >
              {graph.isDirected ? "Directed: ON" : "Directed: OFF"}
            </button>
            <button onClick={removeSelected} disabled={!selected}>Remove</button>
            <button onClick={() => setGraph(cloneGraph(initialGraph))}>Reset Graph</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Click background to <b>Add Node</b></span>
                <span>↔️ Drag to <b>Move</b> • ⌨️ Shift+Drag to <b>Join</b></span>
                <span>🔗 Click Node A then Node B to <b>Join</b></span>
                <span>🔄 Toggle <b>Directed</b> for arrows</span>
                <span>📌 Drag <b>Queue/Visited</b> headers to move them</span>
                <span>🖱️ Right‑Click to <b>Remove</b></span>
              </div>
              <h2>Current Step</h2>
              <p>{describeStep(step as BFStep)}</p>
              
              <div className="simulation-data">
                <div className="data-group">
                  <h3>Distances</h3>
                  <div className="distances">
                    {Object.entries(step?.dist || {}).map(([id, val]) => (
                      <span key={id} className={val !== Infinity ? 'active' : ''}>
                        {id}: {formatDistance(val as number)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="controls">
                <button onClick={() => setStepIndex(0)}>|&lt;</button>
                <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>&lt;</button>
                <button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
                <button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>&gt;</button>
                <button onClick={() => setStepIndex(steps.length - 1)}>&gt;|</button>
                <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "active" : ""} title="Toggle Voice Narration">
                  {isSpeechEnabled ? "🔊" : "🔇"}
                </button>
              </div>
              <label>Speed<input type="range" min="150" max="1400" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>
            </aside>
            <svg 
              ref={svgRef} 
              viewBox="0 0 680 430" 
              onPointerDown={handleCanvasClick} 
              onPointerMove={handleMove} 
              onPointerUp={() => { setDragging(null); setDraggingPanel(null); }}
            >
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="currentColor" /></marker>
              </defs>
              {graph.edges.map((edge) => {
                const from = nodeMap[edge.from];
                const to = nodeMap[edge.to];
                if (!from || !to) return null;
                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const length = Math.hypot(dx, dy) || 1;
                const endX = to.x - (dx / length) * 30;
                const endY = to.y - (dy / length) * 30;
                const midX = (from.x + to.x) / 2 - dy * 0.12;
                const midY = (from.y + to.y) / 2 + dx * 0.12;
                const path = `M ${from.x} ${from.y} Q ${midX} ${midY} ${endX} ${endY}`;
                const active = (step as BFStep)?.edge === edge.id;
                const selectedEdgeNow = selected?.type === "edge" && selected.id === edge.id;
                return (
                  <g key={edge.id} onPointerDown={(ev) => { ev.stopPropagation(); setSelected({ type: "edge", id: edge.id }); setEdgeFrom(edge.from); setEdgeTo(edge.to); }} onContextMenu={(ev) => handleContextMenu(ev, { type: "edge", id: edge.id })}>
                    <path className="edge-hit" d={path} />
                    <path className={`edge ${active ? "active" : ""} ${selectedEdgeNow ? "selected" : ""}`} d={path} markerEnd={graph.isDirected ? "url(#arrow)" : ""} />
                  </g>
                );
              })}
              {graph.nodes.map((node) => {
                const dist = step?.dist?.[node.id];
                const classes = ["node", node.id === graph.source ? "source" : "", dist !== undefined && dist !== Infinity ? "reached" : "", edgeSource === node.id ? "pending" : "", selected?.type === "node" && selected.id === node.id ? "selected" : ""].join(" ");
                return (
                  <g key={node.id} className={classes} onPointerDown={(ev) => handleNodePointerDown(ev, node)} onPointerUp={(ev) => handleNodePointerUp(ev, node)} onContextMenu={(ev) => handleContextMenu(ev, { type: "node", id: node.id })}>
                    <circle cx={node.x} cy={node.y} r="27" />
                    <text x={node.x} y={node.y + 5}>{node.id}</text>
                    <text x={node.x} y={node.y + 46} className="distance">{formatDistance(dist as number)}</text>
                  </g>
                );
              })}

              {/* Movable Panels */}
              <foreignObject x={queuePos.x} y={queuePos.y} width="200" height="150" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "queue", queuePos)}>
                    <span>Queue</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content queue-viz">
                    {step.queue.length > 0 ? (
                      step.queue.map((nodeId, i) => (
                        <div key={`${nodeId}-${i}`} className="queue-item">{nodeId}</div>
                      ))
                    ) : (
                      <span className="empty-msg">Empty</span>
                    )}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={visitedPos.x} y={visitedPos.y} width="220" height="150" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "visited", visitedPos)}>
                    <span>Visited Array</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content visited-viz">
                    {graph.nodes.map(node => (
                      <div key={node.id} className={`visited-item ${step.visited.includes(node.id) ? 'active' : ''}`}>
                        {node.id}
                      </div>
                    ))}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={codePos.x} y={codePos.y} width="220" height="180" className="movable-panel">
                <div onPointerDown={(e) => startPanelDrag(e, "code", codePos)} className="h-full">
                  <CodeTracker 
                    code={[
                      "queue.enqueue(source)",
                      "visited[source] = true",
                      "while queue is not empty:",
                      "  u = queue.dequeue()",
                      "  for each neighbor v of u:",
                      "    if v is not visited:",
                      "      visited[v] = true",
                      "      queue.enqueue(v)"
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
        .hero { padding: 120px 24px 80px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), radial-gradient(circle at 90% 80%, #35c48608, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); }
        .hero h1 { margin: 16px 0; font-size: clamp(48px, 9vw, 92px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 2px 10px rgba(0,0,0,0.1)); }
        .content-width { max-width: 1200px; margin: 0 auto; }
        .description { font-size: 19px; max-width: 800px; margin: 24px 0 40px; line-height: 1.6; color: var(--muted); }
        .complexity-tag-group { display: flex; gap: 16px; margin-bottom: 48px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .complexity-tag .value { font-size: 20px; font-weight: 700; color: var(--blue); font-family: monospace; }
        .actions, .editor, .controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input, select { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 0 12px; }
        button.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 14%, transparent); }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; transition: all 0.3s; box-shadow: 0 4px 14px 0 rgba(79,126,248,0.39); }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79,126,248,0.5); filter: brightness(1.1); }
        .detailed-guide { width: min(1120px, calc(100% - 80px)); margin: 0 auto; padding: 100px 0; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px; margin-bottom: 80px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; transition: transform 0.3s, border-color 0.3s; }
        .guide-card:hover { transform: translateY(-4px); border-color: var(--blue); }
        .guide-card h2 { font-size: 18px; margin: 0 0 16px 0; color: var(--text); }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { background: linear-gradient(135deg, var(--panel), var(--panel2)); border-bottom: 4px solid var(--blue); }
        .simulator { padding: 60px 0 100px; margin-top: 40px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.5); }
        aside { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
        .simulation-data { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
        .data-group h3 { font-size: 11px; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em; margin-bottom: 8px; }
        .queue-viz, .visited-viz { display: flex; flex-wrap: wrap; gap: 6px; }
        .queue-item { background: var(--blue); color: white; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-weight: 700; font-size: 13px; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .visited-item { border: 1px solid var(--border); color: var(--muted); padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 13px; transition: all 0.3s; }
        .visited-item.active { background: color-mix(in srgb, var(--green) 15%, transparent); border-color: var(--green); color: var(--green); font-weight: 700; }
        .distances { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; }
        .distances span { border: 1px solid var(--border); border-radius: 6px; padding: 5px 8px; color: var(--muted); background: var(--panel2); font-family: monospace; transition: all 0.3s; }
        .distances span.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 10%, transparent); }
        .empty-msg { font-size: 12px; color: var(--muted); font-style: italic; }
        @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .counter { font-family: monospace; }
        svg { width: 100%; min-height: 560px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 8px; }
        marker path { fill: var(--muted); }
        .edge { fill: none; stroke: var(--muted); stroke-width: 2; }
        .edge.active { stroke: var(--blue); stroke-width: 3; }
        .edge.selected { stroke: var(--amber); stroke-width: 3; }
        .edge-hit { fill: none; stroke: transparent; stroke-width: 18; cursor: pointer; }
        .node { cursor: grab; }
        .node circle { fill: var(--panel); stroke: var(--muted); stroke-width: 2; }
        .node.source circle { fill: color-mix(in srgb, var(--blue) 18%, transparent); stroke: var(--blue); }
        .node.reached circle { fill: color-mix(in srgb, var(--green) 16%, transparent); stroke: var(--green); }
        .node.selected circle, .node.pending circle { fill: color-mix(in srgb, var(--amber) 18%, transparent); stroke: var(--amber); stroke-width: 3; }
        .distance { fill: var(--muted); font-size: 11px; font-family: monospace; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        .movable-panel { cursor: grab; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); overflow: visible; }
        .movable-panel:active { cursor: grabbing; }
        .movable-panel > div { resize: both; overflow: auto; min-width: 140px; min-height: 110px; max-width: 620px; max-height: 430px; }
        .panel-container { background: color-mix(in srgb, var(--panel) 85%, transparent); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
        .panel-header { background: var(--panel2); padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; cursor: grab; user-select: none; border-bottom: 1px solid var(--border); }
        .panel-header span { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em; }
        .drag-handle { color: var(--muted); opacity: 0.5; }
        .panel-content { padding: 10px; flex: 1; overflow-y: auto; }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
        @media (max-width: 620px) { svg { min-height: 430px; } }
      `}</style>
    </main>
  );
}


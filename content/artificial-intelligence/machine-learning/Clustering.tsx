"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BlockMath, InlineMath } from "react-katex";
import { Play, Pause, RotateCcw, Wand2, UploadCloud, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SimulationSkeleton } from "@/components/SimulationSkeleton";
import { MLGlassCard, MLSectionTitle } from "@/components/ml/MLGlassCard";
import { MLHeroBackdrop } from "@/components/ml/MLHeroBackdrop";
import { MLCodeBlock } from "@/components/ml/MLCodeBlock";
import { MLWorkflowPipeline } from "@/components/ml/MLWorkflowPipeline";
import { MLLineChart } from "@/components/ml/MLLineChart";

type PointC = { id: string; x1: number; x2: number; trueK?: number };
type Centroid = { x: number; y: number };
type KMeansState = {
  centroids: Centroid[];
  assignments: number[];
  inertia: number;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function sqDist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function parseCsvPoints(text: string): { x1: number; x2: number }[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  const rows: { x1: number; x2: number }[] = [];
  for (const line of lines) {
    const parts = line.split(",").map((s) => s.trim());
    if (parts.length < 2) continue;
    const x1 = Number(parts[0]);
    const x2 = Number(parts[1]);
    if (!Number.isFinite(x1) || !Number.isFinite(x2)) continue;
    rows.push({ x1, x2 });
  }
  return rows;
}

function generateSyntheticClusteringData(opts: {
  seed: number;
  n: number;
  trueK: number; // 2..6
  separation: number; // 0..100
  noise: number; // 0..100
  pattern: "Blobs" | "Rings";
}) {
  const rand = mulberry32(opts.seed);
  const n = Math.max(60, Math.floor(opts.n));
  const k = Math.max(2, Math.min(8, Math.floor(opts.trueK)));
  const separation = opts.separation / 100;
  const noise = opts.noise / 100;
  const sigma = 0.05 + noise * 0.2;

  const points: PointC[] = [];

  if (opts.pattern === "Rings") {
    // Two ring radii for a non-convex structure where k-means struggles.
    const rings = 2;
    const baseR1 = 0.23 + separation * 0.12;
    const baseR2 = 0.33 + separation * 0.18;
    for (let i = 0; i < n; i++) {
      const which = rand() < 0.5 ? 0 : 1;
      const r = which === 0 ? baseR1 : baseR2;
      const ang = rand() * Math.PI * 2;
      const jitter = (rand() - 0.5) * sigma;
      const cx = 0.5;
      const cy = 0.5;
      const x1 = clamp01(cx + Math.cos(ang) * (r + jitter));
      const x2 = clamp01(cy + Math.sin(ang) * (r + jitter));
      points.push({ id: `p${i}`, x1, x2, trueK: which + 1 });
    }
    return points;
  }

  // Blobs: place true centers around a circle.
  const ringR = 0.18 + separation * 0.28;
  const phase = rand() * Math.PI * 2;
  const centers: Centroid[] = Array.from({ length: k }, (_, i) => {
    const ang = phase + (i / k) * Math.PI * 2;
    return {
      x: 0.5 + Math.cos(ang) * ringR,
      y: 0.5 + Math.sin(ang) * ringR,
    };
  });

  for (let i = 0; i < n; i++) {
    const which = Math.floor(rand() * k); // true cluster
    const c = centers[which];
    const x1 = clamp01(c.x + (rand() - 0.5) * sigma * 2);
    const x2 = clamp01(c.y + (rand() - 0.5) * sigma * 2);
    points.push({ id: `p${i}`, x1, x2, trueK: which + 1 });
  }

  return points;
}

function initCentroids(points: PointC[], k: number, seed: number, mode: "Random" | "Spread") {
  const rand = mulberry32(seed);
  if (points.length === 0) return [];
  const n = points.length;

  if (mode === "Random") {
    const chosen = new Set<number>();
    const centroids: Centroid[] = [];
    while (centroids.length < k) {
      const idx = Math.floor(rand() * n);
      if (chosen.has(idx)) continue;
      chosen.add(idx);
      centroids.push({ x: points[idx].x1, y: points[idx].x2 });
    }
    return centroids;
  }

  // Spread: sort by angle around center (simple deterministic-ish heuristic).
  const cx = 0.5;
  const cy = 0.5;
  const sorted = [...points].sort((a, b) => Math.atan2(a.x2 - cy, a.x1 - cx) - Math.atan2(b.x2 - cy, b.x1 - cx));
  const centroids: Centroid[] = [];
  for (let i = 0; i < k; i++) {
    const idx = Math.floor((i / Math.max(1, k - 1)) * (sorted.length - 1));
    const p = sorted[idx];
    centroids.push({ x: p.x1, y: p.x2 });
  }
  return centroids;
}

function kmeans(points: PointC[], k: number, steps: number, seed: number, initMode: "Random" | "Spread") {
  const n = points.length;
  if (n === 0) {
    return { states: [] as KMeansState[], maxSteps: 0 };
  }

  let centroids = initCentroids(points, k, seed, initMode);
  const states: KMeansState[] = [];

  for (let step = 0; step <= steps; step++) {
    // Assign
    const assignments = points.map((p) => {
      let best = 0;
      let bestD = Infinity;
      for (let j = 0; j < centroids.length; j++) {
        const d = sqDist(p.x1, p.x2, centroids[j].x, centroids[j].y);
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      }
      return best;
    });

    // Inertia
    let inertia = 0;
    for (let i = 0; i < points.length; i++) {
      const c = centroids[assignments[i]];
      inertia += sqDist(points[i].x1, points[i].x2, c.x, c.y);
    }

    states.push({ centroids: centroids.map((c) => ({ ...c })), assignments, inertia });
    if (step === steps) break;

    // Update centroids
    const next: Centroid[] = Array.from({ length: k }, () => ({ x: 0, y: 0 }));
    const counts = Array.from({ length: k }, () => 0);
    for (let i = 0; i < points.length; i++) {
      const a = assignments[i];
      next[a].x += points[i].x1;
      next[a].y += points[i].x2;
      counts[a] += 1;
    }

    const rand = mulberry32(seed + step * 101);
    for (let j = 0; j < k; j++) {
      if (counts[j] === 0) {
        // Re-seed empty cluster to keep the lab responsive.
        const idx = Math.floor(rand() * n);
        next[j] = { x: points[idx].x1, y: points[idx].x2 };
      } else {
        next[j] = { x: next[j].x / counts[j], y: next[j].y / counts[j] };
      }
    }

    centroids = next;
  }

  return { states, maxSteps: steps };
}

function clusterColor(i: number) {
  const palette = [
    "rgba(34,211,238,0.95)", // cyan
    "rgba(168,85,247,0.95)", // purple
    "rgba(99,102,241,0.95)", // indigo
    "rgba(16,185,129,0.95)", // emerald
    "rgba(245,158,11,0.95)", // amber
    "rgba(236,72,153,0.95)", // pink
  ];
  return palette[i % palette.length];
}

function heatMixColor(a: number, b: number, t: number) {
  const tt = Math.min(1, Math.max(0, t));
  const r = Math.round(a + (b - a) * tt);
  return r;
}

export default function Clustering() {
  const simRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Playground state
  const [seed, setSeed] = useState(4242);
  const [nPoints, setNPoints] = useState(110);
  const [trueK, setTrueK] = useState(3);
  const [separation, setSeparation] = useState(66);
  const [noise, setNoise] = useState(24);
  const [pattern, setPattern] = useState<"Blobs" | "Rings">("Blobs");

  const [k, setK] = useState(3);
  const [initMode, setInitMode] = useState<"Random" | "Spread">("Random");
  const [maxSteps, setMaxSteps] = useState(18);
  const [speedMs, setSpeedMs] = useState(550);

  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isComputing, setIsComputing] = useState(true);

  const [uploadedData, setUploadedData] = useState<PointC[] | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const points = useMemo<PointC[]>(() => {
    if (uploadedData) return uploadedData;
    return generateSyntheticClusteringData({
      seed,
      n: nPoints,
      trueK,
      separation,
      noise,
      pattern,
    });
  }, [uploadedData, seed, nPoints, trueK, separation, noise, pattern]);

  const [history, setHistory] = useState<{
    states: KMeansState[];
  }>(() => ({ states: [] }));

  useEffect(() => {
    let alive = true;
    setIsComputing(true);
    setIsPlaying(false);
    setStepIndex(0);

    const t = window.setTimeout(() => {
      if (!alive) return;
      const { states } = kmeans(points, k, maxSteps, seed, initMode);
      setHistory({ states });
      setIsComputing(false);
    }, 120);

    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [points, k, maxSteps, seed, initMode]);

  useEffect(() => {
    if (!isPlaying) return;
    if (isComputing) return;

    const t = window.setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        const last = (history.states?.length ?? 1) - 1;
        if (next >= last) {
          window.clearInterval(t);
          return last;
        }
        return next;
      });
    }, Math.max(100, speedMs));

    return () => window.clearInterval(t);
  }, [isPlaying, isComputing, speedMs, history.states.length]);

  const current = history.states[Math.min(stepIndex, Math.max(0, history.states.length - 1))];
  const centroids = current?.centroids ?? [];
  const assignments = current?.assignments ?? [];
  const inertia = current?.inertia ?? 0;

  const cohesionSeparation = useMemo(() => {
    if (!current) return { cohesion: 0, sep: 0, silhouetteProxy: 0, stability: 0 };
    const prev = history.states[Math.max(0, stepIndex - 1)];
    const stability =
      prev && prev.assignments.length === assignments.length
        ? assignments.filter((a, i) => a !== prev.assignments[i]).length / Math.max(1, assignments.length)
        : 0;

    // cohesion: avg distance to assigned centroid
    let sumA = 0;
    for (let i = 0; i < points.length; i++) {
      const c = centroids[assignments[i]] ?? centroids[0];
      if (!c) continue;
      sumA += Math.sqrt(sqDist(points[i].x1, points[i].x2, c.x, c.y));
    }
    const cohesion = sumA / Math.max(1, points.length);

    // sep: minimum centroid-to-centroid distance
    let minD = Infinity;
    for (let i = 0; i < centroids.length; i++) {
      for (let j = i + 1; j < centroids.length; j++) {
        const d = Math.sqrt(sqDist(centroids[i].x, centroids[i].y, centroids[j].x, centroids[j].y));
        minD = Math.min(minD, d);
      }
    }
    if (!Number.isFinite(minD)) minD = 0;

    // silhouette proxy: use centroid distances (fast)
    let sumS = 0;
    for (let i = 0; i < points.length; i++) {
      const a = centroids[assignments[i]];
      if (!a) continue;
      const da = Math.sqrt(sqDist(points[i].x1, points[i].x2, a.x, a.y));
      let db = Infinity;
      for (let j = 0; j < centroids.length; j++) {
        if (j === assignments[i]) continue;
        const d = Math.sqrt(sqDist(points[i].x1, points[i].x2, centroids[j].x, centroids[j].y));
        db = Math.min(db, d);
      }
      const s = (db - da) / Math.max(da, db || 1e-9);
      sumS += s;
    }
    const silhouetteProxy = sumS / Math.max(1, points.length);

    return { cohesion, sep: minD, silhouetteProxy, stability };
  }, [current, history.states, stepIndex, points, assignments, centroids]);

  const reset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const newData = () => {
    setUploadedData(null);
    setUploadError(null);
    setIsPlaying(false);
    setStepIndex(0);
    setSeed((s) => s + 1);
  };

  const [userPoint, setUserPoint] = useState<{ x1: number; x2: number } | null>(null);
  const userAssign = useMemo(() => {
    if (!userPoint || centroids.length === 0) return null;
    let best = 0;
    let bestD = Infinity;
    for (let j = 0; j < centroids.length; j++) {
      const d = sqDist(userPoint.x1, userPoint.x2, centroids[j].x, centroids[j].y);
      if (d < bestD) {
        bestD = d;
        best = j;
      }
    }
    return { cluster: best, dist: Math.sqrt(bestD) };
  }, [userPoint, centroids]);

  const vis = useMemo(() => {
    const W = 560;
    const H = 360;
    const pad = { left: 48, right: 22, top: 18, bottom: 34 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;
    const xToSvg = (x: number) => pad.left + x * plotW;
    const yToSvg = (y: number) => pad.top + (1 - y) * plotH;
    return { W, H, pad, plotW, plotH, xToSvg, yToSvg };
  }, []);

  const heatCells = useMemo(() => {
    if (!centroids.length) return [];
    const gridCols = 26;
    const gridRows = 18;
    const cellW = vis.plotW / gridCols;
    const cellH = vis.plotH / gridRows;
    const cells: { id: string; x: number; y: number; c: number }[] = [];

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const xVal = (c + 0.5) / gridCols;
        const yVal = 1 - (r + 0.5) / gridRows;

        let best = 0;
        let bestD = Infinity;
        for (let j = 0; j < centroids.length; j++) {
          const d = sqDist(xVal, yVal, centroids[j].x, centroids[j].y);
          if (d < bestD) {
            bestD = d;
            best = j;
          }
        }
        const svgX = vis.pad.left + c * cellW;
        const svgY = vis.pad.top + r * cellH;
        cells.push({ id: `${r}-${c}`, x: svgX, y: svgY, c: best });
      }
    }

    return cells;
  }, [centroids, vis.pad.left, vis.pad.top, vis.plotW, vis.plotH]);

  const onPlotPointerDown = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (vis.W / rect.width);
    const py = (e.clientY - rect.top) * (vis.H / rect.height);

    const x1 = clamp01((px - vis.pad.left) / vis.plotW);
    const x2 = clamp01(1 - (py - vis.pad.top) / vis.plotH);
    setUserPoint({ x1, x2 });
  };

  const startSimulation = () => {
    simRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const stepsForWorkflow = [
    { id: "in", label: "Input", hint: "Unlabeled points" },
    { id: "prep", label: "Processing", hint: "Measure distances to centroids" },
    { id: "learn", label: "Learning", hint: "Repeat: assign → update centroids" },
    { id: "pred", label: "Prediction", hint: "Assign each point to a cluster" },
    { id: "out", label: "Output", hint: "Groups + centroids" },
  ];

  const pythonCode = `# K-Means clustering (from scratch)
import random
import math

def dist2(a, b):
    return (a[0]-b[0])**2 + (a[1]-b[1])**2

def kmeans(points, k, steps, seed=0):
    random.seed(seed)
    # init: pick random points as centroids
    centroids = random.sample(points, k)

    for _ in range(steps):
        # 1) assign each point to nearest centroid
        assign = []
        for p in points:
            best = 0
            bestD = float("inf")
            for j in range(k):
                d = dist2(p, centroids[j])
                if d < bestD:
                    bestD = d
                    best = j
            assign.append(best)

        # 2) update centroids (mean of assigned points)
        nextC = [[0.0, 0.0] for _ in range(k)]
        counts = [0 for _ in range(k)]
        for (p, a) in zip(points, assign):
            nextC[a][0] += p[0]
            nextC[a][1] += p[1]
            counts[a] += 1

        for j in range(k):
            if counts[j] > 0:
                centroids[j] = [nextC[j][0]/counts[j], nextC[j][1]/counts[j]]

    return centroids, assign`;

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-6 md:p-10 shadow-premium">
          <MLHeroBackdrop accent="cyan" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 backdrop-blur-xl px-5 py-2">
              <span className="inline-flex size-2 rounded-full bg-[var(--accent-secondary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Machine Learning • Clustering
              </span>
            </div>

            <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-[1.02] text-[var(--text-primary)]">
              Discover structure without labels.
            </h1>
            <p className="mt-4 text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              K-means repeatedly assigns points to the closest centroid, then moves centroids to the mean of their assigned points.
              Watch inertia decrease as clusters stabilize.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                onClick={startSimulation}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-5 py-3 text-sm font-bold shadow-lg shadow-indigo-500/10 active:scale-95"
              >
                <Sparkles size={16} className="mr-2" />
                Start Simulation
              </Button>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 px-4 py-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-mono text-[var(--text-secondary)]">Click the plot to see nearest cluster</span>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IS THIS TOPIC */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Beginner friendly" title="What is Clustering?" subtitle="Group similar things." />
            <div className="mt-5 space-y-4 text-[var(--text-secondary)]">
              <p className="leading-relaxed">
                Clustering finds hidden groups in data when you don’t have labels. Instead of predicting “spam/not spam”, you discover
                “these points behave similarly”.
              </p>
              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Real-life analogy</div>
                <p className="mt-2 text-sm leading-relaxed">
                  Think of sorting mixed-colored balls into boxes. You don’t know the correct labels—so you keep moving the “center of each box”
                  until balls settle into the nearest one.
                </p>
              </div>
            </div>
          </MLGlassCard>

          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Visual diagram" title="The K-means loop" subtitle="Assignment ↔ Update." />
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                <div className="text-sm font-black">1) Assign</div>
                <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">Each point joins the closest centroid.</p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                <div className="text-sm font-black">2) Update</div>
                <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">Each centroid moves to the mean of its group.</p>
              </div>
              <motion.div
                className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-4"
                initial={{ opacity: 0.3, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="text-sm font-black">Repeat</div>
                <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">Inertia acts like an energy score you’re lowering.</p>
              </motion.div>
            </div>
          </MLGlassCard>
        </section>

        {/* CORE INTUITION */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle
              eyebrow="Core intuition"
              title="Why the algorithm exists"
              subtitle="Because “similarity” needs a distance rule."
            />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-4 text-[var(--text-secondary)]">
                <p className="leading-relaxed">
                  Clustering starts by assuming you can measure how “close” two points are. In K-means, that’s usually Euclidean distance.
                </p>
                <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">What “centroid” means</div>
                  <p className="mt-2 text-sm leading-relaxed">
                    A centroid is the center of a cluster (mean location). K-means moves centers until they match the points assigned to them.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Intuition hint</div>
                <div className="mt-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl border border-[var(--border-subtle)] bg-indigo-500/10 flex items-center justify-center glow-purple">
                    <Wand2 size={18} className="text-indigo-300" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-[var(--text-primary)]">Inertia = “tightness” score</div>
                    <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                      It grows when points are far from their cluster centers. The algorithm tries to push points closer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* INTERACTIVE SIMULATION */}
        <section ref={simRef} id="simulation" className="scroll-mt-24">
          <MLGlassCard className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <MLSectionTitle eyebrow="Interactive simulation" title="K-means Clustering Lab" subtitle="Step through assign → update and watch centroids converge." />

              <div className="flex items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 px-4 py-2">
                <span className="text-xs font-mono text-[var(--text-secondary)]">step: {stepIndex}/{maxSteps}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-4">
                {isComputing ? (
                  <SimulationSkeleton />
                ) : (
                  <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-3 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 flex items-center justify-center glow-cyan">
                          <Wand2 size={18} className="text-indigo-300" />
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                            Inertia (lower is better)
                          </div>
                          <div className="text-sm font-black text-[var(--text-primary)]">
                            Inertia: {inertia.toFixed(2)} • Silhouette proxy: {cohesionSeparation.silhouetteProxy.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setIsPlaying((v) => !v)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-4 py-2 text-xs font-bold active:scale-95"
                        >
                          {isPlaying ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                          {isPlaying ? "Pause" : "Play"}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={reset}
                          className="rounded-2xl border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                        >
                          <RotateCcw size={16} className="mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-[1.5rem] opacity-[0.12] pointer-events-none bg-[radial-gradient(800px_circle_at_var(--mouse-x-pc)_var(--mouse-y-pc),rgba(34,211,238,0.22),transparent_50%)]" />

                        <svg
                          ref={svgRef}
                          viewBox={`0 0 ${vis.W} ${vis.H}`}
                          className="w-full h-auto rounded-[1.2rem] cursor-crosshair bg-[var(--bg-primary)]/25 border border-[var(--border-subtle)]"
                          onPointerDown={onPlotPointerDown}
                          role="img"
                          aria-label="Clustering feature space with K-means centroids"
                        >
                          {/* Voronoi heat cells based on nearest centroid */}
                          {heatCells.map((c) => {
                            const col = centroids[c.c] ? c.c : 0;
                            const rgba = clusterColor(col);
                            // Convert to rgb with alpha. We only need a soft tint.
                            return (
                              <rect
                                key={c.id}
                                x={c.x}
                                y={c.y}
                                width={vis.plotW / 26 + 0.2}
                                height={vis.plotH / 18 + 0.2}
                                fill={rgba.replace("0.95", "0.12")}
                              />
                            );
                          })}

                          {/* Frame */}
                          <rect
                            x={vis.pad.left}
                            y={vis.pad.top}
                            width={vis.W - vis.pad.left - vis.pad.right}
                            height={vis.H - vis.pad.top - vis.pad.bottom}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="1"
                            rx="14"
                          />

                          {/* Points */}
                          {points.map((p, i) => {
                            const cx = vis.xToSvg(p.x1);
                            const cy = vis.yToSvg(p.x2);
                            const a = assignments[i] ?? 0;
                            const col = clusterColor(a);
                            return (
                              <motion.circle
                                key={p.id}
                                cx={cx}
                                cy={cy}
                                r={5.2}
                                fill={col}
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.18 }}
                              />
                            );
                          })}

                          {/* Centroids */}
                          {centroids.map((c, j) => {
                            const cx = vis.xToSvg(c.x);
                            const cy = vis.yToSvg(c.y);
                            return (
                              <motion.g key={`cent-${j}`}>
                                <motion.circle
                                  cx={cx}
                                  cy={cy}
                                  r={10}
                                  fill={clusterColor(j).replace("0.95", "0.14")}
                                  initial={false}
                                  animate={{ r: 10 }}
                                />
                                <motion.circle
                                  cx={cx}
                                  cy={cy}
                                  r={6.5}
                                  fill={clusterColor(j)}
                                  initial={{ opacity: 0, scale: 0.7 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                />
                                <text
                                  x={cx}
                                  y={cy + 26}
                                  textAnchor="middle"
                                  fontSize="11"
                                  fill="rgba(255,255,255,0.85)"
                                  fontFamily="monospace"
                                >
                                  C{j}
                                </text>
                              </motion.g>
                            );
                          })}

                          {/* User inference */}
                          {userPoint ? (
                            (() => {
                              const cx = vis.xToSvg(userPoint.x1);
                              const cy = vis.yToSvg(userPoint.x2);
                              const cl = userAssign?.cluster ?? 0;
                              const col = clusterColor(cl);
                              return (
                                <>
                                  <circle cx={cx} cy={cy} r={12} fill={col.replace("0.95", "0.16")} />
                                  <motion.circle
                                    cx={cx}
                                    cy={cy}
                                    r={7}
                                    fill={col}
                                    initial={{ scale: 0.7, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.18 }}
                                  />
                                  <text x={cx + 10} y={cy - 10} fontSize="12" fill="rgba(255,255,255,0.88)" fontFamily="monospace">
                                    → C{cl}
                                  </text>
                                </>
                              );
                            })()
                          ) : null}
                        </svg>

                        <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                          <div className="text-xs text-[var(--text-secondary)]">
                            Each region shows the cluster assigned by nearest centroid.
                          </div>
                          <div className="flex gap-2 items-center">
                            {centroids.slice(0, Math.min(3, k)).map((_, j) => (
                              <span key={j} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--text-muted)]">
                                <span className="w-2 h-2 rounded-full" style={{ background: clusterColor(j) }} />
                                C{j}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    Controls
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Number of clusters (k)</span>
                        <span className="font-semibold text-[var(--text-primary)]">{k}</span>
                      </div>
                      <input
                        type="range"
                        min={2}
                        max={6}
                        value={k}
                        onChange={(e) => setK(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Iterations (steps)</span>
                        <span className="font-semibold text-[var(--text-primary)]">{maxSteps}</span>
                      </div>
                      <input
                        type="range"
                        min={6}
                        max={32}
                        value={maxSteps}
                        onChange={(e) => setMaxSteps(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Animation speed</span>
                        <span className="font-semibold text-[var(--text-primary)]">{speedMs}ms</span>
                      </div>
                      <input
                        type="range"
                        min={150}
                        max={1000}
                        step={50}
                        value={speedMs}
                        onChange={(e) => setSpeedMs(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="text-sm font-black text-[var(--text-primary)]">Initialization</div>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => setInitMode("Random")}
                          className={`rounded-2xl flex-1 border border-[var(--border-subtle)] ${
                            initMode === "Random" ? "bg-indigo-600/20 border-indigo-500/50 text-[var(--text-primary)]" : "bg-[var(--bg-primary)]/20 text-[var(--text-secondary)]"
                          }`}
                        >
                          Random seeds
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setInitMode("Spread")}
                          className={`rounded-2xl flex-1 border border-[var(--border-subtle)] ${
                            initMode === "Spread" ? "bg-indigo-600/20 border-indigo-500/50 text-[var(--text-primary)]" : "bg-[var(--bg-primary)]/20 text-[var(--text-secondary)]"
                          }`}
                        >
                          Spread seeds
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="secondary"
                        onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                        className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                      >
                        Step Back
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setStepIndex((i) => Math.min(maxSteps, i + 1))}
                        className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                      >
                        Step Forward
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Cohesion</div>
                        <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">{cohesionSeparation.cohesion.toFixed(2)}</div>
                      </div>
                      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Stability</div>
                        <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">
                          {(1 - cohesionSeparation.stability).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    Learning Playground
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Pattern</span>
                        <span className="font-semibold text-[var(--text-primary)]">{pattern}</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setPattern("Blobs");
                            setUploadedData(null);
                          }}
                          className={`rounded-2xl flex-1 border border-[var(--border-subtle)] ${
                            pattern === "Blobs" ? "bg-indigo-600/20 border-indigo-500/50 text-[var(--text-primary)]" : "bg-[var(--bg-primary)]/20 text-[var(--text-secondary)]"
                          }`}
                        >
                          Blobs
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setPattern("Rings");
                            setUploadedData(null);
                          }}
                          className={`rounded-2xl flex-1 border border-[var(--border-subtle)] ${
                            pattern === "Rings" ? "bg-indigo-600/20 border-indigo-500/50 text-[var(--text-primary)]" : "bg-[var(--bg-primary)]/20 text-[var(--text-secondary)]"
                          }`}
                        >
                          Rings
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Points</span>
                        <span className="font-semibold text-[var(--text-primary)]">{nPoints}</span>
                      </div>
                      <input type="range" min={70} max={180} value={nPoints} onChange={(e) => setNPoints(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">True clusters</span>
                        <span className="font-semibold text-[var(--text-primary)]">{trueK}</span>
                      </div>
                      <input type="range" min={2} max={5} value={trueK} onChange={(e) => setTrueK(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Separation</span>
                        <span className="font-semibold text-[var(--text-primary)]">{separation}%</span>
                      </div>
                      <input type="range" min={0} max={100} value={separation} onChange={(e) => setSeparation(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Noise</span>
                        <span className="font-semibold text-[var(--text-primary)]">{noise}%</span>
                      </div>
                      <input type="range" min={0} max={100} value={noise} onChange={(e) => setNoise(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={newData}
                        className="bg-[var(--bg-primary)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-2xl px-4 py-2 text-xs font-bold border border-[var(--border-subtle)] flex-1"
                      >
                        <RotateCcw size={14} className="mr-2" />
                        Generate New Data
                      </Button>

                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept=".csv,text/csv"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadError(null);
                            try {
                              const text = await file.text();
                              const rows = parseCsvPoints(text);
                              if (rows.length < 20) {
                                setUploadError("CSV must include at least 20 rows: x1,x2");
                                return;
                              }
                              const xs = rows.flatMap((r) => [r.x1, r.x2]);
                              const minV = Math.min(...xs);
                              const maxV = Math.max(...xs);
                              const span = maxV - minV || 1;
                              const normalized: PointC[] = rows.map((r, idx) => ({
                                id: `u${idx}`,
                                x1: (r.x1 - minV) / span,
                                x2: (r.x2 - minV) / span,
                              }));
                              setUploadedData(normalized);
                            } catch {
                              setUploadError("Could not read CSV. Use comma-separated values: x1,x2.");
                            }
                          }}
                        />
                        <div className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 hover:bg-[var(--bg-elevated)] px-4 py-2 text-xs font-bold text-[var(--text-secondary)] transition-all active:scale-95">
                          <UploadCloud size={14} />
                          Upload CSV
                        </div>
                      </label>
                    </div>

                    {uploadError ? (
                      <div className="mt-1 rounded-[1.2rem] border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 text-sm">
                        <div className="flex items-center gap-2 font-black">
                          <AlertTriangle size={16} />
                          Upload problem
                        </div>
                        <div className="mt-1 opacity-90">{uploadError}</div>
                      </div>
                    ) : null}

                    {uploadedData ? (
                      <div className="mt-1 rounded-[1.2rem] border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-200 text-sm">
                        <div className="flex items-center gap-2 font-black">
                          <CheckCircle2 size={16} />
                          CSV loaded ({uploadedData.length} rows)
                        </div>
                        <div className="mt-1 opacity-90">Centroids and assignments will update automatically.</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MLLineChart
                values={history.states.map((s) => s.inertia)}
                currentIndex={stepIndex}
                stroke="rgb(34,211,238)"
              />

              <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Cluster quality snapshot
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Cohesion</div>
                    <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">{cohesionSeparation.cohesion.toFixed(2)}</div>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Separation</div>
                    <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">{cohesionSeparation.sep.toFixed(2)}</div>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4 col-span-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Silhouette proxy</div>
                    <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">{cohesionSeparation.silhouetteProxy.toFixed(2)}</div>
                    <div className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                      Approximate “good clusters” score: high when points are closer to their own centroid than others.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* MATHEMATICAL EXPLANATION */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle
              eyebrow="Mathematical explanation"
              title="K-means objective (the intuition behind inertia)"
              subtitle="Math that matches what you see moving."
            />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  What we minimize
                </div>
                <div className="mt-4">
                  <BlockMath math={"\\min_{\\{\\mu_j\\}} \\; J=\\sum_{i=1}^{N} \\sum_{j=1}^{K} r_{ij} \\lVert x_i-\\mu_j \\rVert^2"} />
                  <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                    Here, <InlineMath math={"r_{ij}"} /> is 1 if point <InlineMath math={"x_i"} /> is assigned to centroid <InlineMath math={"\\mu_j"} />.
                    Inertia chart is this energy—lower means tighter groups.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    The two alternating steps
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                    <div>
                      <InlineMath math={"\\text{(Assignment)}\\quad r_{ij}=1\\;\\text{if } j=\\arg\\min_k \\lVert x_i-\\mu_k\\rVert^2"} />
                    </div>
                    <div>
                      <InlineMath math={"\\text{(Update)}\\quad \\mu_j=\\frac{1}{|C_j|}\\sum_{x_i\\in C_j} x_i"} />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    Now in the lab
                  </div>
                  <div className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed space-y-2">
                    <div>
                      <span className="font-semibold text-[var(--text-primary)]">Current k:</span> {k}
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--text-primary)]">Current inertia:</span> {inertia.toFixed(3)}
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--text-primary)]">What improves:</span> points get closer to their centroid.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* WORKFLOW */}
        <section>
          <MLWorkflowPipeline steps={stepsForWorkflow} />
        </section>

        {/* REAL-WORLD APPLICATIONS */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle
              eyebrow="Real-world applications"
              title="Clustering in the real world"
              subtitle="Why teams use unlabeled grouping."
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              <AppUseCase title="Customer segmentation" desc="Group users by behavior patterns to personalize offers." />
              <AppUseCase title="Image compression & grouping" desc="Cluster similar pixels/features to reduce redundancy." />
              <AppUseCase title="Anomaly triage" desc="Separate “weird” points into small clusters for investigation." />
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Why it’s popular</div>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                <li>• Simple and fast.</li>
                <li>• Great baseline when you don’t have labels.</li>
                <li>• Produces interpretable “centers” for downstream logic.</li>
              </ul>
            </div>
          </MLGlassCard>
        </section>

        {/* VISUALIZATION SECTION */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Visualization" title="Heat regions + cluster transitions" subtitle="Where each centroid wins." />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  What “regions” mean
                </div>
                <div className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Each cell in the heatmap belongs to the nearest centroid. When centroids move, the regions reshape.
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[0, Math.floor(maxSteps / 2), maxSteps].map((idx) => (
                    <CheckpointMini
                      key={idx}
                      idx={idx}
                      maxSteps={maxSteps}
                      inertiaHistory={history.states.map((s) => s.inertia)}
                      onJump={(i) => {
                        setIsPlaying(false);
                        setStepIndex(i);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Objective dynamics
                </div>
                <div className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed space-y-2">
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">Inertia trend:</span>{" "}
                    {history.states.length >= 2 ? (history.states[history.states.length - 1].inertia < history.states[0].inertia ? "Improving" : "Stagnant") : "—"}
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">Stability:</span>{" "}
                    {(1 - cohesionSeparation.stability).toFixed(2)} (higher = fewer assignment changes vs previous step)
                  </div>
                </div>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* CODE IMPLEMENTATION */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Code implementation" title="Beginner-friendly K-means" subtitle="Copy-friendly Python example with the same logic as the lab." />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MLCodeBlock title="Python (from scratch)" language="python" code={pythonCode} />
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Match the lab to the code
                </div>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <li>• Lab step = one assign→update loop.</li>
                  <li>• Inertia chart corresponds to sum of squared distances.</li>
                  <li>• Clicking the plot chooses the nearest centroid at that step.</li>
                </ul>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* COMMON MISTAKES */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Common mistakes & limitations" title="Why clustering can fail" subtitle="Spot the symptoms in the visualization." />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <MistakeCard title="Choosing wrong k" desc="Too small merges groups; too large fragments them. Try changing k and watch inertia/stability." />
              <MistakeCard title="Non-spherical clusters" desc="Rings or moons don’t fit “mean = best center”. Switch pattern to Rings to see it." />
              <MistakeCard title="Feature scaling issues" desc="If features have different scales, distance becomes misleading (units matter!)." />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Failure case demo</div>
              <div className="mt-3 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                  K-means optimizes squared distance to centroids—so it struggles when the “true groups” are curved or density-based.
                </div>
                <Button
                  onClick={() => {
                    setPattern("Rings");
                    setUploadedData(null);
                    setIsPlaying(false);
                    setStepIndex(0);
                  }}
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-sm font-bold active:scale-95"
                >
                  Switch to Rings
                </Button>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* FINAL SUMMARY */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Final summary" title="Takeaways + cheat sheet" subtitle="Everything important, quickly." />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Key takeaways</div>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <li>• K-means alternates assign and update steps.</li>
                  <li>• Inertia is the energy it tries to reduce.</li>
                  <li>• k and initialization strongly affect outcomes.</li>
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Important formula</div>
                <div className="mt-3">
                  <InlineMath math={"J=\\sum_{i=1}^N\\min_j\\lVert x_i-\\mu_j\\rVert^2"} />
                </div>
                <div className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  That “min” is the “nearest centroid” assignment step you see in the regions.
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Interview questions</div>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <li>• What’s the difference between inertia and silhouette?</li>
                  <li>• Why does initialization matter in K-means?</li>
                  <li>• When should you avoid K-means?</li>
                </ul>
              </div>
            </div>
          </MLGlassCard>
        </section>
      </div>
    </section>
  );
}

function AppUseCase({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
      <div className="text-sm font-black text-[var(--text-primary)]">{title}</div>
      <div className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</div>
    </div>
  );
}

function MistakeCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
      <div className="text-sm font-black text-[var(--text-primary)]">{title}</div>
      <div className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</div>
    </div>
  );
}

function CheckpointMini({
  idx,
  maxSteps,
  inertiaHistory,
  onJump,
}: {
  idx: number;
  maxSteps: number;
  inertiaHistory: number[];
  onJump: (i: number) => void;
}) {
  const inertia = inertiaHistory[Math.min(inertiaHistory.length - 1, idx)] ?? 0;
  return (
    <button
      type="button"
      onClick={() => onJump(Math.min(maxSteps, Math.max(0, idx)))}
      className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/15 p-3 hover:bg-[var(--bg-elevated)] transition-all text-left"
    >
      <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">step {idx}</div>
      <div className="mt-1 text-sm font-black text-[var(--text-primary)]">Inertia {inertia.toFixed(1)}</div>
      <div className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">Jump and compare regions.</div>
    </button>
  );
}


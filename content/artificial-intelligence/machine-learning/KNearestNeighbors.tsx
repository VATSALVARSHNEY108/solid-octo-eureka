"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { Sparkles, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MLGlassCard, MLSectionTitle } from "@/components/ml/MLGlassCard";
import { MLHeroBackdrop } from "@/components/ml/MLHeroBackdrop";
import { MLWorkflowPipeline } from "@/components/ml/MLWorkflowPipeline";
import { MLCodeBlock } from "@/components/ml/MLCodeBlock";
import { MLLineChart } from "@/components/ml/MLLineChart";

// ----- Types -----
type Point = { id: number; x: number; y: number; label: 0 | 1 | 2 };

type QueryPoint = { x: number; y: number } | null;

// ----- Constants -----
const LABELS = [0, 1, 2] as const;
const COLORS = ["#e05c5c", "#5c9ee0", "#5ccc8a"] as const;
const NAMES = ["Alpha", "Beta", "Gamma"] as const;
const W = 560,
  H = 400;

let uid = 1;

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function knn(
  pts: Point[],
  q: { x: number; y: number },
  k: number,
  metric: "euclidean" | "manhattan"
) {
  const distance = (p: Point) =>
    metric === "manhattan"
      ? Math.abs(p.x - q.x) + Math.abs(p.y - q.y)
      : dist(p, q);
  const sorted = pts
    .map(p => ({ ...p, d: distance(p) }))
    .sort((a, b) => a.d - b.d);
  const neighbors = sorted.slice(0, k);
  const votes = [0, 0, 0];
  neighbors.forEach(n => votes[n.label]++);
  const pred = votes.indexOf(Math.max(...votes)) as 0 | 1 | 2;
  return { neighbors, sortedAll: sorted, votes, pred };
}

function seedPoints(): Point[] {
  const out: Point[] = [];
  const clusters = [
    { cx: 0.2, cy: 0.2, label: 0 },
    { cx: 0.8, cy: 0.8, label: 1 },
    { cx: 0.5, cy: 0.2, label: 2 },
  ];
  clusters.forEach(c => {
    for (let i = 0; i < 5; i++) {
      out.push({
        id: uid++,
        x: c.cx + (Math.random() - 0.5) * 0.1,
        y: c.cy + (Math.random() - 0.5) * 0.1,
        label: c.label as 0 | 1 | 2,
      });
    }
  });
  return out;
}

export default function KNearestNeighbors() {
  const simRef = useRef<HTMLDivElement>(null);

  const [points, setPoints] = useState<Point[]>(seedPoints());
  const [k, setK] = useState(3);
  const [distanceMetric, setDistanceMetric] = useState<"euclidean" | "manhattan">(
    "euclidean"
  );
  const [weighted, setWeighted] = useState(true);
  const [qx, setQx] = useState(0.52);
  const [qy, setQy] = useState(0.48);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [speedMs, setSpeedMs] = useState(550);

  const result = useMemo(() => {
    const { neighbors, sortedAll, pred } = knn(
      points,
      { x: qx, y: qy },
      k,
      distanceMetric
    );
    return { neighbors, sortedAll, pred };
  }, [points, qx, qy, k, distanceMetric]);

  // Reset animation when parameters change
  useEffect(() => {
    setIsPlaying(false);
    // avoid cascading renders by batching related updates
    setStepIndex(0);
  }, [k, qx, qy, distanceMetric, weighted]);

  // Play animation
  useEffect(() => {
    if (!isPlaying) return;
    const limit = Math.min(k, result.sortedAll.length);
    const timer = setInterval(() => {
      setStepIndex(prev => {
        if (prev >= limit) {
          clearInterval(timer);
          return limit;
        }
        return prev + 1;
      });
    }, Math.max(120, speedMs));
    return () => clearInterval(timer);
  }, [isPlaying, speedMs, k, result.sortedAll.length]);

  const visibleNeighbors = result.neighbors.slice(0, stepIndex);

  const reset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-8">
          <MLHeroBackdrop accent="cyan" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-primary)]">
              K‑Nearest Neighbors (3‑class)
            </h1>
            <p className="mt-4 max-w-3xl text-[var(--text-secondary)]">
              Visualize how K‑NN classifies a query point among three clusters using distance weighting.
            </p>
            <Button
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl"
              onClick={() => simRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              <Sparkles size={16} className="mr-2" /> Start KNN Lab
            </Button>
          </div>
        </section>

        <div ref={simRef}>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Interactive simulation" title="Vote by nearest neighbors" />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Slider label="k neighbors" value={k} min={1} max={9} step={1} onChange={v => setK(Math.round(v))} />
                <Slider label="Query x" value={qx} min={0.05} max={0.95} step={0.01} onChange={setQx} />
                <Slider label="Query y" value={qy} min={0.05} max={0.95} step={0.01} onChange={setQy} />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setDistanceMetric("euclidean")}
                    className={distanceMetric === "euclidean" ? "bg-indigo-600/20 border border-indigo-500/40" : "bg-[var(--bg-primary)]/20 border border-[var(--border-subtle)]"}
                  >
                    Euclidean
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setDistanceMetric("manhattan")}
                    className={distanceMetric === "manhattan" ? "bg-indigo-600/20 border border-indigo-500/40" : "bg-[var(--bg-primary)]/20 border border-[var(--border-subtle)]"}
                  >
                    Manhattan
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setWeighted(w => !w)}
                    className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20"
                  >
                    {weighted ? "Weighted" : "Uniform"}
                  </Button>
                </div>
                <Slider label="Step animation speed (ms)" value={speedMs} min={120} max={1200} step={10} onChange={setSpeedMs} />
                <div className="flex gap-2">
                  <Button
                    className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => setIsPlaying(v => !v)}
                  >
                    {isPlaying ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20"
                    onClick={reset}
                  >
                    <RotateCcw size={16} className="mr-2" /> Reset
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/15 p-3">
                <svg viewBox="0 0 520 320" className="w-full h-auto">
                  <rect x={22} y={14} width={470} height={280} rx={14} fill="transparent" stroke="rgba(255,255,255,0.08)" />
                  {points.map(p => {
                    const x = 22 + p.x * 470;
                    const y = 14 + (1 - p.y) * 280;
                    const isN = visibleNeighbors.some(n => n.id === p.id);
                    return <circle key={p.id} cx={x} cy={y} r={isN ? 7 : 5} fill={COLORS[p.label]} opacity={isN ? 1 : 0.7} />;
                  })}
                  <circle cx={22 + qx * 470} cy={14 + (1 - qy) * 280} r={8} fill="white" />
                </svg>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <MiniMetric title="Active neighbors" value={`${visibleNeighbors.length}/${k}`} />
                  <MiniMetric title="Predicted class" value={`${result.pred}`} />
                  <MiniMetric title="Score class 0" value={"—"} />
                  <MiniMetric title="Score class 1" value={"—"} />
                  <MiniMetric title="Score class 2" value={"—"} />
                </div>
              </div>
            </div>
            <MLLineChart values={result.sortedAll.map(p => p.d)} currentIndex={Math.max(0, visibleNeighbors.length - 1)} stroke="rgb(34,211,238)" />
          </MLGlassCard>
        </div>

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Mathematical intuition" title="Distance + weighted voting" />
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/15 p-4">
              <BlockMath math={"d_{euclid}(x, x_i)=\\sqrt{\\sum_j (x_j-x_{ij})^2}"} />
              <BlockMath math={"d_{manhattan}(x, x_i)=\\sum_j |x_j-x_{ij}|"} />
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/15 p-4">
              <BlockMath math={"\\hat{y}=\\arg\\max_c\\sum_{i\\in N_k(x)} w_i\\,\\mathbf{1}[y_i=c]"} />
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                with optional weighted votes <InlineMath math={"w_i=1/(d_i+\\epsilon)"} />.
              </p>
            </div>
          </div>
        </MLGlassCard>

        <MLWorkflowPipeline
          steps={[
            { id: "1", label: "Input", hint: "Feature vector x" },
            { id: "2", label: "Processing", hint: "Compute distance to all points" },
            { id: "3", label: "Learning", hint: "Store training set (lazy)" },
            { id: "4", label: "Prediction", hint: "k‑neighbor vote" },
            { id: "5", label: "Output", hint: "Class / regression value" },
          ]}
        />
      </div>
    </section>
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span className="font-semibold text-[var(--text-primary)]">{value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-indigo-500" />
    </label>
  );
}

function MiniMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-3">
      <div className="text-[10px] text-[var(--text-secondary)]">{title}</div>
      <div className="text-lg font-black text-[var(--text-primary)]">{value}</div>
    </div>
  );
}

function UseCaseCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
      <div className="font-black text-[var(--text-primary)]">{title}</div>
      <div className="mt-1 text-sm text-[var(--text-secondary)]">{desc}</div>
    </div>
  );
}

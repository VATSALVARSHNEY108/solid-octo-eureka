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

type Point = { id: string; x1: number; x2: number; y: 0 | 1 };
type Weights = [number, number, number]; // [b, w1, w2]

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

function sigmoid(z: number) {
  // Numerically stable sigmoid.
  if (z >= 0) {
    const ez = Math.exp(-z);
    return 1 / (1 + ez);
  }
  const ez = Math.exp(z);
  return ez / (1 + ez);
}

function crossEntropyLoss(points: Point[], w: Weights) {
  const eps = 1e-8;
  let sum = 0;
  for (const p of points) {
    const z = w[0] + w[1] * p.x1 + w[2] * p.x2;
    const pr = sigmoid(z);
    const y = p.y;
    sum += -(y * Math.log(pr + eps) + (1 - y) * Math.log(1 - pr + eps));
  }
  return sum / Math.max(1, points.length);
}

function gradCrossEntropy(points: Point[], w: Weights) {
  const n = Math.max(1, points.length);
  let gb = 0;
  let gw1 = 0;
  let gw2 = 0;
  for (const p of points) {
    const z = w[0] + w[1] * p.x1 + w[2] * p.x2;
    const pr = sigmoid(z);
    const err = pr - p.y; // dL/dz for logistic
    gb += err;
    gw1 += err * p.x1;
    gw2 += err * p.x2;
  }
  return [gb / n, gw1 / n, gw2 / n] as Weights;
}

function generateSyntheticClassificationData(opts: {
  seed: number;
  n: number;
  separation: number; // 0..100
  featureNoise: number; // 0..100
  labelNoise: number; // 0..100
  classBalance: number; // 0..100
  pattern: "Linear" | "Noisy XOR";
}) {
  const rand = mulberry32(opts.seed);
  const n = Math.max(20, Math.floor(opts.n));
  const separation = opts.separation / 100;
  const featureNoise = opts.featureNoise / 100;
  const labelNoise = opts.labelNoise / 100;
  const p1 = opts.classBalance / 100;

  // Choose two centers to control separability.
  const ang = rand() * Math.PI * 2;
  const r = 0.35 + separation * 0.22;
  const cx = 0.5 + Math.cos(ang) * r;
  const cy = 0.5 + Math.sin(ang) * r;
  const cx2 = 0.5 - Math.cos(ang) * r;
  const cy2 = 0.5 - Math.sin(ang) * r;

  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    const y: 0 | 1 = rand() < p1 ? 1 : 0;
    let x1 = y === 1 ? cx : cx2;
    let x2 = y === 1 ? cy : cy2;

    const sigma = 0.06 + featureNoise * 0.18; // feature jitter radius
    x1 += (rand() - 0.5) * sigma * 2;
    x2 += (rand() - 0.5) * sigma * 2;

    if (opts.pattern === "Noisy XOR") {
      // For "hard mode", labels depend on an XOR-like rule instead of linear distance.
      const left = x1 > 0.5 ? 1 : 0;
      const top = x2 > 0.5 ? 1 : 0;
      const rule = (left ^ top) as 0 | 1;
      const flip = rand() < labelNoise ? (rule === 1 ? 0 : 1) : rule;
      points.push({
        id: `p${i}`,
        x1: clamp01(x1),
        x2: clamp01(x2),
        y: flip,
      });
      continue;
    }

    let yy = y;
    if (rand() < labelNoise) yy = yy === 1 ? 0 : 1;

    points.push({
      id: `p${i}`,
      x1: clamp01(x1),
      x2: clamp01(x2),
      y: yy,
    });
  }

  return points;
}

function parseCsvPoints(text: string): { x1: number; x2: number; y: 0 | 1 }[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const rows: { x1: number; x2: number; y: 0 | 1 }[] = [];
  for (const line of lines) {
    const parts = line.split(",").map((s) => s.trim());
    if (parts.length < 3) continue;
    const x1 = Number(parts[0]);
    const x2 = Number(parts[1]);
    const yRaw = Number(parts[2]);
    const y: 0 | 1 = yRaw >= 0.5 ? 1 : 0;
    if (!Number.isFinite(x1) || !Number.isFinite(x2)) continue;
    if (!Number.isFinite(yRaw)) continue;
    rows.push({ x1, x2, y });
  }
  return rows;
}

function formatPct(v: number) {
  return `${Math.round(v)}%`;
}

export default function Classification() {
  const simWrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Playground inputs
  const [seed, setSeed] = useState(1337);
  const [nPoints, setNPoints] = useState(96);
  const [separation, setSeparation] = useState(68);
  const [featureNoise, setFeatureNoise] = useState(26);
  const [labelNoise, setLabelNoise] = useState(12);
  const [classBalance, setClassBalance] = useState(50);
  const [pattern, setPattern] = useState<"Linear" | "Noisy XOR">("Linear");

  // Training inputs
  const [learningRate, setLearningRate] = useState(14);
  const [maxSteps, setMaxSteps] = useState(70);
  const [threshold, setThreshold] = useState(50); // for inference display only
  const [speedMs, setSpeedMs] = useState(500);

  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isComputing, setIsComputing] = useState(true);

  // Optional upload (CSV: x1,x2,y) where x1/x2 are in [0,1].
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<Point[] | null>(null);

  const data = useMemo<Point[]>(() => {
    if (uploadedData) return uploadedData;
    return generateSyntheticClassificationData({
      seed,
      n: nPoints,
      separation,
      featureNoise,
      labelNoise,
      classBalance,
      pattern,
    });
  }, [uploadedData, seed, nPoints, separation, featureNoise, labelNoise, classBalance, pattern]);

  const [history, setHistory] = useState<{
    weights: Weights[];
    losses: number[];
  }>(() => ({ weights: [[0, 0, 0]], losses: [0] }));

  const lr = learningRate / 100; // map 0..100 → 0..1
  const th = threshold / 100;

  // Precompute the full gradient descent trajectory so step/pause is smooth.
  useEffect(() => {
    let alive = true;
    setIsComputing(true);
    setIsPlaying(false);
    setStepIndex(0);

    const t = window.setTimeout(() => {
      if (!alive) return;

      const points = data;
      const w0: Weights = [0, 0, 0];
      const weights: Weights[] = [w0];
      const losses: number[] = [];

      let w = w0;
      for (let i = 0; i <= maxSteps; i++) {
        const loss = crossEntropyLoss(points, w);
        losses.push(loss);
        if (i === maxSteps) break;
        const g = gradCrossEntropy(points, w);
        const wNext: Weights = [w[0] - lr * g[0], w[1] - lr * g[1], w[2] - lr * g[2]];
        weights.push(wNext);
        w = wNext;
      }

      setHistory({ weights, losses });
      setIsComputing(false);
    }, 120);

    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [data, lr, maxSteps]);

  useEffect(() => {
    if (!isPlaying) return;
    if (isComputing) return;

    const t = window.setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= history.weights.length - 1) {
          window.clearInterval(t);
          return history.weights.length - 1;
        }
        return next;
      });
    }, Math.max(100, speedMs));

    return () => window.clearInterval(t);
  }, [isPlaying, isComputing, speedMs, history.weights.length]);

  const currentW = history.weights[Math.min(stepIndex, history.weights.length - 1)] ?? [0, 0, 0];
  const currentLoss = history.losses[Math.min(stepIndex, history.losses.length - 1)] ?? 0;

  const metrics = useMemo(() => {
    const preds = data.map((p) => {
      const z = currentW[0] + currentW[1] * p.x1 + currentW[2] * p.x2;
      const pr = sigmoid(z);
      const predY: 0 | 1 = pr >= th ? 1 : 0;
      return { predY, y: p.y, pr };
    });

    let tp = 0;
    let fp = 0;
    let fn = 0;
    for (const r of preds) {
      if (r.predY === 1 && r.y === 1) tp++;
      if (r.predY === 1 && r.y === 0) fp++;
      if (r.predY === 0 && r.y === 1) fn++;
    }
    const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
    const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

    return { precision, recall, f1, tp, fp, fn };
  }, [data, currentW, th]);

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
  const userPred = useMemo(() => {
    if (!userPoint) return null;
    const z = currentW[0] + currentW[1] * userPoint.x1 + currentW[2] * userPoint.x2;
    const pr = sigmoid(z);
    const predY: 0 | 1 = pr >= th ? 1 : 0;
    return { pr, predY };
  }, [userPoint, currentW, th]);

  const [boundaryViz, boundaryHeat] = useMemo(() => {
    const w = currentW;
    const eps = 1e-6;

    // SVG coordinate mapping
    const xMin = 0;
    const xMax = 1;
    const yMin = 0;
    const yMax = 1;
    const pad = { left: 46, right: 22, top: 18, bottom: 34 };
    const W = 540;
    const H = 360;
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;

    const xToSvg = (x: number) => pad.left + (x - xMin) / (xMax - xMin) * plotW;
    const yToSvg = (y: number) => pad.top + (yMax - y) / (yMax - yMin) * plotH;

    let seg: { x1: number; y1: number; x2: number; y2: number } | null = null;
    const b = w[0];
    const a1 = w[1];
    const a2 = w[2];

    if (Math.abs(a2) > eps) {
      // x2 = -(b + a1*x1)/a2
      const yAt0 = -(b + a1 * xMin) / a2;
      const yAt1 = -(b + a1 * xMax) / a2;
      const clampY = (v: number) => Math.min(yMax, Math.max(yMin, v));
      seg = {
        x1: xToSvg(xMin),
        y1: yToSvg(clampY(yAt0)),
        x2: xToSvg(xMax),
        y2: yToSvg(clampY(yAt1)),
      };
    } else if (Math.abs(a1) > eps) {
      // vertical boundary: x1 = -b/a1
      const x = -b / a1;
      const xc = Math.min(xMax, Math.max(xMin, x));
      seg = {
        x1: xToSvg(xc),
        y1: yToSvg(yMin),
        x2: xToSvg(xc),
        y2: yToSvg(yMax),
      };
    } else {
      seg = null;
    }

    // Heatmap grid for intuition
    const gridCols = 28;
    const gridRows = 18;
    const cellW = plotW / gridCols;
    const cellH = plotH / gridRows;

    const cells: { id: string; x: number; y: number; p: number }[] = [];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const xVal = xMin + (c + 0.5) / gridCols * (xMax - xMin);
        const yVal = yMin + (r + 0.5) / gridRows * (yMax - yMin);
        const z = w[0] + w[1] * xVal + w[2] * yVal;
        const p = sigmoid(z);
        const svgX = pad.left + c * cellW;
        const svgY = pad.top + r * cellH;
        cells.push({ id: `${r}-${c}`, x: svgX, y: svgY, p });
      }
    }

    return [
      {
        seg,
        W,
        H,
        pad,
        xToSvg,
        yToSvg,
      },
      { cells, gridCols, gridRows, plotW, plotH, pad },
    ] as const;
  }, [currentW]);

  const onPlotPointerDown = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const pad = boundaryViz.pad;
    const xMin = 0;
    const xMax = 1;
    const yMin = 0;
    const yMax = 1;
    const W = boundaryViz.W;
    const H = boundaryViz.H;
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;

    const px = (e.clientX - rect.left) * (W / rect.width);
    const py = (e.clientY - rect.top) * (H / rect.height);

    const xClamped = Math.min(W - pad.right, Math.max(pad.left, px));
    const yClamped = Math.min(H - pad.bottom, Math.max(pad.top, py));

    const x1 = xMin + ((xClamped - pad.left) / plotW) * (xMax - xMin);
    const x2 = yMax - ((yClamped - pad.top) / plotH) * (yMax - yMin);

    setUserPoint({ x1: clamp01(x1), x2: clamp01(x2) });
  };

  const startSimulation = () => {
    simWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const stepsForWorkflow = [
    { id: "in", label: "Input", hint: "Features (x1, x2) + labels (y)" },
    { id: "prep", label: "Processing", hint: "Compute probabilities with sigmoid" },
    { id: "learn", label: "Learning", hint: "Update weights using gradient descent" },
    { id: "pred", label: "Prediction", hint: "Compare prob vs decision threshold" },
    { id: "out", label: "Output", hint: "Class + confidence" },
  ];

  const boundaryLabel = pattern === "Linear" ? "Decision boundary learns a line" : "Decision boundary struggles on XOR";

  const pythonCode = `# Logistic Regression (binary classification) - tiny gradient descent demo
import math
import random

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

def cross_entropy(points, w):
    # w = [b, w1, w2]
    eps = 1e-8
    total = 0.0
    for x1, x2, y in points:
        z = w[0] + w[1]*x1 + w[2]*x2
        p = sigmoid(z)
        total += -(y*math.log(p+eps) + (1-y)*math.log(1-p+eps))
    return total / len(points)

def grad(points, w):
    gb = gw1 = gw2 = 0.0
    n = len(points)
    for x1, x2, y in points:
        z = w[0] + w[1]*x1 + w[2]*x2
        p = sigmoid(z)
        err = p - y
        gb += err
        gw1 += err * x1
        gw2 += err * x2
    return [gb/n, gw1/n, gw2/n]

# Synthetic data: (x1, x2, y) where y in {0,1}
points = [(0.1,0.2,0), (0.9,0.8,1)]  # replace with your dataset

lr = 0.2
steps = 100
w = [0.0, 0.0, 0.0]

for t in range(steps):
    loss = cross_entropy(points, w)
    g = grad(points, w)
    w = [w[0]-lr*g[0], w[1]-lr*g[1], w[2]-lr*g[2]]
    if t % 10 == 0:
        print(t, "loss=", loss, "w=", w)`;

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-6 md:p-10 shadow-premium">
          <MLHeroBackdrop accent="indigo" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 backdrop-blur-xl px-5 py-2">
              <span className="inline-flex size-2 rounded-full bg-[var(--accent-secondary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Machine Learning • Classification
              </span>
            </div>

            <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-[1.02] text-[var(--text-primary)]">
              Classify inputs with a moving decision boundary.
            </h1>
            <p className="mt-4 text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              Logistic regression learns a line that separates classes by turning raw features into{" "}
              <span className="font-semibold text-[var(--text-primary)]">probabilities</span>. Play the
              simulation to watch weights update and the boundary refine.
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
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 glow-cyan" />
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  Click the plot to test inference
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IS THIS TOPIC */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MLGlassCard className="p-8">
            <MLSectionTitle
              eyebrow="Beginner friendly"
              title="What is Classification?"
              subtitle="Turn numbers into decisions."
            />
            <div className="mt-5 space-y-4 text-[var(--text-secondary)]">
              <p className="leading-relaxed">
                Classification is the task of taking an input (like an email’s text features or a patient’s test
                results) and outputting a <span className="font-semibold text-[var(--text-primary)]">category</span>{" "}
                (spam/not spam, disease/not disease).
              </p>
              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Real-life analogy
                </div>
                <p className="mt-2 text-sm leading-relaxed">
                  Imagine a bouncer with two doors. A simple model watches your features and decides which door
                  you should walk through—then it gives a{" "}
                  <span className="font-semibold text-[var(--text-primary)]">confidence</span> based on how close you are
                  to the boundary.
                </p>
              </div>
            </div>
          </MLGlassCard>

          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Visual diagram" title="From input to class" subtitle="A mental model you can reuse." />
            <div className="mt-6 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 px-4 py-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    Input
                  </div>
                  <div className="text-sm font-black">Features</div>
                </div>
                <div className="text-[var(--text-muted)]">→</div>
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 px-4 py-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    Model
                  </div>
                  <div className="text-sm font-black">Probabilities</div>
                </div>
                <div className="text-[var(--text-muted)]">→</div>
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 px-4 py-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    Output
                  </div>
                  <div className="text-sm font-black">Class</div>
                </div>
              </div>

              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-4 shimmer-bg">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Key idea
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  A classifier doesn’t just pick a label. It learns a{" "}
                  <span className="font-semibold text-[var(--text-primary)]">boundary</span> where the meaning shifts from
                  class 0 to class 1.
                </p>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* CORE INTUITION */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle
              eyebrow="Core intuition"
              title="Why do we need a model?"
              subtitle="Because we want decisions that generalize—not guesses."
            />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-4 text-[var(--text-secondary)]">
                <p className="leading-relaxed">
                  You’re given examples: some points are class 1, others are class 0. The job of the model is to
                  learn a rule that predicts the label for new, unseen points.
                </p>
                <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    What logistic regression does
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                    <li>• Converts a weighted sum into a probability.</li>
                    <li>• Uses gradient descent to reduce classification error.</li>
                    <li>• Produces a decision boundary you can visualize.</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Intuition animation
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <motion.div
                    initial={{ opacity: 0.2, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-10 h-10 rounded-2xl border border-[var(--border-subtle)] bg-indigo-500/10 flex items-center justify-center glow-purple"
                  >
                    <span className="text-sm font-black text-indigo-400">1</span>
                  </motion.div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-[var(--text-primary)]">
                      Weights move → boundary rotates
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                      Each training step nudges weights to make misclassified points less likely.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-4">
                  <div className="text-sm font-black">A quick check</div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    In the simulation below, if the loss is going down, the boundary is becoming more helpful.
                  </p>
                </div>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* INTERACTIVE SIMULATION */}
        <section ref={simWrapRef} id="simulation" className="scroll-mt-24">
          <MLGlassCard className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <MLSectionTitle eyebrow="Interactive simulation" title="Logistic Regression Lab" subtitle={boundaryLabel} />

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 px-4 py-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-xs font-mono text-[var(--text-secondary)]">
                    step: {stepIndex}/{maxSteps}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Plot + explanation */}
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
                            Decision Boundary
                          </div>
                          <div className="text-sm font-black text-[var(--text-primary)]">
                            Loss: {currentLoss.toFixed(3)} • F1: {metrics.f1.toFixed(2)}
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
                        <div className="absolute inset-0 rounded-[1.5rem] opacity-[0.12] pointer-events-none bg-[radial-gradient(800px_circle_at_var(--mouse-x-pc)_var(--mouse-y-pc),rgba(99,102,241,0.22),transparent_50%)]" />

                        <svg
                          ref={svgRef}
                          viewBox={`0 0 ${boundaryViz.W} ${boundaryViz.H}`}
                          className="w-full h-auto rounded-[1.2rem] cursor-crosshair bg-[var(--bg-primary)]/25 border border-[var(--border-subtle)]"
                          onPointerDown={onPlotPointerDown}
                          role="img"
                          aria-label="Classification feature space and decision boundary"
                        >
                          {/* Heatmap cells */}
                          {boundaryHeat.cells.map((c) => {
                            const p = c.p;
                            // Mix between class colors based on p.
                            // p close to 1 => purple, p close to 0 => cyan.
                            const t = p; // 0..1
                            const rgb = mixRgb({ a: [34, 211, 238], b: [168, 85, 247] }, t);
                            const alpha = 0.06 + 0.28 * Math.abs(p - th);
                            return (
                              <rect
                                key={c.id}
                                x={c.x}
                                y={c.y}
                                width={boundaryHeat.plotW / boundaryHeat.gridCols + 0.2}
                                height={boundaryHeat.plotH / boundaryHeat.gridRows + 0.2}
                                fill={`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`}
                              />
                            );
                          })}

                          {/* Axes frame */}
                          <rect
                            x={boundaryViz.pad.left}
                            y={boundaryViz.pad.top}
                            width={boundaryViz.W - boundaryViz.pad.left - boundaryViz.pad.right}
                            height={boundaryViz.H - boundaryViz.pad.top - boundaryViz.pad.bottom}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="1"
                            rx="14"
                          />

                          {/* Boundary line */}
                          {boundaryViz.seg ? (
                            <motion.line
                              x1={boundaryViz.seg.x1}
                              y1={boundaryViz.seg.y1}
                              x2={boundaryViz.seg.x2}
                              y2={boundaryViz.seg.y2}
                              stroke="rgba(255,255,255,0.92)"
                              strokeWidth="2"
                              strokeDasharray="6 6"
                              initial={false}
                              animate={{ opacity: [0.4, 1] }}
                              transition={{ duration: 0.18 }}
                            />
                          ) : null}

                          {/* Points */}
                          {data.map((p) => {
                            const cx = boundaryViz.xToSvg(p.x1);
                            const cy = boundaryViz.yToSvg(p.x2);
                            const color = p.y === 1 ? "rgba(168,85,247,0.95)" : "rgba(34,211,238,0.95)";
                            return (
                              <motion.circle
                                key={p.id}
                                cx={cx}
                                cy={cy}
                                r={5.2}
                                fill={color}
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.22 }}
                              />
                            );
                          })}

                          {/* User inference point */}
                          {userPoint ? (
                            (() => {
                              const cx = boundaryViz.xToSvg(userPoint.x1);
                              const cy = boundaryViz.yToSvg(userPoint.x2);
                              const pr = userPred?.pr ?? 0.5;
                              const predColor = pr >= th ? "rgba(168,85,247,1)" : "rgba(34,211,238,1)";
                              return (
                                <>
                                  <circle cx={cx} cy={cy} r={10} fill={predColor} opacity={0.18} />
                                  <motion.circle
                                    cx={cx}
                                    cy={cy}
                                    r={7}
                                    fill={predColor}
                                    initial={{ scale: 0.7, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  <text x={cx + 10} y={cy - 10} fontSize="12" fill="rgba(255,255,255,0.88)" fontFamily="monospace">
                                    p={pr.toFixed(2)}
                                  </text>
                                </>
                              );
                            })()
                          ) : null}
                        </svg>

                        <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                          <div className="text-xs text-[var(--text-secondary)]">
                            Click anywhere in the plot to see <span className="font-semibold text-[var(--text-primary)]">probability</span>{" "}
                            under the current weights.
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--text-muted)]">
                              <span className="w-2 h-2 rounded-full bg-cyan-400" />
                              Class 0
                            </span>
                            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--text-muted)]">
                              <span className="w-2 h-2 rounded-full bg-purple-400" />
                              Class 1
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    Controls
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Learning rate</span>
                        <span className="font-semibold text-[var(--text-primary)]">{lr.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={40}
                        value={learningRate}
                        onChange={(e) => setLearningRate(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Training steps</span>
                        <span className="font-semibold text-[var(--text-primary)]">{maxSteps}</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={140}
                        value={maxSteps}
                        onChange={(e) => setMaxSteps(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Inference threshold</span>
                        <span className="font-semibold text-[var(--text-primary)]">{formatPct(th * 100)}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
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

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Precision</div>
                        <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">{metrics.precision.toFixed(2)}</div>
                      </div>
                      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Recall</div>
                        <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">{metrics.recall.toFixed(2)}</div>
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
                            setPattern("Linear");
                            setUploadedData(null);
                          }}
                          className={`rounded-2xl flex-1 border border-[var(--border-subtle)] ${
                            pattern === "Linear" ? "bg-indigo-600/20 border-indigo-500/50 text-[var(--text-primary)]" : "bg-[var(--bg-primary)]/20 text-[var(--text-secondary)]"
                          }`}
                        >
                          Linear
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setPattern("Noisy XOR");
                            setUploadedData(null);
                          }}
                          className={`rounded-2xl flex-1 border border-[var(--border-subtle)] ${
                            pattern === "Noisy XOR" ? "bg-indigo-600/20 border-indigo-500/50 text-[var(--text-primary)]" : "bg-[var(--bg-primary)]/20 text-[var(--text-secondary)]"
                          }`}
                        >
                          Noisy XOR
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Points</span>
                        <span className="font-semibold text-[var(--text-primary)]">{nPoints}</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={160}
                        value={nPoints}
                        onChange={(e) => setNPoints(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Separation</span>
                        <span className="font-semibold text-[var(--text-primary)]">{separation}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={separation}
                        onChange={(e) => setSeparation(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Feature noise</span>
                        <span className="font-semibold text-[var(--text-primary)]">{featureNoise}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={featureNoise}
                        onChange={(e) => setFeatureNoise(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Label noise</span>
                        <span className="font-semibold text-[var(--text-primary)]">{labelNoise}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={40}
                        value={labelNoise}
                        onChange={(e) => setLabelNoise(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Class balance</span>
                        <span className="font-semibold text-[var(--text-primary)]">{classBalance}% class 1</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={90}
                        value={classBalance}
                        onChange={(e) => setClassBalance(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
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
                                setUploadError("CSV must include at least 20 valid rows: x1,x2,y.");
                                return;
                              }
                              // Normalize if user provided values outside [0,1].
                              const xs = rows.flatMap((r) => [r.x1, r.x2]);
                              const minV = Math.min(...xs);
                              const maxV = Math.max(...xs);
                              const span = maxV - minV || 1;
                              const normalized: Point[] = rows.map((r, idx) => ({
                                id: `u${idx}`,
                                x1: (r.x1 - minV) / span,
                                x2: (r.x2 - minV) / span,
                                y: r.y,
                              }));
                              setUploadedData(normalized);
                            } catch {
                              setUploadError("Could not read CSV. Use comma-separated values: x1,x2,y");
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
                        <div className="mt-1 opacity-90">Weights will retrain automatically.</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Training signal / charts */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <MLLineChart
                  values={history.losses}
                  currentIndex={stepIndex}
                  stroke="rgb(99,102,241)"
                  className="bg-[var(--bg-primary)]/10"
                />
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed px-2">
                  Loss drops when predictions match labels more often. If it flattens too early, the model may underfit.
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Weight trajectory (bypass intuition → see movement)
                </div>
                <div className="mt-3 rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/15 p-3">
                  <WeightPlane weights={history.weights} currentIndex={stepIndex} />
                </div>
                <div className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  The point moves as gradient descent updates weights. A better boundary often correlates with decreasing loss.
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
              title="Math intuition (without the intimidation)"
              subtitle="Each formula maps to a visual part of the simulation."
            />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    1) Sigmoid = “how likely class 1 is”
                  </div>
                  <div className="mt-4">
                    <BlockMath math={"p(y=1\\mid x)=\\sigma(z)"} />
                    <div className="mt-3 text-sm text-[var(--text-secondary)]">
                      where <InlineMath math={"z=b+w_1x_1+w_2x_2"} />.
                    </div>
                    <div className="mt-3">
                      <BlockMath math={"\\sigma(z)=\\frac{1}{1+e^{-z}}"} />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    2) Cross-entropy = “penalize wrong probabilities”
                  </div>
                  <div className="mt-4">
                    <BlockMath math={"\\mathcal{L}=-\\frac{1}{N}\\sum_i \\left[y_i\\log(p_i)+(1-y_i)\\log(1-p_i)\\right]"} />
                    <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                      If a point is class 1 but the model says probability is tiny, the log penalty is large—so loss shoots up.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    3) Gradient descent = “nudge weights”
                  </div>
                  <div className="mt-4">
                    <BlockMath math={"\\theta \\leftarrow \\theta - \\eta\\,\\nabla_\\theta \\mathcal{L}"} />
                    <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                      Think of <InlineMath math={"\\eta"} /> as your step size (learning rate). In the lab, moving the learning-rate slider changes how fast
                      the boundary tries to improve.
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                    What you’re seeing right now
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-[var(--text-primary)]">Weights</span>
                      <span className="font-mono text-[var(--text-secondary)]">
                        b={currentW[0].toFixed(2)} • w1={currentW[1].toFixed(2)} • w2={currentW[2].toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-[var(--text-primary)]">Current loss</span>
                      <span className="font-mono">{currentLoss.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-[var(--text-primary)]">Boundary meaning</span>
                      <span className="font-mono">p ≈ {th.toFixed(2)}</span>
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
            <MLSectionTitle eyebrow="Real-world applications" title="Where classification shows up" subtitle="Industry use-cases + why teams choose it." />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              <AppUseCase
                title="Spam & phishing detection"
                desc="Email features → probability spam → threshold by risk tolerance."
              />
              <AppUseCase title="Medical decision support" desc="Lab values → disease likelihood for triage." />
              <AppUseCase title="Credit scoring" desc="Customer features → approve/decline with confidence." />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Why companies use models like this
              </div>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                <li>• Fast to train and easy to monitor.</li>
                <li>• Probabilities help you handle different business costs.</li>
                <li>• Works well when class boundaries are close to linear.</li>
              </ul>
            </div>
          </MLGlassCard>
        </section>

        {/* VISUALIZATION SECTION */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Visualization" title="Feature space + state transitions" subtitle="A few extra visuals to deepen intuition." />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Animated decision boundary checkpoints
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[0, Math.floor(maxSteps / 3), Math.floor((2 * maxSteps) / 3), maxSteps].map((idx) => (
                    <CheckpointCard
                      key={idx}
                      idx={idx}
                      maxSteps={maxSteps}
                      weights={history.weights}
                      th={th}
                      points={data}
                      setStepIndex={(i) => {
                        setIsPlaying(false);
                        setStepIndex(i);
                      }}
                    />
                  ))}
                </div>
                <div className="mt-3 text-sm text-[var(--text-secondary)]">
                  Tap a checkpoint to jump the simulation to that training moment.
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Confusion view (at threshold)
                </div>
                <ConfusionCard tp={metrics.tp} fp={metrics.fp} fn={metrics.fn} total={data.length} />
                <div className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Changing the inference threshold shifts how many positives you predict—use this to reason about false positives vs false negatives.
                </div>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* CODE IMPLEMENTATION */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Code implementation" title="Beginner-friendly logistic regression" subtitle="Copy-friendly Python example." />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <MLCodeBlock title="Python (from scratch)" language="python" code={pythonCode} />
              </div>

              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  How to read this
                </div>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <li>• `sigmoid(z)` turns a score into probability.</li>
                  <li>• `cross_entropy` is the loss you see in the chart.</li>
                  <li>• `grad()` computes “which direction makes things better”.</li>
                  <li>• `w ← w - lr * grad` is the update step.</li>
                </ul>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* COMMON MISTAKES */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Common mistakes & limitations" title="When logistic regression doesn’t shine" subtitle="Visual failure modes you can recognize." />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <MistakeCard
                title="Non-linear boundaries (XOR / circles)"
                desc="A linear model can’t represent curved boundaries—switch Pattern to “Noisy XOR” to see it."
              />
              <MistakeCard title="Bad learning rate" desc="Too high → unstable updates; too low → slow progress (loss chart helps debug)." />
              <MistakeCard title="Class imbalance" desc="With imbalanced classes, a 0.5 threshold may hide false negatives or false positives." />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Quick diagnostic
              </div>
              <div className="mt-3 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                  If the loss is still high after many steps, either the data pattern isn’t linearly separable, or the learning rate is making progress inefficient.
                </div>
                <Button
                  onClick={() => {
                    setPattern("Noisy XOR");
                    setUploadedData(null);
                    setIsPlaying(false);
                    setStepIndex(0);
                  }}
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-sm font-bold active:scale-95"
                >
                  Try Noisy XOR
                </Button>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* FINAL SUMMARY */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Final summary" title="Takeaways you can reuse anywhere" subtitle="Cheat sheet + interview-friendly questions." />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Key takeaways</div>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <li>• Probabilities come from sigmoid of a weighted sum.</li>
                  <li>• Loss tells you if the boundary is getting better.</li>
                  <li>• Gradient descent updates weights step-by-step.</li>
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Important formulas</div>
                <div className="mt-3 space-y-3">
                  <div className="text-sm font-black text-[var(--text-primary)]">Sigmoid</div>
                  <InlineMath math={"\\sigma(z)=\\frac{1}{1+e^{-z}}"} />
                  <div className="text-sm font-black text-[var(--text-primary)]">Loss</div>
                  <InlineMath math={"\\mathcal{L}=-\\frac{1}{N}\\sum_i\\left[y_i\\log p_i+(1-y_i)\\log(1-p_i)\\right]"} />
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Interview questions</div>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <li>• Why do we use a probability threshold?</li>
                  <li>• What happens when learning rate is too high?</li>
                  <li>• When does logistic regression underfit?</li>
                </ul>
              </div>
            </div>
          </MLGlassCard>
        </section>
      </div>
    </section>
  );
}

function mixRgb(
  colors: { a: [number, number, number]; b: [number, number, number] },
  t: number,
): [number, number, number] {
  const tt = Math.min(1, Math.max(0, t));
  const r = Math.round(colors.a[0] + (colors.b[0] - colors.a[0]) * tt);
  const g = Math.round(colors.a[1] + (colors.b[1] - colors.a[1]) * tt);
  const b = Math.round(colors.a[2] + (colors.b[2] - colors.a[2]) * tt);
  return [r, g, b];
}

function WeightPlane({ weights, currentIndex }: { weights: Weights[]; currentIndex: number }) {
  const W = 360;
  const H = 190;
  const pad = 18;

  const points = useMemo(() => {
    const xs = weights.map((w) => w[1]);
    const ys = weights.map((w) => w[2]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;

    const mapX = (x: number) => pad + ((x - minX) / spanX) * (W - pad * 2);
    const mapY = (y: number) => pad + (1 - (y - minY) / spanY) * (H - pad * 2);

    return weights.map((w, i) => ({
      id: `w-${i}`,
      x: mapX(w[1]),
      y: mapY(w[2]),
      xi: w[1],
      yi: w[2],
    }));
  }, [weights]);

  const path = useMemo(() => {
    if (points.length === 0) return "";
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  }, [points]);

  const idx = Math.min(points.length - 1, Math.max(0, currentIndex));
  const cur = points[idx];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <rect x={pad} y={pad} width={W - pad * 2} height={H - pad * 2} fill="none" stroke="rgba(255,255,255,0.08)" rx="12" />
      <path d={path} fill="none" stroke="rgba(99,102,241,0.65)" strokeWidth={2} strokeLinecap="round" />
      <circle cx={cur?.x ?? pad} cy={cur?.y ?? pad} r={6} fill="rgb(99,102,241)" opacity={0.9} />
      <text x={pad} y={H - 6} fontSize="11" fill="rgba(255,255,255,0.6)" fontFamily="monospace">
        w1
      </text>
      <text x={W - 60} y={18} fontSize="11" fill="rgba(255,255,255,0.6)" fontFamily="monospace">
        w2
      </text>
    </svg>
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

function ConfusionCard({ tp, fp, fn, total }: { tp: number; fp: number; fn: number; total: number }) {
  const tn = Math.max(0, total - tp - fp - fn);
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <MiniCell label="TP" value={tp} variant="emerald" />
      <MiniCell label="FP" value={fp} variant="amber" />
      <MiniCell label="FN" value={fn} variant="amber" />
      <MiniCell label="TN" value={tn} variant="slate" />
    </div>
  );
}

function MiniCell({ label, value, variant }: { label: string; value: number; variant: "emerald" | "amber" | "slate" }) {
  const colors =
    variant === "emerald"
      ? { b: "rgba(16,185,129,0.25)", t: "rgb(52,211,153)" }
      : variant === "amber"
        ? { b: "rgba(245,158,11,0.22)", t: "rgb(251,191,36)" }
        : { b: "rgba(148,163,184,0.18)", t: "rgb(148,163,184)" };

  return (
    <div className="rounded-[1.3rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4" style={{ boxShadow: `0 0 0 1px ${colors.b} inset` }}>
      <div className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: "rgba(255,255,255,0.6)" }}>
        {label}
      </div>
      <div className="mt-2 text-3xl font-black" style={{ color: colors.t }}>
        {value}
      </div>
    </div>
  );
}

function CheckpointCard({
  idx,
  maxSteps,
  weights,
  th,
  points,
  setStepIndex,
}: {
  idx: number;
  maxSteps: number;
  weights: Weights[];
  th: number;
  points: Point[];
  setStepIndex: (i: number) => void;
}) {
  const w = weights[Math.min(idx, weights.length - 1)] ?? [0, 0, 0];

  const quality = useMemo(() => {
    let correct = 0;
    for (const p of points) {
      const z = w[0] + w[1] * p.x1 + w[2] * p.x2;
      const pr = sigmoid(z);
      const predY: 0 | 1 = pr >= th ? 1 : 0;
      if (predY === p.y) correct++;
    }
    return correct / Math.max(1, points.length);
  }, [points, w, th]);

  return (
    <button
      type="button"
      onClick={() => setStepIndex(Math.min(maxSteps, Math.max(0, idx)))}
      className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/15 p-3 hover:bg-[var(--bg-elevated)] transition-all text-left"
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">step {idx}</div>
        <div className="text-[10px] font-mono text-[var(--text-secondary)] opacity-80">{Math.round(quality * 100)}%</div>
      </div>
      <div className="mt-2 text-sm font-black text-[var(--text-primary)]">Boundary quality</div>
      <div className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
        a quick “accuracy proxy” at inference threshold.
      </div>
    </button>
  );
}


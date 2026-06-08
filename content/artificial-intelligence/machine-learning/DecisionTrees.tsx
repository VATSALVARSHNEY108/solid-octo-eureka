"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BlockMath, InlineMath } from "react-katex";
import {
  Play,
  Pause,
  RotateCcw,
  Wand2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SimulationSkeleton } from "@/components/SimulationSkeleton";
import { MLGlassCard, MLSectionTitle } from "@/components/ml/MLGlassCard";
import { MLHeroBackdrop } from "@/components/ml/MLHeroBackdrop";
import { MLWorkflowPipeline } from "@/components/ml/MLWorkflowPipeline";
import { MLCodeBlock } from "@/components/ml/MLCodeBlock";
import { MLLineChart } from "@/components/ml/MLLineChart";

type DTPoint = { id: string; x1: number; x2: number; y: 0 | 1 };

type SplitAxis = "x1" | "x2";
type Split = { axis: SplitAxis; threshold: number };

type TreeNode = {
  id: string;
  depth: number;
  samples: number;
  prob1: number; // P(y=1) at this node
  prediction: 0 | 1;
  impurity: number;
  expanded: boolean; // has this node chosen a split?
  canSplit: boolean; // is there a valid split worth expanding?
  split?: Split;
  left?: TreeNode;
  right?: TreeNode;
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

function giniFromPoints(points: DTPoint[]) {
  const n = Math.max(1, points.length);
  const ones = points.reduce((s, p) => s + (p.y === 1 ? 1 : 0), 0);
  const p = ones / n;
  return 2 * p * (1 - p);
}

function entropyFromPoints(points: DTPoint[]) {
  const n = Math.max(1, points.length);
  const ones = points.reduce((s, p) => s + (p.y === 1 ? 1 : 0), 0);
  const p1 = ones / n;
  const p0 = 1 - p1;
  const eps = 1e-12;
  const h = -(p1 * Math.log(p1 + eps) + p0 * Math.log(p0 + eps));
  return h;
}

function impurityOf(points: DTPoint[], criterion: "gini" | "entropy") {
  return criterion === "gini" ? giniFromPoints(points) : entropyFromPoints(points);
}

function predictionFromPoints(points: DTPoint[]) {
  const n = Math.max(1, points.length);
  const ones = points.reduce((s, p) => s + (p.y === 1 ? 1 : 0), 0);
  const prob1 = ones / n;
  const prediction: 0 | 1 = prob1 >= 0.5 ? 1 : 0;
  return { prob1, prediction };
}

function generateDTData(opts: {
  seed: number;
  n: number;
  noise: number; // feature jitter
  labelNoise: number;
  pattern: "XOR" | "Circles";
}) {
  const rand = mulberry32(opts.seed);
  const n = Math.max(80, Math.floor(opts.n));
  const sigma = 0.02 + (opts.noise / 100) * 0.14;
  const labelNoise = opts.labelNoise / 100;

  const points: DTPoint[] = [];
  for (let i = 0; i < n; i++) {
    let x1 = rand();
    let x2 = rand();

    x1 = clamp01(x1 + (rand() - 0.5) * sigma * 2);
    x2 = clamp01(x2 + (rand() - 0.5) * sigma * 2);

    let y: 0 | 1;
    if (opts.pattern === "XOR") {
      const left = x1 > 0.5 ? 1 : 0;
      const top = x2 > 0.5 ? 1 : 0;
      y = (left ^ top) as 0 | 1;
    } else {
      // Concentric-ish circles: classify inside a radius.
      const dx = x1 - 0.5;
      const dy = x2 - 0.5;
      const r2 = dx * dx + dy * dy;
      const rad = 0.14 + 0.18 * (rand() * 0.25 + 0.75); // slight spread makes it more interesting
      y = r2 > rad * rad ? 1 : 0; // outer ring => 1
    }

    if (rand() < labelNoise) y = y === 1 ? 0 : 1;

    points.push({ id: `p${i}`, x1, x2, y });
  }

  return points;
}

function candidateThresholds(values: number[], maxCandidates: number) {
  const uniq = Array.from(new Set(values)).sort((a, b) => a - b);
  if (uniq.length < 2) return [];
  const candidates: number[] = [];
  const stride = Math.max(1, Math.floor((uniq.length - 1) / Math.max(2, maxCandidates)));
  for (let i = 0; i < uniq.length - 1; i += stride) {
    const t = (uniq[i] + uniq[i + 1]) / 2;
    candidates.push(t);
  }
  return candidates;
}

function bestSplitForNode(opts: {
  points: DTPoint[];
  criterion: "gini" | "entropy";
  minSamplesSplit: number;
  maxThresholdCandidates: number;
  minImpurityDecrease: number;
}) {
  const { points, criterion, minSamplesSplit, maxThresholdCandidates, minImpurityDecrease } = opts;
  const n = points.length;
  if (n < 2 * minSamplesSplit) return null;

  const impurityBefore = impurityOf(points, criterion);

  let best: { split: Split; impurityAfter: number } | null = null;
  let bestGain = 0;

  const axes: SplitAxis[] = ["x1", "x2"];
  for (const axis of axes) {
    const values = points.map((p) => (axis === "x1" ? p.x1 : p.x2));
    const thresholds = candidateThresholds(values, maxThresholdCandidates);
    for (const t of thresholds) {
      const left = points.filter((p) => (axis === "x1" ? p.x1 : p.x2) <= t);
      const right = points.filter((p) => (axis === "x1" ? p.x1 : p.x2) > t);
      if (left.length < minSamplesSplit || right.length < minSamplesSplit) continue;

      const impurityAfter =
        (left.length / n) * impurityOf(left, criterion) + (right.length / n) * impurityOf(right, criterion);
      const gain = impurityBefore - impurityAfter;
      if (gain > bestGain && gain >= minImpurityDecrease) {
        bestGain = gain;
        best = { split: { axis, threshold: t }, impurityAfter };
      }
    }
  }

  return best;
}

function deepCloneTreeNode(node: TreeNode): TreeNode {
  // Nodes are pure JSON-friendly objects; structuredClone keeps it simple & fast in modern browsers.
  if (typeof structuredClone !== "undefined") return structuredClone(node);
  return JSON.parse(JSON.stringify(node)) as TreeNode;
}

function buildDecisionTreeHistory(opts: {
  points: DTPoint[];
  maxDepth: number;
  minSamplesSplit: number;
  criterion: "gini" | "entropy";
  minImpurityDecrease: number;
  maxThresholdCandidates: number;
}) {
  const { points, maxDepth, minSamplesSplit, criterion, minImpurityDecrease, maxThresholdCandidates } = opts;

  const rootId = "N0";
  const rootImp = impurityOf(points, criterion);
  const { prob1, prediction } = predictionFromPoints(points);

  const canRootSplit = maxDepth > 0 && points.length >= 2 * minSamplesSplit && rootImp > 1e-9;

  const root: TreeNode = {
    id: rootId,
    depth: 0,
    samples: points.length,
    prob1,
    prediction,
    impurity: rootImp,
    expanded: false,
    canSplit: canRootSplit,
  };

  const snapshots: { root: TreeNode; expandedNodeId: string | null; step: number; gainInfo: string }[] = [];
  snapshots.push({ root: deepCloneTreeNode(root), expandedNodeId: null, step: 0, gainInfo: "Start: root is an unsplit leaf." });

  // Queue of nodes that are eligible but not expanded yet.
  const queue: { nodeId: string; points: DTPoint[]; parent: TreeNode | null }[] = [
    { nodeId: rootId, points, parent: null },
  ];

  const idToNode = new Map<string, { node: TreeNode }>();
  idToNode.set(rootId, { node: root });

  let step = 0;

  while (queue.length > 0) {
    // Expand one node per step.
    const job = queue.shift()!;
    const node = idToNode.get(job.nodeId)?.node;
    if (!node) continue;

    const currentDepth = node.depth;
    if (node.expanded) continue;

    if (!node.canSplit || currentDepth >= maxDepth) {
      // Mark as not splittable if we can't go deeper.
      node.canSplit = false;
      continue;
    }

    const best = bestSplitForNode({
      points: job.points,
      criterion,
      minSamplesSplit,
      maxThresholdCandidates,
      minImpurityDecrease,
    });

    if (!best) {
      node.canSplit = false;
      // Even if we can't split, create a snapshot so the learner sees the algorithm decision.
      step += 1;
      snapshots.push({
        root: deepCloneTreeNode(root),
        expandedNodeId: node.id,
        step,
        gainInfo: "No valid split found (gain too small or constraints violated).",
      });
      continue;
    }

    const { split } = best;
    // Split the subset and create children as *unsplit* leaves.
    const leftPoints = job.points.filter((p) => (split.axis === "x1" ? p.x1 : p.x2) <= split.threshold);
    const rightPoints = job.points.filter((p) => (split.axis === "x1" ? p.x1 : p.x2) > split.threshold);

    const leftImp = impurityOf(leftPoints, criterion);
    const rightImp = impurityOf(rightPoints, criterion);

    const leftPred = predictionFromPoints(leftPoints);
    const rightPred = predictionFromPoints(rightPoints);

    const leftNode: TreeNode = {
      id: `${node.id}L`,
      depth: node.depth + 1,
      samples: leftPoints.length,
      prob1: leftPred.prob1,
      prediction: leftPred.prediction,
      impurity: leftImp,
      expanded: false,
      canSplit: node.depth + 1 < maxDepth && leftPoints.length >= 2 * minSamplesSplit && leftImp > 1e-9,
    };
    const rightNode: TreeNode = {
      id: `${node.id}R`,
      depth: node.depth + 1,
      samples: rightPoints.length,
      prob1: rightPred.prob1,
      prediction: rightPred.prediction,
      impurity: rightImp,
      expanded: false,
      canSplit: node.depth + 1 < maxDepth && rightPoints.length >= 2 * minSamplesSplit && rightImp > 1e-9,
    };

    node.expanded = true;
    node.split = split;
    node.left = leftNode;
    node.right = rightNode;
    node.canSplit = leftNode.canSplit || rightNode.canSplit;

    // Queue children if they can still split.
    idToNode.set(leftNode.id, { node: leftNode });
    idToNode.set(rightNode.id, { node: rightNode });
    if (leftNode.canSplit) queue.push({ nodeId: leftNode.id, points: leftPoints, parent: node });
    if (rightNode.canSplit) queue.push({ nodeId: rightNode.id, points: rightPoints, parent: node });

    step += 1;
    snapshots.push({
      root: deepCloneTreeNode(root),
      expandedNodeId: node.id,
      step,
      gainInfo: `Expanded ${node.id}: split ${split.axis} ≤ ${split.threshold.toFixed(2)} vs > ${split.threshold.toFixed(
        2,
      )}.`,
    });
  }

  // cap to keep the lab responsive
  return snapshots.slice(0, 28);
}

function classifyPoint(tree: TreeNode, p: DTPoint): { y: 0 | 1; prob1: number } {
  let node: TreeNode = tree;
  while (node.expanded && node.split && node.left && node.right) {
    const v = node.split.axis === "x1" ? p.x1 : p.x2;
    node = v <= node.split.threshold ? node.left : node.right;
  }
  return { y: node.prediction, prob1: node.prob1 };
}

function colorForClass(y: 0 | 1) {
  return y === 1 ? "rgba(168,85,247,0.95)" : "rgba(34,211,238,0.95)";
}

export default function DecisionTrees() {
  const simRef = useRef<HTMLDivElement>(null);

  // Data playground
  const [seed, setSeed] = useState(777);
  const [nPoints, setNPoints] = useState(130);
  const [pattern, setPattern] = useState<"XOR" | "Circles">("XOR");
  const [featureNoise, setFeatureNoise] = useState(18);
  const [labelNoise, setLabelNoise] = useState(10);
  const [uploadedData, setUploadedData] = useState<DTPoint[] | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Training controls
  const [maxDepth, setMaxDepth] = useState(4);
  const [minSamplesSplit, setMinSamplesSplit] = useState(8);
  const [criterion, setCriterion] = useState<"gini" | "entropy">("gini");
  const [minImpurityDecrease, setMinImpurityDecrease] = useState(0.03);
  const [speedMs, setSpeedMs] = useState(620);
  const [maxThresholdCandidates, setMaxThresholdCandidates] = useState(14);

  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isComputing, setIsComputing] = useState(true);

  const data = useMemo<DTPoint[]>(() => {
    if (uploadedData) return uploadedData;
    return generateDTData({
      seed,
      n: nPoints,
      noise: featureNoise,
      labelNoise,
      pattern,
    });
  }, [uploadedData, seed, nPoints, featureNoise, labelNoise, pattern]);

  const [history, setHistory] = useState<
    ReturnType<typeof buildDecisionTreeHistory>
  >([]);

  useEffect(() => {
    let alive = true;
    setIsComputing(true);
    setIsPlaying(false);
    setStepIndex(0);

    const t = window.setTimeout(() => {
      if (!alive) return;
      const snaps = buildDecisionTreeHistory({
        points: data,
        maxDepth,
        minSamplesSplit,
        criterion,
        minImpurityDecrease,
        maxThresholdCandidates,
      });
      setHistory(snaps);
      setIsComputing(false);
    }, 130);

    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [data, maxDepth, minSamplesSplit, criterion, minImpurityDecrease, maxThresholdCandidates]);

  useEffect(() => {
    if (!isPlaying) return;
    if (isComputing) return;
    const last = (history?.length ?? 1) - 1;
    if (last <= 0) return;

    const t = window.setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= last) {
          window.clearInterval(t);
          return last;
        }
        return next;
      });
    }, Math.max(100, speedMs));

    return () => window.clearInterval(t);
  }, [isPlaying, isComputing, speedMs, history]);

  const current = history[Math.min(stepIndex, Math.max(0, history.length - 1))];
  const tree = current?.root;

  const reset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const regenerate = () => {
    setIsPlaying(false);
    setStepIndex(0);
    setUploadedData(null);
    setUploadError(null);
    setSeed((s) => s + 1);
  };

  const regionViz = useMemo(() => {
    const W = 560;
    const H = 360;
    const pad = { left: 48, right: 22, top: 18, bottom: 34 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;
    const cols = 26;
    const rows = 18;
    const cellW = plotW / cols;
    const cellH = plotH / rows;

    return { W, H, pad, cols, rows, cellW, cellH, plotW, plotH };
  }, []);

  const classificationGrid = useMemo(() => {
    if (!tree) return [];
    const grid: { id: string; x: number; y: number; yHat: 0 | 1; prob1: number }[] = [];
    const { cols, rows, pad, cellW, cellH } = regionViz;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xVal = (c + 0.5) / cols;
        const yVal = 1 - (r + 0.5) / rows;
        const x1 = clamp01(xVal);
        const x2 = clamp01(yVal);
        const cls = classifyPoint(tree, { id: "g", x1, x2, y: 0 });
        const svgX = pad.left + c * cellW;
        const svgY = pad.top + r * cellH;
        grid.push({ id: `${r}-${c}`, x: svgX, y: svgY, yHat: cls.y, prob1: cls.prob1 });
      }
    }
    return grid;
  }, [tree, regionViz]);

  const [userPoint, setUserPoint] = useState<{ x1: number; x2: number } | null>(null);
  const inference = useMemo(() => {
    if (!tree || !userPoint) return null;
    return classifyPoint(tree, { id: "u", x1: userPoint.x1, x2: userPoint.x2, y: 0 });
  }, [tree, userPoint]);

  const onPlotPointerDown = (e: React.PointerEvent) => {
    if (!tree) return;
    const svg = document.getElementById("dt-plot") as unknown as SVGSVGElement | null;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (regionViz.W / rect.width);
    const py = (e.clientY - rect.top) * (regionViz.H / rect.height);

    const xClamped = Math.min(regionViz.pad.left + regionViz.plotW, Math.max(regionViz.pad.left, px));
    const yClamped = Math.min(regionViz.pad.top + regionViz.plotH, Math.max(regionViz.pad.top, py));
    const x1 = clamp01((xClamped - regionViz.pad.left) / regionViz.plotW);
    const x2 = clamp01(1 - (yClamped - regionViz.pad.top) / regionViz.plotH);
    setUserPoint({ x1, x2 });
  };

  const stepsForWorkflow = [
    { id: "in", label: "Input", hint: "Features (x1, x2) + labels (y)" },
    { id: "prep", label: "Processing", hint: "Try candidate splits and compute impurity gain" },
    { id: "learn", label: "Learning", hint: "Expand the next node that improves purity most" },
    { id: "pred", label: "Prediction", hint: "Follow splits until a leaf" },
    { id: "out", label: "Output", hint: "Class + confidence from leaf frequency" },
  ];

  const pythonCode = `# Decision Tree (from scratch, tiny CART-style demo)
import math

def gini(labels):
    n = len(labels)
    if n == 0: return 0.0
    p1 = sum(labels) / n
    return 2 * p1 * (1 - p1)

def split(points, axis, thr):
    left = [p for p in points if (p["x1"] if axis=="x1" else p["x2"]) <= thr]
    right = [p for p in points if (p["x1"] if axis=="x1" else p["x2"]) > thr]
    return left, right

def best_split(points, min_samples=8):
    impurity_before = gini([p["y"] for p in points])
    best = None
    for axis in ["x1","x2"]:
        values = sorted({p[axis] for p in points})
        for i in range(len(values)-1):
            thr = (values[i] + values[i+1]) / 2
            left, right = split(points, axis, thr)
            if len(left) < min_samples or len(right) < min_samples:
                continue
            labelsL = [p["y"] for p in left]
            labelsR = [p["y"] for p in right]
            impurity_after = (len(left)/len(points))*gini(labelsL) + (len(right)/len(points))*gini(labelsR)
            gain = impurity_before - impurity_after
            if best is None or gain > best["gain"]:
                best = {"axis": axis, "thr": thr, "gain": gain}
    return best`;

  const maxStep = Math.max(0, history.length - 1);

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-6 md:p-10 shadow-premium">
          <MLHeroBackdrop accent="purple" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 backdrop-blur-xl px-5 py-2">
              <span className="inline-flex size-2 rounded-full bg-[var(--accent-secondary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Machine Learning • Decision Trees
              </span>
            </div>

            <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-[1.02] text-[var(--text-primary)]">
              Split the space, then vote
            </h1>
            <p className="mt-4 text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              Decision trees build a rule list by repeatedly choosing the next split that reduces impurity. In the lab, each step
              expands one node—until the leaves become confident.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                onClick={() => simRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-5 py-3 text-sm font-bold shadow-lg shadow-indigo-500/10 active:scale-95"
              >
                <Sparkles size={16} className="mr-2" />
                Start Simulation
              </Button>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 px-4 py-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span className="text-xs font-mono text-[var(--text-secondary)]">Click the plot to infer with the current tree</span>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IS THIS TOPIC */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Beginner friendly" title="What are Decision Trees?" subtitle="A flowchart for predictions." />
            <div className="mt-5 space-y-4 text-[var(--text-secondary)]">
              <p className="leading-relaxed">
                A decision tree asks a sequence of questions like a “choose-your-path” story. Each question is a split on one feature
                (e.g., <InlineMath math={"x_1 \\le t"} />). At the end, each leaf outputs a class.
              </p>
              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Real-life analogy</div>
                <p className="mt-2 text-sm leading-relaxed">
                  Think of triage in a clinic: “Is temperature high?” → “Is cough severe?” → then decide the next action.
                </p>
              </div>
            </div>
          </MLGlassCard>

          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Visual diagram" title="A tree turns data into regions" subtitle="Every split carves a rectangle." />
            <div className="mt-6 space-y-4 text-[var(--text-secondary)]">
              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                <div className="text-sm font-black">Processing view</div>
                <p className="mt-1 text-sm leading-relaxed">
                  For every node, we try candidate thresholds and compute how “mixed” the labels are (impurity). We pick the split that makes
                  left/right nodes more pure.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                <div className="text-sm font-black">Prediction view</div>
                <p className="mt-1 text-sm leading-relaxed">
                  At inference time, you follow splits until you reach a leaf. The leaf’s class is a majority vote based on its training subset.
                </p>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* CORE INTUITION */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Core intuition" title="Why splitting helps" subtitle="Uncertainty → less uncertainty." />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4 text-[var(--text-secondary)]">
                <p className="leading-relaxed">
                  A node is “mixed” when it contains both classes. A good split creates two smaller sets where each set is closer to pure.
                  The result is a tree that turns complex shapes into axis-aligned rectangles.
                </p>
                <div className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                  <div className="text-sm font-black">What you can watch in this lab</div>
                  <ul className="mt-2 space-y-2 text-sm leading-relaxed">
                    <li>• Regions change after each expansion step.</li>
                    <li>• The tree diagram grows node-by-node.</li>
                    <li>• Impurity is lowered as steps progress.</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Split intuition</div>
                <div className="mt-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl border border-[var(--border-subtle)] bg-indigo-500/10 flex items-center justify-center glow-purple">
                    <Wand2 size={18} className="text-indigo-300" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-[var(--text-primary)]">“Pick the split that makes leaves calmer.”</div>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                      In every step, the lab chooses a split with the highest impurity gain under your constraints.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-4">
                  <div className="text-sm font-black">Current step explanation</div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {current?.gainInfo ?? "Computing tree…"}
                  </p>
                </div>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* INTERACTIVE SIMULATION */}
        <section ref={simRef} id="simulation" className="scroll-mt-24">
          <MLGlassCard className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <MLSectionTitle eyebrow="Interactive simulation" title="Decision Tree Builder" subtitle="Expand one node per step." />

              <div className="flex items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 px-4 py-2">
                <span className="text-xs font-mono text-[var(--text-secondary)]">step: {stepIndex}/{maxStep}</span>
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
                          <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Tree impurity</div>
                          <div className="text-sm font-black text-[var(--text-primary)]">
                            root impurity: {tree ? tree.impurity.toFixed(3) : "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setIsPlaying((v) => !v)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-4 py-2 text-xs font-bold active:scale-95"
                        >
                          {isPlaying ? (
                            <Pause size={16} className="mr-2" />
                          ) : (
                            <Play size={16} className="mr-2" />
                          )}
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
                        <div className="absolute inset-0 rounded-[1.5rem] opacity-[0.12] pointer-events-none bg-[radial-gradient(800px_circle_at_var(--mouse-x-pc)_var(--mouse-y-pc),rgba(168,85,247,0.22),transparent_50%)]" />
                        <svg
                          id="dt-plot"
                          viewBox={`0 0 ${regionViz.W} ${regionViz.H}`}
                          className="w-full h-auto rounded-[1.2rem] cursor-crosshair bg-[var(--bg-primary)]/25 border border-[var(--border-subtle)]"
                          onPointerDown={onPlotPointerDown}
                          role="img"
                          aria-label="Decision regions and training points"
                        >
                          {/* Region grid (heatmap-like) */}
                          {classificationGrid.map((cell) => {
                            const base = colorForClass(cell.yHat);
                            const alpha = 0.06 + 0.34 * Math.abs(cell.prob1 - 0.5) * 2; // stronger when confident
                            return (
                              <rect
                                key={cell.id}
                                x={cell.x}
                                y={cell.y}
                                width={regionViz.cellW + 0.15}
                                height={regionViz.cellH + 0.15}
                                fill={base.replace(/0\.95\)/, `${alpha})`)}
                              />
                            );
                          })}

                          {/* Frame */}
                          <rect
                            x={regionViz.pad.left}
                            y={regionViz.pad.top}
                            width={regionViz.W - regionViz.pad.left - regionViz.pad.right}
                            height={regionViz.H - regionViz.pad.top - regionViz.pad.bottom}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="1"
                            rx="14"
                          />

                          {/* Training points */}
                          {data.map((p) => {
                            const cx = regionViz.pad.left + p.x1 * regionViz.plotW;
                            const cy = regionViz.pad.top + (1 - p.x2) * regionViz.plotH;
                            const col = p.y === 1 ? "rgba(168,85,247,0.95)" : "rgba(34,211,238,0.95)";
                            return <motion.circle key={p.id} cx={cx} cy={cy} r={5.2} fill={col} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }} />;
                          })}

                          {/* Inference point */}
                          {userPoint ? (
                            (() => {
                              const cx = regionViz.pad.left + userPoint.x1 * regionViz.plotW;
                              const cy = regionViz.pad.top + (1 - userPoint.x2) * regionViz.plotH;
                              const yHat = inference?.y ?? 0;
                              const col = colorForClass(yHat);
                              const prob1 = inference?.prob1 ?? 0.5;
                              return (
                                <>
                                  <circle cx={cx} cy={cy} r={12} fill={col.replace(/0\.95\)/, "0.16)") } />
                                  <motion.circle cx={cx} cy={cy} r={7} fill={col} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.18 }} />
                                  <text x={cx + 10} y={cy - 10} fontSize="12" fill="rgba(255,255,255,0.9)" fontFamily="monospace">
                                    p1≈{prob1.toFixed(2)}
                                  </text>
                                </>
                              );
                            })()
                          ) : null}
                        </svg>

                        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="text-xs text-[var(--text-secondary)]">
                            Regions update as steps expand nodes. Click to infer using current splits.
                          </div>
                          <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-[0.35em] text-[var(--text-muted)]">
                            <span className="inline-flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-cyan-400" />
                              Class 0
                            </span>
                            <span className="inline-flex items-center gap-2">
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

              {/* Right panel */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Tree visual</div>
                  <div className="mt-3 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4 overflow-auto max-h-[320px]">
                    {tree ? <TreeDiagram root={tree} highlightId={current?.expandedNodeId} /> : <div className="text-sm text-[var(--text-secondary)]">Computing…</div>}
                  </div>

                  <div className="mt-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                    Highlighted node is the most recently expanded split.
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Controls</div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Max depth</span>
                        <span className="font-semibold text-[var(--text-primary)]">{maxDepth}</span>
                      </div>
                      <input type="range" min={1} max={6} value={maxDepth} onChange={(e) => setMaxDepth(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Min samples split</span>
                        <span className="font-semibold text-[var(--text-primary)]">{minSamplesSplit}</span>
                      </div>
                      <input type="range" min={4} max={24} value={minSamplesSplit} onChange={(e) => setMinSamplesSplit(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Impurity metric</span>
                        <span className="font-semibold text-[var(--text-primary)]">{criterion}</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button variant="secondary" onClick={() => setCriterion("gini")} className={`rounded-2xl flex-1 ${criterion === "gini" ? "bg-indigo-600/20 border-indigo-500/50 text-[var(--text-primary)]" : "bg-[var(--bg-primary)]/20 text-[var(--text-secondary)] border-[var(--border-subtle)]"}`}>
                          Gini
                        </Button>
                        <Button variant="secondary" onClick={() => setCriterion("entropy")} className={`rounded-2xl flex-1 ${criterion === "entropy" ? "bg-indigo-600/20 border-indigo-500/50 text-[var(--text-primary)]" : "bg-[var(--bg-primary)]/20 text-[var(--text-secondary)] border-[var(--border-subtle)]"}`}>
                          Entropy
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Min impurity gain</span>
                        <span className="font-semibold text-[var(--text-primary)]">{minImpurityDecrease.toFixed(2)}</span>
                      </div>
                      <input type="range" min={0} max={0.12} step={0.01} value={minImpurityDecrease} onChange={(e) => setMinImpurityDecrease(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Threshold candidates</span>
                        <span className="font-semibold text-[var(--text-primary)]">{maxThresholdCandidates}</span>
                      </div>
                      <input type="range" min={6} max={22} value={maxThresholdCandidates} onChange={(e) => setMaxThresholdCandidates(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Animation speed</span>
                        <span className="font-semibold text-[var(--text-primary)]">{speedMs}ms</span>
                      </div>
                      <input type="range" min={150} max={1000} step={50} value={speedMs} onChange={(e) => setSpeedMs(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="secondary" onClick={() => setStepIndex((i) => Math.max(0, i - 1))} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                        Step Back
                      </Button>
                      <Button variant="secondary" onClick={() => setStepIndex((i) => Math.min(maxStep, i + 1))} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                        Step Forward
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Learning Playground</div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Pattern</span>
                        <span className="font-semibold text-[var(--text-primary)]">{pattern}</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button variant="secondary" onClick={() => { setPattern("XOR"); setUploadedData(null); }} className={`rounded-2xl flex-1 ${pattern === "XOR" ? "bg-indigo-600/20 border-indigo-500/50 text-[var(--text-primary)]" : "bg-[var(--bg-primary)]/20 text-[var(--text-secondary)] border-[var(--border-subtle)]"}`}>
                          XOR
                        </Button>
                        <Button variant="secondary" onClick={() => { setPattern("Circles"); setUploadedData(null); }} className={`rounded-2xl flex-1 ${pattern === "Circles" ? "bg-indigo-600/20 border-indigo-500/50 text-[var(--text-primary)]" : "bg-[var(--bg-primary)]/20 text-[var(--text-secondary)] border-[var(--border-subtle)]"}`}>
                          Circles
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Points</span>
                        <span className="font-semibold text-[var(--text-primary)]">{nPoints}</span>
                      </div>
                      <input type="range" min={90} max={200} value={nPoints} onChange={(e) => setNPoints(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Feature noise</span>
                        <span className="font-semibold text-[var(--text-primary)]">{featureNoise}%</span>
                      </div>
                      <input type="range" min={0} max={60} value={featureNoise} onChange={(e) => setFeatureNoise(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Label noise</span>
                        <span className="font-semibold text-[var(--text-primary)]">{labelNoise}%</span>
                      </div>
                      <input type="range" min={0} max={35} value={labelNoise} onChange={(e) => setLabelNoise(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={regenerate} className="flex-1 rounded-2xl bg-[var(--bg-primary)] hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] px-4 py-2 text-xs font-bold border border-[var(--border-subtle)] active:scale-95">
                        <RotateCcw size={14} className="mr-2 inline" />
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
                              const rows = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
                              const pts: DTPoint[] = [];
                              for (let i = 0; i < rows.length; i++) {
                                const parts = rows[i].split(",").map((s) => s.trim());
                                if (parts.length < 3) continue;
                                const x1 = Number(parts[0]);
                                const x2 = Number(parts[1]);
                                const yRaw = Number(parts[2]);
                                if (!Number.isFinite(x1) || !Number.isFinite(x2) || !Number.isFinite(yRaw)) continue;
                                const y: 0 | 1 = yRaw >= 0.5 ? 1 : 0;
                                pts.push({ id: `u${i}`, x1: clamp01(x1), x2: clamp01(x2), y });
                              }
                              if (pts.length < 60) {
                                setUploadError("CSV must have at least 60 valid rows: x1,x2,y");
                                return;
                              }
                              setUploadedData(pts);
                            } catch {
                              setUploadError("Could not parse CSV. Use comma-separated values: x1,x2,y");
                            }
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 hover:bg-[var(--bg-elevated)] px-4 py-2 text-xs font-bold text-[var(--text-secondary)] transition-all active:scale-95">
                          <UploadCloud size={14} />
                          Upload CSV (x1,x2,y)
                        </div>
                      </label>
                    </div>

                    {uploadError ? (
                      <div className="rounded-[1.2rem] border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 text-sm">
                        <div className="flex items-center gap-2 font-black">
                          <AlertTriangle size={16} />
                          Upload problem
                        </div>
                        <div className="mt-2 opacity-90">{uploadError}</div>
                      </div>
                    ) : null}

                    {uploadedData ? (
                      <div className="rounded-[1.2rem] border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-200 text-sm">
                        <div className="flex items-center gap-2 font-black">
                          <CheckCircle2 size={16} />
                          CSV loaded ({uploadedData.length} rows)
                        </div>
                        <div className="mt-2 opacity-90">Tree training will recompute automatically.</div>
                      </div>
                    ) : null}
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
              title="Impurity is the “mixing” score"
              subtitle="A tree chooses the split that reduces impurity the most."
            />

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Gini impurity</div>
                <div className="mt-4">
                  <BlockMath math={"G=2p(1-p)"} />
                  <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                    If all labels are class 1 or class 0, then <InlineMath math={"p\\in\\{0,1\\}"} /> and impurity becomes 0.
                    Mixed nodes have higher impurity.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Entropy (optional)</div>
                <div className="mt-4">
                  <BlockMath math={"H=-p\\log p-(1-p)\\log(1-p)"} />
                  <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                    Entropy measures uncertainty. Trees can use entropy or Gini—your slider switches the scoring rule.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Impurity gain (what we maximize)</div>
              <div className="mt-4">
                <BlockMath math={"Gain=I_{parent}-\\Big(\\frac{n_L}{n}I_L+\\frac{n_R}{n}I_R\\Big)"} />
              </div>
              <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                The algorithm keeps expanding the node with the biggest impurity gain that also satisfies your split constraints.
              </p>
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
            <MLSectionTitle eyebrow="Real-world applications" title="Where decision trees are used" subtitle="Explainability + fast rules." />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              <AppUseCase title="Credit decisions" desc="Use splits on income, age, debt ratio to approve or decline." />
              <AppUseCase title="Medical triage" desc="Decision paths create human-auditable rules." />
              <AppUseCase title="Fraud detection" desc="Explainable rules for suspicious transactions." />
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Why companies like them</div>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                <li>• Interpretable: you can read the decision path.</li>
                <li>• Handles non-linear boundaries naturally.</li>
                <li>• Can be fast at inference (just follow splits).</li>
              </ul>
            </div>
          </MLGlassCard>
        </section>

        {/* VISUALIZATION SECTION */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Visualization" title="State transitions + region heatmap" subtitle="How the model’s shape evolves." />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  Impurity “trend” across steps
                </div>
                <div className="mt-4">
                  <MLLineChart
                    values={history.map((s) => s.root.impurity)}
                    currentIndex={stepIndex}
                    stroke="rgb(168,85,247)"
                  />
                </div>
              </div>
              <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/25 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
                  What to click for intuition
                </div>
                <div className="mt-4 space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <p>
                    Use <b>Step Forward</b> to watch how regions change from a coarse guess (root leaf) into a more refined partition (deeper splits).
                  </p>
                  <p>
                    Click the plot after a few steps: the same point will jump between regions if the tree has not expanded enough yet.
                  </p>
                </div>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* CODE IMPLEMENTATION */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Code implementation" title="Python example" subtitle="Clear and beginner-friendly." />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MLCodeBlock title="Python (tiny CART-style)" language="python" code={pythonCode} />
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Optional frameworks</div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  In production you’ll typically use libraries like scikit-learn. The lab code exists to make the “split choice” logic
                  visible, not to replace battle-tested implementations.
                </p>
                <div className="mt-4 rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-4">
                  <div className="text-sm font-black text-[var(--text-primary)]">Mental map</div>
                  <ul className="mt-2 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                    <li>• Choose an impurity metric.</li>
                    <li>• Find the best split threshold.</li>
                    <li>• Recurse with stopping rules.</li>
                    <li>• Prune or limit depth to avoid overfitting.</li>
                  </ul>
                </div>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* COMMON MISTAKES */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle
              eyebrow="Common mistakes & limitations"
              title="How decision trees fail"
              subtitle="Overfitting happens easily when trees get too deep."
            />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <MistakeCard
                title="Overfitting (too much depth)"
                desc="A deep tree can memorize noise. Watch the region grid become very jagged, especially with label noise."
              />
              <MistakeCard title="Noisy data" desc="If labels are inconsistent, impurity gain becomes unstable. Use min impurity gain and min samples split." />
              <MistakeCard title="Axis-aligned limitation" desc="Each split is a rectangle boundary (x1 or x2). Some patterns need many splits to approximate." />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Quick fix recipe</div>
              <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                <div>• Reduce <b>max depth</b>.</div>
                <div>• Increase <b>min samples split</b>.</div>
                <div>• Raise <b>min impurity gain</b> to avoid tiny improvements.</div>
              </div>
            </div>
          </MLGlassCard>
        </section>

        {/* FINAL SUMMARY */}
        <section>
          <MLGlassCard className="p-8">
            <MLSectionTitle eyebrow="Final summary" title="Cheat sheet + interview questions" subtitle="Memorize these patterns." />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Key takeaways</div>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <li>• Trees expand nodes by maximizing impurity gain.</li>
                  <li>• Each split adds an axis-aligned rectangle boundary.</li>
                  <li>• Depth limits/pruning help generalization.</li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Important formulas</div>
                <div className="mt-3 space-y-3">
                  <BlockMath math={"Gini=2p(1-p)"} />
                  <BlockMath math={"Gain=I_p-\\Big(\\frac{n_L}{n}I_L+\\frac{n_R}{n}I_R\\Big)"} />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">Interview questions</div>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <li>• Why do impurity metrics matter?</li>
                  <li>• What causes overfitting in trees?</li>
                  <li>• What’s the difference between Gini and entropy?</li>
                </ul>
              </div>
            </div>
          </MLGlassCard>
        </section>
      </div>
    </section>
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

function AppUseCase({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-5">
      <div className="text-sm font-black text-[var(--text-primary)]">{title}</div>
      <div className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</div>
    </div>
  );
}

function TreeDiagram({ root, highlightId }: { root: TreeNode; highlightId?: string | null }) {
  // Simple binary tree layout using depth and left/right index.
  const nodes: { node: TreeNode; x: number; y: number }[] = [];

  const walk = (node: TreeNode, depth: number, index: number) => {
    const x = index * 220 + 40; // spreads siblings
    const y = depth * 92 + 24;
    nodes.push({ node, x, y });
    if (node.expanded && node.left && node.right) {
      walk(node.left, depth + 1, index * 2);
      walk(node.right, depth + 1, index * 2 + 1);
    } else {
      // For unexpanded nodes, show children as placeholders when possible.
      // This keeps the layout stable and beginner-friendly.
    }
  };

  walk(root, 0, 0);

  const width = Math.max(520, ...nodes.map((n) => n.x)) + 220;
  const height = Math.max(200, ...nodes.map((n) => n.y)) + 120;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Links */}
        {nodes.map((n) => {
          if (!n.node.expanded || !n.node.left || !n.node.right) return null;
          const left = nodes.find((m) => m.node.id === n.node.left?.id);
          const right = nodes.find((m) => m.node.id === n.node.right?.id);
          const x1 = n.x + 70;
          const y1 = n.y + 26;
          if (left) {
            return <path key={`${n.node.id}-l`} d={`M ${x1} ${y1} C ${x1 + 60} ${y1} ${left.x + 70} ${left.y + 26} ${left.x + 70} ${left.y + 26}`} stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />;
          }
          if (right) {
            return null;
          }
          return null;
        })}

        {/* Node cards */}
        {nodes.map(({ node, x, y }) => {
          const isHighlight = highlightId && node.id === highlightId;
          const isLeaf = !node.expanded;
          const bg = isLeaf ? "rgba(255,255,255,0.04)" : "rgba(99,102,241,0.10)";
          const border = isHighlight ? "rgba(168,85,247,0.85)" : "rgba(255,255,255,0.12)";
          const label =
            isLeaf
              ? `Leaf: ŷ=${node.prediction} (p1=${node.prob1.toFixed(2)})`
              : `Split ${node.split?.axis} ≤ ${node.split?.threshold.toFixed(2)}`;

          return (
            <g key={node.id} transform={`translate(${x} ${y})`}>
              <rect
                x={0}
                y={0}
                width={180}
                height={70}
                rx={16}
                fill={bg}
                stroke={border}
                strokeWidth={isHighlight ? 2 : 1}
              />
              <text x={12} y={28} fontSize={12} fill="rgba(255,255,255,0.88)" fontFamily="monospace">
                {label.length > 38 ? `${label.slice(0, 37)}…` : label}
              </text>
              <text x={12} y={50} fontSize={11} fill="rgba(255,255,255,0.55)" fontFamily="monospace">
                depth {node.depth} • n={node.samples}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


"use client";

import React, { useMemo, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MLGlassCard, MLSectionTitle } from "@/components/ml/MLGlassCard";
import { MLHeroBackdrop } from "@/components/ml/MLHeroBackdrop";
import { MLWorkflowPipeline } from "@/components/ml/MLWorkflowPipeline";
import { MLCodeBlock } from "@/components/ml/MLCodeBlock";
import { MLLineChart } from "@/components/ml/MLLineChart";

export default function RandomForest() {
  const [treeCount, setTreeCount] = useState(120);
  const [maxDepth, setMaxDepth] = useState(8);
  const [featureBag, setFeatureBag] = useState(0.55);
  const [sampleFrac, setSampleFrac] = useState(0.72);

  const curve = useMemo(() => {
    const points: number[] = [];
    for (let t = 1; t <= 220; t++) {
      const varianceDrop = 1 - Math.exp(-t / 55);
      const depthBoost = Math.min(0.25, maxDepth / 40);
      const bagBoost = featureBag * 0.18 + sampleFrac * 0.12;
      const acc = 0.58 + varianceDrop * (0.24 + depthBoost) + bagBoost;
      points.push(Math.min(0.98, acc));
    }
    return points;
  }, [maxDepth, featureBag, sampleFrac]);

  const currentAcc = curve[Math.max(0, Math.min(curve.length - 1, treeCount - 1))];
  const varianceReduction = Math.min(0.99, 1 - Math.exp(-treeCount / 70));
  const inferenceCost = Math.min(0.99, treeCount / 240 + maxDepth / 28);

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-8">
          <MLHeroBackdrop accent="purple" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-primary)]">Random Forest</h1>
            <p className="mt-4 max-w-3xl text-[var(--text-secondary)]">Many decorrelated trees vote together. Bias stays similar, variance drops, and generalization improves.</p>
            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl">
              <Sparkles size={16} className="mr-2" /> Start Ensemble Lab
            </Button>
          </div>
        </section>

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Interactive simulation" title="Ensemble strength vs cost" />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Slider label="Number of trees" value={treeCount} min={10} max={220} step={1} onChange={(v) => setTreeCount(Math.round(v))} />
              <Slider label="Max depth" value={maxDepth} min={2} max={18} step={1} onChange={(v) => setMaxDepth(Math.round(v))} />
              <Slider label="Feature subsampling ratio" value={featureBag} min={0.2} max={1} step={0.01} onChange={setFeatureBag} />
              <Slider label="Bootstrap sample fraction" value={sampleFrac} min={0.3} max={1} step={0.01} onChange={setSampleFrac} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric title="Validation accuracy" value={`${(currentAcc * 100).toFixed(1)}%`} />
              <Metric title="Variance reduction" value={`${(varianceReduction * 100).toFixed(1)}%`} />
              <Metric title="Inference cost" value={`${(inferenceCost * 100).toFixed(1)}%`} />
              <Metric title="Robustness" value={`${((currentAcc * (1 - inferenceCost * 0.4)) * 100).toFixed(1)}%`} />
            </div>
          </div>
          <div className="mt-5">
            <MLLineChart values={curve} currentIndex={treeCount - 1} stroke="rgb(168,85,247)" />
          </div>
        </MLGlassCard>

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Mathematical intuition" title="Bagging reduces variance" />
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <BlockMath math={"\\hat{y}=\\mathrm{mode}\\{T_1(x), T_2(x), ..., T_B(x)\\}"} />
              <p className="mt-2 text-sm text-[var(--text-secondary)]">For classification, each tree votes and the majority wins.</p>
            </div>
            <div>
              <BlockMath math={"\\mathrm{Var}(\\bar{T}) \\approx \\rho\\sigma^2 + \\frac{1-\\rho}{B}\\sigma^2"} />
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Lower inter-tree correlation <InlineMath math={"\\rho"} /> + more trees <InlineMath math={"B"} /> means lower variance.
              </p>
            </div>
          </div>
        </MLGlassCard>

        <MLWorkflowPipeline
          steps={[
            { id: "1", label: "Input", hint: "Training data" },
            { id: "2", label: "Processing", hint: "Bootstrap samples + feature subsets" },
            { id: "3", label: "Learning", hint: "Train many trees in parallel" },
            { id: "4", label: "Prediction", hint: "Aggregate votes / averages" },
            { id: "5", label: "Output", hint: "Final ensemble prediction" },
          ]}
        />

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Code implementation" title="Python-style pseudocode" />
          <MLCodeBlock
            language="python"
            code={`forest = []\nfor b in range(B):\n    sample = bootstrap(train_data)\n    tree = train_tree(sample, max_depth=max_depth, feature_subsample=feature_ratio)\n    forest.append(tree)\n\ndef predict(x):\n    votes = [tree.predict(x) for tree in forest]\n    return majority(votes)`}
          />
        </MLGlassCard>
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
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-indigo-500" />
    </label>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
      <div className="text-xs text-[var(--text-secondary)]">{title}</div>
      <div className="mt-1 text-xl font-black text-[var(--text-primary)]">{value}</div>
    </div>
  );
}

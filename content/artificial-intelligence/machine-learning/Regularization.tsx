"use client";

import React, { useMemo, useState } from "react";
import { BlockMath } from "react-katex";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MLGlassCard, MLSectionTitle } from "@/components/ml/MLGlassCard";
import { MLHeroBackdrop } from "@/components/ml/MLHeroBackdrop";
import { MLWorkflowPipeline } from "@/components/ml/MLWorkflowPipeline";
import { MLCodeBlock } from "@/components/ml/MLCodeBlock";
import { MLLineChart } from "@/components/ml/MLLineChart";

export default function Regularization() {
  const [lambda, setLambda] = useState(0.2);
  const [w, setW] = useState(1.4);
  const [reg, setReg] = useState<"L1" | "L2">("L2");
  const [noise, setNoise] = useState(0.3);

  const landscape = useMemo(() => {
    const ys: number[] = [];
    for (let ww = -3; ww <= 3; ww += 0.05) {
      const mse = (ww - 1.1) ** 2 + noise * 0.2;
      const pen = reg === "L1" ? Math.abs(ww) : ww ** 2;
      ys.push(mse + lambda * pen);
    }
    return ys;
  }, [reg, lambda, noise]);

  const currentLoss = useMemo(() => {
    const mse = (w - 1.1) ** 2 + noise * 0.2;
    const pen = reg === "L1" ? Math.abs(w) : w ** 2;
    return mse + lambda * pen;
  }, [w, lambda, reg, noise]);

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-8">
          <MLHeroBackdrop accent="purple" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-primary)]">Regularization</h1>
            <p className="mt-4 max-w-3xl text-[var(--text-secondary)]">Control overfitting by penalizing large weights. Compare L1 and L2 intuitively.</p>
            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl">
              <Sparkles size={16} className="mr-2" /> Start Penalty Lab
            </Button>
          </div>
        </section>

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Interactive simulation" title="Bias-variance tradeoff controls" />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Slider label="Regularization strength λ" value={lambda} min={0} max={2} step={0.01} onChange={setLambda} />
              <Slider label="Current weight w" value={w} min={-3} max={3} step={0.01} onChange={setW} />
              <Slider label="Data noise" value={noise} min={0} max={1} step={0.01} onChange={setNoise} />
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setReg("L1")} className={`rounded-2xl ${reg === "L1" ? "bg-indigo-600/20 border border-indigo-500/40" : "bg-[var(--bg-primary)]/20 border border-[var(--border-subtle)]"}`}>L1 (Lasso)</Button>
                <Button variant="secondary" onClick={() => setReg("L2")} className={`rounded-2xl ${reg === "L2" ? "bg-indigo-600/20 border border-indigo-500/40" : "bg-[var(--bg-primary)]/20 border border-[var(--border-subtle)]"}`}>L2 (Ridge)</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric title="Current loss" value={currentLoss.toFixed(3)} />
              <Metric title="Penalty term" value={(reg === "L1" ? lambda * Math.abs(w) : lambda * w * w).toFixed(3)} />
              <Metric title="Bias effect" value={lambda > 0.8 ? "High" : lambda > 0.3 ? "Medium" : "Low"} />
              <Metric title="Variance effect" value={lambda > 0.8 ? "Low variance" : "Higher variance"} />
            </div>
          </div>
          <div className="mt-5">
            <MLLineChart values={landscape} currentIndex={Math.round(((w + 3) / 6) * (landscape.length - 1))} stroke="rgb(168,85,247)" />
          </div>
        </MLGlassCard>

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Mathematical intuition" title="What regularization adds" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
            <div><BlockMath math={"\\mathcal{L}=\\mathcal{L}_{data}+\\lambda\\|w\\|_1"} /></div>
            <div><BlockMath math={"\\mathcal{L}=\\mathcal{L}_{data}+\\lambda\\|w\\|_2^2"} /></div>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-3">L1 encourages sparsity (some weights exactly zero). L2 shrinks all weights smoothly.</p>
        </MLGlassCard>

        <MLWorkflowPipeline
          steps={[
            { id: "1", label: "Input", hint: "Features + labels" },
            { id: "2", label: "Processing", hint: "Compute data loss" },
            { id: "3", label: "Learning", hint: "Add penalty and optimize" },
            { id: "4", label: "Prediction", hint: "Use shrunk parameters" },
            { id: "5", label: "Output", hint: "More stable generalization" },
          ]}
        />

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Code implementation" title="Regularized objective" />
          <MLCodeBlock
            language="python"
            code={`# L2 ridge objective\nloss = mse(y_true, y_pred) + lam * (w**2).sum()\n\n# L1 lasso objective\nloss = mse(y_true, y_pred) + lam * abs(w).sum()`}
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


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

export default function Regression() {
  const [slope, setSlope] = useState(1.2);
  const [intercept, setIntercept] = useState(0.4);
  const [noise, setNoise] = useState(0.2);
  const [lr, setLr] = useState(0.08);
  const [steps, setSteps] = useState(60);

  const points = useMemo(() => {
    const arr: { x: number; y: number }[] = [];
    for (let i = 0; i < 36; i++) {
      const x = -1 + (2 * i) / 35;
      const e = Math.sin(i * 1.73) * noise;
      arr.push({ x, y: slope * x + intercept + e });
    }
    return arr;
  }, [slope, intercept, noise]);

  const trajectory = useMemo(() => {
    let m = 0;
    let b = 0;
    const losses: number[] = [];
    for (let t = 0; t <= steps; t++) {
      let dm = 0;
      let db = 0;
      let loss = 0;
      for (const p of points) {
        const pred = m * p.x + b;
        const err = pred - p.y;
        loss += err * err;
        dm += err * p.x;
        db += err;
      }
      loss /= points.length;
      losses.push(loss);
      dm = (2 / points.length) * dm;
      db = (2 / points.length) * db;
      m -= lr * dm;
      b -= lr * db;
    }
    return { losses, m, b };
  }, [points, lr, steps]);

  const finalPred = points.map((p) => ({ ...p, yhat: trajectory.m * p.x + trajectory.b }));
  const mae = finalPred.reduce((s, p) => s + Math.abs(p.yhat - p.y), 0) / finalPred.length;
  const rmse = Math.sqrt(finalPred.reduce((s, p) => s + (p.yhat - p.y) ** 2, 0) / finalPred.length);

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-8">
          <MLHeroBackdrop accent="indigo" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-primary)]">Regression</h1>
            <p className="mt-4 max-w-3xl text-[var(--text-secondary)]">Fit continuous targets with gradient descent and inspect residual behavior visually.</p>
            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl"><Sparkles size={16} className="mr-2" /> Start Fit Lab</Button>
          </div>
        </section>

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Interactive simulation" title="Line fitting + loss minimization" />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Slider label="True slope" value={slope} min={-2} max={2} step={0.01} onChange={setSlope} />
              <Slider label="True intercept" value={intercept} min={-1.5} max={1.5} step={0.01} onChange={setIntercept} />
              <Slider label="Noise level" value={noise} min={0} max={0.8} step={0.01} onChange={setNoise} />
              <Slider label="Learning rate" value={lr} min={0.01} max={0.2} step={0.005} onChange={setLr} />
              <Slider label="GD steps" value={steps} min={10} max={120} step={1} onChange={(v) => setSteps(Math.round(v))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric title="Learned slope" value={trajectory.m.toFixed(3)} />
              <Metric title="Learned intercept" value={trajectory.b.toFixed(3)} />
              <Metric title="MAE" value={mae.toFixed(3)} />
              <Metric title="RMSE" value={rmse.toFixed(3)} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MLLineChart values={trajectory.losses} currentIndex={trajectory.losses.length - 1} stroke="rgb(99,102,241)" />
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 p-4">
              <svg viewBox="0 0 520 280" className="w-full h-auto">
                <rect x={20} y={14} width={470} height={240} rx={14} fill="transparent" stroke="rgba(255,255,255,0.08)" />
                {finalPred.map((p, i) => {
                  const x = 20 + ((p.x + 1) / 2) * 470;
                  const y = 14 + (1 - ((p.y + 3) / 6)) * 240;
                  return <circle key={i} cx={x} cy={y} r={4} fill="rgba(34,211,238,0.85)" />;
                })}
                <line
                  x1={20}
                  y1={14 + (1 - (((trajectory.m * -1 + trajectory.b) + 3) / 6)) * 240}
                  x2={490}
                  y2={14 + (1 - (((trajectory.m * 1 + trajectory.b) + 3) / 6)) * 240}
                  stroke="rgba(168,85,247,0.95)"
                  strokeWidth={3}
                />
              </svg>
            </div>
          </div>
        </MLGlassCard>

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Mathematical intuition" title="OLS objective" />
          <BlockMath math={"\\min_{m,b}\\;\\frac{1}{N}\\sum_{i=1}^N(y_i-(mx_i+b))^2"} />
          <p className="text-sm text-[var(--text-secondary)] mt-3">Gradient descent repeatedly moves parameters against the gradient to lower this loss.</p>
        </MLGlassCard>

        <MLWorkflowPipeline
          steps={[
            { id: "1", label: "Input", hint: "Feature x and target y" },
            { id: "2", label: "Processing", hint: "Forward pass: yhat = mx+b" },
            { id: "3", label: "Learning", hint: "Compute gradient and update" },
            { id: "4", label: "Prediction", hint: "Apply learned line" },
            { id: "5", label: "Output", hint: "Continuous value" },
          ]}
        />

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Code implementation" title="Python gradient descent" />
          <MLCodeBlock language="python" code={`m, b = 0.0, 0.0\nfor _ in range(steps):\n    dm = db = loss = 0.0\n    for x, y in data:\n        yhat = m*x + b\n        err = yhat - y\n        loss += err**2\n        dm += err*x\n        db += err\n    dm = 2*dm/len(data)\n    db = 2*db/len(data)\n    m -= lr*dm\n    b -= lr*db`} />
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
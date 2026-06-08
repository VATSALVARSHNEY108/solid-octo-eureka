"use client";

import React, { useMemo, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MLGlassCard, MLSectionTitle } from "@/components/ml/MLGlassCard";
import { MLHeroBackdrop } from "@/components/ml/MLHeroBackdrop";
import { MLCodeBlock } from "@/components/ml/MLCodeBlock";
import { MLWorkflowPipeline } from "@/components/ml/MLWorkflowPipeline";

export default function NaiveBayes() {
  const [priorSpam, setPriorSpam] = useState(0.3);
  const [wordOffer, setWordOffer] = useState(0.78);
  const [wordMeeting, setWordMeeting] = useState(0.14);
  const [smoothing, setSmoothing] = useState(1.0);
  const [threshold, setThreshold] = useState(0.5);

  const posterior = useMemo(() => {
    const ps = priorSpam;
    const ph = 1 - ps;
    const offerS = (wordOffer + smoothing * 0.02) / (1 + smoothing * 0.02);
    const offerH = (0.18 + smoothing * 0.02) / (1 + smoothing * 0.02);
    const meetS = (wordMeeting + smoothing * 0.02) / (1 + smoothing * 0.02);
    const meetH = (0.72 + smoothing * 0.02) / (1 + smoothing * 0.02);

    const num = ps * offerS * meetS;
    const den = num + ph * offerH * meetH;
    const p = den <= 0 ? 0.5 : num / den;
    return { p, offerS, offerH, meetS, meetH };
  }, [priorSpam, wordOffer, wordMeeting, smoothing]);

  const verdict = posterior.p >= threshold ? "Spam" : "Not spam";

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-8">
          <MLHeroBackdrop accent="indigo" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text-primary)]">Naive Bayes</h1>
            <p className="mt-4 text-[var(--text-secondary)] max-w-3xl">
              A probability-first classifier. It combines prior belief with evidence likelihoods and predicts the class with highest posterior.
            </p>
            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl">
              <Sparkles size={16} className="mr-2" />
              Bayesian Playground
            </Button>
          </div>
        </section>

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Interactive simulation" title="Email spam posterior calculator" subtitle="Adjust priors and evidence in real time." />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Slider label="Prior P(spam)" value={priorSpam} min={0.05} max={0.95} step={0.01} onChange={setPriorSpam} />
              <Slider label="P(word='offer' | spam)" value={wordOffer} min={0.05} max={0.95} step={0.01} onChange={setWordOffer} />
              <Slider label="P(word='meeting' | spam)" value={wordMeeting} min={0.05} max={0.95} step={0.01} onChange={setWordMeeting} />
              <Slider label="Laplace smoothing α" value={smoothing} min={0} max={4} step={0.1} onChange={setSmoothing} />
              <Slider label="Decision threshold" value={threshold} min={0.05} max={0.95} step={0.01} onChange={setThreshold} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Metric title="Posterior P(spam|x)" value={posterior.p.toFixed(3)} />
              <Metric title="Decision" value={verdict} />
              <Metric title="Calibration hint" value={posterior.p > 0.8 ? "High confidence" : posterior.p < 0.3 ? "Likely ham" : "Uncertain"} />
              <Metric title="False-alert risk" value={`${Math.round((1 - posterior.p) * 100)}%`} />
            </div>
          </div>
        </MLGlassCard>

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Mathematical intuition" title="Bayes theorem in plain language" />
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <BlockMath math={"P(y\\mid x)=\\frac{P(x\\mid y)P(y)}{P(x)}"} />
              <p className="text-sm text-[var(--text-secondary)] mt-3">
                Read it as: <InlineMath math={"posterior = evidence\\times prior / normalization"} />.
              </p>
            </div>
            <div>
              <BlockMath math={"P(x\\mid y)=\\prod_i P(x_i\\mid y)"} />
              <p className="text-sm text-[var(--text-secondary)] mt-3">The “naive” assumption treats features as conditionally independent.</p>
            </div>
          </div>
        </MLGlassCard>

        <MLWorkflowPipeline
          steps={[
            { id: "1", label: "Input", hint: "Tokenized features" },
            { id: "2", label: "Processing", hint: "Lookup likelihood tables" },
            { id: "3", label: "Learning", hint: "Estimate priors + likelihoods" },
            { id: "4", label: "Prediction", hint: "Compute posterior per class" },
            { id: "5", label: "Output", hint: "Class + confidence" },
          ]}
        />

        <MLGlassCard className="p-8">
          <MLSectionTitle eyebrow="Code implementation" title="Beginner Python example" />
          <div className="mt-5">
            <MLCodeBlock
              language="python"
              code={`import math\n\n# toy Naive Bayes for binary class\ndef predict(prior_spam, likelihoods_spam, likelihoods_ham):\n    num = prior_spam\n    den_other = 1 - prior_spam\n    for ps, ph in zip(likelihoods_spam, likelihoods_ham):\n      num *= ps\n      den_other *= ph\n    return num / (num + den_other)\n\np = predict(0.3, [0.78, 0.14], [0.18, 0.72])\nprint('P(spam|x)=', round(p, 3))`}
            />
          </div>
        </MLGlassCard>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
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

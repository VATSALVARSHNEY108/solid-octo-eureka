"use client";

import { useMemo, useState } from "react";

export default function SemiSupervisedLearning() {
  const [labeledRatio, setLabeledRatio] = useState(22);
  const [pseudoLabelConfidence, setPseudoLabelConfidence] = useState(74);
  const [consistencyRegularization, setConsistencyRegularization] = useState(50);

  const metrics = useMemo(() => {
    const pseudoLabelQuality = Math.min(99, Math.max(20, Math.round(24 + pseudoLabelConfidence * 0.62 - (100 - labeledRatio) * 0.12)));
    const finalValidation = Math.min(97, Math.max(45, Math.round(48 + labeledRatio * 0.25 + pseudoLabelQuality * 0.24 + consistencyRegularization * 0.18)));
    const errorPropagationRisk = Math.min(100, Math.max(0, Math.round(72 - pseudoLabelConfidence * 0.5 - consistencyRegularization * 0.2 + (100 - labeledRatio) * 0.18)));
    const dataEfficiency = Math.min(99, Math.max(25, Math.round(35 + (100 - labeledRatio) * 0.32 + consistencyRegularization * 0.24)));
    return { pseudoLabelQuality, finalValidation, errorPropagationRisk, dataEfficiency };
  }, [labeledRatio, pseudoLabelConfidence, consistencyRegularization]);

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-7 md:p-9">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500 mb-3">Lesson 04</p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] mb-4">Semi-Supervised Learning</h1>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Semi-supervised learning combines a small labeled dataset with a larger unlabeled dataset. It is valuable when labels are
            expensive but raw data is abundant.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Core Concepts</h2>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              <li>- Uses both labeled and unlabeled data in one training loop.</li>
              <li>- Pseudo-labeling extends supervision when labels are limited.</li>
              <li>- Consistency regularization improves representation stability.</li>
              <li>- Confidence filtering controls error propagation.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Professional Workflow</h2>
            <ol className="space-y-3 text-[var(--text-secondary)]">
              <li>1. Train seed model on small labeled subset.</li>
              <li>2. Generate pseudo-labels on unlabeled samples.</li>
              <li>3. Keep only high-confidence pseudo-labels for retraining.</li>
              <li>4. Iterate and track validation stability each round.</li>
            </ol>
          </article>
        </div>
      </div>
    </section>
  );
}

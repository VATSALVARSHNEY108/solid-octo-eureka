"use client";

import { useMemo, useState } from "react";

export default function UnsupervisedLearning() {
  const [featureSeparability, setFeatureSeparability] = useState(68);
  const [clusterCountFit, setClusterCountFit] = useState(60);
  const [noiseControl, setNoiseControl] = useState(52);

  const metrics = useMemo(() => {
    const cohesion = Math.min(99, Math.max(35, Math.round(36 + featureSeparability * 0.35 + noiseControl * 0.25)));
    const separation = Math.min(99, Math.max(30, Math.round(28 + featureSeparability * 0.4 + clusterCountFit * 0.25 - (100 - noiseControl) * 0.12)));
    const stability = Math.min(99, Math.max(25, Math.round(30 + noiseControl * 0.35 + clusterCountFit * 0.3 - Math.abs(clusterCountFit - featureSeparability) * 0.2)));
    const anomalySensitivity = Math.min(100, Math.max(0, Math.round(65 - noiseControl * 0.45 + featureSeparability * 0.15)));
    return { cohesion, separation, stability, anomalySensitivity };
  }, [featureSeparability, clusterCountFit, noiseControl]);

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-7 md:p-9">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500 mb-3">Lesson 03</p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] mb-4">Unsupervised Learning</h1>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Unsupervised learning discovers hidden structure in unlabeled data. It is used when labels are unavailable and we need
            clustering, representation learning, or pattern discovery.
          </p>
        </header>

        
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Feature Separability</span>
                  <span className="font-semibold text-[var(--text-primary)]">{featureSeparability}%</span>
                </div>
                <input type="range" min={0} max={100} value={featureSeparability} onChange={(e) => setFeatureSeparability(Number(e.target.value))} className="w-full accent-indigo-500" />
              </label>
              <label className="block">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Cluster Count Fit</span>
                  <span className="font-semibold text-[var(--text-primary)]">{clusterCountFit}%</span>
                </div>
                <input type="range" min={0} max={100} value={clusterCountFit} onChange={(e) => setClusterCountFit(Number(e.target.value))} className="w-full accent-indigo-500" />
              </label>
              <label className="block">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">Noise Control</span>
                  <span className="font-semibold text-[var(--text-primary)]">{noiseControl}%</span>
                </div>
                <input type="range" min={0} max={100} value={noiseControl} onChange={(e) => setNoiseControl(Number(e.target.value))} className="w-full accent-indigo-500" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-1">Cluster Cohesion</p>
                <p className="text-2xl font-black text-[var(--text-primary)]">{metrics.cohesion}%</p>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-1">Cluster Separation</p>
                <p className="text-2xl font-black text-[var(--text-primary)]">{metrics.separation}%</p>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-1">Stability</p>
                <p className="text-2xl font-black text-[var(--text-primary)]">{metrics.stability}%</p>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-1">Anomaly Sensitivity</p>
                <p className="text-2xl font-black text-[var(--text-primary)]">{metrics.anomalySensitivity}%</p>
              </div>
            </div>
          </div>
          <p className="mt-5 text-sm text-[var(--text-secondary)]">
            Professional tip: in unsupervised pipelines, stability under noise is as important as raw cluster separation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Core Concepts</h2>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              <li>- There are no labels, so pattern quality must be inferred indirectly.</li>
              <li>- Clustering groups similar points by distance or density.</li>
              <li>- Dimensionality reduction reveals compact latent structure.</li>
              <li>- Domain interpretation is required before acting on clusters.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Professional Workflow</h2>
            <ol className="space-y-3 text-[var(--text-secondary)]">
              <li>1. Standardize and clean high-dimensional features.</li>
              <li>2. Select clustering/reduction algorithm by data geometry.</li>
              <li>3. Validate with cohesion, separation, and stability checks.</li>
              <li>4. Pair results with domain analysis for real decisions.</li>
            </ol>
          </article>
        </div>
    </section>
  );
}

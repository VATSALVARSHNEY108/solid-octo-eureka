"use client";

import { useMemo, useState } from "react";

export default function SupervisedLearning() {
  const [labelQuality, setLabelQuality] = useState(82);
  const [modelCapacity, setModelCapacity] = useState(64);
  const [regularization, setRegularization] = useState(46);

  const metrics = useMemo(() => {
    const trainAccuracy = Math.min(99, Math.max(55, Math.round(58 + labelQuality * 0.18 + modelCapacity * 0.32 - regularization * 0.08)));
    const overfitGap = Math.max(1, Math.round(modelCapacity * 0.24 - regularization * 0.2 - labelQuality * 0.1 + 7));
    const validationAccuracy = Math.min(97, Math.max(50, trainAccuracy - overfitGap));
    const biasLevel = Math.max(2, Math.round(100 - modelCapacity * 0.7 - labelQuality * 0.25));
    const varianceLevel = Math.max(2, Math.round(modelCapacity * 0.6 - regularization * 0.38));
    return { trainAccuracy, validationAccuracy, biasLevel, varianceLevel };
  }, [labelQuality, modelCapacity, regularization]);

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-7 md:p-9">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500 mb-3">Lesson 02</p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] mb-4">Supervised Learning</h1>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Supervised learning trains a model with labeled examples so it can predict outputs for unseen inputs. It is the core
            approach behind classification and regression systems used in production ML.
          </p>
        </header>

        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Core Concepts</h2>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              <li>- Labeled data gives direct supervision during learning.</li>
              <li>- Classification predicts classes; regression predicts continuous values.</li>
              <li>- Generalization quality matters more than only training performance.</li>
              <li>- Bias and variance must be balanced for reliable models.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Professional Workflow</h2>
            <ol className="space-y-3 text-[var(--text-secondary)]">
              <li>1. Define target variable and objective metric.</li>
              <li>2. Clean labels and split data into train, validation, test.</li>
              <li>3. Train baseline, then tune features and hyperparameters.</li>
              <li>4. Validate on unseen data and monitor drift in production.</li>
            </ol>
          </article>
        </div>
      </div>
    </section>
  );
}

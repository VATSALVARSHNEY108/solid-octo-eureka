"use client";

import { useMemo, useState } from "react";

export default function SelfSupervisedLearning() {
  const [pretextStrength, setPretextStrength] = useState(72);
  const [encoderDepth, setEncoderDepth] = useState(58);
  const [fineTuneBudget, setFineTuneBudget] = useState(45);

  const metrics = useMemo(() => {
    const representationQuality = Math.min(
      99,
      Math.max(30, Math.round(32 + pretextStrength * 0.38 + encoderDepth * 0.28))
    );
    const transferGain = Math.min(
      97,
      Math.max(25, Math.round(28 + representationQuality * 0.35 + fineTuneBudget * 0.32))
    );
    const pretrainEfficiency = Math.min(
      99,
      Math.max(20, Math.round(40 + pretextStrength * 0.25 - encoderDepth * 0.12 + fineTuneBudget * 0.1))
    );
    const downstreamFitness = Math.min(
      98,
      Math.max(30, Math.round(transferGain * 0.55 + representationQuality * 0.35 + fineTuneBudget * 0.1)),
    );
    return { representationQuality, transferGain, pretrainEfficiency, downstreamFitness };
  }, [pretextStrength, encoderDepth, fineTuneBudget]);

  const pretextExamples = [
    { task: "Masked token prediction", domain: "NLP" },
    { task: "Image patch reconstruction", domain: "Vision" },
    { task: "Contrastive view matching", domain: "Multimodal" },
    { task: "Next-frame prediction", domain: "Video" },
  ];

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-7 md:p-9">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500 mb-3">Lesson 05</p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] mb-4">
            Self-Supervised Learning
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Self-supervised learning (SSL) creates supervision signals from the data itself—without manual labels—by solving
            pretext tasks such as predicting masked tokens, matching augmented views, or reconstructing corrupted inputs.
            The learned representations transfer powerfully to downstream tasks with far fewer labeled examples.
          </p>
          <p className="text-sm text-[var(--text-secondary)] opacity-80 leading-relaxed">
            Modern LLMs, vision transformers, and speech models rely on SSL pretraining at scale before task-specific fine-tuning.
          </p>
        </header>
        <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 md:p-7">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Pretext Task Examples</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {pretextExamples.map((ex) => (
                <div
                  key={ex.task}
                  className="flex justify-between items-center px-3 py-2 rounded-lg border border-[var(--border-primary)] text-sm"
                >
                  <span className="text-[var(--text-primary)]">{ex.task}</span>
                  <span className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">{ex.domain}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm text-[var(--text-secondary)] leading-relaxed">
            Professional tip: a strong pretext task aligned with downstream structure (e.g., language modeling for NLP) usually
            beats a generic reconstruction objective. Fine-tuning budget matters most after representations are already rich.
          </p>
        </article>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Core Concepts</h2>
            <ul className="space-y-3 text-[var(--text-secondary)] leading-relaxed">
              <li>
                <strong className="text-[var(--text-primary)]">Pretext tasks</strong> generate labels from data structure
                (masking, rotation, contrastive pairs).
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Contrastive learning</strong> pulls similar views together and
                pushes dissimilar views apart in embedding space.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Transfer learning</strong> reuses pretrained encoders with a
                small labeled head on the target task.
              </li>
              <li>SSL scales with unlabeled corpora; labeling cost shifts to fine-tuning only.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Professional Workflow</h2>
            <ol className="space-y-3 text-[var(--text-secondary)] leading-relaxed">
              <li>1. Choose a pretext objective aligned with downstream modality.</li>
              <li>2. Pretrain encoder on large unlabeled corpus (compute-heavy phase).</li>
              <li>3. Freeze or partially unfreeze weights; attach task-specific head.</li>
              <li>4. Fine-tune on labeled data; evaluate with standard task metrics.</li>
              <li>5. Monitor representation drift and catastrophic forgetting during adaptation.</li>
            </ol>
          </article>
        </div>

        <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">When to Use SSL</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Use self-supervised pretraining when you have abundant unlabeled data, limited labels, and tasks where generic
            representations (language, vision, audio) transfer well. Skip SSL when labeled data is already plentiful and a
            simple supervised baseline meets requirements with lower engineering cost.
          </p>
        </article>
      </div>
    </section>
  );
}

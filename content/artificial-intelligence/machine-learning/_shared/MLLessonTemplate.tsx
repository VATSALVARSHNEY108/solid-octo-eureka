"use client";

import { useMemo, useState } from "react";

type MLLessonTemplateProps = {
  title: string;
  summary: string;
  keyIdeas: string[];
  workflow: string[];
  useCases: string[];
};

type SimulationProfile = {
  controls: [string, string, string];
  metrics: [string, string, string, string];
  insight: string;
};

const PROFILE_BY_TITLE: Record<string, SimulationProfile> = {
  "Introduction to Machine Learning": {
    controls: ["Data Volume", "Feature Quality", "Model Complexity"],
    metrics: ["Learning Score", "Generalization", "Overfit Risk", "Deployment Readiness"],
    insight: "Start with simpler models and better features before increasing complexity.",
  },
  "Supervised Learning": {
    controls: ["Label Quality", "Model Capacity", "Regularization"],
    metrics: ["Train Accuracy", "Validation Accuracy", "Bias Level", "Variance Level"],
    insight: "Aim for high validation accuracy with balanced bias and variance.",
  },
  "Unsupervised Learning": {
    controls: ["Feature Separability", "Cluster Count Fit", "Noise Control"],
    metrics: ["Cluster Cohesion", "Cluster Separation", "Noise Sensitivity", "Structure Confidence"],
    insight: "Good unsupervised outcomes need strong feature separability and noise handling.",
  },
  "Semi-Supervised Learning": {
    controls: ["Labeled Ratio", "Pseudo-label Confidence", "Consistency Strength"],
    metrics: ["Label Utilization", "Validation Gain", "Error Propagation", "Stability"],
    insight: "Low-confidence pseudo-labels can quickly hurt model quality.",
  },
  "Self-Supervised Learning": {
    controls: ["Pretext Task Quality", "Representation Depth", "Fine-tune Budget"],
    metrics: ["Embedding Quality", "Transfer Score", "Pretrain Efficiency", "Downstream Fitness"],
    insight: "Strong representation learning reduces downstream labeled-data needs.",
  },
  Classification: {
    controls: ["Class Balance", "Decision Threshold", "Feature Signal"],
    metrics: ["Precision", "Recall", "F1 Score", "False Positive Risk"],
    insight: "Tune threshold based on business cost of false positives vs false negatives.",
  },
  Regression: {
    controls: ["Feature Linearity", "Outlier Control", "Regularization"],
    metrics: ["R2 Score", "MAE", "RMSE", "Forecast Reliability"],
    insight: "Controlling outliers often improves regression reliability significantly.",
  },
  Clustering: {
    controls: ["Distance Quality", "Cluster Count", "Feature Scaling"],
    metrics: ["Silhouette Proxy", "Intra-cluster Tightness", "Inter-cluster Gap", "Cluster Stability"],
    insight: "Feature scaling and correct cluster count are central for trustworthy grouping.",
  },
  "Decision Trees": {
    controls: ["Max Depth", "Min Samples Split", "Pruning Strength"],
    metrics: ["Tree Fit", "Interpretability", "Overfit Risk", "Generalization"],
    insight: "Pruning often improves tree generalization with little accuracy loss.",
  },
  "Random Forest": {
    controls: ["Tree Count", "Feature Subsampling", "Max Depth"],
    metrics: ["Ensemble Accuracy", "Variance Reduction", "Inference Cost", "Robustness"],
    insight: "More trees reduce variance but increase inference cost.",
  },
  "Support Vector Machines (SVM)": {
    controls: ["Kernel Flexibility", "Margin Penalty (C)", "Gamma Sensitivity"],
    metrics: ["Margin Quality", "Boundary Sharpness", "Generalization", "Computation Load"],
    insight: "SVM performance is highly sensitive to C and gamma settings.",
  },
  "K-Nearest Neighbors (KNN)": {
    controls: ["Neighbor Count (K)", "Distance Metric Fit", "Feature Scaling"],
    metrics: ["Local Accuracy", "Noise Sensitivity", "Decision Stability", "Prediction Cost"],
    insight: "Small K overfits noise; large K can underfit local structure.",
  },
  "Naive Bayes": {
    controls: ["Prior Strength", "Feature Independence", "Smoothing"],
    metrics: ["Probabilistic Fit", "Calibration", "Class Separation", "Inference Speed"],
    insight: "Smoothing and priors matter when classes are imbalanced or sparse.",
  },
  "Dimensionality Reduction": {
    controls: ["Components Retained", "Variance Preservation", "Noise Filtering"],
    metrics: ["Compression Ratio", "Information Retention", "Model Speedup", "Representation Quality"],
    insight: "Retain enough variance to avoid losing predictive signal.",
  },
  "Feature Engineering": {
    controls: ["Feature Relevance", "Interaction Depth", "Leakage Control"],
    metrics: ["Signal Gain", "Model Lift", "Leakage Risk", "Production Robustness"],
    insight: "Higher signal features usually outperform added model complexity.",
  },
  "Data Preprocessing": {
    controls: ["Missing-value Handling", "Scaling Quality", "Outlier Treatment"],
    metrics: ["Data Readiness", "Noise Reduction", "Model Compatibility", "Pipeline Reliability"],
    insight: "Strong preprocessing creates stable downstream model performance.",
  },
  Regularization: {
    controls: ["L1 Strength", "L2 Strength", "Dropout/Constraint Level"],
    metrics: ["Weight Stability", "Overfit Control", "Validation Lift", "Model Simplicity"],
    insight: "Regularization should lower overfit without excessive underfitting.",
  },
  "Model Selection": {
    controls: ["Candidate Diversity", "Validation Strictness", "Latency Budget"],
    metrics: ["Selection Confidence", "Expected Performance", "Complexity Cost", "Deployment Fit"],
    insight: "Select the simplest model that meets objective and latency constraints.",
  },
  "Hyperparameter Tuning": {
    controls: ["Search Breadth", "Trial Budget", "Cross-validation Depth"],
    metrics: ["Best Score Found", "Search Efficiency", "Overtuning Risk", "Reproducibility"],
    insight: "More trials help, but overtuning to validation is a real risk.",
  },
  "Ensemble Learning": {
    controls: ["Base Model Diversity", "Ensemble Size", "Meta-learner Strength"],
    metrics: ["Ensemble Lift", "Variance Control", "Inference Overhead", "Reliability"],
    insight: "Diversity among base models is key to ensemble improvements.",
  },
  "Evaluation Metrics": {
    controls: ["Metric Alignment", "Threshold Policy", "Class Imbalance Awareness"],
    metrics: ["Decision Quality", "Monitoring Coverage", "Error Visibility", "Business Alignment"],
    insight: "Choose metrics that reflect business impact, not just model convenience.",
  },
};

const FALLBACK_PROFILE: SimulationProfile = {
  controls: ["Data Quality", "Model Complexity", "Regularization Strength"],
  metrics: ["Training Score", "Validation Score", "Overfitting Risk", "Reliability"],
  insight: "Aim for strong validation performance with controlled overfitting risk.",
};

export default function MLLessonTemplate({
  title,
  summary,
  keyIdeas,
  workflow,
  useCases,
}: MLLessonTemplateProps) {
  const profile = PROFILE_BY_TITLE[title] ?? FALLBACK_PROFILE;
  const [a, setA] = useState(70);
  const [b, setB] = useState(55);
  const [c, setC] = useState(40);

  const simulation = useMemo(() => {
    const main = Math.min(99, Math.max(40, Math.round(48 + a * 0.35 + b * 0.28 + c * 0.12)));
    const support = Math.min(99, Math.max(35, Math.round(main - Math.abs(b - c) * 0.22 + a * 0.1)));
    const risk = Math.min(100, Math.max(0, Math.round(68 - a * 0.24 + b * 0.2 - c * 0.3)));
    const health = Math.min(99, Math.max(35, Math.round((main * 0.45 + support * 0.35 + (100 - risk) * 0.2))));
    return [main, support, risk, health];
  }, [a, b, c]);

  return (
    <section className="w-full px-6 md:px-10 py-10 md:py-14">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-7 md:p-9">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500 mb-3">
            Machine Learning Lesson
          </p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] mb-4">
            {title}
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed">{summary}</p>
        </header>

        <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Interactive Simulation Lab</h2>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
              Real-time Learning Signal
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">{profile.controls[0]}</span>
                  <span className="font-semibold text-[var(--text-primary)]">{a}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </label>

              <label className="block">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">{profile.controls[1]}</span>
                  <span className="font-semibold text-[var(--text-primary)]">{b}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </label>

              <label className="block">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">{profile.controls[2]}</span>
                  <span className="font-semibold text-[var(--text-primary)]">{c}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={c}
                  onChange={(e) => setC(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{profile.metrics[0]}</p>
                <p className="text-2xl font-black text-[var(--text-primary)]">{simulation[0]}%</p>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{profile.metrics[1]}</p>
                <p className="text-2xl font-black text-[var(--text-primary)]">{simulation[1]}%</p>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{profile.metrics[2]}</p>
                <p className="text-2xl font-black text-[var(--text-primary)]">{simulation[2]}%</p>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{profile.metrics[3]}</p>
                <p className="text-2xl font-black text-[var(--text-primary)]">{simulation[3]}%</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm text-[var(--text-secondary)] leading-relaxed">
            Professional insight: {profile.insight}
          </p>
        </article>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Key Ideas</h2>
            <ul className="space-y-3">
              {keyIdeas.map((idea) => (
                <li key={idea} className="text-[var(--text-secondary)] leading-relaxed">
                  - {idea}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Learning Workflow</h2>
            <ol className="space-y-3">
              {workflow.map((step, idx) => (
                <li key={step} className="text-[var(--text-secondary)] leading-relaxed">
                  <span className="text-indigo-400 font-semibold mr-2">{idx + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </article>
        </div>

        <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Where It Is Used</h2>
          <div className="flex flex-wrap gap-3">
            {useCases.map((useCase) => (
              <span
                key={useCase}
                className="inline-flex rounded-full border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-1.5 text-xs font-semibold text-[var(--text-secondary)]"
              >
                {useCase}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Professional Explanation</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            In production machine learning systems, this topic is not used in isolation. Teams combine data quality checks,
            controlled model complexity, strong validation discipline, and continuous monitoring to keep performance stable
            over time. The most reliable outcomes come from iterative experimentation, reproducible pipelines, and clear
            alignment between model metrics and real business impact.
          </p>
        </article>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type FrameworkLessonMeta = {
  subjectId: string;
  topicId: string;
  lessonId: string;
  title: string;
  tagline: string;
  install: {
    title?: string;
    steps: string[];
    notes?: string[];
  };
  helloWorld: {
    title?: string;
    code: string;
    notes?: string[];
  };
  bestFor: string[];
  notFor: string[];
  pitfalls: string[];
  related: { title: string; href: string; desc?: string }[];
  prev?: { title: string; lessonId: string };
  next?: { title: string; lessonId: string };
};

type CompareRow = {
  name: string;
  bestAt: string;
  typicalTasks: string;
  output: string;
};

const compareRows: CompareRow[] = [
  {
    name: "NumPy",
    bestAt: "Fast array math + linear algebra",
    typicalTasks: "Numerics, prototyping, preprocessing",
    output: "ndarray (CPU)",
  },
  {
    name: "Pandas",
    bestAt: "Tabular ETL + joins + aggregation",
    typicalTasks: "Cleaning, feature engineering, analysis",
    output: "DataFrame / Series",
  },
  {
    name: "scikit-learn",
    bestAt: "Classical ML + evaluation + pipelines",
    typicalTasks: "Baselines, CV, model selection",
    output: "Estimator / Pipeline",
  },
  {
    name: "PyTorch",
    bestAt: "Neural nets + custom training loops",
    typicalTasks: "Deep learning, research, fine-tuning",
    output: "Tensors + nn.Module",
  },
  {
    name: "TensorFlow",
    bestAt: "Keras training + production deployment",
    typicalTasks: "Deep learning, serving, mobile/edge",
    output: "Tensors + Keras Model",
  },
  {
    name: "Hugging Face",
    bestAt: "Model hub + transformer tooling",
    typicalTasks: "Inference, fine-tuning, sharing",
    output: "Checkpoints + pipelines",
  },
];

function lessonHref(meta: Pick<FrameworkLessonMeta, "subjectId" | "topicId">, lessonId: string) {
  return `/curriculum/${meta.subjectId}/${meta.topicId}/${lessonId}`;
}

type SyntaxSheet = {
  title: string;
  description: string;
  code: string;
  notes: string[];
};

function getSyntaxSheet(lessonId: string): SyntaxSheet {
  switch (lessonId) {
    case "NumPy":
      return {
        title: "NumPy syntax sheet",
        description: "Array shapes, broadcasting, and common ops.",
        code: `import numpy as np

# create
x = np.array([1, 2, 3])           # (3,)
X = np.array([[1, 2], [3, 4]])    # (2,2)

# shapes / reshape
X.shape
X.reshape(1, -1)                  # row vector
X.reshape(-1, 1)                  # column vector

# broadcasting
X + 10                            # add scalar to all
X + np.array([1, 0])              # add per-column

# linear algebra
X.T
X @ X.T                           # matrix multiply
np.linalg.norm(X)                 # ||X||

# stats
X.mean(axis=0)
X.std(axis=0)`,
        notes: [
          "Always print `.shape` when debugging â€” most bugs are shape bugs.",
          "Prefer vectorized ops over Python loops for performance.",
        ],
      };
    case "Pandas":
      return {
        title: "Pandas syntax sheet",
        description: "Select, filter, groupby, join, and basic cleaning.",
        code: `import pandas as pd

df = pd.read_csv("data.csv")

# select / filter
df["col"]
df[["a", "b"]]
df.loc[df["age"] > 18, ["age", "name"]]

# missing values
df["age"] = df["age"].fillna(df["age"].median())

# groupby
df.groupby("city")["sales"].sum().reset_index()

# join
df.merge(other, on="id", how="left")

# feature engineering
df["log_x"] = (df["x"] + 1).pipe(np.log)
df = pd.get_dummies(df, columns=["category"])`,
        notes: [
          "Prefer `.loc[...]` for assignment (avoids chained-index pitfalls).",
          "If the dataset doesnâ€™t fit RAM, consider DuckDB/Polars/Spark.",
        ],
      };
    case "ScikitLearn":
      return {
        title: "scikit-learn syntax sheet",
        description: "Fit/predict, pipelines, and train/test split.",
        code: `from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=0, stratify=y)

pipe = Pipeline([
  ("scale", StandardScaler()),
  ("clf", LogisticRegression(max_iter=1000)),
])

pipe.fit(Xtr, ytr)
pred = pipe.predict(Xte)
score = pipe.score(Xte, yte)`,
        notes: [
          "Use `Pipeline` to avoid leakage: preprocessing must be fit on train only.",
          "Use cross-validation when data is limited (`cross_val_score`).",
        ],
      };
    case "PyTorch":
      return {
        title: "PyTorch syntax sheet",
        description: "Tensor basics, autograd, and a minimal training step.",
        code: `import torch
import torch.nn as nn

device = "cuda" if torch.cuda.is_available() else "cpu"

# tensors / device
x = torch.randn(32, 10, device=device)
y = torch.randint(0, 2, (32,), device=device)

# model
model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 2)).to(device)
opt = torch.optim.AdamW(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()

model.train()
opt.zero_grad()
logits = model(x)
loss = loss_fn(logits, y)
loss.backward()
opt.step()`,
        notes: [
          "Call `model.train()` during training and `model.eval()` for inference.",
          "Wrap inference with `torch.no_grad()` to save memory.",
        ],
      };
    case "TensorFlow":
      return {
        title: "TensorFlow / Keras syntax sheet",
        description: "Define, compile, fit, and predict with Keras.",
        code: `import tensorflow as tf

model = tf.keras.Sequential([
  tf.keras.layers.Input(shape=(10,)),
  tf.keras.layers.Dense(32, activation="relu"),
  tf.keras.layers.Dense(2),
])

model.compile(
  optimizer=tf.keras.optimizers.Adam(1e-3),
  loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
  metrics=["accuracy"],
)

model.fit(X_train, y_train, batch_size=32, epochs=5, validation_split=0.1)
pred = model.predict(X_test)`,
        notes: [
          "Validate export/serving early if you plan to deploy (SavedModel/TFLite).",
          "Be consistent about preprocessing between train and serve.",
        ],
      };
    case "HuggingFace":
      return {
        title: "Hugging Face syntax sheet",
        description: "Pipeline inference + tokenizer/model loading.",
        code: `from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification

# fastest on-ramp
clf = pipeline("sentiment-analysis")
print(clf("I love clean interfaces."))

# explicit loading
model_id = "distilbert-base-uncased-finetuned-sst-2-english"
tok = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForSequenceClassification.from_pretrained(model_id)

inputs = tok("hello world", return_tensors="pt", truncation=True)
out = model(**inputs)`,
        notes: [
          "Always load tokenizer + model from the same `model_id` family.",
          "First run often downloads weights â€” expect network + disk usage.",
        ],
      };
    default:
      return {
        title: "Syntax sheet",
        description: "Common commands and patterns.",
        code: `# Add a syntax sheet for this framework...`,
        notes: [],
      };
  }
}

export default function FrameworkLessonLayout({
  meta,
  children,
}: {
  meta: FrameworkLessonMeta;
  children: React.ReactNode;
}) {
  const activeName = meta.title.toLowerCase();

  return (
    <section className="px-12 py-24">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-5 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            <span className="inline-block size-2 rounded-full bg-[var(--text-primary)]" />
            Frameworks
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-[var(--text-primary)]">
            {meta.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)]">{meta.tagline}</p>
        </header>

        <div className="mt-14 flex flex-wrap gap-2">
          {compareRows.map((row) => {
            const href = lessonHref(meta, row.name === "scikit-learn" ? "ScikitLearn" : row.name.replace(" ", ""));
            const rowName = row.name.toLowerCase();
            const isActive =
              activeName.includes(rowName) ||
              (row.name === "scikit-learn" && meta.lessonId === "ScikitLearn") ||
              (row.name === "Hugging Face" && meta.lessonId === "HuggingFace");

            return (
              <Link
                key={row.name}
                href={href}
                className={[
                  "rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] border transition-colors",
                  isActive
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                    : "bg-[var(--bg-secondary)]/40 text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]",
                ].join(" ")}
              >
                {row.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-12">
          <div className="sm:col-span-7 space-y-10">{children}</div>

          <aside className="sm:col-span-5 space-y-6">
            <div className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                {meta.install.title ?? "Install"}
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                {meta.install.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              {meta.install.notes?.length ? (
                <div className="mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
                  <ul className="space-y-2">
                    {meta.install.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="rounded-[2rem] bg-[var(--bg-secondary)]/30 border border-[var(--border-subtle)] p-8 sm:p-10">
              <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                {meta.helloWorld.title ?? "Hello world"}
              </h2>
              <div className="mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 p-5 font-mono text-xs leading-relaxed text-[var(--text-secondary)] overflow-auto">
                {meta.helloWorld.code}
              </div>
              {meta.helloWorld.notes?.length ? (
                <ul className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
                  {meta.helloWorld.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </aside>
        </div>

        <div className="mt-16 rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
          <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Best for / Not for
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-6">
              <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[var(--text-primary)]">
                Best for
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                {meta.bestFor.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-6">
              <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[var(--text-primary)]">
                Not for
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                {meta.notFor.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
          <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Common pitfalls</h2>
          <ul className="mt-5 space-y-3 text-[var(--text-secondary)]">
            {meta.pitfalls.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-[2rem] bg-[var(--bg-secondary)]/30 border border-[var(--border-subtle)] p-8 sm:p-10">
          {(() => {
            const sheet = getSyntaxSheet(meta.lessonId);
            return (
              <>
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
                  cheat_sheet
                </div>
                <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--text-primary)]">
                  {sheet.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {sheet.description}
                </p>
                <div className="mt-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 font-mono text-xs leading-relaxed text-[var(--text-secondary)] overflow-auto">
                  {sheet.code}
                </div>
                {sheet.notes.length ? (
                  <ul className="mt-5 space-y-2 text-xs text-[var(--text-secondary)]">
                    {sheet.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                ) : null}
              </>
            );
          })()}
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20">
          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              Quick comparison
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-[780px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]">
                    <th className="pb-4 pr-6">Framework</th>
                    <th className="pb-4 pr-6">Best at</th>
                    <th className="pb-4 pr-6">Typical tasks</th>
                    <th className="pb-4">Output</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((r) => {
                    const isActive =
                      (r.name === "Hugging Face" && meta.lessonId === "HuggingFace") ||
                      (r.name === "scikit-learn" && meta.lessonId === "ScikitLearn") ||
                      meta.title.toLowerCase().includes(r.name.toLowerCase());

                    return (
                      <tr
                        key={r.name}
                        className={[
                          "align-top",
                          isActive ? "bg-[var(--bg-primary)]" : "",
                        ].join(" ")}
                      >
                        <td className="border-t border-[var(--border-subtle)] py-4 pr-6">
                          <span
                            className={[
                              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border",
                              isActive
                                ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]"
                                : "bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-subtle)]",
                            ].join(" ")}
                          >
                            {r.name}
                          </span>
                        </td>
                        <td className="border-t border-[var(--border-subtle)] py-4 pr-6 text-sm text-[var(--text-secondary)]">
                          {r.bestAt}
                        </td>
                        <td className="border-t border-[var(--border-subtle)] py-4 pr-6 text-sm text-[var(--text-secondary)]">
                          {r.typicalTasks}
                        </td>
                        <td className="border-t border-[var(--border-subtle)] py-4 text-sm text-[var(--text-secondary)]">
                          {r.output}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
            <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Related lessons</h2>
            <div className="mt-6 space-y-3">
              {meta.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="block rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 p-5 hover:border-indigo-500/30 transition-colors"
                >
                  <div className="text-sm font-black tracking-tight text-[var(--text-primary)]">
                    {r.title}
                  </div>
                  {r.desc ? (
                    <div className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{r.desc}</div>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[var(--bg-secondary)]/30 border border-[var(--border-subtle)] p-8 sm:p-10">
            <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Navigation</h2>
            <div className="mt-6 flex flex-col gap-3">
              {meta.prev ? (
                <Link
                  href={lessonHref(meta, meta.prev.lessonId)}
                  className="inline-flex items-center justify-between gap-4 rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 hover:border-indigo-500/30 transition-colors"
                >
                  <span className="inline-flex items-center gap-3 text-sm font-black tracking-tight text-[var(--text-primary)]">
                    <ArrowLeft className="size-4" /> {meta.prev.title}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]">
                    Prev
                  </span>
                </Link>
              ) : null}

              {meta.next ? (
                <Link
                  href={lessonHref(meta, meta.next.lessonId)}
                  className="inline-flex items-center justify-between gap-4 rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 hover:border-indigo-500/30 transition-colors"
                >
                  <span className="inline-flex items-center gap-3 text-sm font-black tracking-tight text-[var(--text-primary)]">
                    {meta.next.title} <ArrowRight className="size-4" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]">
                    Next
                  </span>
                </Link>
              ) : null}

              <Link
                href={`/curriculum/${meta.subjectId}/${meta.topicId}`}
                className="inline-flex items-center justify-between gap-4 rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 hover:border-indigo-500/30 transition-colors"
              >
                <span className="text-sm font-black tracking-tight text-[var(--text-primary)]">
                  Back to topic
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]">
                  Index
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

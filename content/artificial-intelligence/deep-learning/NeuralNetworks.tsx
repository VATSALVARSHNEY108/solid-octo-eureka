"use client";

import { useEffect, useRef, useState } from "react";
import SimulationSkeleton from "@/components/SimulationSkeleton";

export default function NeuralNetworks() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loading, setLoading] = useState(true);
  const LIVE_SRC =
    "https://playground.tensorflow.org/#activation=tanh&batchSize=10&dataset=circle&regDataset=reg-plane&learningRate=0.03&regularizationRate=0&noise=0&networkShape=4,2&seed=0.83113&showTestData=false&discretize=false&percTrainData=50&x=true&y=true&xTimesY=false&xSquared=false&ySquared=false&cosX=false&sinX=false&cosY=false&sinY=false&collectStats=false&problem=classification&initZero=false&hideText=false";

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => setLoading(false);
    iframe.addEventListener("load", onLoad);

    return () => {
      iframe.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <section className="px-12 py-24">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-5 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            <span className="inline-block size-2 rounded-full bg-[var(--text-primary)]" />
            Deep Learning
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-[var(--text-primary)]">
            Neural Networks
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)]">
            Interactive TensorFlow Playground for exploring how a neural
            network changes with architecture, activation, and data.
          </p>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Open the live playground directly:{" "}
            <a
              className="underline decoration-[var(--border-subtle)] underline-offset-4 hover:text-[var(--text-primary)]"
              href={LIVE_SRC}
              target="_blank"
              rel="noreferrer"
            >
              {LIVE_SRC}
            </a>
          </p>
        </header>

        <div className="mt-16 rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-premium overflow-hidden relative">
          {loading ? <SimulationSkeleton className="h-[1200px]" /> : null}
          <iframe
            ref={iframeRef}
            src={LIVE_SRC}
            title="TensorFlow Playground"
            className="block w-full"
            style={{
              border: 0,
              height: "80vh",
              minHeight: "720px",
              visibility: loading ? "hidden" : "visible",
            }}
            sandbox="allow-scripts allow-same-origin allow-forms"
            onError={() => setLoading(false)}
          />
        </div>
      </div>
    </section>
  );
}

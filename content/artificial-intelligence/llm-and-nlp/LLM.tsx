'use client';

import React, { useState, useRef } from 'react';

// Repo metadata from bbycroft/llm-viz
const REPO_INFO = {
  name: 'llm-viz',
  author: 'Brendan Bycroft',
  github: 'https://github.com/bbycroft/llm-viz',
  description:
    'A 3D interactive visualizer of a GPT-style large language model running inference — walking through every layer, attention head, and token embedding step by step.',
};

const KEY_CONCEPTS = [
  {
    icon: '🔢',
    title: 'Token Embeddings',
    desc: 'Each input token is converted into a high-dimensional vector. The model learns these representations during training.',
  },
  {
    icon: '🎯',
    title: 'Self-Attention',
    desc: 'Queries, Keys, and Values let each token attend to every other token. Multi-head attention learns different relationship patterns in parallel.',
  },
  {
    icon: '🧱',
    title: 'Transformer Blocks',
    desc: 'Stacks of attention + MLP layers with residual connections and layer norms. GPT-2 small has 12 such blocks.',
  },
  {
    icon: '🌡️',
    title: 'Softmax & Temperature',
    desc: 'The final layer projects hidden states to vocabulary logits. Softmax turns them into a probability distribution over the next token.',
  },
  {
    icon: '📐',
    title: 'Layer Norm',
    desc: 'Normalizes activations across the hidden dimension. Stabilizes training and allows much deeper networks.',
  },
  {
    icon: '🔁',
    title: 'Residual Streams',
    desc: 'Information flows through a residual stream across all layers. Each block adds its contribution to this stream.',
  },
];

const SOURCE_FILES = [
  {
    path: 'src/llm/GptModel.ts',
    role: 'Core model logic — forward pass, attention computation, weight matrices',
  },
  {
    path: 'src/llm/GptModelLayout.ts',
    role: '3D layout computation for rendering every neuron and weight connection',
  },
  {
    path: 'src/llm/Commentary.tsx',
    role: 'Step-by-step walkthroughs explaining what each part does',
  },
  {
    path: 'src/llm/LayerView.tsx',
    role: 'React component that renders each transformer layer in 3D',
  },
  {
    path: 'src/llm/Camera.ts',
    role: 'Camera controls — orbit, zoom, and programmatic fly-to animations',
  },
  {
    path: 'src/llm/gpu/',
    role: 'WebGPU shaders for hardware-accelerated 3D rendering',
  },
  {
    path: 'src/llm/walkthrough/',
    role: 'Ordered walkthrough phases — from embeddings through to final output',
  },
];

// Live production URL — always available, no local build required
const LIVE_SRC = 'https://bbycroft.net/llm';

export default function LLM() {

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* ── Hero Header ── */}
      <div
        className="relative border-b px-8 py-10 md:px-16 overflow-hidden"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
      >
        {/* decorative background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 max-w-5xl">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs font-mono uppercase tracking-widest px-3 py-1 border rounded-full"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              LLM &amp; NLP
            </span>
            <span
              className="text-xs font-mono px-3 py-1 border rounded-full"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              Interactive · WebGPU
            </span>
          </div>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {REPO_INFO.description}
          </p>
          <div className="flex items-center gap-4 mt-6">
            <a
              href={REPO_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 border rounded text-sm font-mono transition-all duration-200 hover:opacity-70"
              style={{
                borderColor: 'var(--text-primary)',
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.165c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              {REPO_INFO.author} / {REPO_INFO.name}
            </a>
            <a
              href={LIVE_SRC}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-sm font-mono transition-all duration-200 hover:opacity-70"
              style={{ color: 'var(--text-secondary)' }}
            >
              Open full screen ↗
            </a>
          </div>
        </div>
      </div>

      {/* ── Interactive Visualization ── */}
      <div className="border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="px-8 md:px-16 py-4 flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            Live Visualization
          </h2>
          {!iframeLoaded && !iframeError && (
            <span className="text-xs font-mono animate-pulse" style={{ color: 'var(--text-secondary)' }}>
              Loading WebGPU renderer…
            </span>
          )}
        </div>

        <div className="relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          {/* Loading spinner */}
          {!iframeLoaded && !iframeError && (
            <div
              className="absolute inset-0 flex items-center justify-center z-10"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: 'var(--border-color)', borderTopColor: 'transparent' }}
                />
                <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                  Initializing 3D transformer… , if it takes a while refresh the page 
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {iframeError && (
            <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
              <div
                className="text-6xl mb-6 opacity-30 font-mono select-none"
                style={{ color: 'var(--text-primary)' }}
              >
                ⚠
              </div>
              <p className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Could not load visualization
              </p>
              <p className="text-sm max-w-md mb-6" style={{ color: 'var(--text-secondary)' }}>
                The embedded view failed to load. Open it directly at{' '}
                <a href={LIVE_SRC} target="_blank" rel="noreferrer" className="underline">
                  bbycroft.net/llm
                </a>.
              </p>
            </div>
          )}

          {/* The iframe */}
          {!iframeError && (
            <iframe
              ref={iframeRef}
              title="LLM Visualization — bbycroft"
              src={LIVE_SRC}
              className="w-full border-none block"
              style={{ height: 'calc(100vh - 160px)', minHeight: '600px' }}
              loading="lazy"
              referrerPolicy="no-referrer"
              allow="cross-origin-isolated"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeError(true)}
            />
          )}
        </div>
      </div>

      {/* ── Key Concepts ── */}
      <div className="px-8 md:px-16 py-12 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          Key Concepts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {KEY_CONCEPTS.map((concept) => (
            <div
              key={concept.title}
              className="border rounded-lg p-5 transition-all duration-200 hover:border-opacity-70"
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
              }}
            >
              <div className="text-2xl mb-3">{concept.icon}</div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
                {concept.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {concept.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      

      {/* ── Architecture Diagram (ASCII) ── */}
      <div className="px-8 md:px-16 py-12 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          GPT Architecture Overview
        </h2>
        <pre
          className="rounded-lg p-6 text-xs font-mono leading-relaxed overflow-auto"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
            border: '1px solid var(--border-color)',
          }}
        >
          {`// Transformer blocks are stacks of self-attention + MLP layers with residual connections.
// (ASCII preview placeholder — replace with a full diagram if needed)`}
        </pre>
      </div>

      {/* ── Attribution ── */}
      <div className="px-8 md:px-16 py-6">
        <p className="text-xs font-mono text-right" style={{ color: 'var(--text-secondary)' }}>
          Visualization by{' '}
          <a
            href={REPO_INFO.github}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:opacity-70"
          >
            {REPO_INFO.author}
          </a>{' '}
          · MIT License
        </p>
      </div>
    </div>
  );
}

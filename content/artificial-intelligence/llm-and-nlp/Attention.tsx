"use client";

import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Cpu, 
  Activity, 
  Scale, 
  ArrowRight,
  Database,
  Eye,
  Zap,
  Clock,
  ExternalLink
} from "lucide-react";

// ── Visual Design System Tokens ──────────────────────────────────────────────
const S = {
  bgPrimary: "var(--bg-primary)",
  bgSecondary: "var(--bg-secondary)",
  textPrimary: "var(--text-primary)",
  textSecondary: "var(--text-secondary)",
  borderColor: "var(--border-color)",
  borderSubtle: "var(--border-subtle)",
};

// ── Interactive Alignment Matrix Translation Simulator ───────────────────────
const ALIGNMENT_STEPS = [
  {
    step: 1,
    french: "je",
    englishTarget: "I",
    weight: "94%",
    explanation: "On the first pass of the decoder, 94% of the attention weight is focused on the source word 'I'. This guides the model to produce the translation 'je'."
  },
  {
    step: 2,
    french: "t'",
    englishTarget: "you",
    weight: "88%",
    explanation: "On the second pass, the model attends 88% to the object 'you' (capturing grammatical inversion in French syntax), producing the pronominal object 't''."
  },
  {
    step: 3,
    french: "aime",
    englishTarget: "love",
    weight: "95%",
    explanation: "On the final pass, the decoder shifts 95% of its attention weight to the core verb 'love', yielding the verb 'aime' to complete the phrase."
  }
];

// ── Interactive Formula Breakdown Data ───────────────────────────────────────
const FORMULA_PARTS = {
  Q: {
    title: "Query Matrix (Q)",
    dim: "m × d_k",
    desc: "Represents the active search states. In self-attention, each token generates a query vector asking: 'Which tokens in the sequence should I attend to?'"
  },
  K: {
    title: "Key Matrix (K)",
    dim: "n × d_k",
    desc: "Represents the reference descriptors. Each token in the context sequence generates a key vector matching queries. Dot products of Q and K evaluate alignment."
  },
  V: {
    title: "Value Matrix (V)",
    dim: "n × d_v",
    desc: "Represents the actual content vectors. Once soft attention weights are computed, they are used to weight and sum these value vectors to produce the final output."
  },
  softmax: {
    title: "Softmax Activation",
    dim: "Row-wise normalized",
    desc: "Applies exponential normalization across keys. Converts raw alignment scores into positive weights summing to 1 (a probability distribution)."
  },
  scaling: {
    title: "Scaling Factor (1/√d_k)",
    dim: "Scalar",
    desc: "Scales the dot products to prevent extremely large values when the dimension d_k is large. Large values push softmax into regions with vanishing gradients."
  }
};

// ── Timeline Breakthrough Data ───────────────────────────────────────────────
const TIMELINE_BREAKTHROUGHS = [
  {
    era: "1950s–1960s",
    title: "Cognitive Psychology Foundations",
    desc: "Development of the Cocktail Party Effect (focusing on target auditory stimuli while filtering out background noise) and the filter model of attention."
  },
  {
    era: "1990s",
    title: "Fast Weights & Dynamic Links",
    desc: "Early models of fast weight controllers and dynamic links between neurons, anticipating key-value routing mechanisms."
  },
  {
    era: "2014",
    title: "RNN Seq2Seq with Attention",
    desc: "Bahdanau et al. introduced learned attention to handle translation of long sentences in sequence-to-sequence recurrent neural networks."
  },
  {
    era: "2017",
    title: "The Transformer & Self-Attention",
    desc: "The landmark paper 'Attention Is All You Need' formalized scaled dot-product self-attention: A = softmax(QKᵀ / √d_k)V, discarding recurrence entirely."
  },
  {
    era: "2020+",
    title: "Linear & Hardware Optimizations",
    desc: "Linformer, Reformer, FlashAttention, and FlexAttention introduced to reduce quadratic overhead and optimize GPU execution for long context windows."
  }
];

export default function AttentionPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeFormulaPart, setActiveFormulaPart] = useState<keyof typeof FORMULA_PARTS | null>(null);
  const [activeMathTab, setActiveMathTab] = useState("scaled");

  return (
    <div className="w-full min-h-screen px-6 py-12 md:px-12 md:py-24 flex flex-col gap-20 font-sans" style={{ backgroundColor: S.bgPrimary, color: S.textPrimary }}>
      
      {/* ── Header ── */}
      <header className="relative border border-[var(--border-color)] p-8 md:p-12 rounded-2xl overflow-hidden" style={{ backgroundColor: S.bgSecondary }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative z-10 max-w-4xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest px-3.5 py-1.5 border rounded-full border-[var(--border-color)] text-[var(--text-secondary)]">
              Subject 01 · LLM &amp; NLP
            </span>
            <span className="text-xs font-mono px-3.5 py-1.5 border rounded-full border-[var(--border-color)] text-[var(--text-secondary)] flex items-center gap-1.5">
              <Activity size={12} className="animate-pulse" /> Interactive Lesson
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none" style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}>
            The Attention Mechanism
          </h1>
          
          <p className="text-base md:text-lg leading-relaxed text-[var(--text-secondary)] max-w-3xl">
            In machine learning, <strong>attention</strong> is a method that determines the importance of each component in a sequence relative to others. Unlike static weights computed during training, attention weights are "soft"—they are computed dynamically in the forward pass and change with every input sequence.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-[var(--border-subtle)] mt-2">
            <div>
              <div className="text-2xl font-bold font-mono">O(n²)</div>
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Complexity limit</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">Q, K, V</div>
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Projection vectors</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">Soft Weights</div>
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Dynamic values</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">Parallelizable</div>
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Replaced RNNs</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Core Concept Section ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Cpu size={20} />
            <h2 className="text-2xl font-bold font-mono">Self-Attention vs. Recurrent Models</h2>
          </div>
          
          <p className="leading-relaxed text-[var(--text-secondary)]">
            Inspired by ideas about attention in humans, the attention mechanism was developed to address the weaknesses of using information from the hidden layers of recurrent neural networks (RNNs). Recurrent neural networks favor information contained in words at the end of a sentence (recency bias), thereby tending to attenuate the significance of information earlier in the sentence.
          </p>

          <p className="leading-relaxed text-[var(--text-secondary)]">
            <strong>Attention allows a token equal access to any part of a sequence directly</strong>, rather than only bottlenecking through successive hidden states. By shifting from recurrence to parallel self-attention, the Transformer model solved key training performance limitations, making it the foundation for models like BERT, T5, and GPT.
          </p>

          <div className="border border-[var(--border-color)] p-6 rounded-xl space-y-4" style={{ backgroundColor: S.bgSecondary }}>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)] block">
              Attention Pipeline Diagram
            </span>
            <img 
              src="/attention-diagram.png" 
              alt="Attention mechanism diagram showing query, key, and value matrices" 
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-white object-contain p-4 transition-transform hover:scale-[1.01]" 
            />
            <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed text-center">
              Figure: The query vector <strong>q</strong> attends over the key matrix <strong>K</strong> to calculate soft similarity weights <strong>α</strong>, combining value matrix <strong>V</strong> into a context vector.
            </p>
          </div>
        </div>

        {/* Dynamic Concept Alignment Card */}
        <div className="lg:col-span-5 border border-[var(--border-color)] p-6 rounded-2xl flex flex-col gap-6" style={{ backgroundColor: S.bgSecondary }}>
          <h3 className="text-lg font-bold font-mono flex items-center gap-2">
            <Sparkles size={16} /> Interactive Alignment Explorer
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Observe how alignment matching maps words dynamically between languages during decoding (e.g., translating <em>"I love you"</em> to French <em>"je t&apos;aime"</em>).
          </p>

          {/* Timeline stepper inside card */}
          <div className="flex justify-between items-center bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-subtle)]">
            <button 
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="px-3 py-1 text-xs border border-[var(--border-color)] rounded disabled:opacity-30 cursor-pointer"
            >
              Prev
            </button>
            <span className="text-xs font-mono">Step {activeStep + 1} of 3</span>
            <button 
              onClick={() => setActiveStep(Math.min(2, activeStep + 1))}
              disabled={activeStep === 2}
              className="px-3 py-1 text-xs border border-[var(--border-color)] rounded disabled:opacity-30 cursor-pointer"
            >
              Next
            </button>
          </div>

          {/* Active alignment details */}
          <div className="p-5 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-primary)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Target Translation</span>
                <div className="text-xl font-bold font-mono">&quot;{ALIGNMENT_STEPS[activeStep].french}&quot;</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Attends To</span>
                <div className="text-xl font-bold font-mono text-emerald-500">&quot;{ALIGNMENT_STEPS[activeStep].englishTarget}&quot;</div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Attention Weight</span>
              <div className="text-base font-bold font-mono text-emerald-500">{ALIGNMENT_STEPS[activeStep].weight}</div>
            </div>

            <p className="text-xs leading-relaxed text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3">
              {ALIGNMENT_STEPS[activeStep].explanation}
            </p>
          </div>

          <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-white p-3">
            <img 
              src="/attention-alignment-matrix.png" 
              alt="Attention alignment matrix for I love you" 
              className="w-full object-contain rounded" 
            />
            <p className="text-[10px] text-gray-500 text-center mt-2 italic">
              Alignment Matrix: High attention weights (dark cells) reveal cross-lingual mapping.
            </p>
          </div>
        </div>
      </section>

      {/* ── Interactive Formula Explorer ── */}
      <section className="border border-[var(--border-color)] p-8 rounded-2xl flex flex-col gap-8" style={{ backgroundColor: S.bgSecondary }}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Scale size={20} />
            <h2 className="text-2xl font-bold font-mono">Scaled Dot-Product Formula Explorer</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
            Click on any part of the mathematical formula below to view its dimensions, purpose, and role in computing self-attention.
          </p>
        </div>

        {/* Interactive Formula Render */}
        <div className="flex flex-wrap items-center justify-center gap-3 p-8 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-primary)] font-mono text-xl md:text-3xl text-center select-none">
          <span className="text-[var(--text-secondary)]">Attention(</span>
          <button 
            onClick={() => setActiveFormulaPart("Q")}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${activeFormulaPart === "Q" ? "bg-emerald-500/20 text-emerald-500 font-extrabold" : "hover:bg-[var(--border-subtle)]"}`}
          >
            Q
          </button>
          <span>,</span>
          <button 
            onClick={() => setActiveFormulaPart("K")}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${activeFormulaPart === "K" ? "bg-emerald-500/20 text-emerald-500 font-extrabold" : "hover:bg-[var(--border-subtle)]"}`}
          >
            K
          </button>
          <span>,</span>
          <button 
            onClick={() => setActiveFormulaPart("V")}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${activeFormulaPart === "V" ? "bg-emerald-500/20 text-emerald-500 font-extrabold" : "hover:bg-[var(--border-subtle)]"}`}
          >
            V
          </button>
          <span className="text-[var(--text-secondary)]">) =</span>
          
          <button 
            onClick={() => setActiveFormulaPart("softmax")}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${activeFormulaPart === "softmax" ? "bg-emerald-500/20 text-emerald-500 font-extrabold" : "hover:bg-[var(--border-subtle)]"}`}
          >
            softmax
          </button>
          
          <span className="text-[var(--text-secondary)]">(</span>
          <span className="font-bold">Q Kᵀ</span>
          <span className="text-[var(--text-secondary)]">/</span>
          
          <button 
            onClick={() => setActiveFormulaPart("scaling")}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${activeFormulaPart === "scaling" ? "bg-emerald-500/20 text-emerald-500 font-extrabold" : "hover:bg-[var(--border-subtle)]"}`}
          >
            √d_k
          </button>
          
          <span className="text-[var(--text-secondary)]">)</span>
          <span className="font-bold">V</span>
        </div>

        {/* Selected Part Details */}
        <div className="min-h-[140px] border border-[var(--border-subtle)] p-6 rounded-xl bg-[var(--bg-primary)] flex flex-col justify-center gap-2">
          {activeFormulaPart ? (
            <>
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)]">
                <span className="font-mono font-bold text-lg text-emerald-500">{FORMULA_PARTS[activeFormulaPart].title}</span>
                <span className="text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-2.5 py-0.5 rounded">
                  Dimensions: {FORMULA_PARTS[activeFormulaPart].dim}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)] mt-2">
                {FORMULA_PARTS[activeFormulaPart].desc}
              </p>
            </>
          ) : (
            <div className="text-center text-sm text-[var(--text-secondary)] italic">
              Click on a variable in the formula above (Q, K, V, softmax, or √d_k) to view its mathematical description.
            </div>
          )}
        </div>
      </section>

      {/* ── Mathematical Representations (Tabbed View) ── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
          <BookOpen size={20} />
          <h2 className="text-2xl font-bold font-mono">Mathematical Variants</h2>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto">
          {[
            { id: "scaled", label: "Scaled Dot-Product" },
            { id: "masked", label: "Masked Attention" },
            { id: "multihead", label: "Multi-Head" },
            { id: "bahdanau", label: "Bahdanau (Additive)" },
            { id: "luong", label: "Luong (Multiplicative)" },
            { id: "self", label: "Self-Attention" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMathTab(tab.id)}
              className={`px-4 py-2 text-xs font-mono border-b-2 transition-all duration-150 cursor-pointer ${
                activeMathTab === tab.id 
                  ? "border-[var(--text-primary)] text-[var(--text-primary)] font-bold" 
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="p-6 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)]">
          {activeMathTab === "scaled" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg font-mono">Standard Scaled Dot-Product</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                For queries matrix Q ∈ ℝ^(m×d_k), keys matrix K ∈ ℝ^(n×d_k) and values matrix V ∈ ℝ^(n×d_v), the scores represent similarity projections. Equivariant to queries re-ordering and invariant to key-value shuffling.
              </p>
              <pre className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl font-mono text-xs overflow-auto">
                Attention(Q, K, V) = softmax( QKᵀ / √d_k ) · V  ∈ ℝ^(m×d_v)
              </pre>
            </div>
          )}

          {activeMathTab === "masked" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg font-mono">Masked Attention</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Used in autoregressive decoders (like GPT) to prevent model attending to future tokens. The mask M ∈ ℝ^(n×n) contains -∞ for future index elements.
              </p>
              <pre className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl font-mono text-xs overflow-auto">
                Attention(Q, K, V) = softmax( QKᵀ / √d_k + M ) · V
                
                Where M_ij = 0 if i ≥ j, else -∞
              </pre>
            </div>
          )}

          {activeMathTab === "multihead" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg font-mono">Multi-Head Attention</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Allows the model to jointly attend to information from different representation subspaces in parallel. Linear projections of Q, K, V are processed individually.
              </p>
              <pre className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl font-mono text-xs overflow-auto">
                MultiHead(Q, K, V) = Concat(head₁, ..., headₕ) · Wᴼ
                Where headᵢ = Attention(Q·Wᵢᵠ, K·Wᵢᴷ, V·Wᵢᵛ)
              </pre>
            </div>
          )}

          {activeMathTab === "bahdanau" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg font-mono">Bahdanau (Additive) Attention</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                The original recurrent attention mechanism. Similarity scores are computed using a single hidden-layer feedforward network with tanh activation.
              </p>
              <pre className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl font-mono text-xs overflow-auto">
                Attention(Q, K, V) = softmax( tanh( W_Q·Q + W_K·K ) ) · V
              </pre>
            </div>
          )}

          {activeMathTab === "luong" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg font-mono">Luong Attention (General)</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                A multiplicative attention variant. Uses a bilinear dot product with a learnable weight matrix W between queries and keys.
              </p>
              <pre className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl font-mono text-xs overflow-auto">
                Attention(Q, K, V) = softmax( Q · W · Kᵀ ) · V
              </pre>
            </div>
          )}

          {activeMathTab === "self" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg font-mono">Self-Attention</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Q, K, V all come from the same input sequence representations. Masked self-attention is applied in the decoder, and standard bi-directional self-attention is applied in the encoder.
              </p>
              <pre className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl font-mono text-xs overflow-auto">
                H&apos; = Attention( H·Wᵠ, H·Wᴷ, H·Wᵛ )
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* ── Attention Variants Grid ── */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
          <Eye size={20} />
          <h2 className="text-2xl font-bold font-mono">Attention Alignment Architectures</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[var(--border-color)] p-5 rounded-2xl bg-white text-gray-800 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">1. Encoder-Decoder Dot Product</span>
            <img src="/attn-variant-1.png" alt="Encoder-decoder dot product" className="w-full object-contain rounded-lg border" />
            <p className="text-xs text-gray-600 leading-relaxed">
              Both encoder and decoder states are needed to compute attention weights. Score defined by: <code>w_ij = x_i · h_j</code>
            </p>
          </div>

          <div className="border border-[var(--border-color)] p-5 rounded-2xl bg-white text-gray-800 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">2. Encoder-Decoder QKV</span>
            <img src="/attn-variant-2.png" alt="Encoder-decoder QKV" className="w-full object-contain rounded-lg border" />
            <p className="text-xs text-gray-600 leading-relaxed">
              Queries are projected from decoder states, while keys and values are projected from encoder outputs.<sup>[44]</sup>
            </p>
          </div>

          <div className="border border-[var(--border-color)] p-5 rounded-2xl bg-white text-gray-800 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">3. Encoder-Only QKV</span>
            <img src="/attn-variant-3.png" alt="Encoder-only QKV" className="w-full object-contain rounded-lg border" />
            <p className="text-xs text-gray-600 leading-relaxed">
              Decoders are omitted entirely. Queries, keys, and values are computed strictly from the encoder input states (self-attention).<sup>[46]</sup>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-[var(--border-color)] p-5 rounded-2xl flex flex-col gap-2" style={{ backgroundColor: S.bgSecondary }}>
            <strong className="text-[var(--text-primary)] font-mono text-sm block">4. Encoder-only dot product</strong>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              No decoder used. With only 1 sequence input, the weight matrix is calculated via an auto-correlation: <code>w_ij = x_i · x_j</code>.<sup>[45]</sup>
            </p>
          </div>
          <div className="border border-[var(--border-color)] p-5 rounded-2xl flex flex-col gap-2" style={{ backgroundColor: S.bgSecondary }}>
            <strong className="text-[var(--text-primary)] font-mono text-sm block">5. Fully-Connected Layers (PyTorch)</strong>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Computes attention scores using parameterized feedforward linear layers instead of raw dot-product similarity metrics.<sup>[47]</sup>
            </p>
          </div>
        </div>
      </section>

      {/* ── Optimizations & Vision Transformers ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Flash & Flex */}
        <div className="lg:col-span-6 border border-[var(--border-color)] p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="text-lg font-bold font-mono flex items-center gap-2">
            <Zap size={18} /> Attention Optimizations
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-secondary)]">
              <span className="text-xs font-mono font-bold block mb-1">FlashAttention</span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Standard attention has quadratic time/memory complexity O(N²). FlashAttention partitions computations into blocks fitting inside faster GPU SRAM, avoiding the storage of massive intermediate matrices.<sup>[48]</sup>
              </p>
            </div>
            
            <div className="p-4 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-secondary)]">
              <span className="text-xs font-mono font-bold block mb-1">FlexAttention</span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                A PyTorch-native flexible API developed by Meta allowing users to customize and modify attention score values before softmax while maintaining FlashAttention execution speed.<sup>[49]</sup>
              </p>
            </div>
          </div>
        </div>

        {/* Vision Transformers */}
        <div className="lg:col-span-6 border border-[var(--border-color)] p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="text-lg font-bold font-mono flex items-center gap-2">
            <Eye size={18} /> Saliency &amp; Vision Transformers
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Visualizing attention weights as saliency heatmaps is standard practice to inspect decision making in Vision Transformers (ViT). Since models are often trained self-supervised, maps are not native class-sensitive.
          </p>
          <div className="p-4 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-secondary)] space-y-2">
            <span className="text-xs font-mono font-bold block">Key Methodologies</span>
            <ul className="text-xs text-[var(--text-secondary)] list-disc pl-4 space-y-1">
              <li><strong>Attention Rollout:</strong> Recursive dot products combining maps across all layers.<sup>[51]</sup></li>
              <li><strong>CDAM:</strong> Combines attention maps and class [CLS] gradients.<sup>[52]</sup></li>
              <li><strong>GradCAM:</strong> Back-propagates gradients directly to attention outputs.<sup>[53]</sup></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Timeline Breakthroughs ── */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
          <Clock size={20} />
          <h2 className="text-2xl font-bold font-mono">History &amp; Historical Context</h2>
        </div>

        <div className="relative border-l-2 border-[var(--border-color)] pl-6 ml-4 space-y-8">
          {TIMELINE_BREAKTHROUGHS.map((b) => (
            <div key={b.era} className="relative">
              {/* timeline node icon */}
              <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-2 border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />
              </div>
              
              <div>
                <span className="text-xs font-mono font-bold text-emerald-500 bg-[var(--bg-secondary)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                  {b.era}
                </span>
                <h3 className="font-bold font-mono text-base mt-2">{b.title}</h3>
                <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed mt-1">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive Simulations Link ── */}
      <footer className="border-t border-[var(--border-subtle)] pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xs text-[var(--text-secondary)] font-mono">
          THINK++ Interactive Labs · Attention Mechanism
        </div>

        <a
          href="/nlp-simulations/transformer.html"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <ExternalLink size={14} /> Open Live Transformer Simulation ↗
        </a>
      </footer>
    </div>
  );
}

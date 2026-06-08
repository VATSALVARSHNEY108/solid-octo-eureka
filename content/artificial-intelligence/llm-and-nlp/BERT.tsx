"use client";
import React, { useState } from "react";

const card: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "var(--border-radius-md)",
  border: "0.5px solid var(--color-border-tertiary)",
  background: "var(--color-background-secondary)",
};

const sections = [
  {
    id: "overview",
    label: "Overview",
    content: (
      <div>
        <p>
          BERT (Bidirectional Encoder Representations from Transformers) is a language model introduced
          in October 2018 by Google researchers. It uses a self-supervised, encoder-only transformer
          architecture and dramatically advanced the state of the art in NLP. By 2020, BERT became a
          ubiquitous baseline across natural language processing research.
        </p>
        <p>
          BERT was originally released in two sizes — <Code>BERT BASE</Code> (110M parameters) and{" "}
          <Code>BERT LARGE</Code> (340M parameters) — trained on the Toronto BookCorpus (800M words)
          and English Wikipedia (2,500M words). In March 2020, 24 smaller variants were released, the
          smallest being <Code>BERT TINY</Code> at just 4M parameters.
        </p>
      </div>
    ),
  },
  {
    id: "architecture",
    label: "Architecture",
    content: (
      <div>
        <p>BERT consists of four sequential modules:</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, margin: "1.25rem 0" }}>
          {[
            { icon: "→", title: "Tokenizer", desc: "Converts English text into integer tokens" },
            { icon: "⊞", title: "Embedding", desc: "Maps tokens to real-valued vectors in Euclidean space" },
            { icon: "⊕", title: "Encoder", desc: "12–24 Transformer blocks with full self-attention" },
            { icon: "◎", title: "Task Head", desc: "Decodes representations into token probability distributions" },
          ].map((m) => (
            <div key={m.title} style={card}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{m.title}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <p>
          The tokenizer uses <strong>WordPiece</strong> with a vocabulary of 30,000 sub-word tokens.
          Each token is represented by three summed embeddings: <em>token type</em>, <em>position</em>,
          and <em>segment type</em>. After LayerNorm, this yields a 768-dimensional vector per token for
          BERT BASE.
        </p>
        <p>
          BERT's encoder is parameterized by <Code>L</Code> (layers) and <Code>H</Code> (hidden size),
          with <Code>H/64</Code> attention heads and <Code>4H</Code> feed-forward dimensions. For
          example, BERT BASE is 12L/768H and BERT LARGE is 24L/1024H.
        </p>
      </div>
    ),
  },
  {
    id: "training",
    label: "Training",
    content: (
      <div>
        <p>BERT is pre-trained simultaneously on two self-supervised tasks:</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "1.25rem 0" }}>
          <div style={card}>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>Masked Language Modeling</div>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
              15% of tokens are selected for prediction. Of these: 80% are replaced with{" "}
              <Code>[MASK]</Code>, 10% with a random token, and 10% left unchanged. This teaches
              bidirectional context without dataset shift.
            </p>
          </div>
          <div style={card}>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>Next Sentence Prediction</div>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Given two sentences separated by <Code>[SEP]</Code>, BERT predicts whether the second
              follows the first (<Code>[IsNext]</Code> or <Code>[NotNext]</Code>). Enables understanding
              of inter-sentence relationships.
            </p>
          </div>
        </div>
        <p>
          Pre-training BERT BASE on 4 Cloud TPUs took 4 days (~$500). BERT LARGE required 16 Cloud TPUs
          over the same period.
        </p>
        <p>
          After pre-training, BERT can be fine-tuned efficiently on downstream tasks — sentiment
          classification, question answering, NLI, POS tagging, and more — often with as little as one
          hour on a single Cloud TPU for BERT LARGE.
        </p>
      </div>
    ),
  },
  {
    id: "variants",
    label: "Variants",
    content: (
      <div>
        <p>BERT inspired a broad family of derivatives, each refining a specific dimension:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "1rem" }}>
          {[
            { name: "RoBERTa", year: 2019, note: "Better hyperparameters, no NSP task, larger batches. 355M parameters." },
            { name: "XLM-RoBERTa", year: 2019, note: "Multilingual RoBERTa — one of the first large-scale multilingual LMs." },
            { name: "DistilBERT", year: 2019, note: "60% of BERT BASE's parameters (66M), retains 95% of benchmark scores." },
            { name: "ALBERT", year: 2019, note: "Shared parameters across layers; replaces NSP with sentence-order prediction." },
            { name: "ELECTRA", year: 2020, note: "GAN-style training — a small generator replaces tokens, a discriminator detects them." },
            { name: "DeBERTa", year: 2020, note: "Disentangled attention: keeps positional and token encodings separate across all layers." },
          ].map((v) => (
            <div key={v.name} style={{ display: "flex", gap: 14, padding: "10px 14px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-primary)" }}>
              <div style={{ display: "flex", flexDirection: "column", minWidth: 100 }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>{v.name}</span>
                <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{v.year}</span>
              </div>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{v.note}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "limitations",
    label: "Limitations",
    content: (
      <div>
        <p>
          BERT's encoder-only design precludes text generation. Without a decoder, BERT cannot be
          prompted to continue a sentence — naively masking all future tokens creates a dataset shift
          since such inputs were never seen during training. While more sophisticated generation
          techniques exist, they carry significant computational overhead.
        </p>
        <p>
          Bidirectionality also means BERT requires both sides of a target token during inference.
          Prompting half-formed sequences degrades performance meaningfully.
        </p>
        <p>
          Despite strong benchmark results, the internal representations learned by BERT are not well
          understood. This limitation sparked the "BERTology" sub-field, which uses probing classifiers
          and attention analysis to interpret BERT's behavior.
        </p>
      </div>
    ),
  },
];



function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.85em", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 4, padding: "1px 5px" }}>
      {children}
    </code>
  );
}

export default function BERTArticle() {
  const [active, setActive] = useState("overview");
  const section = sections.find((s) => s.id === active)!;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem", fontFamily: "var(--font-sans)", color: "var(--color-text-primary)" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", color: "var(--color-text-tertiary)", textTransform: "uppercase", marginBottom: 8 }}>
          Google · October 2018
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 500, margin: "0 0 10px", lineHeight: 1.25 }}>
          BERT
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
          Bidirectional Encoder Representations from Transformers
        </p>
      </div>

      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: "1.75rem", paddingBottom: 0 }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 14px",
              fontSize: 14,
              fontWeight: active === s.id ? 500 : 400,
              color: active === s.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              borderBottom: active === s.id ? "2px solid var(--color-text-primary)" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-primary)" }}>
        {section.content}
      </div>

      <div style={{ marginTop: "2.5rem", paddingTop: "1.25rem", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 24, flexWrap: "wrap" }}>
        {[
          { label: "Released", value: "Oct 2018" },
          { label: "Architecture", value: "Encoder-only" },
          { label: "BERT BASE", value: "110M params" },
          { label: "BERT LARGE", value: "340M params" },
        ].map((m) => (
          <div key={m.label}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
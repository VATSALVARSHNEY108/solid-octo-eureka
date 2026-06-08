"use client";

import React from "react";
import { GanVisualizer } from "../../../ganlab-next/src/components/gan/GanVisualizer";

export default function GAN() {
  return (
    <section className="w-full px-12 py-24">
      <div className="mx-auto grid w-full max-w-[1100px] gap-10">
        <header className="grid gap-4">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
            Deep Learning • Generative Models
          </div>
          <h1 className="text-balance text-4xl font-semibold text-[var(--text-primary)] md:text-5xl">
            Generative Adversarial Networks (GANs)
          </h1>
          <p className="max-w-[76ch] text-pretty text-lg text-[var(--text-secondary)]">
            Generative Adversarial Networks (GANs) train two neural networks in a game-theoretic minimax game. 
            The <span className="font-medium">Generator</span> attempts to map random noise to realistic data samples, while the <span className="font-medium">Discriminator</span> learns to classify samples as real (from the dataset) or fake (from the generator).
          </p>
        </header>

        <div className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
            Interactive Playground
          </div>
          <div className="overflow-hidden rounded-md border border-[var(--border-primary)] bg-white p-6">
            <GanVisualizer />
          </div>
          <div className="mt-4 text-xs text-[var(--text-secondary)] leading-relaxed">
            The blue dots represent real samples from the chosen 2D data distribution (e.g., ring, grid, moons). 
            The red dots are fake samples produced by the generator network. The background heatmap shows the discriminators confidence, where blue corresponds to high probability of being real, and red corresponds to high probability of being fake.
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Minimax Objective</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              The generator and discriminator are trained simultaneously by solving the objective function:
            </p>
            <div className="my-4 bg-muted/40 p-3 rounded font-mono text-xs overflow-x-auto text-[var(--text-primary)]">
              min_G max_D V(D, G) = E_x[log D(x)] + E_z[log (1 - D(G(z)))]
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Here, <code className="font-mono">D(x)</code> is the discriminators estimate of the probability that real data instance <code className="font-mono">x</code> is real. <code className="font-mono">G(z)</code> is the generators output given noise <code className="font-mono">z</code>.
            </p>
          </div>

          <div className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Training Tips</h3>
            <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-2 leading-relaxed">
              <li><strong>Discriminator Collapse:</strong> If the discriminator learns too quickly, its loss drops to ~0, meaning it rejects all fake samples perfectly. The generator then receives no useful gradients to learn from.</li>
              <li><strong>Learning Rate & Batch Size:</strong> Try adjusting the learning rate down or increasing batch size if training becomes unstable or if the losses collapse.</li>
              <li><strong>Hidden Units:</strong> Increasing hidden units allows the model to capture more complex distributions, but might require more iterations to converge.</li>
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}

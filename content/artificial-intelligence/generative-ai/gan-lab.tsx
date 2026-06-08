import React from "react";
import { GanVisualizer } from "../../../ganlab-next/src/components/gan/GanVisualizer";

export default function GanLabLesson() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">GAN Lab</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Interactive Generative Adversarial Network playground. Adjust hyper‑parameters, watch the discriminator heat‑map and generator samples evolve in real‑time.
          </p>
        </header>
        <GanVisualizer />
      </div>
    </main>
  );
}

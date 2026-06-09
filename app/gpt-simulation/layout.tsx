import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPT & LLM Simulation Hub",
  description: "Fast-loading simulation page",
};

export default function GPTSimulationLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="antialiased font-sans bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}

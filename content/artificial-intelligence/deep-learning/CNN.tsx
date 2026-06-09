"use client";

import { useEffect, useRef, useState } from "react";
import SimulationSkeleton from "@/components/SimulationSkeleton";

export default function CNN() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const syncHeight = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        const height = Math.max(
          doc.documentElement.scrollHeight,
          doc.body.scrollHeight
        );
        iframe.style.height = `${Math.max(1200, height)}px`;
      } catch {
        // Ignore cross-document access issues from the embedded app.
      }
    };

    const onLoad = () => {
      setLoading(false);
      syncHeight();
    };

    iframe.addEventListener("load", onLoad);
    const timer = window.setInterval(syncHeight, 500);
    window.addEventListener("resize", syncHeight);

    return () => {
      iframe.removeEventListener("load", onLoad);
      window.removeEventListener("resize", syncHeight);
      window.clearInterval(timer);
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
            CNN
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)]">
            Interactive CNN Explainer embed with the same framed lesson style as
            the other AI modules.
          </p>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            If the embed looks cropped, open it in a new tab:{" "}
            <a
              className="underline decoration-[var(--border-subtle)] underline-offset-4 hover:text-[var(--text-primary)]"
              href="/cnn-explainer/index.html"
              target="_blank"
              rel="noreferrer"
            >
              /cnn-explainer/index.html
            </a>
          </p>
        </header>

        <div className="mt-16 rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-premium overflow-hidden relative">
          {loading ? <SimulationSkeleton className="h-[1200px]" /> : null}
          <iframe
            ref={iframeRef}
            src="/cnn-explainer/index.html"
            title="CNN Explainer"
            className="block w-full"
            allow="fullscreen; clipboard-read; clipboard-write"
            style={{
              border: 0,
              height: "1200px",
              visibility: loading ? "hidden" : "visible",
            }}
            onError={() => setLoading(false)}
          />
        </div>
      </div>
    </section>
  );
}

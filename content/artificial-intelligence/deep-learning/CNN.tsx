"use client";

import { useEffect, useRef } from "react";

export default function CNN() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const syncHeight = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;

        // Keep the embedded app interactive; Bulma modals and file inputs need
        // normal document overflow behavior to receive clicks reliably.
        doc.documentElement.style.overflow = "visible";
        doc.body.style.overflow = "visible";
        doc.documentElement.style.background = "#ffffff";
        doc.body.style.background = "#ffffff";
        doc.documentElement.style.colorScheme = "light";

        let styleTag = doc.getElementById("thinkpp-dark-focus");
        if (!styleTag) {
          styleTag = doc.createElement("style");
          styleTag.id = "thinkpp-dark-focus";
          doc.head.appendChild(styleTag);
        }
        styleTag.textContent = `html, body { background:#ffffff !important; color:#111111 !important; color-scheme: light !important; } *:focus-visible { outline:2px solid #111111 !important; outline-offset:2px !important; }`;

        const height = Math.max(
          doc.documentElement.scrollHeight,
          doc.body.scrollHeight
        );
        iframe.style.height = `${height}px`;
      } catch {
        // Ignore cross-document access issues.
      }
    };

    const onLoad = () => syncHeight();
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
    <section className="w-full px-4 py-8 md:px-8">
      <div className="w-full border border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <iframe
          ref={iframeRef}
          src="/cnn-explainer/index.html"
          title="CNN Explainer"
          className="w-full"
          allow="fullscreen; clipboard-read; clipboard-write"
          style={{ border: 0, height: "1200px" }}
        />
      </div>
    </section>
  );
}

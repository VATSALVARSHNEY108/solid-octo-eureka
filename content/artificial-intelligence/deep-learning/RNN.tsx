"use client";

import { useEffect, useRef, useState } from "react";
import SimulationSkeleton from "../../../components/SimulationSkeleton";

export default function RNN() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
      // Sync iframe height to its content
      const syncHeight = () => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            const height = doc.body.scrollHeight;
            iframe.style.height = height + 'px';
          }
        } catch (e) {
          console.error('Failed to sync iframe height', e);
        }
      };
      const interval = setInterval(syncHeight, 500);
      return () => {
        iframe.removeEventListener('load', handleLoad);
        clearInterval(interval);
      };
    }
  }, []);

  return (
    <section className="w-full px-4 py-8 md:px-8">
      <div className="w-full border border-[var(--border-primary)] bg-[var(--bg-primary)] relative">
        {loading && <SimulationSkeleton className="h-[1200px]" />}
        <iframe
          ref={iframeRef}
          src="/intro-to-rnn/index.html"
          title="Intro to RNN Explainer"
          className="w-full"
          style={{ border: 0, height: "1200px", visibility: loading ? "hidden" : "visible" }}
          onError={() => { console.error('Failed to load IntroToRNN'); setLoading(false); }}
        />
        <a href="/intro-to-rnn/index.html" target="_blank" className="mt-4 inline-block bg-[var(--bg-primary)] text-[var(--text-primary)] py-2 px-4 rounded hover:bg-[var(--bg-secondary)] transition-colors">Open IntroToRNN in New Tab</a>
      </div>
    </section>
  );
}

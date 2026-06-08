import React, { useEffect, useRef } from 'react';

/**
 * Formula component renders LaTeX math using MathJax.
 * It loads MathJax from CDN if not already present and typesets the given TeX string.
 * The `tex` prop should contain LaTeX expression without delimiters.
 */
export const Formula: React.FC<{ tex: string; block?: boolean }> = ({ tex, block = false }) => {
  const elRef = useRef<HTMLDivElement>(null);

  const [mathJaxReady, setMathJaxReady] = React.useState(false);

    // Load MathJax script once with configuration
    useEffect(() => {
      if (typeof window === 'undefined') return;
      // Define MathJax configuration before loading script
      (window as any).MathJax = {
        tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
        svg: { fontCache: 'global' },
        startup: { typeset: false }, // prevent auto typeset before we are ready
      };
      if ((window as any).MathJax && (window as any).MathJax.typesetPromise) {
        setMathJaxReady(true);
        return;
      }
      const existingScript = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => setMathJaxReady(true));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.onload = () => setMathJaxReady(true);
      document.head.appendChild(script);
    }, []);

  // Typeset when tex changes and MathJax is ready
  useEffect(() => {
    if (!mathJaxReady) return;
    const el = elRef.current;
    if (!el) return;
    const content = block ? `$$${tex}$$` : `$${tex}$`;
    el.innerHTML = content;
    (window as any).MathJax.typesetPromise([el]).catch((err: any) => console.error('MathJax typeset error:', err));
  }, [tex, block, mathJaxReady]);

  return <div ref={elRef} className="formula" />;
};

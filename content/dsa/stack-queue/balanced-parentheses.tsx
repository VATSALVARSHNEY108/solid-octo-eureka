"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BalancedParenthesesLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  const router = useRouter();

  // Redirect to valid parentheses
  useEffect(() => {
    router.replace('/dsa/stack-queue/valid-parentheses');
  }, [router]);

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <h1>Redirecting...</h1>
          <p className="description">Redirecting to Valid Parentheses.</p>
        </div>
      </section>
      <style jsx>{`
        .page { --bg: #0a0d14; --text: #e5e7eb; min-height: 100vh; background: var(--bg); color: var(--text); font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; }
        .page[data-theme="light"] { --bg: #f7f9fc; --text: #172033; }
        .hero h1 { font-size: 32px; font-weight: 800; }
        .description { font-size: 16px; color: #98a2b3; margin-top: 10px; }
      `}</style>
    </main>
  );
}

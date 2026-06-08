"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

type MLHeroBackdropProps = {
  accent?: "cyan" | "purple" | "indigo";
};

type Blob = {
  id: string;
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

function pickAccent(accent: MLHeroBackdropProps["accent"]) {
  if (accent === "cyan") return { a: "rgba(34,211,238,0.55)", b: "rgba(6,182,212,0.1)" };
  if (accent === "purple") return { a: "rgba(168,85,247,0.55)", b: "rgba(168,85,247,0.1)" };
  return { a: "rgba(99,102,241,0.55)", b: "rgba(99,102,241,0.1)" };
}

export function MLHeroBackdrop({ accent = "indigo" }: MLHeroBackdropProps) {
  const blobs = useMemo<Blob[]>(() => {
    // Fixed layout so hydration stays stable.
    const base: Blob[] = [
      { id: "b1", left: "12%", top: "22%", size: 260, delay: 0.0, duration: 7.2, opacity: 0.85 },
      { id: "b2", left: "68%", top: "18%", size: 220, delay: 0.4, duration: 8.6, opacity: 0.65 },
      { id: "b3", left: "52%", top: "58%", size: 320, delay: 0.2, duration: 10.2, opacity: 0.55 },
      { id: "b4", left: "16%", top: "62%", size: 200, delay: 0.6, duration: 9.0, opacity: 0.45 },
    ];
    return base;
  }, []);

  const { a, b } = pickAccent(accent);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(800px circle at var(--mouse-x-pc) var(--mouse-y-pc), rgba(99,102,241,0.08), transparent 45%)",
        }}
      />

      {blobs.map((bl) => (
        <motion.div
          key={bl.id}
          className="absolute rounded-full blur-[40px]"
          style={{
            left: bl.left,
            top: bl.top,
            width: bl.size,
            height: bl.size,
            background: `radial-gradient(circle at 30% 20%, ${a}, ${b} 55%, transparent 70%)`,
            opacity: bl.opacity,
          }}
          initial={{ scale: 0.9, y: 12, x: -10 }}
          animate={{ scale: 1.05, y: -10, x: 10 }}
          transition={{
            duration: bl.duration,
            delay: bl.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Fine grid shimmer */}
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute inset-0 shimmer-bg opacity-[0.18]" />
    </div>
  );
}


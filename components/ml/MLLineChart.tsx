"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MLLineChartProps = {
  values: number[];
  height?: number;
  width?: number;
  stroke?: string;
  currentIndex?: number;
  className?: string;
  yLabel?: string;
};

function buildPath(values: number[], w: number, h: number, pad = 10) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const pts = values.map((v, i) => {
    const x = pad + (i / Math.max(1, values.length - 1)) * innerW;
    const y = pad + (1 - (v - min) / span) * innerH;
    return { x, y };
  });

  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
}

export function MLLineChart({
  values,
  height = 160,
  width = 520,
  stroke = "rgb(99,102,241)",
  currentIndex,
  className,
}: MLLineChartProps) {
  const { path, currentPoint, min, max } = useMemo(() => {
    if (values.length === 0) {
      return { path: "", currentPoint: null as null | { x: number; y: number }, min: 0, max: 0 };
    }

    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const span = maxV - minV || 1;

    const pad = 10;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;

    const pts = values.map((v, i) => {
      const x = pad + (i / Math.max(1, values.length - 1)) * innerW;
      const y = pad + (1 - (v - minV) / span) * innerH;
      return { x, y };
    });

    const p = pts.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`).join(" ");
    const idx = currentIndex == null ? values.length - 1 : Math.min(values.length - 1, Math.max(0, currentIndex));
    const cp = pts[idx] ?? null;
    return { path: p, currentPoint: cp, min: minV, max: maxV };
  }, [values, width, height, currentIndex]);

  return (
    <div className={cn("rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/20 overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-[var(--border-subtle)] text-[10px] font-black uppercase tracking-[0.35em] text-[var(--text-muted)]">
        Chart
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <line x1={10} y1={height / 2} x2={width - 10} y2={height / 2} stroke="rgba(255,255,255,0.08)" />
        <path d={path} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
        {currentPoint ? (
          <motion.circle
            key={`${currentPoint.x}-${currentPoint.y}-${currentIndex ?? values.length - 1}`}
            cx={currentPoint.x}
            cy={currentPoint.y}
            r={5.5}
            fill={stroke}
            initial={{ scale: 0.6, opacity: 0.3 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
          />
        ) : null}
        <text x={width - 12} y={18} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.65)">
          {Number.isFinite(min) && Number.isFinite(max) ? `${min.toFixed(2)} - ${max.toFixed(2)}` : ""}
        </text>
      </svg>
    </div>
  );
}


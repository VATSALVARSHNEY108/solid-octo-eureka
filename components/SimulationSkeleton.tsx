"use client";

import React from "react";
import TetrisLoading from "./ui/tetris-loader";

export function SimulationSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className="h-[calc(100vh-200px)] w-full flex flex-col items-center justify-center p-6 bg-[var(--bg-primary)]">
      <TetrisLoading size="lg" speed="normal" loadingText="Loading Lab..." />
    </div>
  );
}

export default SimulationSkeleton;

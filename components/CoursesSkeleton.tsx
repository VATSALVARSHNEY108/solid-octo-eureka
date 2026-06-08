"use client";

import React from "react";
import TetrisLoading from "./ui/tetris-loader";

export function CoursesSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
      <TetrisLoading size="lg" speed="normal" loadingText="Loading Courses..." />
    </div>
  );
}

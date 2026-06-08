"use client";

import React from "react";
import { TheorySection } from "../../../components/TheorySection";

export default function Ipv4Classes() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <TheorySection 
        title="Ipv4 Classes"
        definition="This section covers Ipv4 Classes."
        timeComplexity="O(1)"
        spaceComplexity="O(1)"
        keyPoints={["Key Point 1", "Key Point 2"]}
      />
    </div>
  );
}

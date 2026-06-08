"use client";

import React from "react";
import { TheorySection } from "../../../components/TheorySection";

export default function Phishing() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <TheorySection 
        title="Phishing"
        definition="This section covers Phishing."
        timeComplexity="O(1)"
        spaceComplexity="O(1)"
        keyPoints={["Key Point 1", "Key Point 2"]}
      />
    </div>
  );
}

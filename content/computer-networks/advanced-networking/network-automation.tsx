"use client";

import React from "react";
import { TheorySection } from "../../../components/TheorySection";

export default function NetworkAutomation() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <TheorySection 
        title="Network Automation"
        definition="This section covers Network Automation."
        timeComplexity="O(1)"
        spaceComplexity="O(1)"
        keyPoints={["Key Point 1", "Key Point 2"]}
      />
    </div>
  );
}

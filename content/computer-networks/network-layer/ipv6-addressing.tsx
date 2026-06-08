"use client";

import React from "react";
import { TheorySection } from "../../../components/TheorySection";

export default function Ipv6Addressing() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <TheorySection 
        title="Ipv6 Addressing"
        definition="This section covers Ipv6 Addressing."
        timeComplexity="O(1)"
        spaceComplexity="O(1)"
        keyPoints={["Key Point 1", "Key Point 2"]}
      />
    </div>
  );
}

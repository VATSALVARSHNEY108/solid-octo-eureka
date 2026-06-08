"use client";

import React from "react";
import { TheorySection } from "../../../components/TheorySection";

export default function AsymmetricEncryption() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <TheorySection 
        title="Asymmetric Encryption"
        definition="This section covers Asymmetric Encryption."
        timeComplexity="O(1)"
        spaceComplexity="O(1)"
        keyPoints={["Key Point 1", "Key Point 2"]}
      />
    </div>
  );
}

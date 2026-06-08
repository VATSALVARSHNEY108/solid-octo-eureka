"use client";

import React, { useState } from "react";
import { Play, Pause, RotateCcw, ChevronRight, AlertCircle, Cpu, Layout, HelpCircle } from "lucide-react";
interface Formula {
  expr: string;
  description: string;
}

interface Parameter {
  name: string;
  default: string;
  description: string;
}

export interface ConceptPageProps {
  title?: string;
  theory?: React.ReactNode;
  mathematics?: React.ReactNode;
  intuition?: React.ReactNode;
  visualization?: React.ReactNode;
  lesson?: {
    title: string;
    theory: string | React.ReactNode;
    formulas?: Formula[];
    visualIntuition?: string | React.ReactNode;
    visualization?: React.ReactNode;
    parameters?: Parameter[];
    failureCases?: string | React.ReactNode;
    applications?: string | React.ReactNode;
    keyCharacteristics?: { title: string; desc: string }[];
    comparisonTable?: { headers: string[]; rows: string[][] };
    commonMistakes?: string[];
  };
}

export default function ConceptPage(props: ConceptPageProps) {
  // Debug: log lesson data to identify missing arrays
  if (process.env.NODE_ENV === 'development') {
    console.log('ConceptPage received props:', props);
    console.log('lesson object:', props.lesson);
    console.log('comparisonTable:', props.lesson?.comparisonTable);
    console.log('keyCharacteristics:', props.lesson?.keyCharacteristics);
    console.log('commonMistakes:', props.lesson?.commonMistakes);
  }
  // Normalize parameters
  const isLessonObj = !!props.lesson;
  const title = isLessonObj ? props.lesson?.title : props.title;
  const theory = isLessonObj ? props.lesson?.theory : props.theory;
  const visualIntuition = isLessonObj ? props.lesson?.visualIntuition : props.intuition;
  const visualization = isLessonObj ? props.lesson?.visualization : props.visualization;
  const formulas = props.lesson?.formulas || [];
  const parameters = props.lesson?.parameters || [];
  const failureCases = props.lesson?.failureCases;
  const applications = props.lesson?.applications;
  const keyCharacteristics = props.lesson?.keyCharacteristics;
  const comparisonTable = props.lesson?.comparisonTable;
  const commonMistakes = props.lesson?.commonMistakes;

  // Decide if this is a dynamic page (has visualization) or static page
  const isDynamic = !!visualization;

  // Navigation steps for progressive flow
  const sections = isDynamic
    ? [
        { id: "theory", label: "1. Concept Theory" },
        { id: "math", label: "2. Mathematical Logic" },
        { id: "intuition", label: "3. Visual Intuition" },
        { id: "interactive", label: "4. Interactive Simulation" },
        { id: "parameters", label: "5. Parameter Effects" },
        { id: "failures", label: "6. Failure Modes" },
        { id: "applications", label: "7. Applications" },
      ]
    : [
        { id: "theory", label: "1. Concept Theory" },
        { id: "characteristics", label: "2. Key Characteristics" },
        { id: "math", label: "3. Formulas & Rules" },
        { id: "illustration", label: "4. Illustration" },
        { id: "comparison", label: "5. Comparison" },
        { id: "applications", label: "6. Applications" },
        { id: "mistakes", label: "7. Common Mistakes" },
      ];

  const [activeSection, setActiveSection] = useState(sections[0].id);

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Top Banner Header */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50 backdrop-blur-md sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-orange-100 text-orange-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold border border-orange-200 dark:border-blue-800">
            {isDynamic ? "Interactive" : "Core Theory"}
          </span>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>
        
        {/* Navigation Dots/Tabs */}
        <div className="hidden lg:flex space-x-1 p-1 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-color)]">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                activeSection === sec.id
                  ? "bg-white text-black shadow-sm dark:bg-zinc-800 dark:text-white border border-[var(--border-color)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {sec.label.split(". ")[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Flow Navigation Tracker (Symmetric Layout Indicator) */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-4">
                  Learning Journey
                </h3>
                <div className="space-y-4">
                  {sections.map((sec, idx) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => scrollTo(sec.id)}
                        className="flex items-center w-full group text-left"
                      >
                        <div className="flex flex-col items-center mr-3.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border transition-all duration-300 ${
                              isActive
                                ? "bg-orange-500 text-white border-orange-500 dark:bg-[#012bea] dark:border-[#012bea] dark:text-white"
                                : "bg-[var(--bg-elevated)] border-[var(--border-color)] text-[var(--text-secondary)] group-hover:border-[var(--text-primary)]"
                            }`}
                          >
                            {idx + 1}
                          </div>
                          {idx < sections.length - 1 && (
                            <div className="w-0.5 h-6 bg-[var(--border-color)] my-1" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "text-orange-600 dark:text-blue-400 font-semibold"
                              : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {sec.label.split(". ")[1]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout Area */}
          <div className="lg:col-span-9 space-y-16">
            
            {/* 1. CONCEPT THEORY */}
            <section id="theory" className="scroll-mt-24 space-y-6">
              <div className="border-b border-[var(--border-color)] pb-3">
                <h2 className="text-2xl font-bold tracking-tight">Concept Theory</h2>
              </div>
              <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-[var(--text-secondary)] space-y-4">
                {typeof theory === "string" ? (
                  <p className="whitespace-pre-line">{theory}</p>
                ) : (
                  theory
                )}
              </div>
            </section>

            {/* STATIC / DYNAMIC CONCEPTS ADAPTATION */}
            {isDynamic ? (
              <>
                {/* 2. FORMULA / MATHEMATICAL LOGIC */}
                <section id="math" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <h2 className="text-2xl font-bold tracking-tight">Mathematical Logic</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formulas.length > 0 ? (
                      formulas.map((f, i) => (
                        <div
                          key={i}
                          className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="bg-orange-50 dark:bg-blue-950/20 px-4 py-3 rounded-lg border border-orange-100 dark:border-blue-900/30 text-center mb-4 min-h-[56px] flex items-center justify-center">
                            {typeof f.expr === "string" ? (
                              <code className="text-base font-mono text-orange-600 dark:text-blue-400">
                                {f.expr}
                              </code>
                            ) : (
                              <div className="text-lg font-serif text-orange-600 dark:text-blue-400 select-all select-text">
                                {f.expr}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{f.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="md:col-span-2 p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)]">
                        {props.mathematics || <p>No specific math constraints listed.</p>}
                      </div>
                    )}
                  </div>
                </section>

                {/* 3. VISUAL INTUITION */}
                <section id="intuition" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <h2 className="text-2xl font-bold tracking-tight">Visual Intuition</h2>
                  </div>
                  <div className="p-6 bg-gradient-to-tr from-[var(--bg-secondary)] to-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl flex items-start space-x-4">
                    <div className="p-2.5 bg-orange-100 dark:bg-blue-950/40 rounded-lg text-orange-600 dark:text-blue-400 mt-1">
                      <Cpu size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Mental Analogy</h4>
                      <div className="text-[var(--text-secondary)] leading-relaxed">
                        {visualIntuition}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. INTERACTIVE VISUALIZATION AREA */}
                <section id="interactive" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <h2 className="text-2xl font-bold tracking-tight">Interactive Simulation</h2>
                  </div>
                  {visualization}
                </section>

                {/* 5. PARAMETER EFFECTS */}
                <section id="parameters" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <h2 className="text-2xl font-bold tracking-tight">Parameter Effects</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parameters.length > 0 ? (
                      parameters.map((p, i) => (
                        <div
                          key={i}
                          className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm font-semibold">{p.name}</span>
                            <span className="text-xs px-2 py-0.5 bg-[var(--bg-elevated)] rounded border border-[var(--border-color)] font-mono">
                              Default: {p.default}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{p.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[var(--text-secondary)] md:col-span-2">
                        Adjust parameters in the interactive simulator above to see the real-time effects on behavior.
                      </p>
                    )}
                  </div>
                </section>

                {/* 6. FAILURE CASES */}
                <section id="failures" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <h2 className="text-2xl font-bold tracking-tight text-red-500 dark:text-red-400">
                      Failure Modes & Limits
                    </h2>
                  </div>
                  <div className="p-6 bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start space-x-4">
                    <div className="p-2 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg mt-1">
                      <AlertCircle size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                        Edge Cases & Instabilities
                      </h4>
                      <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {failureCases}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* STATIC SPECIFIC LAYOUT */}

                {/* 2. KEY CHARACTERISTICS */}
                <section id="characteristics" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <h2 className="text-2xl font-bold tracking-tight">Key Characteristics</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keyCharacteristics?.map((char, i) => (
                      <div
                        key={i}
                        className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl"
                      >
                        <h4 className="font-bold text-sm uppercase tracking-wide text-orange-600 dark:text-blue-400 mb-2">
                          {char.title}
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)]">{char.desc}</p>
                      </div>
                    )) || (
                      <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl md:col-span-2 text-[var(--text-secondary)] text-sm">
                        This concept features high structural permanence, logical sequence mapping, and mathematical definitions.
                      </div>
                    )}
                  </div>
                </section>

                {/* 3. FORMULAS & RULES */}
                <section id="math" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <h2 className="text-2xl font-bold tracking-tight">Important Formulas & Axioms</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formulas.length > 0 ? (
                      formulas.map((f, i) => (
                        <div
                          key={i}
                          className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl"
                        >
                          <div className="bg-orange-50 dark:bg-blue-950/20 px-4 py-3 rounded-lg border border-orange-100 dark:border-blue-900/30 text-center mb-4 min-h-[56px] flex items-center justify-center">
                            {typeof f.expr === "string" ? (
                              <code className="text-base font-mono text-orange-600 dark:text-blue-400">
                                {f.expr}
                              </code>
                            ) : (
                              <div className="text-lg font-serif text-orange-600 dark:text-blue-400 select-all select-text">
                                {f.expr}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{f.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="md:col-span-2 p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] text-sm">
                        No active formula bounds are specified for this logic-based topic.
                      </div>
                    )}
                  </div>
                </section>

                {/* 4. STATIC ILLUSTRATION */}
                <section id="illustration" className="scroll-mt-24 space-y-6">
                  <div className="border-b border-[var(--border-color)] pb-3">
                    <h2 className="text-2xl font-bold tracking-tight">Visual Diagram & Structure</h2>
                  </div>
                  <div className="p-6 bg-gradient-to-tr from-[var(--bg-secondary)] to-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl">
                    {visualIntuition ? (
                      <div className="text-[var(--text-secondary)] leading-relaxed text-sm">
                        {visualIntuition}
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center border border-dashed border-[var(--border-color)] rounded-lg text-sm text-[var(--text-secondary)]">
                        Static illustration of core relational definitions
                      </div>
                    )}
                  </div>
                </section>

                {/* 5. COMPARISON TABLES */}
                {comparisonTable && (
                  <section id="comparison" className="scroll-mt-24 space-y-6">
                    <div className="border-b border-[var(--border-color)] pb-3">
                      <h2 className="text-2xl font-bold tracking-tight">Core Comparison</h2>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
                      <table className="min-w-full divide-y divide-[var(--border-color)] text-sm">
                        <thead className="bg-[var(--bg-secondary)]">
                          <tr>
                            {comparisonTable?.headers?.map?.((h, i) => (
                              <th
                                key={i}
                                className="px-6 py-3.5 text-left font-semibold text-[var(--text-primary)]"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-primary)]">
                          {comparisonTable?.rows?.map?.((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[var(--bg-secondary)]/30">
                              {row?.map?.((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="px-6 py-4 text-[var(--text-secondary)] whitespace-pre-line"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </>
            )}

            {/* 7. REAL-WORLD APPLICATIONS */}
            <section id="applications" className="scroll-mt-24 space-y-6">
              <div className="border-b border-[var(--border-color)] pb-3">
                <h2 className="text-2xl font-bold tracking-tight">Real-World Engineering</h2>
              </div>
              <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-4">
                {typeof applications === "string" ? (
                  <p className="text-[var(--text-secondary)] whitespace-pre-line">{applications}</p>
                ) : (
                  applications
                )}
              </div>
            </section>

            {/* STATIC SPECIFIC MISTAKES SECTION */}
            {!isDynamic && commonMistakes && (
              <section id="mistakes" className="scroll-mt-24 space-y-6">
                <div className="border-b border-[var(--border-color)] pb-3">
                  <h2 className="text-2xl font-bold tracking-tight text-orange-600 dark:text-red-400">
                    Important Notes & Common Pitfalls
                  </h2>
                </div>
                <div className="p-6 bg-orange-50/30 dark:bg-red-950/10 border border-orange-200 dark:border-red-900/30 rounded-xl space-y-3">
                  {commonMistakes?.map((mistake, i) => (
                    <div key={i} className="flex items-start space-x-3 text-sm">
                      <div className="text-orange-500 dark:text-red-400 font-bold mt-0.5">⚠️</div>
                      <p className="text-[var(--text-secondary)] leading-relaxed">{mistake}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

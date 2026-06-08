import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section className="mb-12 last:mb-0">
    <h2 className="text-2xl font-semibold mb-4 text-var(--text-primary)">{title}</h2>
    <div className="prose prose-sm max-w-none text-var(--text-secondary)">{children}</div>
  </section>
);

export interface ConceptPageProps {
  /** Lesson title */
  title: string;
  /** Ordered sections of the learning flow */
  sections: { id: string; title: string; content: React.ReactNode }[];
  /** Optional side navigation items */
  navItems?: { id: string; label: string }[];
}

/**
 * A highly structured page that guides learners through a progressive learning flow:
 * 1. Theory
 * 2. Formula / Mathematical description
 * 3. Visual Intuition
 * 4. Interactive Visualization
 * 5. Parameter Effects
 * 6. Failure Cases
 * 7. Real‑World Applications
 *
 * The component respects the project's design system – colors are defined via CSS variables
 * (e.g. `--bg-primary`, `--text-primary`). Light mode uses subtle orange accents, dark mode uses
 * `#012bea` for active states.
 */
export const ConceptPage: React.FC<ConceptPageProps> = ({ title, sections, navItems }) => {
  return (
    <div className="px-12 py-24 mx-auto max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-var(--text-primary) mb-2">{title}</h1>
      </header>
      {navItems && (
        <nav className="sticky top-0 bg-var(--bg-primary) py-2 mb-8 border-b border-var(--border) z-10">
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-var(--text-secondary) hover:text-var(--accent) transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {sections.map((sec) => (
        <Section key={sec.id} title={sec.title}>
          {sec.content}
        </Section>
      ))}
    </div>
  );
};

export default ConceptPage;

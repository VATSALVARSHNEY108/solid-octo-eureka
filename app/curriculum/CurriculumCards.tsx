// app/curriculum/CurriculumCards.tsx
"use client";

import Link from "next/link";
import {
  BookOpen, Layers, Brain, Network, Cpu, Monitor,
  CircuitBoard, Radio, Waves, Database, Gauge, Code, Zap,
  ArrowUpRight,
} from "lucide-react";
import { Subject } from "@/lib/content-types";
import { SUBJECT_META } from "@/lib/content-registry";

// ── Per-subject chromatic identity ───────────────────────────────────────────

const SUBJECT_PALETTE: Record<string, {
  icon: React.ElementType;
  grad: [string, string];   // gradient stops
  glow: string;             // box-shadow color
  tag: string;              // short label
}> = {
  "dsa": {
    icon: Zap,
    grad: ["#fbbf24", "#f59e0b"],
    glow: "#f59e0b",
    tag: "Algorithms",
  },
  "artificial-intelligence": {
    icon: Brain,
    grad: ["#c084fc", "#a855f7"],
    glow: "#a855f7",
    tag: "AI / ML",
  },
  "computer-networks": {
    icon: Network,
    grad: ["#22d3ee", "#06b6d4"],
    glow: "#06b6d4",
    tag: "Networking",
  },
  "computer-organization-and-architecture": {
    icon: Cpu,
    grad: ["#34d399", "#10b981"],
    glow: "#10b981",
    tag: "Architecture",
  },
  "operating-system": {
    icon: Monitor,
    grad: ["#60a5fa", "#3b82f6"],
    glow: "#3b82f6",
    tag: "Systems",
  },
  "digital-electronics": {
    icon: CircuitBoard,
    grad: ["#f472b6", "#ec4899"],
    glow: "#ec4899",
    tag: "Electronics",
  },
  "communication-systems": {
    icon: Radio,
    grad: ["#fb923c", "#f97316"],
    glow: "#f97316",
    tag: "Comms",
  },
  "signals-and-systems": {
    icon: Waves,
    grad: ["#2dd4bf", "#14b8a6"],
    glow: "#14b8a6",
    tag: "Signals",
  },
  "database-management-system": {
    icon: Database,
    grad: ["#818cf8", "#6366f1"],
    glow: "#6366f1",
    tag: "DBMS",
  },
  "control-systems": {
    icon: Gauge,
    grad: ["#f87171", "#ef4444"],
    glow: "#ef4444",
    tag: "Control",
  },
  "compiler-design": {
    icon: Code,
    grad: ["#a3e635", "#84cc16"],
    glow: "#84cc16",
    tag: "Compilers",
  },
};

const FALLBACK_PALETTE = {
  icon: Layers,
  grad: ["#94a3b8", "#64748b"] as [string, string],
  glow: "#64748b",
  tag: "Subject",
};

// ── Card component ────────────────────────────────────────────────────────────

function SubjectCard({
  subject,
  index,
}: {
  subject: Subject;
  index: number;
}) {
  const p = SUBJECT_PALETTE[subject.id] ?? FALLBACK_PALETTE;
  const Icon = p.icon;
  const topicCount = subject.topics?.length ?? 0;
  const [g1, g2] = p.grad;

  return (
    <Link
      href={`/curriculum/${subject.id}`}
      id={`subject-${subject.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "linear-gradient(145deg, #0f1117 0%, #13161f 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        textDecoration: "none",
        animation: `cardReveal 0.5s cubic-bezier(0.22,1,0.36,1) both`,
        animationDelay: `${index * 60}ms`,
        transition: "box-shadow 0.4s ease, border-color 0.4s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = `0 0 0 1px ${p.glow}55, 0 8px 40px ${p.glow}22, 0 24px 60px rgba(0,0,0,0.5)`;
        el.style.borderColor = `${p.glow}44`;
        el.style.transform = "translateY(-4px) scale(1.01)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "none";
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.transform = "translateY(0) scale(1)";
      }}
    >
      {/* ── Chromatic top bar ── */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{
          background: `linear-gradient(90deg, ${g1}, ${g2})`,
          boxShadow: `0 0 12px ${p.glow}88`,
        }}
      />

      {/* ── Subtle corner glow ── */}
      <div
        className="absolute top-0 right-0 pointer-events-none rounded-tr-2xl"
        style={{
          width: 160,
          height: 160,
          background: `radial-gradient(ellipse at top right, ${p.glow}0f 0%, transparent 65%)`,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* ── Scan-line shimmer (visible on hover via group) ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(
            180deg,
            transparent 0%,
            ${p.glow}06 49%,
            ${p.glow}0c 50%,
            transparent 51%
          )`,
          backgroundSize: "100% 8px",
          animation: "scanline 3s linear infinite",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ── Card body ── */}
      <div className="relative flex flex-col gap-4 p-5 flex-1">

        {/* Icon + tag row */}
        <div className="flex items-start justify-between">
          <div
            className="relative flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              background: `linear-gradient(135deg, ${g1}20, ${g2}30)`,
              border: `1px solid ${p.glow}33`,
            }}
          >
            {/* Subtle icon glow */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle, ${p.glow}22 0%, transparent 70%)`,
                transition: "opacity 0.35s",
              }}
            />
            <Icon
              size={20}
              style={{
                background: `linear-gradient(135deg, ${g1}, ${g2})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: `drop-shadow(0 0 4px ${p.glow}66)`,
              }}
            />
          </div>

          {/* Tag chip */}
          <span
            className="rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${g1}18, ${g2}25)`,
              border: `1px solid ${p.glow}30`,
              color: p.glow,
              letterSpacing: "0.12em",
            }}
          >
            {p.tag}
          </span>
        </div>

        {/* Title */}
        <div className="flex-1">
          <h3
            className="font-bold leading-snug mb-2"
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.01em",
            }}
          >
            {subject.name}
          </h3>
          <p
            className="leading-relaxed line-clamp-2"
            style={{
              fontSize: 12.5,
              color: "rgba(255,255,255,0.38)",
              lineHeight: 1.65,
            }}
          >
            {subject.description || `Explore the ${subject.name} curriculum with interactive lessons and challenges.`}
          </p>
        </div>

        {/* ── Footer ── */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Topic pill */}
          <div className="flex items-center gap-1.5">
            <div
              className="rounded-full"
              style={{
                width: 5, height: 5,
                background: p.glow,
                boxShadow: `0 0 5px ${p.glow}`,
              }}
            />
            <span
              style={{
                fontSize: 10.5,
                color: "rgba(255,255,255,0.35)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {topicCount} {topicCount === 1 ? "topic" : "topics"}
            </span>
          </div>

          {/* Arrow CTA */}
          <div
            className="flex items-center gap-1 rounded-full px-3 py-1 opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(135deg, ${g1}, ${g2})`,
              transform: "translateX(4px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              fontSize: 10,
              fontWeight: 800,
              color: "#000",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
            // inline style for transform animation on group-hover can't be CSS-only,
            // so we piggyback on the opacity toggle above with JS:
            ref={(el) => {
              if (!el) return;
              const parent = el.closest("a");
              if (!parent) return;
              const show = () => { el.style.transform = "translateX(0)"; };
              const hide = () => { el.style.transform = "translateX(4px)"; };
              parent.addEventListener("mouseenter", show);
              parent.addEventListener("mouseleave", hide);
            }}
          >
            Explore <ArrowUpRight size={10} />
          </div>
        </div>
      </div>

      {/* ── Index number watermark ── */}
      <div
        className="absolute bottom-4 right-5 font-black pointer-events-none select-none"
        style={{
          fontSize: 56,
          lineHeight: 1,
          color: "rgba(255,255,255,0.025)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.04em",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    </Link>
  );
}

// ── Main grid ─────────────────────────────────────────────────────────────────

export default function CurriculumCards({ subjects }: { subjects: Subject[] }) {
  return (
    <>
      <style>{`
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes scanline {
          from { background-position: 0 0; }
          to   { background-position: 0 100%; }
        }
      `}</style>

      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
        }}
      >
        {subjects.map((subject, i) => (
          <SubjectCard key={subject.id} subject={subject} index={i} />
        ))}
      </div>
    </>
  );
}
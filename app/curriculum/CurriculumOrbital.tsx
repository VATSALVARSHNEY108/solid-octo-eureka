"use client";

import { useRouter } from "next/navigation";
import {
  Brain,
  Network,
  Cpu,
  Monitor,
  CircuitBoard,
  Radio,
  Waves,
  Database,
  Gauge,
  Code,
  Zap,
} from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

// Map subject IDs to lucide icons and metadata
const SUBJECT_ICON_MAP: Record<string, React.ElementType> = {
  dsa: Zap,
  "artificial-intelligence": Brain,
  "computer-networks": Network,
  "computer-organization-and-architecture": Cpu,
  "operating-system": Monitor,
  "digital-electronics": CircuitBoard,
  "communication-systems": Radio,
  "signals-and-systems": Waves,
  "database-management-system": Database,
  "control-systems": Gauge,
  "compiler-design": Code,
};

const SUBJECT_ENERGY: Record<string, number> = {
  dsa: 95,
  "artificial-intelligence": 90,
  "computer-networks": 75,
  "computer-organization-and-architecture": 70,
  "operating-system": 80,
  "digital-electronics": 65,
  "communication-systems": 55,
  "signals-and-systems": 60,
  "database-management-system": 72,
  "control-systems": 50,
  "compiler-design": 68,
};

const SUBJECT_STATUS: Record<string, "completed" | "in-progress" | "pending"> = {
  dsa: "in-progress",
  "artificial-intelligence": "in-progress",
  "computer-networks": "in-progress",
  "computer-organization-and-architecture": "in-progress",
  "operating-system": "in-progress",
  "digital-electronics": "in-progress",
  "communication-systems": "pending",
  "signals-and-systems": "pending",
  "database-management-system": "in-progress",
  "control-systems": "pending",
  "compiler-design": "pending",
};

// Build related IDs based on conceptual connections between subjects
const SUBJECT_RELATIONS: Record<string, string[]> = {
  dsa: ["artificial-intelligence", "compiler-design"],
  "artificial-intelligence": ["dsa", "signals-and-systems"],
  "computer-networks": ["operating-system", "communication-systems"],
  "computer-organization-and-architecture": ["digital-electronics", "operating-system"],
  "operating-system": ["computer-organization-and-architecture", "computer-networks"],
  "digital-electronics": ["computer-organization-and-architecture", "signals-and-systems"],
  "communication-systems": ["signals-and-systems", "computer-networks"],
  "signals-and-systems": ["communication-systems", "control-systems"],
  "database-management-system": ["dsa", "operating-system"],
  "control-systems": ["signals-and-systems"],
  "compiler-design": ["dsa"],
};

interface SubjectInfo {
  id: string;
  name: string;
  description?: string;
}

interface CurriculumOrbitalProps {
  subjects: SubjectInfo[];
}

export default function CurriculumOrbital({ subjects }: CurriculumOrbitalProps) {
  const router = useRouter();

  // Build timeline data from subjects
  const timelineData = subjects.map((subject, index) => {
    const relatedSubjectIds = SUBJECT_RELATIONS[subject.id] || [];
    const relatedIds = relatedSubjectIds
      .map((relId) => {
        const relIndex = subjects.findIndex((s) => s.id === relId);
        return relIndex >= 0 ? relIndex + 1 : -1;
      })
      .filter((id) => id > 0);

    return {
      id: index + 1,
      title: subject.name,
      date: subject.id,
      content: subject.description || `Explore the ${subject.name} curriculum with interactive lessons and simulations.`,
      category: subject.name,
      icon: SUBJECT_ICON_MAP[subject.id] || Code,
      relatedIds,
      status: SUBJECT_STATUS[subject.id] || ("pending" as const),
      energy: SUBJECT_ENERGY[subject.id] || 50,
    };
  });

  return <RadialOrbitalTimeline timelineData={timelineData} />;
}

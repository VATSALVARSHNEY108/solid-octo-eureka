// app/curriculum/page.tsx
import { getSubjectsFromFS } from "@/lib/content-registry.server";
import CurriculumCards from "./CurriculumCards";

export default async function CurriculumHome() {
  const subjects = await getSubjectsFromFS();
  return (
    <div className="relative min-h-screen selection:bg-indigo-500/30">
      <div className="section-container pt-24 pb-20">
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/70 backdrop-blur-xl p-5 md:p-8">
          <CurriculumCards subjects={subjects} />
        </div>
      </div>
    </div>
  );
}

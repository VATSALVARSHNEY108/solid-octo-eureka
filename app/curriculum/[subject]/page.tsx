import { getSubjectFromFS, getSubjectsFromFS } from "@/lib/content-registry.server";
import { notFound } from "next/navigation";
import TopicExplorer from "@/components/TopicExplorer";
import Link from "next/link";
import { ArrowLeft, Sparkles, Layout } from "lucide-react";

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const subjects = await getSubjectsFromFS();
  return subjects.map((s) => ({ subject: s.id }));
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectId } = await params;
  const subject = await getSubjectFromFS(subjectId);

  if (!subject) {
    return (
      <div className="p-24 text-center text-[var(--text-primary)]">
        <h2 className="text-2xl font-bold mb-4">Subject Not Found</h2>
        <p className="text-[var(--text-secondary)]">The requested subject could not be loaded. Please check the curriculum configuration.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-indigo-500/30">
      <div className="relative z-10 section-container pt-32 pb-24">
        {/* Navigation */}
        <Link 
          href="/curriculum" 
          className="inline-flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-12 uppercase tracking-[0.3em] group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Curriculum
        </Link>

        {/* Header */}
        <header className="max-w-3xl mb-20">
          <div className="relative inline-flex items-center gap-4 px-6 py-4 rounded-3xl 
            bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10
            border border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20 mb-10">

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon Container */}
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl 
              bg-gradient-to-br from-indigo-500 to-violet-600 
              shadow-lg shadow-indigo-500/30">

              <Layout size={28} className="text-white" />
            </div>

            {/* Text Content */}
            <div className="relative flex flex-col">
              <span className="text-[11px] font-extrabold tracking-[0.25em] uppercase text-indigo-400">
                Learning Module
              </span>

              <h2 className="text-2xl font-black text-[var(--text-primary)] leading-tight">
                {subject.name}
              </h2>

              <div className="mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            </div>
          </div>
        </header>

        {/* Topics Grid */}
        <TopicExplorer subjectId={subject.id} topics={subject.topics} />
      </div>
    </div>
  );
}

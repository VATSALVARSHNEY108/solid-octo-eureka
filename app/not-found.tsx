import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-xl w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-8 shadow-premium">
        <h1 className="text-2xl md:text-3xl font-black mb-3">404 — Page not found</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          The page you’re looking for doesn’t exist (or the link is broken).
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/"
            className="btn-primary !px-6 !py-3 !text-md inline-flex items-center justify-center"
          >
            Go to Home
          </Link>
          <Link
            href="/curriculum"
            className="btn-secondary !px-6 !py-3 !text-md inline-flex items-center justify-center"
          >
            Browse Curriculum
          </Link>
        </div>
      </div>
    </div>
  );
}


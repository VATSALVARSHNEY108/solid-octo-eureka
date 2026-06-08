// app/curriculum/SubjectsList.tsx

import Link from "next/link";
import { getSubjectsFromFS } from "@/lib/content-registry.server";

type SubjectInfo = {
  id: string;
  name: string;
};

export default async function SubjectsList() {
  const subjectsData = await getSubjectsFromFS();
  const subjects: SubjectInfo[] = subjectsData.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-8">
      <h1 className="text-3xl font-bold mb-6">Curriculum</h1>
      <ul className="space-y-4">
        {subjects.map((subject) => (
          <li key={subject.id}>
            <Link
              href={`/curriculum/${subject.id}`}
              className="text-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {subject.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

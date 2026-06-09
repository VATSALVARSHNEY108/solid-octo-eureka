import TetrisLoading from "@/components/ui/tetris-loader";

export default function NotesLoading() {
  return (
    <div className="flex h-[calc(100vh-80px)] bg-[var(--bg-primary)] items-center justify-center p-6">
      <TetrisLoading size="lg" speed="normal" loadingText="Loading Notes..." />
    </div>
  );
}

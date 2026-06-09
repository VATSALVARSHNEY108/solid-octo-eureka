import TetrisLoading from "@/components/ui/tetris-loader";

export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6">
      <TetrisLoading size="lg" speed="normal" loadingText="Loading Topic..." />
    </div>
  );
}

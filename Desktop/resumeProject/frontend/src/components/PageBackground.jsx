export default function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[110px]" />
      <div className="absolute top-1/2 left-0 h-64 w-64 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
    </div>
  );
}

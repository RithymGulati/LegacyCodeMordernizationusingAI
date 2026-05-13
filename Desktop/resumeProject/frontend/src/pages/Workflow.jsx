import { LEGACY_JAVA, AI_COMMENTED_JAVA } from "../components/siteContent.js";
import AiInsightGrid from "../components/AiInsightGrid.jsx";

export default function Workflow() {
  return (
    <>
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/90">
          Workflow
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Side-by-side legacy analysis
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Compare raw source with AI-generated inline documentation and
          modernization notes—then review structured insights in one place.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0a0e18] px-4 py-3">
          <span className="text-xs font-medium text-slate-500">
            Analysis workspace
          </span>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
        </div>
        <div className="grid gap-0 lg:grid-cols-2 lg:divide-x lg:divide-white/10">
          <div className="p-5 lg:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Input — legacy code
              </span>
            </div>
            <pre className="max-h-[min(420px,50vh)] overflow-auto rounded-xl border border-white/10 bg-[#050810] p-4 text-sm leading-relaxed text-slate-400">
              <code>{LEGACY_JAVA}</code>
            </pre>
          </div>
          <div className="border-t border-white/10 bg-gradient-to-b from-indigo-500/[0.06] to-transparent p-5 lg:border-t-0 lg:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-200/90">
                Output — AI commented
              </span>
              <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-200">
                Business + modernization
              </span>
            </div>
            <pre className="max-h-[min(420px,50vh)] overflow-auto rounded-xl border border-indigo-500/20 bg-[#060a14] p-4 text-sm leading-relaxed text-slate-300">
              <code>{AI_COMMENTED_JAVA}</code>
            </pre>
          </div>
        </div>
      </div>

      <AiInsightGrid
        className="mt-12 md:mt-16"
        heading="AI insights"
        sub="Structured signals your teams can use in triage, review, and modernization planning."
      />
    </>
  );
}

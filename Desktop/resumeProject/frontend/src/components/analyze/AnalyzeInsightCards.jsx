/**
 * Rich insight cards for /analyze (progress bar, badges, lists).
 * @param {{
 *   analysis: {
 *     language?: string,
 *     maintainabilityScore?: number,
 *     riskLevel?: string,
 *     modernizationSuggestions?: string[],
 *     businessSummary?: string,
 *     keyIssues?: string[],
 *   },
 *   className?: string,
 * }} props
 */
export default function AnalyzeInsightCards({ analysis, className = "" }) {
  const a = analysis || {};
  const score = Number(a.maintainabilityScore);
  const safeScore = Number.isFinite(score) ? Math.min(100, Math.max(0, Math.round(score))) : 0;
  const risk = String(a.riskLevel || "Unknown").trim() || "Unknown";
  const riskLower = risk.toLowerCase();

  let barColor = "from-amber-500 to-orange-400";
  if (safeScore >= 72) barColor = "from-emerald-500 to-teal-400";
  else if (safeScore < 45) barColor = "from-rose-500 to-orange-500";

  let badgeClass =
    "border-amber-500/40 bg-amber-500/15 text-amber-200";
  if (riskLower === "low") {
    badgeClass = "border-emerald-500/40 bg-emerald-500/15 text-emerald-200";
  } else if (riskLower === "high") {
    badgeClass = "border-rose-500/40 bg-rose-500/15 text-rose-200";
  }

  const suggestions = Array.isArray(a.modernizationSuggestions)
    ? a.modernizationSuggestions.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const issues = Array.isArray(a.keyIssues)
    ? a.keyIssues.map((s) => String(s).trim()).filter(Boolean)
    : [];

  const card =
    "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md transition duration-300 hover:border-indigo-400/25 hover:bg-white/[0.045] hover:shadow-[0_0_32px_-12px_rgba(99,102,241,0.35)]";

  return (
    <section className={className}>
      <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
        AI Insights
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-400">
        Structured fields from the model response — scores and lists reflect the analyzed snippet.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className={card}>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Language Detected
          </p>
          <p className="mt-3 flex items-center gap-2 text-lg font-semibold text-slate-100">
            <span className="rounded-lg border border-indigo-400/25 bg-indigo-500/10 px-2 py-0.5 font-mono text-sm text-indigo-200">
              {String(a.language || "Unknown")}
            </span>
          </p>
        </div>

        <div className={card}>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Maintainability Score
          </p>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-slate-100">
            {safeScore}
            <span className="text-base font-normal text-slate-500"> / 100</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
              style={{ width: `${safeScore}%` }}
            />
          </div>
        </div>

        <div className={card}>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Risk Level
          </p>
          <p className="mt-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${badgeClass}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  riskLower === "low"
                    ? "bg-emerald-400"
                    : riskLower === "high"
                      ? "bg-rose-400"
                      : "bg-amber-400"
                }`}
              />
              {risk}
            </span>
          </p>
        </div>

        <div className={`${card} sm:col-span-2 xl:col-span-2`}>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Suggested Modernization
          </p>
          {suggestions.length ? (
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-300 marker:text-indigo-400/80">
              {suggestions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-slate-500">None listed.</p>
          )}
        </div>

        <div className={card}>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Business Logic Summary
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            {String(a.businessSummary || "").trim() || "—"}
          </p>
        </div>

        <div className={`${card} sm:col-span-2 xl:col-span-3`}>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Key Issues
          </p>
          {issues.length ? (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300 marker:text-rose-400/70">
              {issues.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500">None flagged.</p>
          )}
        </div>
      </div>
    </section>
  );
}

import { AI_INSIGHTS_ROWS } from "./siteContent.js";

function AccentDot({ accent }) {
  const map = {
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
  };
  return <span className={`h-2 w-2 shrink-0 rounded-full ${map[accent] || "bg-slate-500"}`} />;
}

export default function AiInsightGrid({
  heading = "AI insights",
  sub,
  className,
  rows,
}) {
  const data = rows ?? AI_INSIGHTS_ROWS;

  return (
    <section className={className}>
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{heading}</h2>
      {sub ? (
        <p className="mt-2 max-w-2xl text-slate-400">{sub}</p>
      ) : null}
      <dl className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((row) => (
          <div
            key={row.label}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur transition hover:border-white/15"
          >
            <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              {row.accent && <AccentDot accent={row.accent} />}
              {row.label}
            </dt>
            <dd
              className={`mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed ${
                row.accent === "emerald"
                  ? "text-emerald-300/95"
                  : row.accent === "amber"
                    ? "text-amber-200/95"
                    : row.accent === "rose"
                      ? "text-rose-300/95"
                      : "text-slate-200"
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

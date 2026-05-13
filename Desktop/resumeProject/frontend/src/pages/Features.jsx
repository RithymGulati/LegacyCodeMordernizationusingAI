import { FEATURES } from "../components/siteContent.js";

export default function Features() {
  return (
    <>
      <div className="mb-12 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/90">
          Capabilities
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Enterprise-grade analysis for legacy estates
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Purpose-built for IT services modernization: document what matters,
          quantify risk, and align engineering with business intent.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition duration-300 hover:border-indigo-400/35 hover:bg-white/[0.05] lg:p-8"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />
            </div>
            <div className="relative">
              <span className="inline-flex rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-indigo-200">
                {feature.tag}
              </span>
              <h2 className="mt-5 text-xl font-semibold tracking-tight">
                {feature.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-400">
                {feature.description}
              </p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-indigo-500/40 via-white/10 to-transparent" />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

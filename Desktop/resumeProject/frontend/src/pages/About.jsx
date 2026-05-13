import { TECH_STACK, WORKFLOW_STEPS } from "../components/siteContent.js";

export default function About() {
  return (
    <>
      <div className="mb-12 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/90">
          About
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Legacy AI for modernization programs
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          LegacyAI helps enterprises reduce the cost and risk of changing
          systems that were never documented the way maintainers need today. We
          focus on extracting business logic, improving comment clarity, and
          shortening code review cycles.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:p-8">
          <h2 className="text-lg font-semibold tracking-tight">Mission</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-400">
            Poorly documented or outdated legacy code slows delivery and hides
            domain rules that modernization depends on. LegacyAI connects
            engineering work to business outcomes with AI-generated explanatory
            comments, maintainability signals, and practical modernization guidance—
            surfaced through a clean, accountable workflow your teams can adopt
            quickly.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { k: "Clarity", v: "Inline documentation aligned to glossaries." },
              { k: "Speed", v: "Faster onboarding and safer change batches." },
              { k: "Governance", v: "Enterprise-ready patterns and controls." },
            ].map((item) => (
              <div key={item.k}>
                <p className="text-sm font-medium text-white">{item.k}</p>
                <p className="mt-2 text-sm text-slate-500">{item.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-indigo-500/10 to-transparent p-6 backdrop-blur sm:p-8">
          <h2 className="text-lg font-semibold tracking-tight">How we fit in</h2>
          <ul className="mt-5 space-y-4">
            {WORKFLOW_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-3 text-sm text-slate-400">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/10 text-xs font-semibold text-indigo-200">
                  {i + 1}
                </span>
                <span>
                  <span className="font-medium text-slate-200">{step.title}.</span>{" "}
                  {step.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-14 md:mt-20">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          Tech stack
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-500">
          Built with the same stack we recommend for fast, maintainable product
          surfaces at scale.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 backdrop-blur transition hover:border-indigo-400/35 hover:text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}

import { Link } from "react-router-dom";
import { LEGACY_JAVA, AI_COMMENTED_JAVA } from "../components/siteContent.js";

export default function Home() {
  return (
    <>
      <section className="pb-12 md:pb-16">
        <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs text-slate-300 backdrop-blur">
          AI-Powered Code Modernization
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          AI-Assisted Legacy Code{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Modernization Platform
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Understand business logic, generate intelligent documentation, and
          modernize enterprise legacy systems using AI.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/analyze"
            className="inline-flex rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
          >
            Start Analysis
          </Link>
          <Link
            to="/workflow"
            className="inline-flex rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur transition hover:border-white/35 hover:bg-white/10"
          >
            View Demo
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Understand business logic
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Reduce review time
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Ship modernization faster
          </span>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/90">
              Preview
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              From opaque legacy to documented intent
            </h2>
          </div>
          <Link
            to="/analyze"
            className="hidden shrink-0 text-sm text-indigo-300 transition hover:text-indigo-200 sm:inline"
          >
            Open playground →
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
          <div className="grid gap-3 p-3 md:grid-cols-2 md:gap-4 md:p-4">
            <div className="rounded-xl border border-white/10 bg-[#070b14] p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
                  Raw
                </span>
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </span>
              </div>
              <pre className="max-h-[220px] overflow-x-auto overflow-y-auto text-xs leading-relaxed text-slate-400 sm:text-sm md:max-h-[280px]">
                <code>{LEGACY_JAVA}</code>
              </pre>
            </div>
            <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/[0.08] to-transparent p-4 shadow-[0_0_50px_-10px_rgba(99,102,241,0.25)]">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium uppercase tracking-widest text-indigo-200/90">
                  AI annotated
                </span>
                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                  Inline context
                </span>
              </div>
              <pre className="max-h-[220px] overflow-x-auto overflow-y-auto text-xs leading-relaxed text-slate-300 sm:text-sm md:max-h-[280px]">
                <code>{AI_COMMENTED_JAVA}</code>
              </pre>
            </div>
          </div>
        </div>
        <Link
          to="/analyze"
          className="mt-4 inline-block text-sm text-indigo-300 transition hover:text-indigo-200 sm:hidden"
        >
          Open playground →
        </Link>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-600/10 p-8 sm:p-10 md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to shorten the path from legacy to clarity?
            </h2>
            <p className="mt-3 text-slate-400">
              Route a sample through analysis or talk to our team about
              rollout, security, and enterprise controls.
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap gap-3">
            <Link
              to="/analyze"
              className="inline-flex rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Start analysis
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur transition hover:border-white/35 hover:bg-white/10"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

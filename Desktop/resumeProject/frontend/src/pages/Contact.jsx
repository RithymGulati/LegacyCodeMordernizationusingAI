import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState("idle");

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("sent");
    e.target.reset();
    window.setTimeout(() => setStatus("idle"), 3500);
  }

  return (
    <>
      <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300/90">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Talk to LegacyAI
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Share your modernization context—teams, stacks, compliance—and we&apos;ll
            follow up with next steps.
          </p>
          <ul className="mt-10 space-y-4 text-sm text-slate-500">
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              Enterprise pilots and security questionnaires
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              Custom glossary and domain alignment
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              Integration with your engineering workflow
            </li>
          </ul>
        </div>

        <div className="mt-14 lg:mt-0">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur sm:p-8"
          >
            <div className="grid gap-5">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-slate-400">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#070b14] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none ring-0 transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/25"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-400">
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#070b14] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/25"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-xs font-medium text-slate-400">
                  Company <span className="text-slate-600">(optional)</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Enterprise Inc."
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#070b14] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/25"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-slate-400">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Legacy stacks, regions, timelines, procurement…"
                  className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-[#070b14] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/25"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 sm:w-auto"
              >
                Send message
              </button>
              {status === "sent" && (
                <p className="text-center text-sm text-emerald-400 sm:text-right">
                  Thanks — we&apos;ll be in touch.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

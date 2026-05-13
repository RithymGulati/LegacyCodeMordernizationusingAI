import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/features", label: "Features" },
  { to: "/workflow", label: "Workflow" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const navLinkClass = ({ isActive }) =>
  [
    "text-sm transition",
    isActive
      ? "text-white font-medium"
      : "text-slate-400 hover:text-white",
  ].join(" ");

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#05070f]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-12">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-white transition hover:text-indigo-200"
          onClick={() => setOpen(false)}
        >
          LegacyAI
        </Link>

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:gap-10">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/analyze"
            className="hidden rounded-full border border-indigo-400/40 bg-indigo-500/15 px-4 py-2 text-sm font-medium text-indigo-100 transition hover:border-indigo-300 hover:bg-indigo-500/30 sm:inline-flex"
          >
            Analyze Code
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/5 hover:text-white md:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/[0.06] bg-[#05070f]/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/analyze"
              className="mt-2 rounded-full border border-indigo-400/40 bg-indigo-500/15 px-4 py-2 text-center text-sm font-medium text-indigo-100"
              onClick={() => setOpen(false)}
            >
              Analyze Code
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

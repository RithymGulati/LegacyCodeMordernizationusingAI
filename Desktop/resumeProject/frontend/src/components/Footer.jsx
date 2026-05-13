import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 text-sm text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p className="text-slate-400">© {new Date().getFullYear()} LegacyAI</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/features" className="transition hover:text-slate-300">
            Features
          </Link>
          <Link to="/workflow" className="transition hover:text-slate-300">
            Workflow
          </Link>
          <Link to="/about" className="transition hover:text-slate-300">
            About
          </Link>
          <Link to="/contact" className="transition hover:text-slate-300">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

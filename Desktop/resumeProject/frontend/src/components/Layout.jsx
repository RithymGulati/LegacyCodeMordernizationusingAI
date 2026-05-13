import { Outlet, useLocation } from "react-router-dom";
import PageBackground from "./PageBackground.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const { pathname } = useLocation();
  const isAnalyze = pathname === "/analyze";

  return (
    <div className="relative min-h-screen bg-[#05070f] text-white antialiased selection:bg-indigo-500/40">
      <PageBackground />
      <Navbar />
      <main
        className={
          isAnalyze
            ? "relative w-full max-w-[1920px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 xl:mx-auto"
            : "relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16"
        }
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

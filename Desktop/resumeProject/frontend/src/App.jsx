import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Features from "./pages/Features.jsx";
import Workflow from "./pages/Workflow.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Analyze from "./pages/Analyze.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/features" element={<Features />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

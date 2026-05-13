import { useCallback, useEffect, useRef, useState } from "react";
import { analyzeEndpoint } from "../config/analyzeApi.js";
import { annotatedCodeToSegments } from "../utils/analysisSegments.js";
import AnalyzeInsightCards from "../components/analyze/AnalyzeInsightCards.jsx";
import { ANALYZE_SAMPLE_SNIPPETS } from "../components/analyze/sampleSnippets.js";
import { HighlightedCodeLine } from "../components/analyze/codeHighlight.jsx";
import { sanitizeAiOutputLine } from "../utils/sanitizeAiOutput.js";

/* ─── constants ───────────────────────────────────────────────── */

const LINE_STYLE = { height: "1.5rem", lineHeight: "1.5rem" };
const MIN_PANEL_H = "min-h-[min(56vh,680px)]";
const STREAM_INTERVAL_MS = 100;

const INPUT_PLACEHOLDER =
  "Paste legacy Java, COBOL, or enterprise service code here...";

const EMPTY_OUTPUT_BODY =
  "Paste legacy code and run analysis to generate business-aware comments, modernization notes, and maintainability insights.";

const LOADING_MESSAGES = [
  "Detecting language...",
  "Analyzing business logic...",
  "Generating modernization insights...",
  "Evaluating maintainability risks...",
];

const LANG_PILLS = ["Java", "Python", "COBOL", "C++"];

/** @typedef {{ type: 'code' | 'inline' | 'business' | 'modernization' | 'risk', text: string }} Seg */

/* ─── icons ───────────────────────────────────────────────────── */

function Spinner({ className = "h-4 w-4" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function IconCopy({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.08 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
  );
}

function IconDownload({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

/* ─── status pill ─────────────────────────────────────────────── */

function StatusPill({ variant, label }) {
  const dot =
    variant === "ready"
      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
      : variant === "analyzing"
        ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
        : variant === "streaming"
          ? "bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.55)]"
          : variant === "complete"
            ? "bg-emerald-400"
            : variant === "error"
              ? "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.45)]"
              : "bg-rose-400";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm">
      <span className={`relative flex h-2 w-2 rounded-full ${dot}`}>
        {(variant === "analyzing" || variant === "streaming") && (
          <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-40" />
        )}
      </span>
      <span className="text-slate-400">Status:</span>
      <span className="text-slate-100">{label}</span>
    </div>
  );
}

/* ─── segments ─────────────────────────────────────────────────── */

/** @param {{ seg: Seg }} props */
function SegmentLine({ seg }) {
  if (seg.type === "code") return <HighlightedCodeLine line={seg.text} />;
  if (seg.type === "inline")
    return <span className="text-emerald-400/95">{sanitizeAiOutputLine(seg.text)}</span>;
  if (seg.type === "business")
    return <span className="text-violet-300/95">{sanitizeAiOutputLine(seg.text)}</span>;
  if (seg.type === "modernization")
    return <span className="text-amber-300/95">{sanitizeAiOutputLine(seg.text)}</span>;
  if (seg.type === "risk")
    return <span className="text-rose-400/95">{sanitizeAiOutputLine(seg.text)}</span>;
  return null;
}

/**
 * @param {{ segments: Seg[], visibleCount: number }} props
 */
function OutputEditor({ segments, visibleCount }) {
  const bodyRef = useRef(null);
  const gutterRef = useRef(null);

  const visible = segments.slice(0, visibleCount);
  const n = Math.max(visible.length, 1);

  const onBodyScroll = useCallback(() => {
    const b = bodyRef.current;
    const g = gutterRef.current;
    if (b && g) g.scrollTop = b.scrollTop;
  }, []);

  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTop = b.scrollHeight;
  }, [visibleCount]);

  return (
    <div className={`flex ${MIN_PANEL_H} flex-1 overflow-hidden rounded-b-2xl bg-[#0d1117]`}>
      <div
        ref={gutterRef}
        className="w-[2.875rem] shrink-0 overflow-y-scroll border-r border-[#30363d] bg-[#010409] py-3 pl-2 pr-1 text-right font-mono text-xs leading-6 text-[#6e7681] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-hidden
      >
        {Array.from({ length: n }, (_, i) => (
          <div key={i} style={LINE_STYLE}>
            {i + 1}
          </div>
        ))}
      </div>
      <div
        ref={bodyRef}
        onScroll={onBodyScroll}
        className={`${MIN_PANEL_H} flex-1 overflow-auto py-3 pl-3 pr-4 font-mono text-[13px] leading-6`}
      >
        {visible.map((seg, i) => (
          <div
            key={i}
            style={LINE_STYLE}
            className="whitespace-pre transition-opacity duration-200 selection:bg-indigo-500/30"
          >
            <SegmentLine seg={seg} />
          </div>
        ))}
        {visibleCount < segments.length && (
          <div style={LINE_STYLE} className="flex items-center font-mono text-[13px]">
            <span className="inline-block h-[1.1em] w-[2px] animate-pulse rounded-sm bg-indigo-400/90" />
          </div>
        )}
      </div>
    </div>
  );
}

function ApiErrorCard({ title, message, code, onRetry }) {
  return (
    <div
      className="rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/45 via-[#0a0d14]/90 to-[#05070f] p-6 shadow-[0_0_48px_-18px_rgba(244,63,94,0.4)] backdrop-blur-xl"
      role="alert"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rose-500/35 bg-rose-500/10 text-rose-300">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight text-rose-50">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{message}</p>
          {code ? (
            <p className="mt-3 font-mono text-xs text-slate-600">Code: {code}</p>
          ) : null}
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-5 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white"
            >
              Try again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ─── main page ───────────────────────────────────────────────── */

export default function Analyze() {
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("idle");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [allSegments, setAllSegments] = useState(/** @type {Seg[] | null} */ (null));
  const [visibleCount, setVisibleCount] = useState(0);
  const [analysisPayload, setAnalysisPayload] = useState(/** @type {Record<string, unknown> | null} */ (null));
  const [analyzeError, setAnalyzeError] = useState("");
  const [apiError, setApiError] = useState(/** @type {{ title: string, message: string, code?: string } | null} */ (null));
  const [activeSampleId, setActiveSampleId] = useState(/** @type {string | null} */ (null));
  const [copyFlash, setCopyFlash] = useState(/** @type {null | 'raw' | 'ann'} */ (null));

  const streamIntervalRef = useRef(null);
  const inputTaRef = useRef(null);
  const inputGutterRef = useRef(null);

  const lineCountSource = source.split("\n").length;
  const inputLineCount = Math.max(lineCountSource, 18);

  const onInputScroll = useCallback(() => {
    const ta = inputTaRef.current;
    const g = inputGutterRef.current;
    if (ta && g) g.scrollTop = ta.scrollTop;
  }, []);

  useEffect(() => {
    if (status !== "loading") return undefined;
    setLoadingMsgIdx(0);
    const id = window.setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 550);
    return () => window.clearInterval(id);
  }, [status]);

  useEffect(
    () => () => {
      if (streamIntervalRef.current) window.clearInterval(streamIntervalRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!copyFlash) return undefined;
    const t = window.setTimeout(() => setCopyFlash(null), 1600);
    return () => window.clearTimeout(t);
  }, [copyFlash]);

  function cancelStreaming() {
    if (streamIntervalRef.current) {
      window.clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
  }

  function resetOutputState() {
    cancelStreaming();
    setAllSegments(null);
    setVisibleCount(0);
    setAnalysisPayload(null);
    setStatus("idle");
  }

  function applySample(snippet) {
    setAnalyzeError("");
    setApiError(null);
    resetOutputState();
    setSource(snippet.code);
    setActiveSampleId(snippet.id);
  }

  function clearInput() {
    setAnalyzeError("");
    setApiError(null);
    resetOutputState();
    setSource("");
    setActiveSampleId(null);
  }

  async function copyToClipboard(text, kind) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFlash(kind);
    } catch {
      setAnalyzeError("Could not copy to clipboard.");
    }
  }

  function copyRawCode() {
    if (!source) return;
    copyToClipboard(source, "raw");
  }

  function copyAnnotatedCode() {
    if (!allSegments?.length) return;
    copyToClipboard(allSegments.map((s) => s.text).join("\n"), "ann");
  }

  function startStreaming(segments) {
    setAllSegments(segments);
    setVisibleCount(0);
    setStatus("streaming");

    let idx = 0;
    streamIntervalRef.current = window.setInterval(() => {
      idx += 1;
      setVisibleCount(idx);
      if (idx >= segments.length) {
        window.clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        setStatus("done");
      }
    }, STREAM_INTERVAL_MS);
  }

  async function handleAnalyze() {
    if (!source.trim()) {
      setAnalyzeError("Paste legacy code before running analysis.");
      return;
    }
    setAnalyzeError("");
    setApiError(null);
    cancelStreaming();

    setAllSegments(null);
    setVisibleCount(0);
    setAnalysisPayload(null);
    setStatus("loading");

    const snapshot = source.trim();

    try {
      const res = await fetch(analyzeEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: snapshot }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        const msg =
          (typeof data?.message === "string" && data.message) ||
          (typeof data?.error === "string" && data.error) ||
          `Request failed (${res.status})`;
        const code = typeof data?.error === "string" ? data.error : undefined;
        throw Object.assign(new Error(msg), { code, status: res.status });
      }

      const segments = annotatedCodeToSegments(data?.annotatedCode);
      setAnalysisPayload(data);
      startStreaming(segments);
    } catch (err) {
      cancelStreaming();
      setAllSegments(null);
      setVisibleCount(0);
      setAnalysisPayload(null);
      setStatus("idle");

      let title = "Analysis unavailable";
      let message =
        err instanceof Error ? err.message : "An unexpected error occurred.";

      if (err instanceof TypeError && err.message.includes("fetch")) {
        title = "Cannot reach analysis service";
        message =
          "The browser could not connect to the API. Start the backend (`npm start` in `backend/`) and ensure it runs on the configured port.";
      } else if (/** @type {*} */ (err)?.status === 503) {
        title = "Service not configured";
      } else if (/** @type {*} */ (err)?.status === 504) {
        title = "Request timed out";
      }

      setApiError({
        title,
        message,
        code: /** @type {*} */ (err)?.code,
      });
    }
  }

  const isLocked = status === "loading" || status === "streaming";
  const showRightLoading = status === "loading";
  const showOutput = (status === "streaming" || status === "done") && allSegments !== null;
  const streamingDone = status === "done";
  const showInsights = streamingDone && analysisPayload != null;

  const detectedLanguageLabel =
    status === "loading"
      ? "Analyzing…"
      : analysisPayload?.language
        ? String(analysisPayload.language)
        : "Not analyzed";

  let statusVariant = "ready";
  let statusLabel = "Ready";
  if (apiError) {
    statusVariant = "error";
    statusLabel = "Error";
  } else if (status === "loading") {
    statusVariant = "analyzing";
    statusLabel = "Analyzing";
  } else if (status === "streaming") {
    statusVariant = "streaming";
    statusLabel = "Streaming response";
  } else if (status === "done") {
    statusVariant = "complete";
    statusLabel = "Complete";
  }

  const utilityBtn =
    "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white";

  return (
    <div className="relative pb-12">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-indigo-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-20 right-0 h-64 w-64 rounded-full bg-violet-600/12 blur-[90px]" />

      <div className="relative space-y-8 lg:space-y-10">
        <header className="flex flex-col gap-6 border-b border-white/[0.07] pb-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl border-l-2 border-indigo-500/40 pl-5">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Analyze Legacy Code
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Paste your legacy code below and let AI analyze business logic, risks, and
              modernization opportunities.
            </p>
          </div>
          <div className="shrink-0 lg:pt-1">
            <StatusPill variant={statusVariant} label={statusLabel} />
          </div>
        </header>

        {apiError ? (
          <ApiErrorCard
            title={apiError.title}
            message={apiError.message}
            code={apiError.code}
            onRetry={() => {
              setApiError(null);
              handleAnalyze();
            }}
          />
        ) : null}

        <section>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-300/80">
            Sample snippets
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ANALYZE_SAMPLE_SNIPPETS.map((sn) => (
              <button
                key={sn.id}
                type="button"
                onClick={() => applySample(sn)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                  activeSampleId === sn.id
                    ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-100 shadow-[0_0_20px_-6px_rgba(99,102,241,0.5)]"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-slate-200"
                }`}
              >
                {sn.label}
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="order-2 flex flex-wrap items-center gap-2 xl:order-1 xl:justify-end">
            <button type="button" onClick={clearInput} className={utilityBtn}>
              <span className="text-rose-400/90">Clear input</span>
            </button>
            <button type="button" onClick={copyRawCode} disabled={!source} className={`${utilityBtn} disabled:opacity-40`}>
              <IconCopy className="h-3.5 w-3.5 opacity-70" />
              Copy raw
              {copyFlash === "raw" ? <span className="text-emerald-400/90">· Copied</span> : null}
            </button>
            <button
              type="button"
              onClick={copyAnnotatedCode}
              disabled={!showOutput || visibleCount === 0}
              className={`${utilityBtn} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <IconCopy className="h-3.5 w-3.5 opacity-70" />
              Copy annotated
              {copyFlash === "ann" ? <span className="text-emerald-400/90">· Copied</span> : null}
            </button>
          </div>
          <div className="order-1 w-full xl:order-2 xl:w-auto xl:shrink-0">
            {analyzeError ? (
              <p className="mb-2 text-xs text-amber-400/95 xl:text-right">{analyzeError}</p>
            ) : null}
            <button
              type="button"
              disabled={isLocked}
              onClick={handleAnalyze}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.65)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 xl:min-w-[220px]"
            >
              {status === "loading" ? (
                <>
                  <Spinner />
                  Analyzing…
                </>
              ) : status === "streaming" ? (
                <>
                  <Spinner className="h-4 w-4 opacity-80" />
                  Streaming…
                </>
              ) : (
                "Analyze Legacy Code"
              )}
            </button>
          </div>
        </div>

        <div className="grid min-h-0 gap-5 lg:grid-cols-2 lg:gap-6">
          <div
            className={`flex flex-col overflow-hidden rounded-2xl border border-[#30363d]/90 bg-[#0d1117]/95 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_60px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-opacity duration-300 ${
              isLocked ? "opacity-[0.58]" : "opacity-100"
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#30363d] px-4 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b949e]">
                Raw legacy code
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyRawCode}
                  disabled={!source}
                  title="Copy raw code"
                  className="rounded-md p-1.5 text-[#8b949e] transition hover:bg-white/10 hover:text-slate-200 disabled:opacity-30"
                >
                  <IconCopy className="h-4 w-4" />
                </button>
                <div className="flex gap-1.5 pl-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27ca40]/85" />
                </div>
              </div>
            </div>

            <div
              className={`relative flex min-h-0 flex-1 overflow-hidden bg-[#0d1117] ${
                isLocked ? "cursor-not-allowed" : ""
              }`}
            >
              <div
                ref={inputGutterRef}
                className="w-[2.875rem] shrink-0 overflow-y-scroll border-r border-[#30363d] bg-[#010409] py-3 pl-2 pr-1 text-right font-mono text-xs leading-6 text-[#6e7681] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-hidden
              >
                {Array.from({ length: inputLineCount }, (_, i) => (
                  <div key={i} style={LINE_STYLE}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <textarea
                ref={inputTaRef}
                value={source}
                readOnly={isLocked}
                onChange={(e) => {
                  setSource(e.target.value);
                  setActiveSampleId(null);
                }}
                onScroll={onInputScroll}
                spellCheck={false}
                placeholder={INPUT_PLACEHOLDER}
                aria-label="Legacy code input"
                className={`${MIN_PANEL_H} w-full flex-1 resize-none bg-transparent py-3 pl-3 pr-3 font-mono text-[13px] leading-6 text-[#e6edf3] outline-none ring-0 placeholder:text-[#6e7681] ${
                  isLocked
                    ? "cursor-not-allowed select-none caret-transparent"
                    : "caret-[#58a6ff]"
                }`}
                style={{ tabSize: 2 }}
              />
              {isLocked && (
                <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-3">
                  <span className="rounded-md border border-white/10 bg-black/55 px-2 py-1 text-[10px] font-medium text-[#8b949e] backdrop-blur">
                    Locked during analysis
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#30363d] bg-[#161b22]/90 px-4 py-2.5 text-[11px] text-[#8b949e]">
              <span>
                Detected language:{" "}
                <span className="font-medium text-slate-300">{detectedLanguageLabel}</span>
              </span>
              <span className="tabular-nums">
                Lines of code: <span className="font-medium text-slate-300">{lineCountSource}</span>
              </span>
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-[#0d1117]/95 shadow-[0_0_0_1px_rgba(99,102,241,0.12),0_28px_70px_-24px_rgba(79,70,229,0.35)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#30363d] px-4 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-200/90">
                {showRightLoading ? "Output" : showOutput ? "AI generated analysis" : "Output"}
              </span>
              {showOutput ? (
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded border border-emerald-500/35 bg-emerald-500/[0.12] px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    Inline
                  </span>
                  <span className="rounded border border-violet-400/35 bg-violet-500/[0.12] px-2 py-0.5 text-[10px] font-medium text-violet-200">
                    Business
                  </span>
                  <span className="rounded border border-amber-400/35 bg-amber-500/[0.12] px-2 py-0.5 text-[10px] font-medium text-amber-200">
                    Modernization
                  </span>
                  <span className="rounded border border-rose-400/35 bg-rose-500/[0.12] px-2 py-0.5 text-[10px] font-medium text-rose-200">
                    Risk
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-[#484f58]">Awaiting run</span>
              )}
            </div>

            <div className="relative min-h-0 flex-1">
              {showRightLoading && (
                <div
                  className={`flex ${MIN_PANEL_H} flex-col items-center justify-center gap-6 px-6 text-center`}
                >
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/25 blur-2xl" />
                    <svg
                      className="relative h-10 w-10 animate-spin text-indigo-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Processing your legacy snippet</p>
                    <p key={loadingMsgIdx} className="mt-3 text-sm text-indigo-300/90">
                      {LOADING_MESSAGES[loadingMsgIdx]}
                    </p>
                  </div>
                </div>
              )}

              {showOutput && allSegments && (
                <OutputEditor segments={allSegments} visibleCount={visibleCount} />
              )}

              {!showRightLoading && !showOutput && (
                <div
                  className={`flex ${MIN_PANEL_H} flex-col items-center justify-center bg-gradient-to-b from-indigo-500/[0.05] to-transparent px-6 py-10 text-center`}
                >
                  <div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
                    <p className="text-sm leading-relaxed text-slate-400">{EMPTY_OUTPUT_BODY}</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {LANG_PILLS.map((lang) => (
                        <span
                          key={lang}
                          className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-medium text-slate-500"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {showOutput && allSegments && (
              <div className="border-t border-[#30363d] bg-[#161b22]/90 px-4 py-2.5 text-right text-[11px] text-[#8b949e]">
                Output lines:{" "}
                <span className="font-medium text-slate-300 tabular-nums">{allSegments.length}</span>
              </div>
            )}
          </div>
        </div>

        {showInsights && analysisPayload && (
          <div className="animate-fade-in-soft border-t border-white/10 pt-10 lg:pt-12">
            <AnalyzeInsightCards analysis={analysisPayload} />
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex max-w-lg items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-slate-500 backdrop-blur-sm">
            <span className="shrink-0 rounded border border-indigo-400/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-300">
              Tip
            </span>
            <span>Use sample snippets or paste your own legacy code to get started.</span>
          </div>
          <button
            type="button"
            title="Export to PDF — coming soon"
            disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-medium text-slate-500 opacity-70 backdrop-blur-sm"
          >
            <IconDownload className="h-4 w-4" />
            Export report
            <span className="text-[10px] text-slate-600">Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
}

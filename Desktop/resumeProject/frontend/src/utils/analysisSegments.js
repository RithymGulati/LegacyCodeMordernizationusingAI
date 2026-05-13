import { sanitizeAiOutputLine, sanitizeAnnotatedCode } from "./sanitizeAiOutput.js";

/**
 * Map each line of API `annotatedCode` to a display segment for the editor.
 * Model is instructed to prefix synthetic comment lines with // [INLINE|BUSINESS|MODERNIZE|RISK]
 *
 * @typedef {{ type: 'code' | 'inline' | 'business' | 'modernization' | 'risk', text: string }} AnalysisSeg
 */

/**
 * @param {string} annotatedCode
 * @returns {AnalysisSeg[]}
 */
export function annotatedCodeToSegments(annotatedCode) {
  const raw = typeof annotatedCode === "string" ? annotatedCode : "";
  const normalized = sanitizeAnnotatedCode(raw.replace(/\r\n/g, "\n"));

  if (!normalized.trim()) {
    return [
      {
        type: "inline",
        text: "// No annotated code was returned. See AI Insights for the narrative analysis.",
      },
    ];
  }

  const lines = normalized.split("\n");

  return lines.map((line) => {
    const clean = sanitizeAiOutputLine(line);
    const t = clean.trimStart();

    if (/^#\s*\[BUSINESS\]/i.test(t)) {
      return { type: "business", text: clean };
    }
    if (/^#\s*\[MODERNIZE\]/i.test(t)) {
      return { type: "modernization", text: clean };
    }
    if (/^#\s*\[RISK\]/i.test(t)) {
      return { type: "risk", text: clean };
    }
    if (/^#\s*\[INLINE\]/i.test(t)) {
      return { type: "inline", text: clean };
    }

    if (/^\/\/\s*\[BUSINESS\]/i.test(t)) {
      return { type: "business", text: clean };
    }
    if (/^\/\/\s*\[MODERNIZE\]/i.test(t)) {
      return { type: "modernization", text: clean };
    }
    if (/^\/\/\s*\[RISK\]/i.test(t)) {
      return { type: "risk", text: clean };
    }
    if (/^\/\/\s*\[INLINE\]/i.test(t)) {
      return { type: "inline", text: clean };
    }

    // Fallback: classify common free-form prefixes from the model
    const tlHash = t.toUpperCase();
    if (tlHash.startsWith("#") && (tlHash.includes("BUSINESS") || tlHash.includes("DOMAIN"))) {
      return { type: "business", text: clean };
    }
    if (tlHash.startsWith("#") && (tlHash.includes("MODERNIZ") || tlHash.includes("REFACTOR"))) {
      return { type: "modernization", text: clean };
    }
    if (tlHash.startsWith("#") && (tlHash.includes("RISK") || tlHash.includes("WARNING"))) {
      return { type: "risk", text: clean };
    }
    if (tlHash.startsWith("#") && !tlHash.startsWith("# [")) {
      return { type: "inline", text: clean };
    }

    const tl = t.toUpperCase();
    if (tl.startsWith("//") && (tl.includes("BUSINESS") || tl.includes("DOMAIN"))) {
      return { type: "business", text: clean };
    }
    if (tl.startsWith("//") && (tl.includes("MODERNIZ") || tl.includes("REFACTOR"))) {
      return { type: "modernization", text: clean };
    }
    if (tl.startsWith("//") && (tl.includes("RISK") || tl.includes("WARNING") || tl.includes("DEBT"))) {
      return { type: "risk", text: clean };
    }
    if (tl.startsWith("//") || tl.startsWith("*")) {
      return { type: "inline", text: clean };
    }

    return { type: "code", text: clean };
  });
}

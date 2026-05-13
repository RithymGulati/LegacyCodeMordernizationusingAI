/**
 * Normalize AI / model text for display so NBSP and literal escape sequences
 * never show up as visible artifacts (e.g. "\u00a0").
 *
 * @param {string} line
 * @returns {string}
 */
export function sanitizeAiOutputLine(line) {
  if (typeof line !== "string") return "";
  let s = line;
  // Real Unicode NBSP and common space-like chars → ASCII space
  s = s.replace(/\u00a0/g, " ");
  s = s.replace(/[\u1680\u2000-\u200a\u202f\u205f\u3000]/g, " ");
  // Literal backslash sequences sometimes returned by models / JSON
  s = s.replace(/\\u00a0/gi, " ");
  s = s.replace(/\\u0020/gi, " ");
  s = s.replace(/\\u200b/gi, ""); // zero-width space escape
  s = s.replace(/&nbsp;|&#160;|&#xA0;/gi, " ");
  // Collapse runs of spaces only where they came from NBSP fixes (optional trim end)
  return s;
}

/**
 * Sanitize full annotated code before line-split (handles stray escapes mid-file).
 * @param {string} text
 * @returns {string}
 */
export function sanitizeAnnotatedCode(text) {
  if (typeof text !== "string") return "";
  return sanitizeAiOutputLine(text.replace(/\r\n/g, "\n"));
}

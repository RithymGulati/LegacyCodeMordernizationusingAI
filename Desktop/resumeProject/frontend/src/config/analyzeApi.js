/**
 * Base URL for the LegacyAI analyze API (no trailing slash).
 * Override with Vite: `VITE_ANALYZE_API_URL=http://localhost:5000`
 */
export const ANALYZE_API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_ANALYZE_API_URL) ||
  "http://localhost:5001";

export function analyzeEndpoint() {
  return `${ANALYZE_API_BASE.replace(/\/$/, "")}/api/analyze`;
}

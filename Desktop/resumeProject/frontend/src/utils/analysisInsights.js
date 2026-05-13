/**
 * Build insight card rows from normalized /api/analyze JSON payload.
 *
 * @param {{
 *   language?: string,
 *   businessSummary?: string,
 *   maintainabilityScore?: number,
 *   riskLevel?: string,
 *   modernizationSuggestions?: string[],
 *   keyIssues?: string[]
 * }} a
 * @returns {{ label: string, value: string, accent?: string }[]}
 */
export function buildInsightRowsFromAnalysis(a) {
  const language = String(a?.language || "Unknown").trim() || "Unknown";
  const score = Number(a?.maintainabilityScore);
  const safeScore = Number.isFinite(score) ? Math.min(100, Math.max(0, Math.round(score))) : 0;
  const riskLevel = String(a?.riskLevel || "Unknown").trim() || "Unknown";
  const riskLower = riskLevel.toLowerCase();
  let riskAccent;
  if (riskLower === "low") riskAccent = "emerald";
  else if (riskLower === "high") riskAccent = "rose";
  else riskAccent = "amber";

  let scoreAccent;
  if (safeScore >= 72) scoreAccent = "emerald";
  else if (safeScore >= 45) scoreAccent = "amber";

  const suggestions = Array.isArray(a?.modernizationSuggestions)
    ? a.modernizationSuggestions.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const modText = suggestions.length
    ? suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")
    : "None listed.";

  const issues = Array.isArray(a?.keyIssues)
    ? a.keyIssues.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const issuesText = issues.length
    ? issues.map((s, i) => `${i + 1}. ${s}`).join("\n")
    : "None flagged.";

  const business = String(a?.businessSummary || "").trim() || "—";

  return [
    { label: "Language Detected", value: language },
    {
      label: "Maintainability Score",
      value: `${safeScore} / 100`,
      accent: scoreAccent,
    },
    { label: "Risk Level", value: riskLevel, accent: riskAccent },
    { label: "Suggested Modernization", value: modText },
    { label: "Business Logic Summary", value: business },
    { label: "Key Issues", value: issuesText },
  ];
}

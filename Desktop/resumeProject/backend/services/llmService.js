import axios from "axios";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "openrouter/free";
const REQUEST_TIMEOUT_MS = 90_000;

const SYSTEM_MESSAGE =
  "You are an enterprise legacy code modernization assistant. Return only valid JSON.";

/**
 * Strip markdown fences and trim so JSON.parse succeeds more often.
 * @param {string} raw
 * @returns {string}
 */
export function extractJsonString(raw) {
  if (typeof raw !== "string") return "";
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "");
  }
  return s.trim();
}

/**
 * @param {unknown} parsed
 * @returns {{
 *   language: string,
 *   businessSummary: string,
 *   maintainabilityScore: number,
 *   riskLevel: string,
 *   modernizationSuggestions: string[],
 *   annotatedCode: string,
 *   keyIssues: string[]
 * }}
 */
export function normalizeAnalysis(parsed) {
  const p = parsed && typeof parsed === "object" ? parsed : {};

  const scoreRaw = Number(p.maintainabilityScore);
  const maintainabilityScore = Number.isFinite(scoreRaw)
    ? Math.min(100, Math.max(0, Math.round(scoreRaw)))
    : 0;

  const suggestions = Array.isArray(p.modernizationSuggestions)
    ? p.modernizationSuggestions.map((x) => String(x)).filter(Boolean)
    : [];

  const keyIssues = Array.isArray(p.keyIssues)
    ? p.keyIssues.map((x) => String(x)).filter(Boolean)
    : [];

  return {
    language: String(p.language || "Unknown").trim() || "Unknown",
    businessSummary: String(p.businessSummary || "").trim(),
    maintainabilityScore,
    riskLevel: String(p.riskLevel || "Unknown").trim() || "Unknown",
    modernizationSuggestions: suggestions,
    annotatedCode: String(p.annotatedCode ?? ""),
    keyIssues,
  };
}

function buildUserPrompt(code) {
  return `Analyze the following legacy source. Detect the programming language automatically (prioritize Java; also support COBOL, Python, C++). Assess business logic, maintainability, modernization readiness, architectural risks, legacy patterns, and code quality.

Return STRICTLY a single JSON object with these keys and types (no markdown, no prose outside JSON):
{
  "language": string,
  "businessSummary": string,
  "maintainabilityScore": number (integer 0-100),
  "riskLevel": string (one of: "Low", "Medium", "High"),
  "modernizationSuggestions": string[] (3-8 concise actionable items),
  "annotatedCode": string,
  "keyIssues": string[] (2-8 specific issues or risks)
}

Rules for "annotatedCode":
- Start from the user's code and preserve structure, indentation, and line breaks as much as possible.
- Add helpful comment lines immediately above the relevant statements where appropriate.
- Each NEW comment line you add must begin with EXACTLY one of these prefixes (choose the best fit):
  // [INLINE]   — technical / code explanation
  // [BUSINESS] — business rule or domain meaning
  // [MODERNIZE] — modernization or refactoring recommendation
  // [RISK] — risk, debt, or operational concern
- Do not add these prefixes to non-comment lines (actual code must remain valid).
- Keep comments concise and enterprise-appropriate.

LEGACY CODE TO ANALYZE:
---
${code}
---
`;
}

/**
 * @param {string} text
 * @returns {unknown}
 */
function safeJsonParse(text) {
  const cleaned = extractJsonString(text);
  return JSON.parse(cleaned);
}

/**
 * @param {object} data
 * @returns {string}
 */
function extractAssistantContent(data) {
  const msg = data?.choices?.[0]?.message;
  const c = msg?.content;
  if (typeof c === "string") return c;
  if (Array.isArray(c)) {
    return c
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("");
  }
  return "";
}

/**
 * @param {string} code
 * @returns {Promise<ReturnType<typeof normalizeAnalysis>>}
 */
export async function runLegacyAnalysis(code) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey || apiKey === "YOUR_OPENROUTER_API_KEY") {
    const err = new Error(
      "Server is not configured with a valid OPENROUTER_API_KEY. Set it in backend/.env",
    );
    err.statusCode = 503;
    err.code = "CONFIG_ERROR";
    throw err;
  }

  const userContent = buildUserPrompt(code);

  let data;
  try {
    let lastHttpError = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      const body = {
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: SYSTEM_MESSAGE },
          { role: "user", content: userContent },
        ],
        temperature: 0.2,
        max_tokens: 8192,
        ...(attempt === 0 ? { response_format: { type: "json_object" } } : {}),
      };

      const res = await axios.post(OPENROUTER_URL, body, {
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.OPENROUTER_HTTP_REFERER || "http://localhost:5173",
          "X-Title": "LegacyAI Analyze",
        },
        validateStatus: () => true,
      });

      if (res.status < 200 || res.status >= 300) {
        const msg =
          res.data?.error?.message ||
          res.data?.message ||
          `OpenRouter returned status ${res.status}`;
        lastHttpError = { status: res.status, msg, data: res.data };
        console.error("[llm] HTTP error", res.status, msg);
        if (attempt === 0 && res.status === 400) {
          console.warn(
            "[llm] Retrying without response_format (model may not support json_object).",
          );
          continue;
        }
        const err = new Error(msg);
        err.statusCode = 502;
        err.code = "OPENROUTER_HTTP_ERROR";
        throw err;
      }

      data = res.data;
      break;
    }

    if (!data && lastHttpError) {
      const err = new Error(lastHttpError.msg);
      err.statusCode = 502;
      err.code = "OPENROUTER_HTTP_ERROR";
      throw err;
    }
  } catch (e) {
    if (e.code === "ECONNABORTED") {
      console.error("[llm] Request timeout after", REQUEST_TIMEOUT_MS, "ms");
      const err = new Error("LLM request timed out. Try a smaller snippet.");
      err.statusCode = 504;
      err.code = "LLM_TIMEOUT";
      throw err;
    }
    if (e.response) {
      const msg =
        e.response.data?.error?.message ||
        e.response.data?.message ||
        e.message;
      console.error("[llm] Axios error", e.response.status, msg);
      const err = new Error(msg);
      err.statusCode = 502;
      err.code = "OPENROUTER_ERROR";
      throw err;
    }
    console.error("[llm]", e.message || e);
    throw e;
  }

  const text = extractAssistantContent(data);
  if (!text?.trim()) {
    console.error("[llm] Empty assistant content", JSON.stringify(data).slice(0, 500));
    const err = new Error("Model returned an empty response.");
    err.statusCode = 502;
    err.code = "LLM_EMPTY";
    throw err;
  }

  let parsed;
  try {
    parsed = safeJsonParse(text);
  } catch (parseErr) {
    console.error("[llm] JSON parse failed:", parseErr.message);
    console.error("[llm] Raw text (truncated):", text.slice(0, 1200));
    const err = new Error("Could not parse structured analysis from model output.");
    err.statusCode = 502;
    err.code = "LLM_PARSE_ERROR";
    throw err;
  }

  return normalizeAnalysis(parsed);
}

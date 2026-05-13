import { runLegacyAnalysis } from "../services/llmService.js";

/**
 * POST /api/analyze
 * Body: { code: string }
 */
export async function analyzeLegacyCode(req, res, next) {
  try {
    const code = req.body?.code;

    if (code === undefined || code === null) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Request body must include a string field `code`.",
      });
    }

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Code cannot be empty.",
      });
    }

    const analysis = await runLegacyAnalysis(code.trim());
    return res.status(200).json(analysis);
  } catch (err) {
    next(err);
  }
}

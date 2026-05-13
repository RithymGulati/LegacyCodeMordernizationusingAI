import "dotenv/config";
import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyzeRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: "512kb" }));

app.use("/api/analyze", analyzeRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found", message: "No route for this path." });
});

app.use((err, req, res, next) => {
  console.error("[server]", err?.message || err);
  const status = err.statusCode || err.status || 500;
  const message =
    err.expose && err.message
      ? err.message
      : status === 500
        ? "Internal server error"
        : err.message || "Request failed";
  const payload = {
    error: err.code || "SERVER_ERROR",
    message,
  };
  if (err.details !== undefined) payload.details = err.details;
  res.status(status >= 400 && status < 600 ? status : 500).json(payload);
});

app.listen(PORT, () => {
  console.log(`LegacyAI backend listening on http://localhost:${PORT}`);
});

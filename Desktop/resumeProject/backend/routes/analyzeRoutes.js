import { Router } from "express";
import { analyzeLegacyCode } from "../controllers/analyzeController.js";

const router = Router();

router.post("/", analyzeLegacyCode);

export default router;

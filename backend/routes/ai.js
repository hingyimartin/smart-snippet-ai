import express from "express";
import { analyzeSnippet, getUsage } from "../controllers/aiController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/analyze", authenticateToken, analyzeSnippet);
router.get("/usage", authenticateToken, getUsage);

export default router;

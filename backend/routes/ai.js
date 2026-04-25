import express from "express";
import { analyzeSnippet } from "../controllers/aiController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/analyze", authenticateToken, analyzeSnippet);

export default router;

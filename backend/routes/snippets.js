import express from "express";
import {
  createSnippet,
  getSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  getPublicSnippets,
} from "../controllers/snippetController.js";
import { authenticateToken } from "../middleware/auth.js";
import { vote } from "../controllers/voteController.js";

const router = express.Router();

router.post("/", authenticateToken, createSnippet);
router.get("/", authenticateToken, getSnippets);
router.get("/explore", getPublicSnippets);
router.get("/:id", authenticateToken, getSnippetById);
router.put("/:id", authenticateToken, updateSnippet);
router.delete("/:id", authenticateToken, deleteSnippet);

router.post("/:id/vote", authenticateToken, vote);

export default router;

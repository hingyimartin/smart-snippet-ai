import express from "express";
import {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getSnippets,
  deleteSnippet,
  toggleSnippetVisibility,
} from "../controllers/adminController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/snippets", getSnippets);
router.delete("/snippets/:id", deleteSnippet);
router.put("/snippets/:id/visibility", toggleSnippetVisibility);

export default router;

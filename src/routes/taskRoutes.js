import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createTask, getTasks, deleteTask } from "../controllers/taskController.js";


const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  // - Create task
  // - Attach owner = req.user._id
  await createTask(req, res)
});

// GET /api/tasks
router.get("/", async (req, res) => {
  // - Return only tasks belonging to req.user
  await getTasks(req, res)
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  // - Check ownership
  // - Delete task
  await deleteTask(req, res)
});

export default router;


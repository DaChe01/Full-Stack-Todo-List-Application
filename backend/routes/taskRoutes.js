import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import {
  getTasks,
  addTask,
  updateTask,
  toggleComplete,
  deleteTask,
  clearCompleted,
} from "../controllers/taskController.js";

const router = express.Router();

// Protect all task routes
router.use(protect);

// Get all tasks
router.get("/", getTasks);

// Add a new task
router.post(
  "/",
  [body("title").notEmpty().withMessage("Title is required")],
  addTask
);

// Update a task
router.put("/:id", updateTask);

// Toggle task completion
router.patch("/:id/complete", toggleComplete);

// Clear all completed tasks ✅ must be BEFORE /:id
router.delete("/completed", clearCompleted);

// Delete a single task
router.delete("/:id", deleteTask);

export default router;

import pool from "../config/db.js";
import { validationResult } from "express-validator";

// Get all tasks for authenticated user
export const getTasks = async (req, res) => {
  const userId = req.user.id;
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id=$1 ORDER BY created_at DESC",
    [userId]
  );
  res.json(result.rows);
};

// Add new task
export const addTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { title, description, priority, due_date } = req.body;
  const userId = req.user.id;

  const newTask = await pool.query(
    `INSERT INTO tasks (user_id, title, description, priority, due_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, title, description || "", priority || "Medium", due_date || null]
  );

  res.status(201).json(newTask.rows[0]);
};

// Update task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, due_date } = req.body;
  const userId = req.user.id;

  const updated = await pool.query(
    `UPDATE tasks
     SET title=$1, description=$2, priority=$3, due_date=$4, updated_at=NOW()
     WHERE id=$5 AND user_id=$6
     RETURNING *`,
    [title, description || "", priority || "Medium", due_date || null, id, userId]
  );

  if (updated.rows.length === 0)
    return res.status(404).json({ message: "Task not found" });

  res.json(updated.rows[0]);
};

// Toggle complete
export const toggleComplete = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const task = await pool.query(
    `UPDATE tasks
     SET completed = NOT completed, updated_at=NOW()
     WHERE id=$1 AND user_id=$2
     RETURNING *`,
    [id, userId]
  );

  if (task.rows.length === 0)
    return res.status(404).json({ message: "Task not found" });

  res.json(task.rows[0]);
};

// Delete task
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const deleted = await pool.query(
    `DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *`,
    [id, userId]
  );

  if (deleted.rows.length === 0)
    return res.status(404).json({ message: "Task not found" });

  res.json({ message: "Task deleted successfully" });
};

// Clear all completed tasks
export const clearCompleted = async (req, res) => {
  const userId = req.user.id;
  await pool.query("DELETE FROM tasks WHERE user_id=$1 AND completed=true", [userId]);
  res.json({ message: "Cleared completed tasks" });
};

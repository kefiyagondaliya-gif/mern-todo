const express = require("express");
const { body } = require("express-validator");
const {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  clearCompleted,
} = require("../controllers/task.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/", getTasks);

router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Task title is required").isLength({ max: 200 }).withMessage("Title too long"),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
    body("dueDate").optional({ nullable: true }).isISO8601().withMessage("Invalid date format"),
  ],
  createTask
);

router.delete("/clear-completed", clearCompleted);

router.put("/:id", updateTask);

router.patch("/:id/toggle", toggleTask);

router.delete("/:id", deleteTask);

module.exports = router;

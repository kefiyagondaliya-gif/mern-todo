const { validationResult } = require("express-validator");
const Task = require("../models/Task");

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, sort = "-createdAt" } = req.query;

    const filter = { user: req.user._id };
    if (status && ["pending", "completed"].includes(status)) filter.status = status;
    if (priority && ["low", "medium", "high"].includes(priority)) filter.priority = priority;

    const tasks = await Task.find(filter).sort(sort).lean();

    const stats = {
      total: await Task.countDocuments({ user: req.user._id }),
      pending: await Task.countDocuments({ user: req.user._id, status: "pending" }),
      completed: await Task.countDocuments({ user: req.user._id, status: "completed" }),
    };

    res.json({ success: true, count: tasks.length, stats, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch tasks." });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate,
    });

    res.status(201).json({ success: true, message: "Task created.", task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create task." });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.json({ success: true, message: "Task updated.", task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update task." });
  }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }

    task.status = task.status === "pending" ? "completed" : "pending";
    await task.save();

    res.json({ success: true, message: `Task marked as ${task.status}.`, task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to toggle task." });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }

    res.json({ success: true, message: "Task deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete task." });
  }
};

// @desc    Delete all completed tasks
// @route   DELETE /api/tasks/clear-completed
// @access  Private
const clearCompleted = async (req, res) => {
  try {
    const result = await Task.deleteMany({ user: req.user._id, status: "completed" });
    res.json({ success: true, message: `${result.deletedCount} completed tasks cleared.` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to clear tasks." });
  }
};

module.exports = { getTasks, createTask, updateTask, toggleTask, deleteTask, clearCompleted };

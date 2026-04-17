import { useState } from "react";
import Button from "./Button";
import styles from "./TaskCard.module.css";

const PRIORITY_CONFIG = {
  high: { label: "High", color: "#ef4444" },
  medium: { label: "Medium", color: "#f59e0b" },
  low: { label: "Low", color: "#22c55e" },
};

export default function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isCompleted = task.status === "completed";
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(task._id);
    setToggling(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task._id);
    setDeleting(false);
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const now = new Date();
    const isPast = d < now && !isCompleted;
    return {
      text: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      isPast,
    };
  };

  const due = task.dueDate ? formatDate(task.dueDate) : null;

  return (
    <div className={`${styles.card} ${isCompleted ? styles.completed : ""}`}>
      {/* Priority indicator */}
      <span
        className={styles.priorityBar}
        style={{ background: priority.color }}
      />

      {/* Checkbox */}
      <button
        className={`${styles.checkbox} ${isCompleted ? styles.checked : ""}`}
        onClick={handleToggle}
        disabled={toggling}
        aria-label="Toggle task"
      >
        {isCompleted && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className={styles.content}>
        <p className={`${styles.title} ${isCompleted ? styles.strikethrough : ""}`}>
          {task.title}
        </p>
        {task.description && (
          <p className={styles.desc}>{task.description}</p>
        )}
        <div className={styles.meta}>
          <span className={styles.priorityBadge} style={{ color: priority.color, background: `${priority.color}18` }}>
            {priority.label}
          </span>
          {due && (
            <span className={`${styles.due} ${due.isPast ? styles.overdue : ""}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {due.text}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={() => onEdit(task)} title="Edit">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={handleDelete}
          disabled={deleting}
          title="Delete"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  fetchTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  clearCompleted,
} from "../utils/api";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import Button from "../components/Button";
import styles from "./Dashboard.module.css";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

const PRIORITY_FILTERS = [
  { label: "Any Priority", value: "" },
  { label: "🔴 High", value: "high" },
  { label: "🟡 Medium", value: "medium" },
  { label: "🟢 Low", value: "low" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const { data } = await fetchTasks(params);
      setTasks(data.tasks);
      setStats(data.stats);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (formData) => {
    try {
      const { data } = await createTask(formData);
      setTasks((prev) => [data.task, ...prev]);
      setStats((s) => ({ ...s, total: s.total + 1, pending: s.pending + 1 }));
      toast.success("Task added!");
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleEdit = async (formData) => {
    try {
      const { data } = await updateTask(editTask._id, formData);
      setTasks((prev) => prev.map((t) => (t._id === editTask._id ? data.task : t)));
      toast.success("Task updated!");
      setEditTask(null);
      setModalOpen(false);
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
      const wasCompleted = tasks.find((t) => t._id === id)?.status === "completed";
      setStats((s) => ({
        ...s,
        completed: wasCompleted ? s.completed - 1 : s.completed + 1,
        pending: wasCompleted ? s.pending + 1 : s.pending - 1,
      }));
    } catch {
      toast.error("Failed to toggle task");
    }
  };

  const handleDelete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setStats((s) => ({
        ...s,
        total: s.total - 1,
        [task?.status]: s[task?.status] - 1,
      }));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleClearCompleted = async () => {
    if (!stats.completed) return;
    try {
      await clearCompleted();
      setTasks((prev) => prev.filter((t) => t.status !== "completed"));
      setStats((s) => ({ ...s, total: s.total - s.completed, completed: 0 }));
      toast.success("Completed tasks cleared");
    } catch {
      toast.error("Failed to clear tasks");
    }
  };

  const openEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  // Client-side search filter
  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <div className={styles.logo}>✦</div>
            <span className={styles.brandName}>TaskFlow</span>
          </div>

          <div className={styles.userCard}>
            <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.name}</p>
              <p className={styles.userEmail}>{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{stats.total}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum} style={{ color: "#f59e0b" }}>{stats.pending}</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum} style={{ color: "#22c55e" }}>{stats.completed}</span>
              <span className={styles.statLabel}>Done</span>
            </div>
          </div>

          {/* Progress */}
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Overall Progress</span>
              <span className={styles.progressPct}>{progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <nav className={styles.nav}>
            <p className={styles.navLabel}>Filter by Status</p>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`${styles.navItem} ${statusFilter === f.value ? styles.navActive : ""}`}
                onClick={() => setStatusFilter(f.value)}
              >
                {f.label}
                {f.value === "" && <span className={styles.navCount}>{stats.total}</span>}
                {f.value === "pending" && <span className={styles.navCount}>{stats.pending}</span>}
                {f.value === "completed" && <span className={styles.navCount}>{stats.completed}</span>}
              </button>
            ))}
          </nav>

          {/* Priority Filter */}
          <nav className={styles.nav}>
            <p className={styles.navLabel}>Filter by Priority</p>
            {PRIORITY_FILTERS.map((f) => (
              <button
                key={f.value}
                className={`${styles.navItem} ${priorityFilter === f.value ? styles.navActive : ""}`}
                onClick={() => setPriorityFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </nav>
        </div>

        <button className={styles.logoutBtn} onClick={logout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>
              {statusFilter === "completed" ? "Completed Tasks" :
               statusFilter === "pending" ? "Pending Tasks" : "My Tasks"}
            </h1>
            <p className={styles.pageSubtitle}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className={styles.headerActions}>
            {stats.completed > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearCompleted}>
                Clear Completed
              </Button>
            )}
            <Button size="md" onClick={() => { setEditTask(null); setModalOpen(true); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Task
            </Button>
          </div>
        </header>

        {/* Search */}
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch("")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Task List */}
        <div className={styles.taskList}>
          {loading ? (
            <div className={styles.loadingState}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                {search ? "🔍" : statusFilter === "completed" ? "🎯" : "📋"}
              </div>
              <p className={styles.emptyTitle}>
                {search ? "No tasks match your search" :
                 statusFilter === "completed" ? "No completed tasks yet" :
                 statusFilter === "pending" ? "No pending tasks — you're all caught up!" :
                 "No tasks yet. Create your first one!"}
              </p>
              {!search && !statusFilter && (
                <Button size="sm" onClick={() => setModalOpen(true)}>
                  Add Task
                </Button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={openEdit}
              />
            ))
          )}
        </div>
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={editTask ? handleEdit : handleCreate}
        editTask={editTask}
      />
    </div>
  );
}

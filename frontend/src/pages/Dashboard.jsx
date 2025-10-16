import { useState, useEffect } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingPriority, setEditingPriority] = useState("Medium");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date");

  const name = localStorage.getItem("name") || "Developer";

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleLogout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) handleLogout();
    else fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTitle) return;
    try {
      const res = await API.post("/tasks", {
        title: newTitle,
        description: newDescription,
        priority: newPriority,
        due_date: newDueDate || null,
      });
      setTasks([res.data, ...tasks]);
      setNewTitle("");
      setNewDescription("");
      setNewPriority("Medium");
      setNewDueDate("");
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditingTitle(task.title);
    setEditingDescription(task.description);
    setEditingPriority(task.priority || "Medium");
    setEditingDueDate(task.due_date || "");
  };

  const saveEdit = async () => {
    try {
      const res = await API.put(`/tasks/${editingTask}`, {
        title: editingTitle,
        description: editingDescription,
        priority: editingPriority,
        due_date: editingDueDate || null,
      });
      setTasks(tasks.map((t) => (t.id === editingTask ? res.data : t)));
      cancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditingTitle("");
    setEditingDescription("");
    setEditingPriority("Medium");
    setEditingDueDate("");
  };

  const toggleComplete = async (task) => {
    try {
      const res = await API.patch(`/tasks/${task.id}/complete`);
      setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const clearCompleted = async () => {
    try {
      await API.delete("/tasks/completed");
      setTasks(tasks.filter((t) => !t.completed));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.href = "/";
  };

  const filteredTasks = tasks
    .filter((t) => (filter === "active" ? !t.completed : filter === "completed" ? t.completed : true))
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "priority") {
        const prioOrder = { High: 1, Medium: 2, Low: 3 };
        return (prioOrder[a.priority] || 4) - (prioOrder[b.priority] || 4);
      } else if (sort === "alphabet") return a.title.localeCompare(b.title);
      else return new Date(a.due_date || a.created_at) - new Date(b.due_date || b.created_at);
    });

  return (
    <div className="dashboard-container">
      {/* Welcome */}
      <div className="header">
        <h2>Welcome, {name} 👋</h2>
        <p className="motivation">Stay Organized. Stay Consistent. Keep Building 🚀</p>
      </div>

      <h1>Tasks Dashboard</h1>

      {/* Add Task */}
      <div className="add-task-form">
        <input type="text" placeholder="Task title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <input type="text" placeholder="Description..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
        <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Search & Sort */}
      <div className="search-sort">
        <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="alphabet">Sort Alphabetically</option>
        </select>
      </div>

      {/* Filters */}
      <div className="filters">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
        <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>Active</button>
        <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed</button>
      </div>

      {/* Counter & Clear */}
      <p>Total: {tasks.length} | Active: {tasks.filter((t) => !t.completed).length} | Completed: {tasks.filter((t) => t.completed).length}</p>
      <button className="danger-btn" onClick={clearCompleted}>Clear Completed Tasks</button>

      {/* Task List */}
      <ul>
        {filteredTasks.map((t) => (
          <li key={t.id} className={t.completed ? "completed" : ""}>
            <div className="task-row">
              {/* Checkbox */}
              <input type="checkbox" checked={t.completed} onChange={() => toggleComplete(t)} className="task-checkbox" />

              {/* Task Name + Priority */}
              <div className="task-info">
                <span className="task-title">{t.title}</span>
                {t.priority && <span className={`badge-${t.priority.toLowerCase()}`}>{t.priority}</span>}
              </div>

              {/* Due Date */}
              {t.due_date && <span className="task-date">{new Date(t.due_date).toLocaleDateString()}</span>}

              {/* Edit & Delete */}
              <div className="task-actions">
                <button onClick={() => startEditing(t)}>Edit</button>
                <button onClick={() => deleteTask(t.id)}>Delete</button>
              </div>
            </div>

            {/* Editing Form */}
            {editingTask === t.id && (
              <div className="editing-form">
                <input type="text" value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} />
                <input type="text" value={editingDescription} onChange={(e) => setEditingDescription(e.target.value)} />
                <select value={editingPriority} onChange={(e) => setEditingPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <input type="date" value={editingDueDate} onChange={(e) => setEditingDueDate(e.target.value)} />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="logout-container">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

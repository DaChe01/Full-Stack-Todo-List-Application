import { useState, useEffect } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date"); // default sort by date

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) handleLogout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) handleLogout();
    else fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask) return;
    try {
      const res = await API.post("/tasks", {
        title: newTask,
        priority,
        dueDate: dueDate || null,
      });
      setTasks([res.data, ...tasks]);
      setNewTask("");
      setPriority("Medium");
      setDueDate("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await API.patch(`/tasks/${task.id}/complete`);
      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      );
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

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "priority") {
        const prioOrder = { High: 1, Medium: 2, Low: 3 };
        return (prioOrder[a.priority] || 4) - (prioOrder[b.priority] || 4);
      } else if (sort === "alphabet") {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(a.dueDate || a.created_at) - new Date(b.dueDate || b.created_at);
      }
    });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <h1>Tasks Dashboard</h1>

      {/* Add Task */}
      <div className="add-task-form">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Search & Sort */}
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="alphabet">Sort Alphabetically</option>
        </select>
      </div>

      {/* Filters */}
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* Counter & Clear Completed */}
      <p className="task-counter">
        Total: {tasks.length} | Active: {tasks.filter((t) => !t.completed).length} | Completed:{" "}
        {tasks.filter((t) => t.completed).length}
      </p>
      <button className="danger-btn" onClick={clearCompleted}>
        Clear Completed Tasks
      </button>

      {/* Task List */}
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <div className="task-left">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
              />
              <span>{task.title}</span>
              {task.priority && (
                <span
                  className={
                    task.priority === "High"
                      ? "badge-high"
                      : task.priority === "Medium"
                      ? "badge-medium"
                      : "badge-low"
                  }
                >
                  {task.priority}
                </span>
              )}
              {task.dueDate && (
                <span className="due-date">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <button className="danger-btn" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Logout at Bottom */}
      <div className="logout-container">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

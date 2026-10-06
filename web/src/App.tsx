import { useEffect, useState } from "react";
import "./index.css";

type Task = { id: number; title: string; done: boolean };

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(localStorage.getItem("tasks") ?? "[]"));
  const [title, setTitle] = useState("");

  useEffect(() => localStorage.setItem("tasks", JSON.stringify(tasks)), [tasks]);

  function addTask(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: title.trim(), done: false }]);
    setTitle("");
  }

  const toggle = (id: number) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: number) => setTasks(tasks.filter((t) => t.id !== id));

  return (
    <main className="app">
      <h1>TaskFlow</h1>
      <form onSubmit={addTask}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs doing?" />
        <button>Add</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? "done" : ""}>
            <input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} />
            <span>{task.title}</span>
            <button onClick={() => remove(task.id)} aria-label="Delete">×</button>
          </li>
        ))}
      </ul>
      <p className="count">{tasks.filter((t) => !t.done).length} left</p>
    </main>
  );
}

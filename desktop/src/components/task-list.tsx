import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { BellIcon, DownloadIcon, LockIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLicence } from "@/hooks/licence-context";
import { type Task, toCsv } from "@/tasks";

interface TaskListProps {
  tasks: Task[];
  setTasks: (update: (tasks: Task[]) => Task[]) => void;
}

export function TaskList({ tasks, setTasks }: TaskListProps) {
  const { isUnlocked, requestUpgrade } = useLicence();
  const [title, setTitle] = useState("");
  const [remindingId, setRemindingId] = useState<number | null>(null);

  function addTask(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setTasks((all) => [...all, { id: Date.now(), title: title.trim(), done: false }]);
    setTitle("");
  }

  const update = (id: number, changes: Partial<Task>) => setTasks((all) => all.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  const remove = (id: number) => setTasks((all) => all.filter((t) => t.id !== id));

  // Pro: a reminder on a task.
  function openReminder(id: number) {
    if (!isUnlocked("reminders")) return requestUpgrade("reminders");
    setRemindingId(remindingId === id ? null : id);
  }

  // Pro: save the tasks as a CSV file.
  async function exportTasks() {
    if (!isUnlocked("export")) return requestUpgrade("export");
    const path = await save({ defaultPath: "tasks.csv", filters: [{ name: "CSV", extensions: ["csv"] }] });
    if (!path) return;
    await writeTextFile(path, toCsv(tasks));
    toast.success(`Saved ${tasks.length} tasks to ${path.split("/").pop()}`);
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-semibold">Tasks</h1>
        <Button variant="outline" size="sm" onClick={exportTasks}>
          <DownloadIcon />
          Export
          {!isUnlocked("export") && <LockIcon className="text-muted-foreground" aria-label="Pro feature" />}
        </Button>
      </div>

      <form onSubmit={addTask} className="mb-4 flex gap-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs doing?" />
        <Button type="submit">Add</Button>
      </form>

      <ul className="grid gap-2">
        {tasks.map((task) => (
          <li key={task.id} className="rounded-lg border bg-card p-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={task.done} onChange={() => update(task.id, { done: !task.done })} aria-label={`Done: ${task.title}`} />
              <span className={task.done ? "flex-1 text-muted-foreground line-through" : "flex-1"}>{task.title}</span>
              {task.remindAt && !task.done && <span className="text-xs text-muted-foreground">{new Date(task.remindAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>}
              <Button size="icon-sm" variant="ghost" onClick={() => openReminder(task.id)} aria-label={`Remind me: ${task.title}`}>
                {isUnlocked("reminders") ? <BellIcon /> : <LockIcon />}
              </Button>
              <Button size="icon-sm" variant="ghost" onClick={() => remove(task.id)} aria-label={`Delete: ${task.title}`}>
                <XIcon />
              </Button>
            </div>
            {remindingId === task.id && (
              <div className="mt-3 flex items-center gap-2 pl-7">
                <Input
                  type="datetime-local"
                  aria-label="Reminder time"
                  value={task.remindAt ?? ""}
                  onChange={(e) => update(task.id, { remindAt: e.target.value, reminded: false })}
                  className="max-w-60"
                />
                <Button size="sm" variant="ghost" onClick={() => setRemindingId(null)}>
                  Done
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>{tasks.filter((t) => !t.done).length} left</span>
        {tasks.some((t) => t.done) && (
          <Button size="sm" variant="ghost" onClick={() => setTasks((all) => all.filter((t) => !t.done))}>
            Clear completed
          </Button>
        )}
      </div>
    </div>
  );
}

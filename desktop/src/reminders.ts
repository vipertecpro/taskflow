import { notify } from "@desktop-kit/notify";
import { useEffect } from "react";
import { toast } from "sonner";

import type { Task } from "@/tasks";

/** Shows a desktop notification when a task's reminder time arrives. */
export function useReminders(tasks: Task[], setTasks: (update: (tasks: Task[]) => Task[]) => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => {
      const due = tasks.filter((t) => t.remindAt && !t.reminded && !t.done && new Date(t.remindAt) <= new Date());
      if (due.length === 0) return;
      for (const task of due) {
        // In pnpm dev, macOS can't show notifications, so show the reminder in the window.
        void notify("TaskFlow reminder", task.title).then((shown) => shown || toast(`Reminder: ${task.title}`));
      }
      setTasks((all) => all.map((t) => (due.some((d) => d.id === t.id) ? { ...t, reminded: true } : t)));
    }, 5000);
    return () => clearInterval(timer);
  }, [tasks, setTasks, enabled]);
}

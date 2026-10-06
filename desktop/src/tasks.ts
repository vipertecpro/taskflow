export type Task = { id: number; title: string; done: boolean; remindAt?: string; reminded?: boolean };

export const loadTasks = (): Task[] => JSON.parse(localStorage.getItem("tasks") ?? "[]");
export const saveTasks = (tasks: Task[]) => localStorage.setItem("tasks", JSON.stringify(tasks));

/** The tasks as CSV, for Excel or Numbers. */
export function toCsv(tasks: Task[]): string {
  const cell = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const rows = tasks.map((t) => [cell(t.title), t.done ? "yes" : "no", t.remindAt ?? ""].join(","));
  return ["Task,Done,Reminder", ...rows].join("\n");
}

import { useEffect, useState } from "react";

import { LicenceBanner } from "@/components/licence-banner";
import { LicenceProvider } from "@/components/licence-provider";
import { SettingsView } from "@/components/settings-view";
import { Sidebar } from "@/components/sidebar";
import { TaskList } from "@/components/task-list";
import { Toaster } from "@/components/ui/sonner";
import { useLicence } from "@/hooks/licence-context";
import { useReminders } from "@/reminders";
import { loadTasks, saveTasks, type Task } from "@/tasks";

export default function App() {
  return (
    <LicenceProvider>
      <TaskFlow />
      <Toaster position="bottom-right" />
    </LicenceProvider>
  );
}

function TaskFlow() {
  const { isUnlocked } = useLicence();
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [view, setView] = useState<"tasks" | "settings">(initialView);

  useEffect(() => saveTasks(tasks), [tasks]);
  useReminders(tasks, setTasks, isUnlocked("reminders"));

  return (
    <div className="flex h-svh bg-background text-foreground">
      <Sidebar
        view={view}
        remaining={tasks.filter((t) => !t.done).length}
        onOpenTasks={() => setView("tasks")}
        onOpenSettings={() => setView("settings")}
      />
      <main className="flex min-w-0 flex-1 flex-col">
        <LicenceBanner />
        {view === "settings" ? <SettingsView /> : <TaskList tasks={tasks} setTasks={setTasks} />}
      </main>
    </div>
  );
}

/** Development preview links can open Settings directly (see `src/dev/preview.ts`). */
function initialView(): "tasks" | "settings" {
  return import.meta.env.DEV && new URLSearchParams(window.location.search).get("view") === "settings" ? "settings" : "tasks";
}

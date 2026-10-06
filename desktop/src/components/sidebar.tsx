import { ListTodoIcon, SettingsIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLicence } from "@/hooks/licence-context";
import { summarise } from "@desktop-kit/licensing";

const badgeVariant = { good: "secondary", attention: "outline", blocked: "destructive" } as const;

interface SidebarProps {
  view: "tasks" | "settings";
  remaining: number;
  onOpenTasks: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ view, remaining, onOpenTasks, onOpenSettings }: SidebarProps) {
  const { state } = useLicence();
  const summary = state ? summarise(state) : null;

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-muted/30">
      <div className="px-4 pt-4 pb-3 font-heading text-lg font-semibold">TaskFlow</div>
      <nav className="flex flex-1 flex-col gap-0.5 px-2" aria-label="TaskFlow">
        <Button variant={view === "tasks" ? "secondary" : "ghost"} size="sm" className="justify-start" onClick={onOpenTasks}>
          <ListTodoIcon />
          Tasks
          <span className="ml-auto text-xs text-muted-foreground">{remaining}</span>
        </Button>
      </nav>
      <div className="grid gap-2 border-t p-3">
        {summary && (
          <button type="button" onClick={onOpenSettings} className="text-left" aria-label={`Licence: ${summary.label}. Open settings.`}>
            <Badge variant={badgeVariant[summary.tone]}>{summary.label}</Badge>
          </button>
        )}
        <Button variant={view === "settings" ? "secondary" : "ghost"} size="sm" className="justify-start" onClick={onOpenSettings}>
          <SettingsIcon />
          Settings
        </Button>
      </div>
    </aside>
  );
}

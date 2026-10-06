/**
 * Preview mode: the app's screens in a browser with sample licence data
 * instead of the Rust plugin. Development builds only.
 *
 *   pnpm preview   then open   http://localhost:1420/?preview=trial
 */
import { installPreview as installLicencePreview } from "@desktop-kit/licensing/preview";

import { PRO_FEATURES } from "@/features";
import { saveTasks } from "@/tasks";

export function installPreview(params: URLSearchParams): void {
  saveTasks([
    { id: 1, title: "Buy groceries", done: false },
    { id: 2, title: "Finish the launch video", done: true },
    { id: 3, title: "Call the accountant", done: false, remindAt: "2026-10-07T10:00" },
    { id: 4, title: "Book flights for the conference", done: false },
  ]);
  installLicencePreview(params.get("preview"), {
    features: Object.keys(PRO_FEATURES),
    product: "com.samrivera.taskflow",
  });
}

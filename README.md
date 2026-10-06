# TaskFlow

A small to-do app, built from scratch and turned into a desktop app you can sell: notarised for macOS, with a free trial, licence keys and paid features.

It's the example from the **"Build and sell a desktop app from scratch"** video, and it's free to use and learn from (MIT).

| Folder | What it is |
|---|---|
| `web/` | The to-do app as a plain React + Vite website. Runs on its own: `pnpm install && pnpm dev`. |
| `desktop/` | The same app inside [Tauri Desktop Kit](https://vipertecpro.com/products/tauri-desktop-kit): the files you add or change in the kit's React demo to make TaskFlow. |

## What TaskFlow does

- **Free:** add, complete and delete tasks. Saved on the computer.
- **Pro (7-day free trial, then a licence):**
  - **Reminders:** a desktop notification when a task is due.
  - **Export:** save your tasks as a CSV file through the normal Save dialog.

## Building the desktop version

The desktop version needs **Tauri Desktop Kit** (sold separately, $119). The kit provides everything that isn't the to-do list: the licence checks, free trial, upgrade dialog, licence server, notarised releases, updates and notifications that work on macOS 26. This repository contains only TaskFlow's own code.

With the kit unzipped:

```bash
pnpm install
pnpm kit:init                      # React · "TaskFlow" · com.yourname.taskflow · 7-day trial
cd apps/react
pnpm tauri add dialog              # the Save dialog
pnpm tauri add fs                  # writing the CSV file
pnpm tauri icon <path>/desktop/icon/taskflow-icon.png
```

Then:

1. Copy everything in `desktop/src/` into `apps/react/src/` (it replaces `App.tsx`, `App.test.tsx`, `components/sidebar.tsx` and `dev/preview.ts`). Delete `components/note-editor.tsx` and `components/pro-toggle.tsx`, which TaskFlow doesn't use.
2. In `apps/react/src/components/upgrade-dialog.tsx`, import the features from TaskFlow instead of the demo:
   ```ts
   import { PRO_FEATURES, type ProFeature } from "@/features";
   ```
3. Allow writing the exported file: add `"fs:allow-write-text-file"` to the `permissions` in `apps/react/src-tauri/capabilities/default.json` (see `desktop/capabilities-default.json`).
4. In the kit's `.env`, set `KIT_TRIAL_FEATURES=reminders,export`.
5. `pnpm licence:serve` in one terminal, `pnpm dev` in another.

Activate the demo key `DEMO-PRO-2026` in TaskFlow's Settings to unlock Pro. Reminders show inside the window in `pnpm dev`, and as macOS notifications in the built app (`pnpm build`).

## Licence

MIT, for TaskFlow's code in this repository. Tauri Desktop Kit has its own commercial licence.

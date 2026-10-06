/** TaskFlow's paid features. The keys must match the licences your server issues. */
export const PRO_FEATURES = {
  reminders: {
    name: "Reminders",
    description: "A desktop notification when a task is due.",
  },
  export: {
    name: "Export",
    description: "Save your tasks as a CSV file for Excel or Numbers.",
  },
} as const;

export type ProFeature = keyof typeof PRO_FEATURES;

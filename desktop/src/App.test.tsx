import { installPreview } from "@desktop-kit/licensing/preview";
import { clearMocks } from "@tauri-apps/api/mocks";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import App from "@/App";
import { PRO_FEATURES } from "@/features";

const features = Object.keys(PRO_FEATURES);

afterEach(() => {
  cleanup();
  clearMocks();
  localStorage.clear();
});

describe("TaskFlow", () => {
  it("shows the trial countdown", async () => {
    installPreview("trial", { features });
    render(<App />);

    expect(await screen.findByText("Trial · 11 days left")).toBeInTheDocument();
  });

  it("opens the upgrade dialog from a locked Pro feature once the trial has ended", async () => {
    installPreview("trial-ended", { features });
    render(<App />);

    fireEvent.click(await screen.findByRole("button", { name: /Export/ }));

    expect(await screen.findByText("Your free trial has ended")).toBeInTheDocument();
    expect(screen.getByText(/Export is a Pro feature/)).toBeInTheDocument();
  });

  it("adds and completes tasks for free", async () => {
    installPreview("trial-ended", { features });
    render(<App />);

    fireEvent.change(await screen.findByPlaceholderText("What needs doing?"), { target: { value: "Water the plants" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    fireEvent.click(await screen.findByRole("checkbox", { name: "Done: Water the plants" }));

    expect(screen.getByRole("checkbox", { name: "Done: Water the plants" })).toBeChecked();
  });

  it("activates a key from Settings", async () => {
    installPreview("trial", { features });
    render(<App />);

    fireEvent.click(await screen.findByRole("button", { name: "Settings" }));
    fireEvent.change(await screen.findByLabelText("Licence key"), { target: { value: "DEMO-PRO-2026" } });
    fireEvent.click(screen.getByRole("button", { name: "Activate" }));

    expect(await screen.findByText("Licensed to Ada Lovelace.")).toBeInTheDocument();
  });
});

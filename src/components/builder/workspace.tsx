"use client";

import { ComponentLibrary } from "@/components/builder/component-library";
import { BuilderCanvas } from "@/components/builder/canvas";
import { NavigatorPanel } from "@/components/builder/navigator-panel";
import { SettingsPanel } from "@/components/builder/settings-panel";
import { TopToolbar } from "@/components/builder/top-toolbar";
import { useBuilder } from "@/components/builder/builder-context";

export function BuilderWorkspace() {
  const { activeBreakpoint } = useBuilder();

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6 xl:p-10">
      <TopToolbar />
      <div className="grid gap-4 xl:hidden">
        <div className="grid gap-4 rounded-2xl border border-[var(--builder-border)] bg-[var(--builder-surface)] p-4">
          <NavigatorPanel />
          <ComponentLibrary />
        </div>
        <SettingsPanel />
      </div>
      <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-6 overflow-hidden xl:grid-cols-[320px_1fr_360px]">
        <div className="hidden h-full flex-col gap-4 xl:flex">
          <NavigatorPanel />
          <ComponentLibrary />
        </div>
        <div className="flex h-full flex-col gap-4">
          <BuilderCanvas />
          <div className="rounded-2xl border border-[var(--builder-border)] bg-[var(--builder-surface)] p-4 text-xs text-slate-400">
            Adjusting styles for{" "}
            <span className="font-semibold text-[var(--builder-primary)]">
              {activeBreakpoint}
            </span>{" "}
            breakpoint. Use keyboard shortcuts for precision nudging:{" "}
            <kbd className="rounded border border-[var(--builder-border)] bg-[var(--builder-surface-subtle)] px-2">
              Alt
            </kbd>{" "}
            + arrow keys.
          </div>
        </div>
        <div className="hidden h-full xl:flex">
          <SettingsPanel />
        </div>
      </div>
    </div>
  );
}

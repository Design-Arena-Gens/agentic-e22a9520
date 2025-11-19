"use client";

import { useBuilder } from "@/components/builder/builder-context";
import { useTheme } from "@/components/providers/theme-provider";
import {
  Eye,
  Laptop,
  Moon,
  Palette,
  Plus,
  Rocket,
  Save,
  Sun,
  Undo,
  Redo,
  Smartphone,
  Tablet,
  PanelLeft,
} from "lucide-react";
import { useState } from "react";

const breakpoints = [
  { id: "desktop", label: "Desktop", icon: Laptop },
  { id: "tablet", label: "Tablet", icon: Tablet },
  { id: "mobile", label: "Mobile", icon: Smartphone },
] as const;

export function TopToolbar() {
  const { activeBreakpoint, setBreakpoint } = useBuilder();
  const { isDark, toggle } = useTheme();
  const [showPages, setShowPages] = useState(false);

  return (
    <header
      className="flex h-16 items-center justify-between rounded-2xl border border-[var(--builder-border)] bg-[var(--builder-surface)] px-5 text-sm shadow-sm"
      role="banner"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={showPages}
          onClick={() => setShowPages((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-[var(--builder-surface-subtle)] px-3 py-2 font-medium text-slate-700 transition hover:border-[var(--builder-border)] hover:bg-[var(--builder-primary-soft)] hover:text-[var(--builder-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--builder-primary)] dark:text-slate-200"
        >
          <PanelLeft className="size-4" aria-hidden="true" />
          Page: Homepage
        </button>
        {showPages ? (
          <div
            role="dialog"
            aria-label="Page management"
            className="absolute left-6 top-20 z-30 w-72 rounded-2xl border border-[var(--builder-border)] bg-[var(--builder-surface)] p-4 shadow-lg"
          >
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
              Pages
            </p>
            <ul className="flex flex-col gap-2" role="list">
              <li>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-transparent bg-[var(--builder-surface-subtle)] px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-[var(--builder-border)] hover:bg-[var(--builder-primary-soft)] dark:text-slate-200"
                >
                  Homepage
                  <span className="text-xs text-slate-400">Default</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-dashed border-[var(--builder-border)] px-3 py-2 text-left text-sm text-slate-500 transition hover:border-solid hover:text-[var(--builder-primary)]"
                >
                  <Plus className="mr-2 size-4" aria-hidden="true" />
                  New page
                </button>
              </li>
            </ul>
          </div>
        ) : null}
        <div className="hidden items-center gap-2 rounded-full bg-[var(--builder-surface-subtle)] px-2 py-1 md:flex">
          {breakpoints.map((bp) => (
            <button
              key={bp.id}
              type="button"
              onClick={() => setBreakpoint(bp.id)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition focus-visible:outline-none ${
                activeBreakpoint === bp.id
                  ? "bg-[var(--builder-primary)] text-white shadow-md"
                  : "text-slate-500 hover:bg-[var(--builder-primary-soft)] hover:text-[var(--builder-primary)]"
              }`}
              role="tab"
              aria-selected={activeBreakpoint === bp.id}
            >
              <bp.icon className="size-4" aria-hidden="true" />
              {bp.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-full bg-[var(--builder-surface-subtle)] p-1">
          <button
            type="button"
            aria-label="Undo"
            className="rounded-full p-1.5 text-slate-500 transition hover:bg-[var(--builder-primary-soft)] hover:text-[var(--builder-primary)] focus-visible:outline-none"
          >
            <Undo className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Redo"
            className="rounded-full p-1.5 text-slate-500 transition hover:bg-[var(--builder-primary-soft)] hover:text-[var(--builder-primary)] focus-visible:outline-none"
          >
            <Redo className="size-4" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle theme"
          onClick={toggle}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--builder-border)] px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[var(--builder-primary)] hover:text-[var(--builder-primary)] dark:text-slate-200"
        >
          {isDark ? (
            <>
              <Moon className="size-4" aria-hidden="true" /> Dark
            </>
          ) : (
            <>
              <Sun className="size-4" aria-hidden="true" /> Light
            </>
          )}
        </button>

        <button
          type="button"
          className="hidden items-center gap-2 rounded-xl border border-transparent bg-[var(--builder-primary)] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl focus-visible:outline-none sm:flex"
        >
          <Save className="size-4" aria-hidden="true" />
          Save
        </button>
        <button
          type="button"
          className="hidden items-center gap-2 rounded-xl border border-transparent bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-400 hover:shadow-xl focus-visible:outline-none md:flex"
        >
          <Rocket className="size-4" aria-hidden="true" />
          Publish
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--builder-border)] px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[var(--builder-primary)] hover:text-[var(--builder-primary)] dark:text-slate-200"
        >
          <Eye className="size-4" aria-hidden="true" />
          Preview
        </button>
      </div>
    </header>
  );
}

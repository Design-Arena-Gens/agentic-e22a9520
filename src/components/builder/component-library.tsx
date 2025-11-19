"use client";

import { libraryItems } from "@/lib/component-library";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useBuilder } from "@/components/builder/builder-context";

const categoryOrder = ["Layout", "Content", "Forms", "Navigation", "Media"] as const;

export function ComponentLibrary() {
  const { templates, applyTemplate } = useBuilder();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return libraryItems.filter((item) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <section
      aria-label="Component library"
      className="panel h-full overflow-hidden"
      role="region"
    >
      <header className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Components
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Drag components onto the canvas
          </p>
        </div>
        <label className="relative flex items-center" aria-label="Search components">
          <Search
            className="pointer-events-none absolute left-3 size-4 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            className="w-full rounded-xl border border-[var(--builder-border)] bg-transparent py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:text-slate-100"
            placeholder="Search components"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Component categories"
        >
          {["All", ...categoryOrder].map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition",
                activeCategory === category
                  ? "bg-[var(--builder-primary)] text-white shadow"
                  : "bg-[var(--builder-surface-subtle)] text-slate-500 hover:text-[var(--builder-primary)] dark:text-slate-400",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </header>
      <div className="divider" role="presentation" />
      <ul className="scroll-y-soft grow space-y-3 pr-1 text-sm" role="list">
        {filteredItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "copy";
                event.dataTransfer.setData(
                  "application/builder-drag",
                  JSON.stringify({
                    source: "library",
                    itemId: item.id,
                  }),
                );
              }}
              className="flex w-full cursor-grab items-start justify-between rounded-xl border border-[var(--builder-border)] bg-[var(--builder-surface-subtle)] px-4 py-3 text-left transition hover:border-[var(--builder-primary)] hover:bg-[var(--builder-primary-soft)] active:cursor-grabbing"
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-slate-700 dark:text-slate-100">
                  {item.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.description}
                </span>
              </div>
              <span className="rounded-full bg-[var(--builder-surface)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Drag
              </span>
            </button>
          </li>
        ))}
        {filteredItems.length === 0 ? (
          <li className="rounded-xl border border-dashed border-[var(--builder-border)] bg-[var(--builder-surface-subtle)] px-4 py-10 text-center text-xs text-slate-400">
            No components match your search.
          </li>
        ) : null}
      </ul>
      <div className="divider" role="presentation" />
      <section className="space-y-3" aria-label="Templates">
        <p className="control-label">Templates</p>
        <ul className="space-y-3" role="list">
          {templates.map((template) => (
            <li key={template.id}>
              <button
                type="button"
                onClick={() => applyTemplate(template)}
                className="w-full rounded-xl border border-[var(--builder-border)] bg-[var(--builder-surface-subtle)] px-4 py-3 text-left text-sm text-slate-500 transition hover:border-[var(--builder-primary)] hover:bg-[var(--builder-primary-soft)] hover:text-[var(--builder-primary)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-100">
                      {template.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {template.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--builder-surface)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Apply
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

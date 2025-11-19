"use client";

import { useMemo, useState } from "react";
import { useBuilder } from "@/components/builder/builder-context";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Copy, Trash2 } from "lucide-react";

const containerKinds = new Set([
  "section",
  "container",
  "hero",
  "card",
  "form",
  "navbar",
  "carousel",
  "list",
]);

export function NavigatorPanel() {
  const { elements, rootId, selectedId, selectElement, deleteElement, duplicateElement } =
    useBuilder();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const tree = useMemo(() => {
    const buildTree = (id: string): string[] => {
      const element = elements[id];
      if (!element) return [];
      return [id, ...element.children.flatMap((childId) => buildTree(childId))];
    };
    return buildTree(rootId);
  }, [elements, rootId]);

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (id: string, depth = 0): React.ReactNode => {
    const element = elements[id];
    if (!element) return null;
    const isSelected = selectedId === id;
    const isCollapsed = collapsed[id];
    const hasChildren = element.children.length > 0 && containerKinds.has(element.kind);

    return (
      <div key={id} role="treeitem" aria-selected={isSelected} aria-level={depth + 1}>
        <div
          className={cn(
            "group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none",
            isSelected
              ? "bg-[var(--builder-primary-soft)] text-[var(--builder-primary)]"
              : "text-slate-500 hover:bg-[var(--builder-surface-subtle)] hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100",
          )}
          style={{ paddingLeft: `${depth * 1.25 + 1}rem` }}
          tabIndex={0}
          onClick={() => selectElement(id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              selectElement(id);
            }
            if (event.key === "ArrowRight" && hasChildren) {
              event.preventDefault();
              setCollapsed((prev) => ({ ...prev, [id]: false }));
            }
            if (event.key === "ArrowLeft" && hasChildren) {
              event.preventDefault();
              setCollapsed((prev) => ({ ...prev, [id]: true }));
            }
          }}
        >
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <button
                type="button"
                aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${element.name}`}
                className="rounded-full p-1 text-slate-400 transition hover:text-[var(--builder-primary)] focus-visible:outline-none"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleCollapse(id);
                }}
              >
                {isCollapsed ? (
                  <ChevronRight className="size-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="size-4" aria-hidden="true" />
                )}
              </button>
            ) : (
              <span className="ml-5 block size-2 rounded-full bg-slate-300 dark:bg-slate-600" />
            )}
            <div className="flex flex-col">
              <span className="font-medium text-slate-700 dark:text-slate-100">
                {element.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {element.kind}
              </span>
            </div>
          </div>
          {id !== rootId ? (
            <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                aria-label="Duplicate element"
                className="rounded-full p-1 text-slate-400 transition hover:text-[var(--builder-primary)] focus-visible:outline-none"
                onClick={(event) => {
                  event.stopPropagation();
                  duplicateElement(id);
                }}
              >
                <Copy className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Delete element"
                className="rounded-full p-1 text-slate-400 transition hover:text-red-500 focus-visible:outline-none"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteElement(id);
                }}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
        {hasChildren && !isCollapsed ? (
          <div role="group">
            {element.children.map((childId) => renderNode(childId, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section
      aria-label="Element navigator"
      className="panel h-full overflow-hidden"
      role="tree"
    >
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Layers
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Navigate your document structure
          </p>
        </div>
      </header>
      <div className="divider" role="presentation" />
      <div className="scroll-y-soft grow pr-2" role="group">
        {renderNode(rootId)}
      </div>
    </section>
  );
}

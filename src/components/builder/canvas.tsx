"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
  type DragEvent,
  type ReactNode,
} from "react";
import { useBuilder } from "@/components/builder/builder-context";
import { libraryItems } from "@/lib/component-library";
import { Breakpoint, ElementNode } from "@/lib/builder-types";
import { cn } from "@/lib/utils";

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

const tagByKind: Record<string, keyof JSX.IntrinsicElements> = {
  section: "section",
  hero: "section",
  container: "div",
  card: "article",
  heading: "h2",
  paragraph: "p",
  button: "button",
  image: "figure",
  list: "ul",
  "list-item": "li",
  form: "form",
  "form-field": "label",
  navbar: "nav",
  carousel: "div",
  footer: "footer",
  custom: "div",
};

function isContainer(kind: string) {
  return containerKinds.has(kind);
}

function mergeStyles(node: ElementNode, breakpoint: Breakpoint): CSSProperties {
  const styles = node.styles?.[breakpoint] ?? {};
  const result: CSSProperties = {};

  const layout = styles.layout ?? {};
  const typography = styles.typography ?? {};
  const background = styles.background ?? {};
  const border = styles.border ?? {};
  const shadow = styles.shadow ?? {};
  const visibility = styles.visibility ?? {};

  if (layout.display) result.display = layout.display as CSSProperties["display"];
  if (layout.flexDirection) result.flexDirection = layout.flexDirection as
    | CSSProperties["flexDirection"];
  if (layout.justifyContent) result.justifyContent = layout.justifyContent as
    | CSSProperties["justifyContent"];
  if (layout.alignItems) result.alignItems = layout.alignItems as
    | CSSProperties["alignItems"];
  if (layout.alignContent) result.alignContent = layout.alignContent as
    | CSSProperties["alignContent"];
  if (layout.placeItems) result.placeItems = layout.placeItems as
    | CSSProperties["placeItems"];
  if (layout.placeContent) result.placeContent = layout.placeContent as
    | CSSProperties["placeContent"];
  if (layout.flexWrap) result.flexWrap = layout.flexWrap as CSSProperties["flexWrap"];
  if (layout.gap) result.gap = layout.gap;
  if (layout.padding) result.padding = layout.padding;
  if (layout.margin) result.margin = layout.margin;
  if (layout.width) result.width = layout.width;
  if (layout.maxWidth) result.maxWidth = layout.maxWidth;
  if (layout.height) result.height = layout.height;
  if (layout.minHeight) result.minHeight = layout.minHeight;
  if (layout.gridTemplateColumns)
    result.gridTemplateColumns = layout.gridTemplateColumns as CSSProperties["gridTemplateColumns"];
  if (layout.gridTemplateRows)
    result.gridTemplateRows = layout.gridTemplateRows as CSSProperties["gridTemplateRows"];
  if (layout.columnGap) result.columnGap = layout.columnGap;
  if (layout.rowGap) result.rowGap = layout.rowGap;
  if (layout.overflow) result.overflow = layout.overflow as CSSProperties["overflow"];
  if (layout.position) result.position = layout.position as CSSProperties["position"];
  if (layout.left) result.left = layout.left;
  if (layout.right) result.right = layout.right;
  if (layout.top) result.top = layout.top;
  if (layout.bottom) result.bottom = layout.bottom;
  if (layout.zIndex !== undefined)
    result.zIndex =
      typeof layout.zIndex === "string" ? Number(layout.zIndex) || layout.zIndex : layout.zIndex;

  if (typography.fontSize) result.fontSize = typography.fontSize;
  if (typography.fontWeight)
    result.fontWeight = typography.fontWeight as CSSProperties["fontWeight"];
  if (typography.lineHeight) result.lineHeight = typography.lineHeight;
  if (typography.letterSpacing) result.letterSpacing = typography.letterSpacing;
  if (typography.textAlign)
    result.textAlign = typography.textAlign as CSSProperties["textAlign"];
  if (typography.color) result.color = typography.color;
  if (typography.fontFamily) result.fontFamily = typography.fontFamily;

  if (background.color) {
    if (background.color.includes("gradient")) {
      result.background = background.color;
    } else {
      result.backgroundColor = background.color;
    }
  }
  if (background.image) result.backgroundImage = `url(${background.image})`;
  if (border.radius) result.borderRadius = border.radius as CSSProperties["borderRadius"];
  if (border.width || border.color || border.style) {
    result.border = `${border.width ?? "1px"} ${border.style ?? "solid"} ${border.color ?? "rgba(15,23,42,0.1)"}`;
  }
  if (shadow.shadow) result.boxShadow = shadow.shadow;

  if (visibility.hidden) {
    result.display = "none";
  }

  return result;
}

function useCustomCode(elements: Record<string, ElementNode>, rootId: string) {
  return useMemo(() => {
    const css: string[] = [];
    const traverse = (id: string) => {
      const node = elements[id];
      if (!node) return;
      if (node.customCode?.css) {
        css.push(`[data-element-id="${id}"] { ${node.customCode.css} }`);
      }
      node.children.forEach(traverse);
    };
    traverse(rootId);
    return css.join("\n");
  }, [elements, rootId]);
}

export function BuilderCanvas() {
  const {
    elements,
    rootId,
    selectedId,
    selectElement,
    activeBreakpoint,
    addElement,
    moveElement,
  } = useBuilder();
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const customCss = useCustomCode(elements, rootId);

  const getElement = (id: string) => elements[id];

  const isDescendant = (parentId: string, childId: string): boolean => {
    const parent = getElement(parentId);
    if (!parent) return false;
    if (parent.children.includes(childId)) return true;
    return parent.children.some((child) => isDescendant(child, childId));
  };

  const handleDrop = (event: DragEvent<Element>, targetId: string | null) => {
    event.preventDefault();
    event.stopPropagation();
    setDropTarget(null);

    const payloadText = event.dataTransfer.getData("application/builder-drag");
    if (!payloadText) return;
    try {
      const payload = JSON.parse(payloadText) as
        | { source: "library"; itemId: string }
        | { source: "element"; elementId: string };

      if (payload.source === "library") {
        const libraryItem = libraryItems.find((item) => item.id === payload.itemId);
        if (!libraryItem) return;
        const blueprint = libraryItem.blueprint();
        const targetElement = targetId ? getElement(targetId) : getElement(rootId);
        if (!targetElement) return;
        const parentId = isContainer(targetElement.kind)
          ? targetElement.id
          : targetElement.parentId ?? rootId;
        const parent = getElement(parentId);
        if (!parent) return;
        const newElement = {
          ...blueprint,
          parentId: parentId,
        };
        addElement(parentId, newElement);
        return;
      }

      if (payload.source === "element") {
        const elementId = payload.elementId;
        if (elementId === targetId || elementId === rootId) return;
        if (!elements[elementId]) return;
        if (targetId && isDescendant(elementId, targetId)) return;
        const targetElement = targetId ? getElement(targetId) : getElement(rootId);
        if (!targetElement) return;
        const parentId = isContainer(targetElement.kind)
          ? targetElement.id
          : targetElement.parentId ?? rootId;
        const parent = getElement(parentId);
        if (!parent) return;
        const index = isContainer(targetElement.kind)
          ? parent.children.length
          : (parent.children.indexOf(targetElement.id) ?? parent.children.length) + 1;
        moveElement(elementId, parentId, Math.max(index, 0));
      }
    } catch (error) {
      console.error("Failed to parse drag payload", error);
    }
  };

  const renderChildren = (node: ElementNode) => {
    if (node.children.length === 0) {
      return (
        <div className="rounded-xl border border-dashed border-[var(--builder-border)] bg-[var(--builder-surface)] p-6 text-center text-xs text-slate-400">
          Drop components here
        </div>
      );
    }
    return node.children.map((childId) => renderElement(getElement(childId)));
  };

  const renderElement = (node?: ElementNode): ReactNode => {
    if (!node) return null;

    const Tag = tagByKind[node.kind] ?? "div";
    const isSelected = selectedId === node.id;
    const style = mergeStyles(node, activeBreakpoint);

    const ariaProps =
      node.accessibility?.ariaLabel || node.accessibility?.ariaDescription
        ? {
            "aria-label": node.accessibility?.ariaLabel,
            "aria-description": node.accessibility?.ariaDescription,
          }
        : {};

    const roleProp = node.accessibility?.role ? { role: node.accessibility.role } : {};
    const tabIndexProp =
      typeof node.accessibility?.tabIndex === "number"
        ? { tabIndex: node.accessibility.tabIndex }
        : {};

    return (
      <Tag
        key={node.id}
        data-element-id={node.id}
        draggable={node.id !== rootId}
        {...ariaProps}
        {...roleProp}
        {...tabIndexProp}
        onClick={(event) => {
          event.stopPropagation();
          selectElement(node.id);
        }}
        onDragStart={(event: DragEvent) => {
          if (node.id === rootId) return;
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData(
            "application/builder-drag",
            JSON.stringify({ source: "element", elementId: node.id }),
          );
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (dropTarget !== node.id) {
            setDropTarget(node.id);
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setDropTarget(node.id);
        }}
        onDragLeave={(event) => {
          event.stopPropagation();
          const target = event.relatedTarget as HTMLElement | null;
          if (!target || !event.currentTarget.contains(target)) {
            setDropTarget(null);
          }
        }}
        onDrop={(event) => handleDrop(event, node.id)}
        className={cn(
          "relative rounded-2xl border border-transparent transition",
          isSelected
            ? "border-[var(--builder-primary)] shadow-lg"
            : "hover:border-[var(--builder-border)]",
          dropTarget === node.id ? "border-dashed border-[var(--builder-primary)]" : "",
        )}
        style={style}
      >
        {["heading", "paragraph", "button", "blockquote"].includes(node.kind) ? (
          <span className="block text-balance">{node.content}</span>
        ) : null}
        {node.kind === "list" ? (
          node.children.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--builder-border)] p-4 text-center text-xs text-slate-400">
              Drop list items here
            </div>
          ) : (
            node.children.map((childId) => renderElement(getElement(childId)))
          )
        ) : node.kind === "list-item" ? (
          <div className="flex items-start gap-3">
            <span className="mt-1 size-2 rounded-full bg-[var(--builder-primary)]" />
            <div className="grow">{node.content}</div>
          </div>
        ) : node.kind === "navbar" ? (
          <div className="flex w-full items-center justify-between gap-6">
            <div className="text-sm font-semibold uppercase tracking-widest text-[var(--builder-primary)]">
              Aperture
            </div>
            <nav className="flex gap-4 text-xs font-medium uppercase tracking-wide text-slate-500">
              <span>Features</span>
              <span>Templates</span>
              <span>CMS</span>
              <span>Pricing</span>
            </nav>
            <button className="rounded-full bg-[var(--builder-primary)] px-4 py-2 text-xs font-semibold text-white">
              Launch
            </button>
          </div>
        ) : node.kind === "form" ? (
          <form className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              Name
              <input
                type="text"
                aria-label="Name"
                placeholder="Jane Doe"
                className="rounded-xl border border-[var(--builder-border)] bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:bg-[var(--builder-surface)] dark:text-slate-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              Email
              <input
                type="email"
                aria-label="Email"
                placeholder="you@example.com"
                className="rounded-xl border border-[var(--builder-border)] bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:bg-[var(--builder-surface)] dark:text-slate-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-500">
              Message
              <textarea
                aria-label="Message"
                placeholder="How can we help?"
                className="min-h-[120px] rounded-xl border border-[var(--builder-border)] bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:bg-[var(--builder-surface)] dark:text-slate-100"
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-[var(--builder-primary)] px-4 py-2 text-sm font-semibold text-white shadow"
            >
              Submit
            </button>
          </form>
        ) : node.kind === "carousel" ? (
          <div className="flex w-full gap-4 overflow-x-auto">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="min-w-[220px] rounded-2xl bg-[var(--builder-surface-subtle)] p-4 text-sm text-slate-500"
              >
                Slide {index}
              </div>
            ))}
          </div>
        ) : isContainer(node.kind) ? (
          renderChildren(node)
        ) : node.children.length ? (
          node.children.map((childId) => renderElement(getElement(childId)))
        ) : null}
      </Tag>
    );
  };

  const root = elements[rootId];

  return (
    <section
      aria-label="Design canvas"
      className="relative h-full rounded-3xl border border-[var(--builder-border)] bg-gradient-to-br from-[var(--builder-surface)] to-[var(--builder-surface-subtle)] p-8"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => handleDrop(event, null)}
    >
      <div className="absolute inset-x-0 top-4 flex justify-center gap-2 text-xs text-slate-400">
        <span>
          Viewing <strong className="text-slate-600 dark:text-slate-200">{activeBreakpoint}</strong>{" "}
          breakpoint
        </span>
      </div>
      <div className="pointer-events-none absolute inset-6 rounded-3xl border border-dashed border-transparent transition">
        {dropTarget === null ? null : (
          <div className="size-full rounded-3xl border border-dashed border-[var(--builder-primary)]" />
        )}
      </div>
      <div className="mx-auto flex max-w-[960px] flex-col gap-6" role="presentation">
        {renderElement(root)}
      </div>
      {customCss ? (
        <style
          dangerouslySetInnerHTML={{
            __html: customCss,
          }}
        />
      ) : null}
    </section>
  );
}

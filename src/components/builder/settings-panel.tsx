"use client";

import { useState } from "react";
import { useBuilder } from "@/components/builder/builder-context";
import type { ResponsiveStyle } from "@/lib/builder-types";
import { cn } from "@/lib/utils";

type StyleSection =
  | "typography"
  | "layout"
  | "background"
  | "border"
  | "shadow"
  | "visibility";

const tabs = ["Styles", "Content", "Accessibility", "SEO", "Code", "Integrations"] as const;

interface StyleInputProps {
  label: string;
  value?: string | number;
  type?: "text" | "number" | "color";
  placeholder?: string;
  onChange: (value: string) => void;
  min?: number;
}

function StyleInput({
  label,
  value,
  type = "text",
  placeholder,
  onChange,
  min,
}: StyleInputProps) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
      {label}
      <input
        type={type}
        value={value ?? ""}
        min={min}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-[var(--builder-border)] bg-transparent px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:text-slate-100"
      />
    </label>
  );
}

const layoutOptions = [
  { label: "Block", value: "block" },
  { label: "Flex", value: "flex" },
  { label: "Inline Flex", value: "inline-flex" },
  { label: "Grid", value: "grid" },
  { label: "None", value: "none" },
];

const textAlignOptions = ["left", "center", "right", "justify"];

const accessibilityRoles = [
  "",
  "banner",
  "navigation",
  "main",
  "complementary",
  "contentinfo",
  "button",
  "link",
  "form",
  "heading",
];

export function SettingsPanel() {
  const {
    elements,
    selectedId,
    rootId,
    activeBreakpoint,
    updateElementStyles,
    updateElementContent,
    updateElementAccessibility,
    updateElementSeo,
    updateElementCustomCode,
    updatePageMeta,
    pageMeta,
    integrations,
    updateIntegration,
  } = useBuilder();

  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Styles");
  const element = selectedId ? elements[selectedId] : undefined;
  const styles: ResponsiveStyle = element?.styles?.[activeBreakpoint] ?? {};

  if (!element) {
    return (
      <aside className="panel h-full">
        <p className="text-sm text-slate-500">Select an element to edit its settings.</p>
      </aside>
    );
  }

  const updateStyles = (section: StyleSection, key: string, value: string) => {
    const sectionStyles = {
      ...(styles?.[section] ?? {}),
    } as Record<string, string>;
    if (!value) {
      delete sectionStyles[key];
    } else {
      sectionStyles[key] = value;
    }
    updateElementStyles(element.id, activeBreakpoint, {
      [section]: sectionStyles,
    } as Partial<ResponsiveStyle>);
  };

  const renderStylesTab = () => (
    <div className="flex flex-col gap-6">
      <section aria-label="Typography controls" className="space-y-3">
        <p className="control-label">Typography</p>
        <div className="grid grid-cols-2 gap-3">
          <StyleInput
            label="Font size"
            value={styles?.typography?.fontSize}
            placeholder="e.g. 1rem"
            onChange={(value) => updateStyles("typography", "fontSize", value)}
          />
          <StyleInput
            label="Font weight"
            value={styles?.typography?.fontWeight ?? ""}
            placeholder="400"
            onChange={(value) => updateStyles("typography", "fontWeight", value)}
          />
          <StyleInput
            label="Line height"
            value={styles?.typography?.lineHeight}
            placeholder="1.5"
            onChange={(value) => updateStyles("typography", "lineHeight", value)}
          />
          <StyleInput
            label="Letter spacing"
            value={styles?.typography?.letterSpacing}
            placeholder="0px"
            onChange={(value) => updateStyles("typography", "letterSpacing", value)}
          />
          <StyleInput
            label="Color"
            value={styles?.typography?.color}
            placeholder="#0f172a"
            onChange={(value) => updateStyles("typography", "color", value)}
          />
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Align
            <select
              value={styles?.typography?.textAlign ?? ""}
              onChange={(event) =>
                updateStyles("typography", "textAlign", event.target.value)
              }
              className="rounded-lg border border-[var(--builder-border)] bg-transparent px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:text-slate-100"
            >
              <option value="">Default</option>
              {textAlignOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section aria-label="Layout controls" className="space-y-3">
        <p className="control-label">Layout</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Display
            <select
              value={styles?.layout?.display ?? ""}
              onChange={(event) => updateStyles("layout", "display", event.target.value)}
              className="rounded-lg border border-[var(--builder-border)] bg-transparent px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:text-slate-100"
            >
              <option value="">Default</option>
              {layoutOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <StyleInput
            label="Flex direction"
            value={styles?.layout?.flexDirection}
            placeholder="row"
            onChange={(value) => updateStyles("layout", "flexDirection", value)}
          />
          <StyleInput
            label="Justify"
            value={styles?.layout?.justifyContent}
            placeholder="center"
            onChange={(value) => updateStyles("layout", "justifyContent", value)}
          />
          <StyleInput
            label="Align items"
            value={styles?.layout?.alignItems}
            placeholder="center"
            onChange={(value) => updateStyles("layout", "alignItems", value)}
          />
          <StyleInput
            label="Gap"
            value={styles?.layout?.gap}
            placeholder="16px"
            onChange={(value) => updateStyles("layout", "gap", value)}
          />
          <StyleInput
            label="Padding"
            value={styles?.layout?.padding}
            placeholder="24px"
            onChange={(value) => updateStyles("layout", "padding", value)}
          />
          <StyleInput
            label="Margin"
            value={styles?.layout?.margin}
            placeholder="0 auto"
            onChange={(value) => updateStyles("layout", "margin", value)}
          />
          <StyleInput
            label="Width"
            value={styles?.layout?.width}
            placeholder="100%"
            onChange={(value) => updateStyles("layout", "width", value)}
          />
          <StyleInput
            label="Max width"
            value={styles?.layout?.maxWidth}
            placeholder="1200px"
            onChange={(value) => updateStyles("layout", "maxWidth", value)}
          />
          <StyleInput
            label="Height"
            value={styles?.layout?.height}
            placeholder="auto"
            onChange={(value) => updateStyles("layout", "height", value)}
          />
          <StyleInput
            label="Overflow"
            value={styles?.layout?.overflow}
            placeholder="visible"
            onChange={(value) => updateStyles("layout", "overflow", value)}
          />
          <StyleInput
            label="Z-index"
            value={styles?.layout?.zIndex?.toString()}
            placeholder="auto"
            onChange={(value) => updateStyles("layout", "zIndex", value)}
          />
        </div>
      </section>

      <section aria-label="Background controls" className="space-y-3">
        <p className="control-label">Background</p>
        <div className="grid grid-cols-2 gap-3">
          <StyleInput
            label="Color / Gradient"
            value={styles?.background?.color}
            placeholder="rgba(0,0,0,0.05)"
            onChange={(value) => updateStyles("background", "color", value)}
          />
          <StyleInput
            label="Image URL"
            value={styles?.background?.image}
            placeholder="https://"
            onChange={(value) => updateStyles("background", "image", value)}
          />
        </div>
      </section>

      <section aria-label="Border controls" className="space-y-3">
        <p className="control-label">Borders</p>
        <div className="grid grid-cols-2 gap-3">
          <StyleInput
            label="Radius"
            value={styles?.border?.radius}
            placeholder="16px"
            onChange={(value) => updateStyles("border", "radius", value)}
          />
          <StyleInput
            label="Width"
            value={styles?.border?.width}
            placeholder="1px"
            onChange={(value) => updateStyles("border", "width", value)}
          />
          <StyleInput
            label="Color"
            value={styles?.border?.color}
            placeholder="rgba(15,23,42,0.1)"
            onChange={(value) => updateStyles("border", "color", value)}
          />
          <StyleInput
            label="Style"
            value={styles?.border?.style}
            placeholder="solid"
            onChange={(value) => updateStyles("border", "style", value)}
          />
        </div>
      </section>

      <section aria-label="Shadow controls" className="space-y-3">
        <p className="control-label">Shadows</p>
        <StyleInput
          label="Box shadow"
          value={styles?.shadow?.shadow}
          placeholder="0 10px 30px rgba(15,23,42,0.1)"
          onChange={(value) => updateStyles("shadow", "shadow", value)}
        />
      </section>

      <section aria-label="Responsive visibility" className="space-y-3">
        <p className="control-label">Visibility</p>
        <label className="flex items-center justify-between rounded-xl border border-[var(--builder-border)] bg-[var(--builder-surface-subtle)] px-3 py-2 text-sm text-slate-500">
          Hide on {activeBreakpoint}
          <input
            type="checkbox"
            checked={Boolean(styles?.visibility?.hidden)}
            onChange={(event) =>
              updateStyles("visibility", "hidden", event.target.checked ? "true" : "")
            }
            aria-label="Hide element on current breakpoint"
            className="size-4 rounded border border-[var(--builder-border)] accent-[var(--builder-primary)]"
          />
        </label>
      </section>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-4">
      <p className="control-label">Content</p>
      {["heading", "paragraph", "button", "blockquote", "list-item"].includes(element.kind) ? (
        <label className="flex flex-col gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          Text
          <textarea
            value={element.content ?? ""}
            onChange={(event) => updateElementContent(element.id, event.target.value)}
            className="min-h-[120px] rounded-xl border border-[var(--builder-border)] bg-transparent px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:text-slate-100"
          />
        </label>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select a text-based element to edit its content.
        </p>
      )}
    </div>
  );

  const renderAccessibilityTab = () => (
    <div className="space-y-4">
      <p className="control-label">Accessibility</p>
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        Role
        <select
          value={element.accessibility?.role ?? ""}
          onChange={(event) =>
            updateElementAccessibility(element.id, {
              ...element.accessibility,
              role: event.target.value,
            })
          }
          className="rounded-lg border border-[var(--builder-border)] bg-transparent px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:text-slate-100"
        >
          {accessibilityRoles.map((role) => (
            <option value={role} key={role || "none"}>
              {role || "Auto"}
            </option>
          ))}
        </select>
      </label>
      <StyleInput
        label="ARIA label"
        value={element.accessibility?.ariaLabel}
        placeholder="Describe the element"
        onChange={(value) =>
          updateElementAccessibility(element.id, {
            ...element.accessibility,
            ariaLabel: value,
          })
        }
      />
      <StyleInput
        label="ARIA description"
        value={element.accessibility?.ariaDescription}
        placeholder="Provide supplementary context"
        onChange={(value) =>
          updateElementAccessibility(element.id, {
            ...element.accessibility,
            ariaDescription: value,
          })
        }
      />
      <StyleInput
        label="Tab index"
        value={element.accessibility?.tabIndex?.toString()}
        onChange={(value) =>
          updateElementAccessibility(element.id, {
            ...element.accessibility,
            tabIndex: value ? Number(value) : undefined,
          })
        }
      />
    </div>
  );

  const renderSeoTab = () => {
    if (element.id === rootId) {
      return (
        <div className="space-y-4">
          <p className="control-label">Page SEO</p>
          <StyleInput
            label="Meta title"
            value={pageMeta.title}
            onChange={(value) => updatePageMeta({ title: value })}
          />
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Meta description
            <textarea
              value={pageMeta.description}
              onChange={(event) =>
                updatePageMeta({
                  description: event.target.value,
                })
              }
              className="min-h-[120px] rounded-xl border border-[var(--builder-border)] bg-transparent px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:text-slate-100"
            />
          </label>
          <StyleInput
            label="Keywords (comma separated)"
            value={pageMeta.keywords.join(", ")}
            onChange={(value) =>
              updatePageMeta({
                keywords: value
                  .split(",")
                  .map((keyword) => keyword.trim())
                  .filter(Boolean),
              })
            }
          />
          <StyleInput
            label="OG image URL"
            value={pageMeta.ogImage}
            onChange={(value) => updatePageMeta({ ogImage: value })}
          />
          <StyleInput
            label="Favicon URL"
            value={pageMeta.favicon}
            onChange={(value) => updatePageMeta({ favicon: value })}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="control-label">Element SEO</p>
        <StyleInput
          label="Alt text"
          value={element.seo?.altText}
          placeholder="Describe the media or element"
          onChange={(value) =>
            updateElementSeo(element.id, {
              ...element.seo,
              altText: value,
            })
          }
        />
        <StyleInput
          label="Meta description"
          value={element.seo?.metaDescription}
          placeholder="Short description for search engines"
          onChange={(value) =>
            updateElementSeo(element.id, {
              ...element.seo,
              metaDescription: value,
            })
          }
        />
        <StyleInput
          label="Canonical URL"
          value={element.seo?.canonicalUrl}
          placeholder="https://example.com"
          onChange={(value) =>
            updateElementSeo(element.id, {
              ...element.seo,
              canonicalUrl: value,
            })
          }
        />
        <StyleInput
          label="Keywords"
          value={element.seo?.keywords?.join(", ")}
          placeholder="Comma separated"
          onChange={(value) =>
            updateElementSeo(element.id, {
              ...element.seo,
              keywords: value
                .split(",")
                .map((keyword) => keyword.trim())
                .filter(Boolean),
            })
          }
        />
      </div>
    );
  };

  const renderCodeTab = () => {
    const isPage = element.id === rootId;
    return (
      <div className="space-y-4">
        <p className="control-label">{isPage ? "Global Code" : "Element Code"}</p>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Custom CSS
          <textarea
            value={isPage ? pageMeta.customCss ?? "" : element.customCode?.css ?? ""}
            onChange={(event) =>
              isPage
                ? updatePageMeta({ customCss: event.target.value })
                : updateElementCustomCode(element.id, event.target.value, undefined)
            }
            className="min-h-[160px] rounded-xl border border-[var(--builder-border)] bg-[var(--builder-surface-subtle)] px-3 py-2 font-mono text-xs text-slate-700 outline-none transition focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:bg-[var(--builder-surface)] dark:text-slate-100"
            placeholder="Write scoped CSS declarations..."
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Custom JavaScript
          <textarea
            value={isPage ? pageMeta.customJs ?? "" : element.customCode?.js ?? ""}
            onChange={(event) =>
              isPage
                ? updatePageMeta({ customJs: event.target.value })
                : updateElementCustomCode(element.id, undefined, event.target.value)
            }
            className="min-h-[160px] rounded-xl border border-[var(--builder-border)] bg-[var(--builder-surface-subtle)] px-3 py-2 font-mono text-xs text-slate-700 outline-none transition focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:bg-[var(--builder-surface)] dark:text-slate-100"
            placeholder="Execute custom logic after page load..."
          />
        </label>
        {isPage ? (
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Custom Head HTML
            <textarea
              value={pageMeta.customHeadHtml ?? ""}
              onChange={(event) => updatePageMeta({ customHeadHtml: event.target.value })}
              className="min-h-[120px] rounded-xl border border-[var(--builder-border)] bg-[var(--builder-surface-subtle)] px-3 py-2 font-mono text-xs text-slate-700 outline-none transition focus:border-[var(--builder-primary)] focus:ring-2 focus:ring-[var(--builder-primary-soft)] dark:bg-[var(--builder-surface)] dark:text-slate-100"
              placeholder="<script src=...></script>"
            />
          </label>
        ) : null}
      </div>
    );
  };

  const renderIntegrationsTab = () => (
    <div className="space-y-4">
      <p className="control-label">Platform Integrations</p>
      <ul className="space-y-3" role="list">
        {integrations.map((integration) => (
          <li
            key={integration.id}
            className="rounded-xl border border-[var(--builder-border)] bg-[var(--builder-surface-subtle)] p-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                  {integration.name}
                </p>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {integration.category}
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>{integration.connected ? "Connected" : "Disconnected"}</span>
                <input
                  type="checkbox"
                  checked={integration.connected}
                  onChange={(event) =>
                    updateIntegration(integration.id, event.target.checked)
                  }
                  className="size-4 rounded border border-[var(--builder-border)] accent-[var(--builder-primary)]"
                  aria-label={`Toggle ${integration.name}`}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {integration.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );

  const tabContent: Record<(typeof tabs)[number], React.ReactNode> = {
    Styles: renderStylesTab(),
    Content: renderContentTab(),
    Accessibility: renderAccessibilityTab(),
    SEO: renderSeoTab(),
    Code: renderCodeTab(),
    Integrations: renderIntegrationsTab(),
  };

  return (
    <aside aria-label="Element settings" className="panel h-full">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {element.id === rootId ? "Page Settings" : element.name}
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          {element.id === rootId ? "Configure global styles and metadata" : element.kind}
        </p>
      </header>
      <nav
        className="mt-4 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Element settings tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition",
              activeTab === tab
                ? "bg-[var(--builder-primary)] text-white shadow"
                : "bg-[var(--builder-surface-subtle)] text-slate-500 hover:text-[var(--builder-primary)] dark:text-slate-400",
            )}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className="divider" role="presentation" />
      <div className="scroll-y-soft grow space-y-6 pr-2" role="tabpanel">
        {tabContent[activeTab]}
      </div>
    </aside>
  );
}

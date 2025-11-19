"use client";

import { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { nanoid } from "nanoid";
import {
  Breakpoint,
  BuilderTemplate,
  ElementKind,
  ElementNode,
  IntegrationOption,
  PageMetaSettings,
  ResponsiveStyle,
} from "@/lib/builder-types";

type BuilderState = {
  elements: Record<string, ElementNode>;
  rootId: string;
  selectedId: string | null;
  activeBreakpoint: Breakpoint;
  pageMeta: PageMetaSettings;
  integrations: IntegrationOption[];
};

type BuilderAction =
  | { type: "SELECT_ELEMENT"; id: string | null }
  | { type: "SET_BREAKPOINT"; breakpoint: Breakpoint }
  | {
      type: "UPDATE_ELEMENT_STYLES";
      id: string;
      breakpoint: Breakpoint;
      styles: Partial<ResponsiveStyle>;
    }
  | {
      type: "UPDATE_ELEMENT_CONTENT";
      id: string;
      content: string;
    }
  | {
      type: "ADD_ELEMENT";
      parentId: string;
      index?: number;
      element: ElementNode;
    }
  | {
      type: "MOVE_ELEMENT";
      id: string;
      parentId: string;
      index: number;
    }
  | { type: "DELETE_ELEMENT"; id: string }
  | { type: "DUPLICATE_ELEMENT"; id: string }
  | { type: "APPLY_TEMPLATE"; template: BuilderTemplate }
  | {
      type: "UPDATE_PAGE_META";
      payload: Partial<PageMetaSettings>;
    }
  | {
      type: "UPDATE_INTEGRATION";
      id: string;
      connected: boolean;
    }
  | {
      type: "UPDATE_ELEMENT_PROPS";
      id: string;
      props: Record<string, unknown>;
    }
  | {
      type: "UPDATE_ELEMENT_ACCESSIBILITY";
      id: string;
      accessibility: ElementNode["accessibility"];
    }
  | {
      type: "UPDATE_ELEMENT_SEO";
      id: string;
      seo: ElementNode["seo"];
    }
  | {
      type: "UPDATE_ELEMENT_CUSTOM_CODE";
      id: string;
      css?: string;
      js?: string;
    };

const createElement = (
  kind: ElementKind,
  overrides: Partial<ElementNode> = {},
): ElementNode => {
  const id = overrides.id ?? nanoid(8);
  return {
    id,
    kind,
    name: overrides.name ?? kind.charAt(0).toUpperCase() + kind.slice(1),
    parentId: overrides.parentId ?? null,
    children: overrides.children ?? [],
    content: overrides.content,
    props: overrides.props ?? {},
    styles: overrides.styles ?? {
      desktop: {},
      tablet: {},
      mobile: {},
    },
    accessibility: overrides.accessibility,
    seo: overrides.seo,
    customCode: overrides.customCode,
  };
};

const buildLandingTemplate = (rootId = "root") => {
  const hero = createElement("hero", {
    name: "Hero Section",
    styles: {
      desktop: {
        layout: {
          padding: "96px 64px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        },
        background: {
          color: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(56,189,248,0.05))",
        },
        border: {
          radius: "24px",
        },
      },
      tablet: {
        layout: {
          padding: "72px 48px",
        },
      },
      mobile: {
        layout: {
          padding: "56px 24px",
        },
      },
    },
  });

  const heroHeading = createElement("heading", {
    parentId: hero.id,
    name: "Hero Heading",
    content: "Build beautifully responsive websites without touching code.",
    styles: {
      desktop: {
        typography: {
          fontSize: "3rem",
          fontWeight: 700,
          lineHeight: "1.1",
          color: "var(--builder-heading-color)",
        },
        layout: {
          maxWidth: "720px",
        },
      },
      tablet: {
        typography: {
          fontSize: "2.5rem",
        },
      },
      mobile: {
        typography: {
          fontSize: "2rem",
        },
      },
    },
  });

  const heroParagraph = createElement("paragraph", {
    parentId: hero.id,
    name: "Hero Description",
    content:
      "Design, publish, and scale with production-ready components, accessible defaults, and visual breakpoints.",
    styles: {
      desktop: {
        typography: {
          fontSize: "1.125rem",
          lineHeight: "1.7",
          color: "var(--builder-text-muted)",
        },
        layout: {
          maxWidth: "640px",
        },
      },
      tablet: {},
      mobile: {},
    },
  });

  const ctaContainer = createElement("container", {
    parentId: hero.id,
    name: "CTA Row",
    children: [],
    styles: {
      desktop: {
        layout: {
          display: "flex",
          gap: "16px",
          alignItems: "center",
        },
      },
      tablet: {},
      mobile: {
        layout: {
          flexDirection: "column",
          alignItems: "stretch",
        },
      },
    },
  });

  const primaryButton = createElement("button", {
    parentId: ctaContainer.id,
    name: "Primary CTA",
    content: "Start designing",
    styles: {
      desktop: {
        layout: {
          padding: "16px 32px",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
        },
        typography: {
          fontSize: "1rem",
          fontWeight: 600,
          color: "#ffffff",
        },
        background: {
          color: "linear-gradient(135deg, #6366f1, #22d3ee)",
        },
        border: {
          radius: "9999px",
        },
        shadow: {
          shadow: "0 20px 35px -20px rgba(99,102,241,0.8)",
        },
      },
      tablet: {},
      mobile: {
        layout: {
          width: "100%",
        },
      },
    },
  });

  const secondaryButton = createElement("button", {
    parentId: ctaContainer.id,
    name: "Secondary CTA",
    content: "Preview templates",
    styles: {
      desktop: {
        layout: {
          padding: "16px 32px",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
        },
        typography: {
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--builder-text-primary)",
        },
        background: {
          color: "rgba(15,23,42,0.05)",
        },
        border: {
          radius: "9999px",
        },
      },
      tablet: {},
      mobile: {
        layout: {
          width: "100%",
        },
      },
    },
  });

  ctaContainer.children = [primaryButton.id, secondaryButton.id];

  const featureSection = createElement("section", {
    name: "Feature Grid",
    styles: {
      desktop: {
        layout: {
          margin: "64px 0",
          display: "grid",
          gap: "24px",
        },
      },
      tablet: {},
      mobile: {},
    },
  });

  const featureGrid = createElement("container", {
    parentId: featureSection.id,
    name: "Feature Grid",
    styles: {
      desktop: {
        layout: {
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        },
      },
      tablet: {
        layout: {
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        },
      },
      mobile: {
        layout: {
          gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
        },
      },
    },
  });

  featureSection.children = [featureGrid.id];

  const featureCards: ElementNode[] = [0, 1, 2].map((index) => {
    const card = createElement("card", {
      parentId: featureGrid.id,
      name: `Feature ${index + 1}`,
      styles: {
        desktop: {
          layout: {
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          },
          background: {
            color: "rgba(99,102,241,0.08)",
          },
        },
        tablet: {},
        mobile: {},
      },
    });

    const heading = createElement("heading", {
      parentId: card.id,
      name: "Feature Heading",
      content: `Production-ready UI components`,
      styles: {
        desktop: {
          typography: {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--builder-heading-color)",
          },
        },
        tablet: {},
        mobile: {},
      },
    });

    const paragraph = createElement("paragraph", {
      parentId: card.id,
      name: "Feature Copy",
      content:
        "Craft layouts visually and export semantic HTML with WCAG-compliant patterns.",
      styles: {
        desktop: {
          typography: {
            fontSize: "0.95rem",
            lineHeight: "1.6",
            color: "var(--builder-text-muted)",
          },
        },
        tablet: {},
        mobile: {},
      },
    });

    card.children = [heading.id, paragraph.id];
    return [card, heading, paragraph];
  }).flat();

  featureGrid.children = featureCards
    .filter((node) => node.kind === "card")
    .map((node) => node.id);

  const root = createElement("section", {
    id: rootId,
    name: "Page",
    children: [hero.id, featureSection.id],
    styles: {
      desktop: {
        layout: {
          display: "flex",
          flexDirection: "column",
          gap: "64px",
          padding: "64px 80px",
        },
      },
      tablet: {
        layout: {
          padding: "48px 48px",
        },
      },
      mobile: {
        layout: {
          padding: "32px 20px",
        },
      },
    },
  });

  hero.parentId = root.id;
  featureSection.parentId = root.id;

  hero.children = [heroHeading.id, heroParagraph.id, ctaContainer.id];

  const elementList: ElementNode[] = [
    root,
    hero,
    heroHeading,
    heroParagraph,
    ctaContainer,
    primaryButton,
    secondaryButton,
    featureSection,
    featureGrid,
    ...featureCards,
  ];

  const elements: Record<string, ElementNode> = {};
  elementList.forEach((node) => {
    elements[node.id] = node;
  });

  return {
    elements,
    rootId: root.id,
    defaultSelectedId: hero.id,
  };
};

const templates: BuilderTemplate[] = [
  {
    id: "landing",
    name: "Product Landing",
    description: "Hero, feature grid, testimonials, and pricing sections.",
    create: () => buildLandingTemplate(),
  },
];

const integrations: IntegrationOption[] = [
  {
    id: "notion",
    name: "Notion CMS",
    category: "CMS",
    description: "Sync collections and pages to power dynamic content.",
    connected: false,
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "E-Commerce",
    description: "Link product catalogs and inventory data in real time.",
    connected: false,
  },
  {
    id: "airtable",
    name: "Airtable",
    category: "CMS",
    description: "Bind Airtable bases as data sources for repeatable sections.",
    connected: false,
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "E-Commerce",
    description: "Accept payments with secure checkout workflows.",
    connected: false,
  },
];

const baseStructure = buildLandingTemplate();

const initialState: BuilderState = {
  elements: baseStructure.elements,
  rootId: baseStructure.rootId,
  selectedId: baseStructure.defaultSelectedId ?? baseStructure.rootId,
  activeBreakpoint: "desktop",
  pageMeta: {
    title: "Aperture — Visual Web Builder",
    description:
      "Design responsive, accessible websites visually with Aperture’s professional site builder.",
    keywords: ["web builder", "no-code", "responsive design", "webflow alternative"],
    ogImage: "",
    favicon: "",
    customHeadHtml: "",
    customCss: "",
    customJs: "",
  },
  integrations,
};

const cloneTree = (
  elements: Record<string, ElementNode>,
  id: string,
  parentId: string | null,
) => {
  const node = elements[id];
  const newId = nanoid(8);
  const clonedChildren: string[] = [];
  const clonedNode: ElementNode = {
    ...node,
    id: newId,
    parentId,
    children: [],
    styles: JSON.parse(JSON.stringify(node.styles)),
    accessibility: node.accessibility ? { ...node.accessibility } : undefined,
    seo: node.seo ? { ...node.seo } : undefined,
    customCode: node.customCode ? { ...node.customCode } : undefined,
  };
  const clonedElements: Record<string, ElementNode> = {
    [newId]: clonedNode,
  };
  node.children.forEach((childId) => {
    const { id: childCloneId, elements: childElements } = cloneTree(
      elements,
      childId,
      newId,
    );
    clonedChildren.push(childCloneId);
    Object.assign(clonedElements, childElements);
  });
  clonedNode.children = clonedChildren;
  return { id: newId, elements: clonedElements };
};

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case "SELECT_ELEMENT":
      return { ...state, selectedId: action.id };
    case "SET_BREAKPOINT":
      return { ...state, activeBreakpoint: action.breakpoint };
    case "UPDATE_ELEMENT_STYLES": {
      const element = state.elements[action.id];
      if (!element) return state;
      const updatedElement: ElementNode = {
        ...element,
        styles: {
          ...element.styles,
          [action.breakpoint]: {
            ...element.styles[action.breakpoint],
            ...action.styles,
          },
        },
      };
      return {
        ...state,
        elements: {
          ...state.elements,
          [element.id]: updatedElement,
        },
      };
    }
    case "UPDATE_ELEMENT_CONTENT": {
      const element = state.elements[action.id];
      if (!element) return state;
      return {
        ...state,
        elements: {
          ...state.elements,
          [action.id]: {
            ...element,
            content: action.content,
          },
        },
      };
    }
    case "ADD_ELEMENT": {
      const parent = state.elements[action.parentId];
      if (!parent) return state;
      const index =
        typeof action.index === "number" ? action.index : parent.children.length;
      const element = action.element;
      const updatedParent: ElementNode = {
        ...parent,
        children: [
          ...parent.children.slice(0, index),
          element.id,
          ...parent.children.slice(index),
        ],
      };
      return {
        ...state,
        elements: {
          ...state.elements,
          [element.id]: element,
          [updatedParent.id]: updatedParent,
        },
        selectedId: element.id,
      };
    }
    case "MOVE_ELEMENT": {
      const element = state.elements[action.id];
      if (!element) return state;
      const sourceParent = element.parentId
        ? state.elements[element.parentId]
        : null;
      const targetParent = state.elements[action.parentId];
      if (!targetParent) return state;

      const updatedElements = { ...state.elements };
      if (sourceParent) {
        updatedElements[sourceParent.id] = {
          ...sourceParent,
          children: sourceParent.children.filter((child) => child !== action.id),
        };
      }

      updatedElements[targetParent.id] = {
        ...targetParent,
        children: [
          ...targetParent.children.slice(0, action.index),
          action.id,
          ...targetParent.children.slice(action.index),
        ],
      };

      updatedElements[action.id] = {
        ...element,
        parentId: targetParent.id,
      };

      return { ...state, elements: updatedElements };
    }
    case "DELETE_ELEMENT": {
      const element = state.elements[action.id];
      if (!element || action.id === state.rootId) return state;
      const updatedElements = { ...state.elements };
      const idsToRemove: string[] = [action.id];
      const collectChildren = (id: string) => {
        const node = state.elements[id];
        node.children.forEach((childId) => {
          idsToRemove.push(childId);
          collectChildren(childId);
        });
      };
      collectChildren(action.id);
      idsToRemove.forEach((id) => delete updatedElements[id]);
      if (element.parentId) {
        const parent = state.elements[element.parentId];
        updatedElements[parent.id] = {
          ...parent,
          children: parent.children.filter((child) => child !== action.id),
        };
      }
      const newSelected =
        element.parentId && updatedElements[element.parentId]
          ? updatedElements[element.parentId].id
          : state.rootId;
      return { ...state, elements: updatedElements, selectedId: newSelected };
    }
    case "DUPLICATE_ELEMENT": {
      if (action.id === state.rootId) return state;
      const element = state.elements[action.id];
      if (!element || !element.parentId) return state;
      const { id: clonedId, elements: clonedElements } = cloneTree(
        state.elements,
        action.id,
        element.parentId,
      );
      const parent = state.elements[element.parentId];
      const siblingIndex = parent.children.indexOf(action.id) + 1;
      const updatedParent: ElementNode = {
        ...parent,
        children: [
          ...parent.children.slice(0, siblingIndex),
          clonedId,
          ...parent.children.slice(siblingIndex),
        ],
      };
      return {
        ...state,
        elements: {
          ...state.elements,
          ...clonedElements,
          [updatedParent.id]: updatedParent,
        },
        selectedId: clonedId,
      };
    }
    case "APPLY_TEMPLATE": {
      const snapshot = action.template.create();
      const normalizedElements: Record<string, ElementNode> = {};
      const shouldSwapRoot = snapshot.rootId !== state.rootId;

      Object.values(snapshot.elements).forEach((element) => {
        const nextId = element.id === snapshot.rootId && shouldSwapRoot ? state.rootId : element.id;
        const nextParent =
          element.parentId === snapshot.rootId && shouldSwapRoot
            ? state.rootId
            : element.parentId;
        normalizedElements[nextId] = {
          ...element,
          id: nextId,
          parentId: nextParent,
          name: nextId === state.rootId ? "Page" : element.name,
          children: element.children.map((childId) =>
            childId === snapshot.rootId && shouldSwapRoot ? state.rootId : childId,
          ),
        };
      });

      const defaultSelection =
        (snapshot.defaultSelectedId &&
          normalizedElements[snapshot.defaultSelectedId] &&
          snapshot.defaultSelectedId !== state.rootId &&
          snapshot.defaultSelectedId) ||
        normalizedElements[state.rootId]?.children?.[0] ||
        state.rootId;

      return {
        ...state,
        elements: {
          ...normalizedElements,
        },
        selectedId: defaultSelection,
      };
    }
    case "UPDATE_PAGE_META":
      return {
        ...state,
        pageMeta: {
          ...state.pageMeta,
          ...action.payload,
        },
      };
    case "UPDATE_INTEGRATION":
      return {
        ...state,
        integrations: state.integrations.map((integration) =>
          integration.id === action.id
            ? { ...integration, connected: action.connected }
            : integration,
        ),
      };
    case "UPDATE_ELEMENT_PROPS": {
      const element = state.elements[action.id];
      if (!element) return state;
      return {
        ...state,
        elements: {
          ...state.elements,
          [action.id]: {
            ...element,
            props: {
              ...element.props,
              ...action.props,
            },
          },
        },
      };
    }
    case "UPDATE_ELEMENT_ACCESSIBILITY": {
      const element = state.elements[action.id];
      if (!element) return state;
      return {
        ...state,
        elements: {
          ...state.elements,
          [action.id]: {
            ...element,
            accessibility: {
              ...element.accessibility,
              ...action.accessibility,
            },
          },
        },
      };
    }
    case "UPDATE_ELEMENT_SEO": {
      const element = state.elements[action.id];
      if (!element) return state;
      return {
        ...state,
        elements: {
          ...state.elements,
          [action.id]: {
            ...element,
            seo: {
              ...element.seo,
              ...action.seo,
            },
          },
        },
      };
    }
    case "UPDATE_ELEMENT_CUSTOM_CODE": {
      const element = state.elements[action.id];
      if (!element) return state;
      return {
        ...state,
        elements: {
          ...state.elements,
          [action.id]: {
            ...element,
            customCode: {
              css: action.css ?? element.customCode?.css ?? "",
              js: action.js ?? element.customCode?.js ?? "",
            },
          },
        },
      };
    }
    default:
      return state;
  }
}

interface BuilderContextValue extends BuilderState {
  selectElement: (id: string | null) => void;
  setBreakpoint: (breakpoint: Breakpoint) => void;
  updateElementStyles: (
    id: string,
    breakpoint: Breakpoint,
    styles: Partial<ResponsiveStyle>,
  ) => void;
  updateElementContent: (id: string, content: string) => void;
  addElement: (parentId: string, element: ElementNode, index?: number) => void;
  moveElement: (id: string, parentId: string, index: number) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  applyTemplate: (template: BuilderTemplate) => void;
  updatePageMeta: (payload: Partial<PageMetaSettings>) => void;
  updateIntegration: (id: string, connected: boolean) => void;
  updateElementProps: (id: string, props: Record<string, unknown>) => void;
  updateElementAccessibility: (
    id: string,
    accessibility: ElementNode["accessibility"],
  ) => void;
  updateElementSeo: (id: string, seo: ElementNode["seo"]) => void;
  updateElementCustomCode: (id: string, css?: string, js?: string) => void;
  createElement: (kind: ElementKind, overrides?: Partial<ElementNode>) => ElementNode;
  templates: BuilderTemplate[];
}

const BuilderContext = createContext<BuilderContextValue | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  const selectElement = useCallback(
    (id: string | null) => dispatch({ type: "SELECT_ELEMENT", id }),
    [],
  );

  const setBreakpoint = useCallback(
    (breakpoint: Breakpoint) =>
      dispatch({ type: "SET_BREAKPOINT", breakpoint }),
    [],
  );

  const updateElementStyles = useCallback(
    (id: string, breakpoint: Breakpoint, styles: Partial<ResponsiveStyle>) =>
      dispatch({ type: "UPDATE_ELEMENT_STYLES", id, breakpoint, styles }),
    [],
  );

  const updateElementContent = useCallback(
    (id: string, content: string) =>
      dispatch({ type: "UPDATE_ELEMENT_CONTENT", id, content }),
    [],
  );

  const addElement = useCallback(
    (parentId: string, element: ElementNode, index?: number) =>
      dispatch({ type: "ADD_ELEMENT", parentId, element, index }),
    [],
  );

  const moveElement = useCallback(
    (id: string, parentId: string, index: number) =>
      dispatch({ type: "MOVE_ELEMENT", id, parentId, index }),
    [],
  );

  const deleteElement = useCallback(
    (id: string) => dispatch({ type: "DELETE_ELEMENT", id }),
    [],
  );

  const duplicateElement = useCallback(
    (id: string) => dispatch({ type: "DUPLICATE_ELEMENT", id }),
    [],
  );

  const applyTemplate = useCallback(
    (template: BuilderTemplate) =>
      dispatch({ type: "APPLY_TEMPLATE", template }),
    [],
  );

  const updatePageMeta = useCallback(
    (payload: Partial<PageMetaSettings>) =>
      dispatch({ type: "UPDATE_PAGE_META", payload }),
    [],
  );

  const updateIntegration = useCallback(
    (id: string, connected: boolean) =>
      dispatch({ type: "UPDATE_INTEGRATION", id, connected }),
    [],
  );

  const updateElementProps = useCallback(
    (id: string, props: Record<string, unknown>) =>
      dispatch({ type: "UPDATE_ELEMENT_PROPS", id, props }),
    [],
  );

  const updateElementAccessibility = useCallback(
    (id: string, accessibility: ElementNode["accessibility"]) =>
      dispatch({ type: "UPDATE_ELEMENT_ACCESSIBILITY", id, accessibility }),
    [],
  );

  const updateElementSeo = useCallback(
    (id: string, seo: ElementNode["seo"]) =>
      dispatch({ type: "UPDATE_ELEMENT_SEO", id, seo }),
    [],
  );

  const updateElementCustomCode = useCallback(
    (id: string, css?: string, js?: string) =>
      dispatch({ type: "UPDATE_ELEMENT_CUSTOM_CODE", id, css, js }),
    [],
  );

  const contextValue = useMemo<BuilderContextValue>(
    () => ({
      ...state,
      selectElement,
      setBreakpoint,
      updateElementStyles,
      updateElementContent,
      addElement,
      moveElement,
      deleteElement,
      duplicateElement,
      applyTemplate,
      updatePageMeta,
      updateIntegration,
      updateElementProps,
      updateElementAccessibility,
      updateElementSeo,
      updateElementCustomCode,
      createElement,
      templates,
    }),
    [
      state,
      selectElement,
      setBreakpoint,
      updateElementStyles,
      updateElementContent,
      addElement,
      moveElement,
      deleteElement,
      duplicateElement,
      applyTemplate,
      updatePageMeta,
      updateIntegration,
      updateElementProps,
      updateElementAccessibility,
      updateElementSeo,
      updateElementCustomCode,
    ],
  );

  return (
    <BuilderContext.Provider value={contextValue}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
}

import { ElementNode } from "./builder-types";
import { nanoid } from "nanoid";

export type LibraryCategory = "Layout" | "Content" | "Forms" | "Navigation" | "Media";

export interface LibraryItem {
  id: string;
  name: string;
  description: string;
  category: LibraryCategory;
  icon: string;
  blueprint: () => ElementNode;
}

export const libraryItems: LibraryItem[] = [
  {
    id: "button-solid",
    name: "Primary Button",
    description: "Button with solid accent background.",
    category: "Content",
    icon: "button",
    blueprint: () => ({
      id: nanoid(8),
      kind: "button",
      name: "Button",
      parentId: null,
      children: [],
      content: "Click me",
      styles: {
        desktop: {
          layout: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 28px",
            borderRadius: "9999px",
            gap: "8px",
          },
          typography: {
            fontSize: "1rem",
            fontWeight: 600,
            color: "#ffffff",
          },
          background: {
            color: "linear-gradient(135deg, #6366f1, #22d3ee)",
          },
          shadow: {
            shadow: "0 18px 30px -15px rgba(99,102,241,0.7)",
          },
        },
        tablet: {
          layout: {
            width: "fit-content",
          },
        },
        mobile: {
          layout: {
            width: "100%",
          },
        },
      },
    }),
  },
  {
    id: "card-feature",
    name: "Feature Card",
    description: "Stacked card with heading and copy.",
    category: "Layout",
    icon: "layers",
    blueprint: () => ({
      id: nanoid(8),
      kind: "card",
      name: "Feature Card",
      parentId: null,
      children: [],
      styles: {
        desktop: {
          layout: {
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            borderRadius: "20px",
          },
          background: {
            color: "rgba(99,102,241,0.08)",
          },
        },
        tablet: {},
        mobile: {},
      },
    }),
  },
  {
    id: "form-basic",
    name: "Contact Form",
    description: "Input fields with submit button.",
    category: "Forms",
    icon: "form",
    blueprint: () => ({
      id: nanoid(8),
      kind: "form",
      name: "Contact Form",
      parentId: null,
      children: [],
      styles: {
        desktop: {
          layout: {
            display: "grid",
            gap: "16px",
            maxWidth: "480px",
          },
        },
        tablet: {},
        mobile: {},
      },
    }),
  },
  {
    id: "navbar-top",
    name: "Navbar",
    description: "Responsive top navigation bar.",
    category: "Navigation",
    icon: "navbar",
    blueprint: () => ({
      id: nanoid(8),
      kind: "navbar",
      name: "Navbar",
      parentId: null,
      children: [],
      styles: {
        desktop: {
          layout: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderRadius: "16px",
          },
          background: {
            color: "rgba(15,23,42,0.03)",
          },
        },
        tablet: {},
        mobile: {
          layout: {
            flexDirection: "column",
            gap: "16px",
          },
        },
      },
    }),
  },
  {
    id: "carousel",
    name: "Carousel",
    description: "Horizontal carousel container.",
    category: "Media",
    icon: "carousel",
    blueprint: () => ({
      id: nanoid(8),
      kind: "carousel",
      name: "Carousel",
      parentId: null,
      children: [],
      styles: {
        desktop: {
          layout: {
            display: "flex",
            gap: "16px",
            overflow: "hidden",
          },
        },
        tablet: {},
        mobile: {},
      },
    }),
  },
];

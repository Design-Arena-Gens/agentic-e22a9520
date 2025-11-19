export type Breakpoint = "desktop" | "tablet" | "mobile";

export type ElementKind =
  | "section"
  | "container"
  | "heading"
  | "paragraph"
  | "button"
  | "image"
  | "list"
  | "list-item"
  | "form"
  | "form-field"
  | "navbar"
  | "footer"
  | "card"
  | "hero"
  | "carousel"
  | "blockquote"
  | "icon"
  | "custom";

export interface ResponsiveStyle {
  layout?: {
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    alignContent?: string;
    placeItems?: string;
    placeContent?: string;
    flexWrap?: string;
    gap?: string;
    padding?: string;
    margin?: string;
    width?: string;
    maxWidth?: string;
    height?: string;
    minHeight?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    columnGap?: string;
    rowGap?: string;
    position?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    overflow?: string;
    zIndex?: string | number;
  };
  typography?: {
    fontSize?: string;
    fontWeight?: number | string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: string;
    color?: string;
    fontFamily?: string;
  };
  background?: {
    color?: string;
    gradient?: string;
    image?: string;
  };
  border?: {
    radius?: string;
    width?: string;
    color?: string;
    style?: string;
  };
  shadow?: {
    shadow?: string;
  };
  visibility?: {
    hidden?: boolean;
  };
}

export type ElementStyles = Record<Breakpoint, ResponsiveStyle>;

export interface ElementAccessibility {
  role?: string;
  ariaLabel?: string;
  ariaDescription?: string;
  tabIndex?: number;
}

export interface ElementSEO {
  altText?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string[];
}

export interface ElementNode {
  id: string;
  kind: ElementKind;
  name: string;
  parentId: string | null;
  children: string[];
  content?: string;
  props?: Record<string, unknown>;
  styles: ElementStyles;
  accessibility?: ElementAccessibility;
  seo?: ElementSEO;
  customCode?: {
    css?: string;
    js?: string;
  };
}

export interface TemplateSnapshot {
  rootId: string;
  elements: Record<string, ElementNode>;
  defaultSelectedId?: string;
}

export interface BuilderTemplate {
  id: string;
  name: string;
  description: string;
  create: () => TemplateSnapshot;
}

export interface IntegrationOption {
  id: string;
  name: string;
  category: "CMS" | "E-Commerce" | "Analytics" | "Automation";
  description: string;
  connected: boolean;
}

export interface PageMetaSettings {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  favicon?: string;
  customHeadHtml?: string;
  customCss?: string;
  customJs?: string;
}

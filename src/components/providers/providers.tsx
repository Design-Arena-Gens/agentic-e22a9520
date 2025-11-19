"use client";

import { BuilderProvider } from "@/components/builder/builder-context";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <BuilderProvider>{children}</BuilderProvider>
    </ThemeProvider>
  );
}

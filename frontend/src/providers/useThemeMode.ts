"use client";

import { useContext } from "react";
import { ThemeContext, ThemeContextType } from "@/providers/ThemeProvider";

export const useThemeMode = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return context;
};

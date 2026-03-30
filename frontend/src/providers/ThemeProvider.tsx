"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { createContext, ReactNode, useState, useCallback, useEffect } from "react";
import { createAppTheme } from "@/theme/theme";

export type ThemeMode = "light" | "dark";

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [_, setMounted] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage or system preference (client-side only)
    const savedMode = localStorage.getItem("themeMode") as ThemeMode | null;
    if (savedMode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(savedMode);
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
         
        setMode("dark");
      }
    }
     
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  }, []);

  const theme = createAppTheme(mode);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

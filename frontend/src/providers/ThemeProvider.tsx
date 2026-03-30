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

// Type guard to validate localStorage values
const isValidThemeMode = (value: unknown): value is ThemeMode => {
  return value === "light" || value === "dark";
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    // Initialize theme from localStorage or system preference (client-side only)
    // Setting state inside effect is necessary to avoid hydration mismatch
    const savedModeString = localStorage.getItem("themeMode");
    if (isValidThemeMode(savedModeString)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(savedModeString);
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setMode("dark");
      }
    }
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

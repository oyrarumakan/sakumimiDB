import { createTheme, ThemeOptions } from "@mui/material/styles";

const themeOptions: Record<"light" | "dark", ThemeOptions> = {
  light: {
    palette: {
      mode: "light",
      primary: {
        main: "#f19db5",
        light: "#f5b8c8",
        dark: "#e88ba7",
      },
      secondary: {
        main: "#757575",
      },
      background: {
        default: "#ffffff",
        paper: "#ffffff",
      },
      text: {
        primary: "#171717",
        secondary: "#666666",
      },
    },
    typography: {
      fontFamily: [
        '"Geist Sans"',
        '"Geist Mono"',
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 700,
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: 600,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.43,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
              transition: "box-shadow 0.3s ease-in-out",
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
      },
    },
  },
  dark: {
    palette: {
      mode: "dark",
      primary: {
        main: "#f19db5",
        light: "#f5b8c8",
        dark: "#e88ba7",
      },
      secondary: {
        main: "#e0e0e0",
      },
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
      text: {
        primary: "#ffffff",
        secondary: "#b0b0b0",
      },
    },
    typography: {
      fontFamily: [
        '"Geist Sans"',
        '"Geist Mono"',
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 700,
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: 600,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.43,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.7)",
              transition: "box-shadow 0.3s ease-in-out",
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
      },
    },
  },
};

export const createAppTheme = (mode: "light" | "dark") => {
  return createTheme(themeOptions[mode]);
};

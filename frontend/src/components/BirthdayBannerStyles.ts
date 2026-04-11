import { alpha } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

/**
 * BirthdayBanner のスタイル定義。
 */
export const birthdayBannerStyles = {
  container: { pt: 3 },
  paper: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 3,
    border: "1px solid",
    borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.45),
    background: (theme: Theme) =>
      `linear-gradient(135deg, ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.3 : 0.2)} 0%, ${alpha(theme.palette.primary.light, theme.palette.mode === "dark" ? 0.2 : 0.16)} 56%, ${alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.9 : 0.98)} 100%)`,
    boxShadow: (theme: Theme) => `0 12px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  decorationLayer: {
    position: "absolute",
    inset: 0,
    background: (theme: Theme) =>
      `radial-gradient(circle at top left, ${alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.42 : 0.92)} 0, ${alpha(theme.palette.background.paper, 0)} 42%), radial-gradient(circle at bottom right, ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.28 : 0.22)} 0, ${alpha(theme.palette.primary.main, 0)} 38%)`,
    pointerEvents: "none",
  },
  contentRow: {
    position: "relative",
    display: "flex",
    alignItems: { xs: "flex-start", sm: "center" },
    gap: 2,
    px: { xs: 2, sm: 3 },
    py: { xs: 2, sm: 2.5 },
  },
  iconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 48,
    width: 48,
    height: 48,
    borderRadius: "50%",
    backgroundColor: (theme: Theme) => alpha(theme.palette.background.paper, 0.78),
    color: "primary.dark",
    boxShadow: (theme: Theme) => `inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.24)}`,
  },
  title: {
    color: "primary.main",
    fontWeight: 700,
    letterSpacing: "0.08em",
  },
  message: {
    fontWeight: 700,
    lineHeight: 1.3,
    mt: 0.25,
  },
  subtitle: {
    mt: 0.5,
    color: "text.secondary",
  },
  closeButton: {
    alignSelf: { xs: "flex-start", sm: "center" },
    backgroundColor: (theme: Theme) => alpha(theme.palette.background.paper, 0.72),
    color: "text.primary",
    "&:hover": {
      backgroundColor: (theme: Theme) => alpha(theme.palette.background.paper, 0.9),
    },
  },
} as const;
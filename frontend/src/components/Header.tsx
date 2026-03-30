"use client";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { AppBar, Toolbar, Box, Typography, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useThemeMode } from "@/providers/useThemeMode";

export default function Header() {
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ flexDirection: "column", alignItems: "flex-start", py: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            mb: 2,
          }}
        >
          <Box sx={{ maxWidth: 160 }}>
            <img
              src="/logo.png"
              alt="SakumimiDB logo"
              style={{ height: "auto", width: "100%", maxHeight: 100 }}
            />
          </Box>
          <Tooltip title={mode === "dark" ? "ライトテーマに切り替え" : "ダークテーマに切り替え"}>
            <IconButton
              onClick={toggleTheme}
              color="primary"
              sx={{ ml: "auto" }}
              aria-label={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          webラジオ「さくみみ」の過去のエピソード情報を検索できるデータベースです。
          <br />
          出演者や配信年などの条件で絞り込んで、気になるエピソードを見つけてみてください。
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

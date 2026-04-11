"use client";

import CakeIcon from '@mui/icons-material/Cake';
import CloseIcon from "@mui/icons-material/Close";
import { Box, Container, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";

interface BirthdayBannerProps {
  birthdayMembers: string[];
  dateLabel: string;
}

/**
 * 当日誕生日メンバーがいる場合に祝祭バナーを表示する。
 * @param props バナー表示に必要なメンバー名と日付ラベル。
 * @param props.birthdayMembers 当日誕生日のメンバー名一覧。
 * @param props.dateLabel 表示用の日付ラベル。
 * @returns 閉じられた場合または誕生日メンバーがいない場合はnull、それ以外はバナー要素。
 */
export default function BirthdayBanner({ birthdayMembers, dateLabel }: BirthdayBannerProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen || birthdayMembers.length === 0) {
    return null;
  }

  const memberNames = birthdayMembers.join("、");
  const message =
    birthdayMembers.length === 1
      ? `${dateLabel}は ${memberNames} さんの誕生日です。`
      : `${dateLabel}は ${memberNames} さんの誕生日です。`;

  return (
    <Container maxWidth="md" sx={{ pt: 3 }}>
      <Paper
        role="status"
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "rgba(241, 157, 181, 0.45)",
          background:
            "linear-gradient(135deg, rgba(241, 157, 181, 0.22) 0%, rgba(255, 240, 196, 0.78) 52%, rgba(255, 255, 255, 0.94) 100%)",
          boxShadow: "0 12px 24px rgba(241, 157, 181, 0.18)",
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(255, 255, 255, 0.92) 0, rgba(255, 255, 255, 0) 42%), radial-gradient(circle at bottom right, rgba(241, 157, 181, 0.22) 0, rgba(241, 157, 181, 0) 38%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 2.5 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 48,
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.68)",
              color: "primary.dark",
              boxShadow: "inset 0 0 0 1px rgba(241, 157, 181, 0.22)",
            }}
          >
            <CakeIcon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: "primary.dark", fontWeight: 700, letterSpacing: "0.08em" }}>
              Happy Birthday
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mt: 0.25 }}>
              {message}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
              誕生日メンバーのエピソードを聞いてみませんか？
            </Typography>
          </Box>
          <IconButton
            aria-label="誕生日バナーを閉じる"
            onClick={() => setIsOpen(false)}
            sx={{
              alignSelf: { xs: "flex-start", sm: "center" },
              backgroundColor: "rgba(255, 255, 255, 0.72)",
              color: "text.primary",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
}
"use client";

import CakeIcon from "@mui/icons-material/Cake";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Container, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { birthdayBannerStyles } from "./BirthdayBannerStyles";

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
  const message = `${dateLabel}は${memberNames}さんの誕生日です。`;

  return (
    <Container maxWidth="md" sx={birthdayBannerStyles.container}>
      <Paper role="status" elevation={0} sx={birthdayBannerStyles.paper}>
        <Box aria-hidden="true" sx={birthdayBannerStyles.decorationLayer} />
        <Box sx={birthdayBannerStyles.contentRow}>
          <Box sx={birthdayBannerStyles.iconWrap}>
            <CakeIcon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="overline" sx={birthdayBannerStyles.title}>
              Happy Birthday
            </Typography>
            <Typography variant="h6" sx={birthdayBannerStyles.message}>
              {message}
            </Typography>
            <Typography variant="body2" sx={birthdayBannerStyles.subtitle}>
              誕生日メンバーが登場するエピソードを聞いてみませんか？
            </Typography>
          </Box>
          <IconButton
            aria-label="誕生日バナーを閉じる"
            onClick={() => setIsOpen(false)}
            sx={birthdayBannerStyles.closeButton}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
}
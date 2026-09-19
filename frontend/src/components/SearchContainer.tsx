"use client";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box, Container, Typography, Button } from "@mui/material";
import { useState, useMemo } from "react";
import type { Episode } from "@/types/episode";
import type { MembersData } from "@/types/member";
import type { SearchConditions, SortOrder } from "@/types/search";
import {
  createAvailableYears,
  createEpisodeRanges,
  filterEpisodes,
  groupMembers,
  sortEpisodes,
} from "@/utils/search";
import membersData from "@data/members.json";
import BirthdayBanner from "./BirthdayBanner";
import EpisodeList from "./EpisodeList";
import SearchForm from "./SearchForm";

const typedMembersData = membersData as MembersData;

interface SearchContainerProps {
  episodes: Episode[];
  birthdayMembers: string[];
  birthdayLabel: string;
}

/**
 * 誕生日バナーと連携するエピソード検索画面を表示する。
 * @param props 検索対象と誕生日表示に必要なデータ。
 * @param props.episodes 検索対象のエピソード一覧。
 * @param props.birthdayMembers 当日誕生日のメンバー名一覧。
 * @param props.birthdayLabel 表示用の日付ラベル。
 * @returns 誕生日バナー、検索条件、検索結果を含む画面。
 */
export default function SearchContainer({
  episodes,
  birthdayMembers,
  birthdayLabel,
}: SearchContainerProps) {
  const [conditions, setConditions] = useState<SearchConditions>({
    member1: "",
    member2: "",
    episode: "",
    year: "",
    caption: "",
  });

  const [displayCount, setDisplayCount] = useState(10);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSortOrderChange = (order: SortOrder) => {
    if (sortOrder !== order) {
      setSortOrder(order);
      setDisplayCount(10);
    }
  };

  const handleConditionChange = (key: keyof SearchConditions, value: string) => {
    setConditions((prev) => {
      const updated = { ...prev, [key]: value };
      // member1がクリアされたらmember2もリセット
      if (key === "member1" && value === "") {
        updated.member2 = "";
      }
      // member1とmember2が同じ値にならないようにする
      if (key === "member1" && value !== "" && value === prev.member2) {
        updated.member2 = "";
      }
      if (key === "member2" && value !== "" && value === prev.member1) {
        updated.member1 = "";
      }
      return updated;
    });
    setDisplayCount(10);
  };

  const handleClear = () => {
    setConditions({
      member1: "",
      member2: "",
      episode: "",
      year: "",
      caption: "",
    });
    setDisplayCount(10);
  };

  const groupedAvailableMembers = useMemo(() => groupMembers(typedMembersData), []);
  const availableEpisodes = useMemo(() => createEpisodeRanges(episodes), [episodes]);
  const availableYears = useMemo(() => createAvailableYears(episodes), [episodes]);
  const filteredEpisodes = useMemo(
    () => filterEpisodes(episodes, conditions),
    [episodes, conditions],
  );
  const sortedEpisodes = useMemo(
    () => sortEpisodes(filteredEpisodes, sortOrder),
    [filteredEpisodes, sortOrder],
  );

  const displayedEpisodes = sortedEpisodes.slice(0, displayCount);
  const hasMore = displayCount < sortedEpisodes.length;
  const hasActiveFilters = Boolean(
    conditions.member1 ||
    conditions.member2 ||
    conditions.episode ||
    conditions.year ||
    conditions.caption.trim()
  );

  return (
    <>
      <BirthdayBanner
        birthdayMembers={birthdayMembers}
        dateLabel={birthdayLabel}
        onMemberSelect={(memberName) => handleConditionChange("member1", memberName)}
      />
      <Container maxWidth="md" sx={{ py: 4 }}>
      <SearchForm
        conditions={conditions}
        onConditionChange={handleConditionChange}
        availableMembers={groupedAvailableMembers}
        availableEpisodes={availableEpisodes}
        availableYears={availableYears}
        onClear={handleClear}
      />

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              borderLeft: "4px solid",
              borderColor: "primary.main",
              pl: 2,
            }}
          >
            {hasActiveFilters ? `検索結果 (${filteredEpisodes.length}件)` : "最新エピソード"}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant={sortOrder === "asc" ? "contained" : "outlined"}
              color="primary"
              size="small"
              onClick={() => handleSortOrderChange("asc")}
              startIcon={<ArrowUpwardIcon />}
              sx={{ textTransform: "none" }}
            >
              昇順
            </Button>
            <Button
              variant={sortOrder === "desc" ? "contained" : "outlined"}
              color="primary"
              size="small"
              onClick={() => handleSortOrderChange("desc")}
              startIcon={<ArrowDownwardIcon />}
              sx={{ textTransform: "none" }}
            >
              降順
            </Button>
          </Box>
        </Box>
        <EpisodeList episodes={displayedEpisodes} />

        {hasMore && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => setDisplayCount((prev) => prev + 10)}
              variant="outlined"
              color="primary"
              sx={{
                textTransform: "none",
                borderWidth: "2px",
                "&:hover": {
                  borderWidth: "2px",
                },
              }}
            >
              もっと表示する
            </Button>
          </Box>
        )}
      </Box>
      </Container>
    </>
  );
}

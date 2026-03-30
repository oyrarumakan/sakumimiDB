"use client";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box, Container, Typography, Button } from "@mui/material";
import { useState, useMemo } from "react";
import type { Episode } from "@/types/episode";
import type { SearchConditions } from "@/types/search";
import membersData from "@data/members.json";
import EpisodeList from "./EpisodeList";
import SearchForm from "./SearchForm";

export interface GroupedMembers {
  group: string;
  members: string[];
}

interface SearchContainerProps {
  episodes: Episode[];
}

export default function SearchContainer({ episodes }: SearchContainerProps) {
  const [conditions, setConditions] = useState<SearchConditions>({
    member1: "",
    member2: "",
    episode: "",
    year: "",
  });

  const [displayCount, setDisplayCount] = useState(10);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortOrderChange = (order: "asc" | "desc") => {
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
    });
    setDisplayCount(10);
  };

  // メンバー一覧をjsonから取得してグルーピングする
  const groupedAvailableMembers = useMemo(() => {
    const nonGraduatedMap: Record<string, { name: string, kana: string }[]> = {
      "一期生": [],
      "二期生": [],
      "三期生": [],
      "四期生": [],
      "その他": []
    };
    const graduatedList: { name: string, kana: string, generation: string }[] = [];

    Object.entries(membersData).forEach(([name, memberInfo]) => {
      if (memberInfo.isGraduated) {
        graduatedList.push({ 
          name, 
          kana: memberInfo.nameKana,
          generation: memberInfo.generation
        });
      } else {
        const gen = memberInfo.generation;
        if (nonGraduatedMap[gen]) {
          nonGraduatedMap[gen].push({ 
            name, 
            kana: memberInfo.nameKana
          });
        } else {
          nonGraduatedMap["その他"].push({ 
            name, 
            kana: memberInfo.nameKana
          });
        }
      }
    });

    const groups: GroupedMembers[] = [];
    const generationOrder = ["一期生", "二期生", "三期生", "四期生", "その他"];

    // 現役メンバーを期別→五十音順でソート
    generationOrder.forEach(gen => {
      if (nonGraduatedMap[gen].length > 0) {
        nonGraduatedMap[gen].sort((a, b) => a.kana.localeCompare(b.kana, "ja"));
        groups.push({
          group: gen,
          members: nonGraduatedMap[gen].map(x => x.name)
        });
      }
    });

    // 卒業生は最後に、期別→五十音順でソート
    if (graduatedList.length > 0) {
      graduatedList.sort((a, b) => {
        const genOrder = { "一期生": 1, "二期生": 2, "三期生": 3, "四期生": 4 };
        const genA = genOrder[a.generation as keyof typeof genOrder] || 999;
        const genB = genOrder[b.generation as keyof typeof genOrder] || 999;
        
        if (genA !== genB) {
          return genA - genB;
        }
        return a.kana.localeCompare(b.kana, "ja");
      });
      groups.push({
        group: "卒業生",
        members: graduatedList.map(x => x.name)
      });
    }

    return groups;
  }, []);

  const availableEpisodes = useMemo(() => {
    // エピソード番号を取得
    const episodeNumbers = Array.from(new Set(episodes.map((ep) => ep.episode)))
      .map((ep) => parseInt(ep.replace(/[^0-9]/g, ""), 10))
      .filter((num) => !isNaN(num));

    if (episodeNumbers.length === 0) return [];

    const maxEpisode = Math.max(...episodeNumbers);

    // セレクトボックス用に10話ごとの範囲を生成 (#1-#10, #11-#20, ... )
    const ranges = [];
    for (let i = Math.ceil(maxEpisode / 10) * 10; i >= 1; i -= 10) {
      const rangeStart = i - 9;
      const rangeEnd = i;
      ranges.push(`#${rangeStart} - #${rangeEnd}`);
    }

    return ranges;
  }, [episodes]);

  const availableYears = useMemo(() => {
    const years = new Set(episodes.map((ep) => ep.date.split("/")[0]));
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [episodes]);

  // フィルタリング処理
  const filteredEpisodes = useMemo(() => {
    return episodes.filter((ep) => {
      // エピソード範囲(10話ごと)で検索
      if (conditions.episode) {
        const epNum = parseInt(ep.episode.replace(/[^0-9]/g, ""), 10);
        const [startStr, endStr] = conditions.episode.split(" - ");
        const rangeStart = parseInt(startStr.replace(/[^0-9]/g, ""), 10);
        const rangeEnd = parseInt(endStr.replace(/[^0-9]/g, ""), 10);

        if (isNaN(epNum) || isNaN(rangeStart) || isNaN(rangeEnd)) {
          return false;
        }

        if (epNum < rangeStart || epNum > rangeEnd) {
          return false;
        }
      }
      // 配信年で検索
      const epYear = ep.date.split("/")[0];
      if (conditions.year && epYear !== conditions.year) {
        return false;
      }
      // メンバーで検索 (AND)
      if (conditions.member1 && !ep.members.includes(conditions.member1)) {
        return false;
      }
      if (conditions.member2 && !ep.members.includes(conditions.member2)) {
        return false;
      }

      return true;
    });
  }, [episodes, conditions]);

  // ソート処理
  const sortedEpisodes = useMemo(() => {
    return [...filteredEpisodes].sort((a, b) => {
      const aNum = parseInt(a.episode.replace(/[^0-9]/g, ""), 10);
      const bNum = parseInt(b.episode.replace(/[^0-9]/g, ""), 10);
      return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
    });
  }, [filteredEpisodes, sortOrder]);

  const displayedEpisodes = sortedEpisodes.slice(0, displayCount);
  const hasMore = displayCount < sortedEpisodes.length;

  return (
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
            {conditions.member1 || conditions.member2 || conditions.episode || conditions.year
              ? "検索結果"
              : "最新エピソード"}
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
  );
}

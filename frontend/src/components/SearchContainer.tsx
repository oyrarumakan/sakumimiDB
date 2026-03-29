"use client";

import { useState, useMemo } from "react";
import type { Episode } from "@/types/episode";
import type { SearchConditions } from "@/types/search";
import EpisodeList from "./EpisodeList";
import SearchForm from "./SearchForm";

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

  const handleConditionChange = (key: keyof SearchConditions, value: string) => {
    setConditions((prev) => ({ ...prev, [key]: value }));
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

  // 選択肢の生成
  const availableMembers = useMemo(() => {
    const members = new Set<string>();
    episodes.forEach((ep) => ep.members.forEach((m) => members.add(m)));
    return Array.from(members).sort();
  }, [episodes]);

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

  const displayedEpisodes = filteredEpisodes.slice(0, displayCount);
  const hasMore = displayCount < filteredEpisodes.length;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <SearchForm
        conditions={conditions}
        onConditionChange={handleConditionChange}
        availableMembers={availableMembers}
        availableEpisodes={availableEpisodes}
        availableYears={availableYears}
        onClear={handleClear}
      />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 border-l-4 border-accent-pink pl-3">
          {conditions.member1 || conditions.member2 || conditions.episode || conditions.year
            ? "検索結果"
            : "最新エピソード"}
        </h2>
        <EpisodeList episodes={displayedEpisodes} />
        
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setDisplayCount((prev) => prev + 10)}
              className="px-8 py-3 bg-white border-2 border-accent-pink text-accent-pink rounded-full hover:bg-pink-50 transition-colors font-bold shadow-sm"
            >
              もっと表示する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

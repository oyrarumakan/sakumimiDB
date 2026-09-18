import { describe, expect, it } from "vitest";
import {
  createEmptySearchConditions,
  createEpisodeFixtures,
  createMembersFixture,
  EMPTY_EPISODES,
} from "@/test/fixtures";
import {
  createAvailableYears,
  createEpisodeRanges,
  filterEpisodes,
  groupMembers,
  sortEpisodes,
} from "@/utils/search";

describe("groupMembers", () => {
  it("現役メンバーを期別・五十音順、卒業生を期順に並べる", () => {
    expect(groupMembers(createMembersFixture())).toEqual([
      { group: "二期生", members: ["遠藤光莉", "大園玲"] },
      { group: "三期生", members: ["石森璃花", "小島凪紗"] },
      { group: "四期生", members: ["山川宇衣"] },
      { group: "卒業生", members: ["上村莉菜", "土生瑞穂", "井上梨名"] },
    ]);
  });
});

describe("createEpisodeRanges", () => {
  it("最大話数までの範囲を10話単位の降順で生成する", () => {
    expect(createEpisodeRanges(createEpisodeFixtures())).toEqual([
      "#11 - #20",
      "#1 - #10",
    ]);
  });

  it("空配列からは範囲を生成しない", () => {
    expect(createEpisodeRanges(EMPTY_EPISODES)).toEqual([]);
  });
});

describe("createAvailableYears", () => {
  it("重複を除いた配信年を新しい順に返す", () => {
    expect(createAvailableYears(createEpisodeFixtures())).toEqual([
      "2026",
      "2025",
      "2024",
    ]);
  });
});

describe("filterEpisodes", () => {
  it("メンバー2人をAND条件で絞り込む", () => {
    const conditions = {
      ...createEmptySearchConditions(),
      member1: "遠藤光莉",
      member2: "石森璃花",
    };

    expect(filterEpisodes(createEpisodeFixtures(), conditions).map(({ episode }) => episode))
      .toEqual(["#001", "#010"]);
  });

  it("配信年で絞り込む", () => {
    const conditions = { ...createEmptySearchConditions(), year: "2025" };

    expect(filterEpisodes(createEpisodeFixtures(), conditions)).toHaveLength(5);
  });

  it("番号範囲の両端を検索結果に含める", () => {
    const conditions = {
      ...createEmptySearchConditions(),
      episode: "#1 - #10",
    };
    const episodeNumbers = filterEpisodes(createEpisodeFixtures(), conditions).map(
      ({ episode }) => episode,
    );

    expect(episodeNumbers).toHaveLength(10);
    expect(episodeNumbers).toContain("#001");
    expect(episodeNumbers).toContain("#010");
    expect(episodeNumbers).not.toContain("#011");
  });

  it("フリーワードの前後空白と大文字小文字を無視する", () => {
    const conditions = {
      ...createEmptySearchConditions(),
      caption: "  april NEWS  ",
    };

    expect(filterEpisodes(createEpisodeFixtures(), conditions).map(({ episode }) => episode))
      .toEqual(["#009"]);
  });

  it("複数の検索条件をすべて適用する", () => {
    const conditions = {
      ...createEmptySearchConditions(),
      member1: "石森璃花",
      year: "2025",
      caption: "卒業",
    };

    expect(filterEpisodes(createEpisodeFixtures(), conditions).map(({ episode }) => episode))
      .toEqual(["#008"]);
  });

  it("一致するエピソードがなければ空配列を返す", () => {
    const conditions = {
      ...createEmptySearchConditions(),
      caption: "存在しない番組名",
    };

    expect(filterEpisodes(createEpisodeFixtures(), conditions)).toEqual([]);
  });
});

describe("sortEpisodes", () => {
  it.each([
    ["asc", ["#001", "#002", "#003", "#004", "#005", "#006", "#007", "#008", "#009", "#010", "#011", "#012"]],
    ["desc", ["#012", "#011", "#010", "#009", "#008", "#007", "#006", "#005", "#004", "#003", "#002", "#001"]],
  ] as const)("番号を数値として%s順に並べる", (sortOrder, expected) => {
    const episodes = createEpisodeFixtures();

    expect(sortEpisodes(episodes, sortOrder).map(({ episode }) => episode)).toEqual(expected);
  });

  it("入力配列を変更しない", () => {
    const episodes = createEpisodeFixtures().reverse();
    const originalOrder = episodes.map(({ episode }) => episode);

    sortEpisodes(episodes, "asc");

    expect(episodes.map(({ episode }) => episode)).toEqual(originalOrder);
  });
});

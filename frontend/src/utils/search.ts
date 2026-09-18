import type { Episode } from "@/types/episode";
import type { MembersData } from "@/types/member";
import type { GroupedMembers, SearchConditions, SortOrder } from "@/types/search";

const GENERATION_ORDER = ["一期生", "二期生", "三期生", "四期生", "その他"];
const GENERATION_RANK: Record<string, number> = {
  "一期生": 1,
  "二期生": 2,
  "三期生": 3,
  "四期生": 4,
};

/**
 * エピソード表記から番号部分を数値として取り出す。
 * @param episode エピソード表記。
 * @returns 抽出した番号。数字がない場合はNaN。
 * @example
 * getEpisodeNumber("#123");
 * // => 123
 */
const getEpisodeNumber = (episode: string): number =>
  Number.parseInt(episode.replace(/[^0-9]/g, ""), 10);

/**
 * メンバーを現役の期別と卒業生に分け、表示順に整列する。
 * @type {(membersData: MembersData) => GroupedMembers[]}
 * @param membersData メンバー情報の辞書。
 * @returns 期別にグループ化したメンバー名。
 * @example
 * groupMembers({
 *   "山田花子": {
 *     name: "山田花子",
 *     nameKana: "やまだはなこ",
 *     generation: "一期生",
 *     isGraduated: false,
 *   },
 * });
 * // => [{ group: "一期生", members: ["山田花子"] }]
 */
export const groupMembers = (membersData: MembersData): GroupedMembers[] => {
  const activeMembers: Record<string, Array<{ name: string; kana: string }>> = {
    "一期生": [],
    "二期生": [],
    "三期生": [],
    "四期生": [],
    "その他": [],
  };
  const graduatedMembers: Array<{ name: string; kana: string; generation: string }> = [];

  Object.entries(membersData).forEach(([name, memberInfo]) => {
    if (memberInfo.isGraduated) {
      graduatedMembers.push({
        name,
        kana: memberInfo.nameKana,
        generation: memberInfo.generation,
      });
      return;
    }

    const generation = activeMembers[memberInfo.generation]
      ? memberInfo.generation
      : "その他";
    activeMembers[generation].push({ name, kana: memberInfo.nameKana });
  });

  const groups = GENERATION_ORDER.flatMap((generation): GroupedMembers[] => {
    const members = activeMembers[generation];

    if (members.length === 0) {
      return [];
    }

    members.sort((first, second) => first.kana.localeCompare(second.kana, "ja"));

    return [{ group: generation, members: members.map((member) => member.name) }];
  });

  if (graduatedMembers.length > 0) {
    graduatedMembers.sort((first, second) => {
      const generationDifference =
        (GENERATION_RANK[first.generation] ?? 999) -
        (GENERATION_RANK[second.generation] ?? 999);

      return generationDifference !== 0
        ? generationDifference
        : first.kana.localeCompare(second.kana, "ja");
    });
    groups.push({
      group: "卒業生",
      members: graduatedMembers.map((member) => member.name),
    });
  }

  return groups;
};

/**
 * エピソード一覧から10話単位の検索範囲を新しい順に生成する。
 * @type {(episodes: readonly Episode[]) => string[]}
 * @param episodes エピソード一覧。
 * @returns 「#1 - #10」形式の検索範囲。
 * @example
 * createEpisodeRanges([
 *   { episode: "#015", date: "2026/01/01", members: [], caption: "", url: "" },
 * ]);
 * // => ["#11 - #20", "#1 - #10"]
 */
export const createEpisodeRanges = (episodes: readonly Episode[]): string[] => {
  const episodeNumbers = Array.from(new Set(episodes.map((episode) => episode.episode)))
    .map(getEpisodeNumber)
    .filter((episodeNumber) => !Number.isNaN(episodeNumber));

  if (episodeNumbers.length === 0) {
    return [];
  }

  const maxEpisode = Math.max(...episodeNumbers);
  const ranges: string[] = [];

  for (let rangeEnd = Math.ceil(maxEpisode / 10) * 10; rangeEnd >= 1; rangeEnd -= 10) {
    ranges.push(`#${rangeEnd - 9} - #${rangeEnd}`);
  }

  return ranges;
};

/**
 * エピソード一覧から重複のない配信年を新しい順に取得する。
 * @type {(episodes: readonly Episode[]) => string[]}
 * @param episodes エピソード一覧。
 * @returns 降順に並べた配信年。
 * @example
 * createAvailableYears([
 *   { episode: "#001", date: "2025/01/01", members: [], caption: "", url: "" },
 *   { episode: "#002", date: "2026/01/01", members: [], caption: "", url: "" },
 * ]);
 * // => ["2026", "2025"]
 */
export const createAvailableYears = (episodes: readonly Episode[]): string[] => {
  const years = new Set(episodes.map((episode) => episode.date.split("/")[0]));

  return Array.from(years).sort((first, second) => second.localeCompare(first));
};

/**
 * 指定されたすべての検索条件に一致するエピソードを抽出する。
 * @type {(episodes: readonly Episode[], conditions: SearchConditions) => Episode[]}
 * @param episodes 検索対象のエピソード一覧。
 * @param conditions メンバー、番号範囲、年、フリーワードの検索条件。
 * @returns すべての条件に一致するエピソード一覧。
 * @example
 * filterEpisodes(
 *   [{ episode: "#001", date: "2026/01/01", members: ["山田花子"], caption: "新年", url: "" }],
 *   { member1: "山田花子", member2: "", episode: "#1 - #10", year: "2026", caption: "新年" },
 * );
 * // => [{ episode: "#001", ... }]
 */
export const filterEpisodes = (
  episodes: readonly Episode[],
  conditions: SearchConditions,
): Episode[] => {
  const searchWord = conditions.caption.trim().toLowerCase();

  return episodes.filter((episode) => {
    if (conditions.episode) {
      const episodeNumber = getEpisodeNumber(episode.episode);
      const [rangeStartText, rangeEndText] = conditions.episode.split(" - ");
      const rangeStart = getEpisodeNumber(rangeStartText);
      const rangeEnd = getEpisodeNumber(rangeEndText);

      if (
        Number.isNaN(episodeNumber) ||
        Number.isNaN(rangeStart) ||
        Number.isNaN(rangeEnd) ||
        episodeNumber < rangeStart ||
        episodeNumber > rangeEnd
      ) {
        return false;
      }
    }

    const episodeYear = episode.date.split("/")[0];
    if (conditions.year && episodeYear !== conditions.year) {
      return false;
    }
    if (conditions.member1 && !episode.members.includes(conditions.member1)) {
      return false;
    }
    if (conditions.member2 && !episode.members.includes(conditions.member2)) {
      return false;
    }
    if (searchWord && !episode.caption.toLowerCase().includes(searchWord)) {
      return false;
    }

    return true;
  });
};

/**
 * エピソードを番号の数値順で並べ、入力配列を変更しない。
 * @type {(episodes: readonly Episode[], sortOrder: SortOrder) => Episode[]}
 * @param episodes 並べ替えるエピソード一覧。
 * @param sortOrder 昇順または降順。
 * @returns 指定順に並べた新しいエピソード一覧。
 * @example
 * sortEpisodes(
 *   [
 *     { episode: "#010", date: "", members: [], caption: "", url: "" },
 *     { episode: "#002", date: "", members: [], caption: "", url: "" },
 *   ],
 *   "asc",
 * );
 * // => [#002のエピソード, #010のエピソード]
 */
export const sortEpisodes = (
  episodes: readonly Episode[],
  sortOrder: SortOrder,
): Episode[] =>
  [...episodes].sort((first, second) => {
    const difference = getEpisodeNumber(first.episode) - getEpisodeNumber(second.episode);

    return sortOrder === "asc" ? difference : -difference;
  });

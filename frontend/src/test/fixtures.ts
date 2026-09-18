import type { Episode } from "@/types/episode";
import type { MembersData } from "@/types/member";
import type { SearchConditions } from "@/types/search";

/** JSTで2026年3月1日00:00となる、日時依存テスト用の固定時刻。 */
export const FIXED_NOW_ISO = "2026-02-28T15:00:00.000Z";

/** 空データの表示や検索を検証するためのエピソード一覧。 */
export const EMPTY_EPISODES = [] as const satisfies readonly Episode[];

/**
 * 検索、並び替え、初期10件表示に使うエピソードfixtureを生成する。
 * @type {() => Episode[]}
 * @returns 呼び出しごとに生成した12件のエピソード。
 * @example
 * const episodes = createEpisodeFixtures();
 * // episodes[9].episode === "#010"
 * // episodes[10].episode === "#011"
 */
export const createEpisodeFixtures = (): Episode[] => [
  {
    url: "https://example.com/episodes/001",
    date: "2024/01/05",
    episode: "#001",
    members: ["山田花子", "鈴木一郎"],
    caption: "Morning Special",
  },
  {
    url: "https://example.com/episodes/002",
    date: "2024/02/10",
    episode: "#002",
    members: ["山田花子"],
    caption: "冬のおたより",
  },
  {
    url: "https://example.com/episodes/003",
    date: "2024/03/15",
    episode: "#003",
    members: ["鈴木一郎"],
    caption: "春の話",
  },
  {
    url: "https://example.com/episodes/004",
    date: "2024/04/20",
    episode: "#004",
    members: ["佐藤美咲"],
    caption: "新生活",
  },
  {
    url: "https://example.com/episodes/005",
    date: "2024/05/25",
    episode: "#005",
    members: ["山田花子", "佐藤美咲"],
    caption: "休日",
  },
  {
    url: "https://example.com/episodes/006",
    date: "2025/01/10",
    episode: "#006",
    members: ["鈴木一郎", "佐藤美咲"],
    caption: "新年",
  },
  {
    url: "https://example.com/episodes/007",
    date: "2025/02/14",
    episode: "#007",
    members: ["山田花子"],
    caption: "バレンタイン",
  },
  {
    url: "https://example.com/episodes/008",
    date: "2025/03/21",
    episode: "#008",
    members: ["鈴木一郎"],
    caption: "卒業",
  },
  {
    url: "https://example.com/episodes/009",
    date: "2025/04/01",
    episode: "#009",
    members: ["佐藤美咲"],
    caption: "April News",
  },
  {
    url: "https://example.com/episodes/010",
    date: "2025/05/05",
    episode: "#010",
    members: ["山田花子", "鈴木一郎"],
    caption: "10話の境界",
  },
  {
    url: "https://example.com/episodes/011",
    date: "2026/01/01",
    episode: "#011",
    members: ["山田花子", "佐藤美咲"],
    caption: "11話の境界",
  },
  {
    url: "https://example.com/episodes/012",
    date: "2026/02/01",
    episode: "#012",
    members: ["鈴木一郎", "佐藤美咲"],
    caption: "最新エピソード",
  },
];

/**
 * 期別・五十音順・卒業生と誕生日の検証に使うメンバーfixtureを生成する。
 * @type {() => MembersData}
 * @returns 呼び出しごとに生成したメンバー情報。
 * @example
 * const members = createMembersFixture();
 * // members["山田花子"].birthday === "02/29"
 */
export const createMembersFixture = (): MembersData => ({
  "山田花子": {
    name: "山田花子",
    nameKana: "やまだはなこ",
    generation: "一期生",
    isGraduated: false,
    birthday: "02/29",
  },
  "青木さくら": {
    name: "青木さくら",
    nameKana: "あおきさくら",
    generation: "一期生",
    isGraduated: false,
    birthday: "03/01",
  },
  "鈴木一郎": {
    name: "鈴木一郎",
    nameKana: "すずきいちろう",
    generation: "二期生",
    isGraduated: false,
  },
  "佐藤美咲": {
    name: "佐藤美咲",
    nameKana: "さとうみさき",
    generation: "研究生",
    isGraduated: false,
  },
  "伊藤あかり": {
    name: "伊藤あかり",
    nameKana: "いとうあかり",
    generation: "一期生",
    isGraduated: true,
  },
  "加藤ゆう": {
    name: "加藤ゆう",
    nameKana: "かとうゆう",
    generation: "二期生",
    isGraduated: true,
    birthday: "13/40",
  },
});

/**
 * 未指定状態の検索条件を生成する。
 * @type {() => SearchConditions}
 * @returns すべて空文字の検索条件。
 */
export const createEmptySearchConditions = (): SearchConditions => ({
  member1: "",
  member2: "",
  episode: "",
  year: "",
  caption: "",
});

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
    members: ["遠藤光莉", "石森璃花"],
    caption: "Morning Special",
  },
  {
    url: "https://example.com/episodes/002",
    date: "2024/02/10",
    episode: "#002",
    members: ["遠藤光莉"],
    caption: "冬のおたより",
  },
  {
    url: "https://example.com/episodes/003",
    date: "2024/03/15",
    episode: "#003",
    members: ["石森璃花"],
    caption: "春の話",
  },
  {
    url: "https://example.com/episodes/004",
    date: "2024/04/20",
    episode: "#004",
    members: ["山川宇衣"],
    caption: "新生活",
  },
  {
    url: "https://example.com/episodes/005",
    date: "2024/05/25",
    episode: "#005",
    members: ["遠藤光莉", "山川宇衣"],
    caption: "休日",
  },
  {
    url: "https://example.com/episodes/006",
    date: "2025/01/10",
    episode: "#006",
    members: ["石森璃花", "山川宇衣"],
    caption: "新年",
  },
  {
    url: "https://example.com/episodes/007",
    date: "2025/02/14",
    episode: "#007",
    members: ["遠藤光莉"],
    caption: "バレンタイン",
  },
  {
    url: "https://example.com/episodes/008",
    date: "2025/03/21",
    episode: "#008",
    members: ["石森璃花"],
    caption: "卒業",
  },
  {
    url: "https://example.com/episodes/009",
    date: "2025/04/01",
    episode: "#009",
    members: ["山川宇衣"],
    caption: "April News",
  },
  {
    url: "https://example.com/episodes/010",
    date: "2025/05/05",
    episode: "#010",
    members: ["遠藤光莉", "石森璃花"],
    caption: "10話の境界",
  },
  {
    url: "https://example.com/episodes/011",
    date: "2026/01/01",
    episode: "#011",
    members: ["遠藤光莉", "山川宇衣"],
    caption: "11話の境界",
  },
  {
    url: "https://example.com/episodes/012",
    date: "2026/02/01",
    episode: "#012",
    members: ["石森璃花", "山川宇衣"],
    caption: "最新エピソード",
  },
];

/**
 * 期別・五十音順・卒業生と誕生日の検証に使うメンバーfixtureを生成する。
 * 実在メンバーの2026年9月19日時点の情報を、実データと切り離して固定している。
 * @type {() => MembersData}
 * @returns 呼び出しごとに生成したメンバー情報。
 * @example
 * const members = createMembersFixture();
 * // members["遠藤光莉"].birthday === "04/17"
 */
export const createMembersFixture = (): MembersData => ({
    "遠藤光莉": {
      name: "遠藤光莉",
      nameKana: "えんどう ひかり",
      generation: "二期生",
      isGraduated: false,
      birthday: "04/17",
    },
    "大園玲": {
      name: "大園玲",
      nameKana: "おおぞの れい",
      generation: "二期生",
      isGraduated: false,
      birthday: "04/18",
    },
    "石森璃花": {
      name: "石森璃花",
      nameKana: "いしもり りか",
      generation: "三期生",
      isGraduated: false,
      birthday: "01/13",
    },
    "小島凪紗": {
      name: "小島凪紗",
      nameKana: "こじま なぎさ",
      generation: "三期生",
      isGraduated: false,
      birthday: "07/07",
    },
    "山川宇衣": {
      name: "山川宇衣",
      nameKana: "やまかわ うい",
      generation: "四期生",
      isGraduated: false,
      birthday: "09/19",
    },
    "上村莉菜": {
      name: "上村莉菜",
      nameKana: "うえむら りな",
      generation: "一期生",
      isGraduated: true,
      birthday: "01/04",
    },
    "土生瑞穂": {
      name: "土生瑞穂",
      nameKana: "はぶ みずほ",
      generation: "一期生",
      isGraduated: true,
      birthday: "07/07",
    },
    "井上梨名": {
      name: "井上梨名",
      nameKana: "いのうえ りな",
      generation: "二期生",
      isGraduated: true,
      birthday: "01/29",
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

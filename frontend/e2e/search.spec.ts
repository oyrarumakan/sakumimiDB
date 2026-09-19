import { expect, test } from "@playwright/test";
import episodeData from "../../data/episode_data.json";
import type { Episode } from "../src/types/episode";

const episodes: Episode[] = episodeData;

/**
 * エピソード表記から番号を取り出す。
 * @param episode 「#123」形式のエピソード表記。
 * @returns エピソード番号。
 * @example
 * getEpisodeNumber("#123");
 * // => 123
 */
const getEpisodeNumber = (episode: string): number =>
  Number.parseInt(episode.replace(/[^0-9]/g, ""), 10);

/**
 * 実データをエピソード番号順に並べた新しい配列を返す。
 * @type {(order: "asc" | "desc") => Episode[]}
 * @param order 昇順または降順。
 * @returns 指定した順番のエピソード一覧。
 * @example
 * const ascending = getSortedEpisodes("asc");
 * getEpisodeNumber(ascending[0].episode) <=
 *   getEpisodeNumber(ascending[ascending.length - 1].episode);
 * // => true
 *
 * const descending = getSortedEpisodes("desc");
 * getEpisodeNumber(descending[0].episode) >=
 *   getEpisodeNumber(descending[descending.length - 1].episode);
 * // => true
 */
const getSortedEpisodes = (order: "asc" | "desc"): Episode[] =>
  [...episodes].sort((first, second) => {
    const difference = getEpisodeNumber(first.episode) - getEpisodeNumber(second.episode);

    return order === "asc" ? difference : -difference;
  });

test("トップページで検索、並び替え、追加表示、クリアができる", async ({ page }) => {
  const descendingEpisodes = getSortedEpisodes("desc");
  const ascendingEpisodes = getSortedEpisodes("asc");
  const latestEpisode = descendingEpisodes[0];
  const oldestEpisode = ascendingEpisodes[0];
  const targetYear = latestEpisode.date.split("/")[0];
  const targetYearEpisodes = ascendingEpisodes.filter(({ date }) => date.startsWith(targetYear));

  await page.goto("/");

  await expect(page.getByRole("img", { name: "SakumimiDB logo" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "最新エピソード" })).toBeVisible();
  await expect(page.getByRole("link", { name: "聴く" })).toHaveCount(
    Math.min(10, episodes.length),
  );
  await expect(page.getByText(latestEpisode.episode, { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "昇順" }).click();
  await expect(page.getByText(oldestEpisode.episode, { exact: true })).toBeVisible();

  if (episodes.length > 10) {
    await page.getByRole("button", { name: "もっと表示する" }).click();
    await expect(page.getByRole("link", { name: "聴く" })).toHaveCount(
      Math.min(20, episodes.length),
    );
  }

  await page.getByRole("combobox", { name: "配信年" }).click();
  await page.getByRole("option", { name: targetYear, exact: true }).click();
  await expect(
    page.getByRole("heading", { name: `検索結果 (${targetYearEpisodes.length}件)` }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "聴く" })).toHaveCount(
    Math.min(10, targetYearEpisodes.length),
  );

  await page.getByRole("button", { name: "検索結果をクリアする" }).click();
  await expect(page.getByRole("heading", { name: "最新エピソード" })).toBeVisible();

  const firstListenLink = page.getByRole("link", { name: "聴く" }).first();
  await expect(firstListenLink).toHaveAttribute("href", oldestEpisode.url);
  await expect(firstListenLink).toHaveAttribute("target", "_blank");
  await expect(firstListenLink).toHaveAttribute("rel", "noopener noreferrer");
});

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import SearchContainer from "@/components/SearchContainer";
import { createEpisodeFixtures } from "@/test/fixtures";

describe("SearchContainer", () => {
  beforeEach(() => {
    render(
      <SearchContainer
        episodes={createEpisodeFixtures()}
        birthdayMembers={["遠藤光莉"]}
        birthdayLabel="4月17日"
      />,
    );
  });

  it("初期状態では新しい順に10件を表示する", () => {
    expect(screen.getByRole("heading", { name: "最新エピソード" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "聴く" })).toHaveLength(10);
    expect(screen.getByText("#012")).toBeInTheDocument();
    expect(screen.getByText("#003")).toBeInTheDocument();
    expect(screen.queryByText("#002")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "もっと表示する" })).toBeInTheDocument();
  });

  it("追加表示後は全件を表示し、ボタンを隠す", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "もっと表示する" }));

    expect(screen.getAllByRole("link", { name: "聴く" })).toHaveLength(12);
    expect(screen.queryByRole("button", { name: "もっと表示する" })).not.toBeInTheDocument();
  });

  it("ソート変更時に表示件数を10件へ戻す", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "もっと表示する" }));

    await user.click(screen.getByRole("button", { name: "昇順" }));

    expect(screen.getAllByRole("link", { name: "聴く" })).toHaveLength(10);
    expect(screen.getByText("#001")).toBeInTheDocument();
    expect(screen.queryByText("#011")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "もっと表示する" })).toBeInTheDocument();
  });

  it("検索条件の変更時に表示件数を10件へ戻す", async () => {
    const user = userEvent.setup();
    const captionInput = screen.getByRole("textbox", { name: "フリーワード" });
    await user.click(screen.getByRole("button", { name: "もっと表示する" }));
    expect(screen.getAllByRole("link", { name: "聴く" })).toHaveLength(12);

    await user.type(captionInput, "a");
    await user.clear(captionInput);

    expect(screen.getAllByRole("link", { name: "聴く" })).toHaveLength(10);
    expect(screen.getByRole("button", { name: "もっと表示する" })).toBeInTheDocument();
  });

  it("フリーワード変更時に件数を表示し、クリアすると初期状態へ戻す", async () => {
    const user = userEvent.setup();
    const captionInput = screen.getByRole("textbox", { name: "フリーワード" });

    await user.type(captionInput, "april news");

    expect(screen.getByRole("heading", { name: "検索結果 (1件)" })).toBeInTheDocument();
    expect(screen.getByText("#009")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "検索結果をクリアする" }));

    expect(captionInput).toHaveValue("");
    expect(screen.getByRole("heading", { name: "最新エピソード" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "聴く" })).toHaveLength(10);
  });

  it("検索結果が0件の場合に案内を表示する", async () => {
    const user = userEvent.setup();

    await user.type(
      screen.getByRole("textbox", { name: "フリーワード" }),
      "存在しない番組名",
    );

    expect(screen.getByRole("heading", { name: "検索結果 (0件)" })).toBeInTheDocument();
    expect(screen.getByText("該当するエピソードが見つかりませんでした。")).toBeInTheDocument();
  });

  it("メンバー1の選択に応じてメンバー2を有効化し、重複選択を防ぐ", async () => {
    const user = userEvent.setup();
    const member1 = screen.getByRole("combobox", { name: "メンバー 1" });
    const member2 = screen.getByRole("combobox", { name: "メンバー 2 (AND)" });

    expect(member2).toHaveAttribute("aria-disabled", "true");

    await user.click(member1);
    await user.click(screen.getByRole("option", { name: "遠藤光莉" }));
    expect(member2).not.toHaveAttribute("aria-disabled", "true");

    await user.click(member2);
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).queryByRole("option", { name: "遠藤光莉" })).not.toBeInTheDocument();
    await user.click(within(listbox).getByRole("option", { name: "石森璃花" }));
    expect(screen.getByRole("heading", { name: "検索結果 (2件)" })).toBeInTheDocument();

    await user.click(member1);
    await user.click(screen.getByRole("option", { name: "すべて" }));
    expect(member2).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("heading", { name: "最新エピソード" })).toBeInTheDocument();
  });

  it("聴くリンクに外部遷移用の属性を設定する", () => {
    const latestLink = screen.getAllByRole("link", { name: "聴く" })[0];

    expect(latestLink).toHaveAttribute("href", "https://example.com/episodes/012");
    expect(latestLink).toHaveAttribute("target", "_blank");
    expect(latestLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("誕生日バナーの導線からメンバー1と検索結果を更新する", async () => {
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: "遠藤光莉さんのエピソードを聞いてみる" }),
    );

    expect(screen.getByRole("combobox", { name: "メンバー 1" })).toHaveTextContent(
      "遠藤光莉",
    );
    expect(screen.getByRole("heading", { name: "検索結果 (6件)" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "聴く" })).toHaveLength(6);
  });

  it("誕生日バナーからメンバー1を上書きし、他の検索条件を維持する", async () => {
    const user = userEvent.setup();
    const member1 = screen.getByRole("combobox", { name: "メンバー 1" });
    const captionInput = screen.getByRole("textbox", { name: "フリーワード" });

    await user.click(member1);
    await user.click(screen.getByRole("option", { name: "石森璃花" }));
    await user.type(captionInput, "Morning Special");
    await user.click(
      screen.getByRole("button", { name: "遠藤光莉さんのエピソードを聞いてみる" }),
    );

    expect(member1).toHaveTextContent("遠藤光莉");
    expect(captionInput).toHaveValue("Morning Special");
    expect(screen.getByRole("heading", { name: "検索結果 (1件)" })).toBeInTheDocument();
    expect(screen.getByText("#001")).toBeInTheDocument();
  });

  it("メンバー2と同じ誕生日メンバーを選ぶとメンバー2をクリアする", async () => {
    const user = userEvent.setup();
    const member1 = screen.getByRole("combobox", { name: "メンバー 1" });
    const member2 = screen.getByRole("combobox", { name: "メンバー 2 (AND)" });

    await user.click(member1);
    await user.click(screen.getByRole("option", { name: "石森璃花" }));
    await user.click(member2);
    await user.click(screen.getByRole("option", { name: "遠藤光莉" }));
    await user.click(
      screen.getByRole("button", { name: "遠藤光莉さんのエピソードを聞いてみる" }),
    );

    expect(member1).toHaveTextContent("遠藤光莉");
    expect(member2).toHaveTextContent("すべて");
    expect(screen.getByRole("heading", { name: "検索結果 (6件)" })).toBeInTheDocument();
  });
});

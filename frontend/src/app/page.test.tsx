import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import { createEpisodeFixtures } from "@/test/fixtures";

const { readFileMock } = vi.hoisted(() => ({
  readFileMock: vi.fn(),
}));

vi.mock("fs/promises", () => ({
  readFile: readFileMock,
}));

vi.mock("@/components/Header", () => ({
  default: () => <div>ヘッダー</div>,
}));

vi.mock("@/components/BirthdayBanner", () => ({
  default: () => <div>誕生日バナー</div>,
}));

vi.mock("@/components/ErrorComponent", () => ({
  default: () => <div role="alert">データ読み込みエラー</div>,
}));

vi.mock("@/components/SearchContainer", () => ({
  default: ({ episodes }: { episodes: Array<{ episode: string }> }) => (
    <div data-testid="episodes">{episodes.map(({ episode }) => episode).join(",")}</div>
  ),
}));

describe("Home", () => {
  it("JSONから読み込んだエピソードを検索画面へ渡す", async () => {
    const episodes = createEpisodeFixtures().slice(0, 2);
    readFileMock.mockResolvedValueOnce(JSON.stringify(episodes));

    render(await Home());

    expect(screen.getByTestId("episodes")).toHaveTextContent("#001,#002");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("空のJSON配列を正常なデータとして扱う", async () => {
    readFileMock.mockResolvedValueOnce("[]");

    render(await Home());

    expect(screen.getByTestId("episodes")).toBeEmptyDOMElement();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("ファイル読み込み失敗時にエラーを表示する", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    readFileMock.mockRejectedValueOnce(new Error("read failed"));

    render(await Home());

    expect(screen.getByRole("alert")).toHaveTextContent("データ読み込みエラー");
    expect(screen.queryByTestId("episodes")).not.toBeInTheDocument();
  });

  it("JSON解析失敗時にエラーを表示する", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    readFileMock.mockResolvedValueOnce("invalid json");

    render(await Home());

    expect(screen.getByRole("alert")).toHaveTextContent("データ読み込みエラー");
    expect(screen.queryByTestId("episodes")).not.toBeInTheDocument();
  });
});

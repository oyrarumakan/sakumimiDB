import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useThemeMode } from "@/providers/useThemeMode";

/**
 * テスト中のテーマ状態と切り替え操作を表示する。
 * @returns 現在のテーマを示すボタン。
 */
const ThemeProbe = () => {
  const { mode, toggleTheme } = useThemeMode();

  return <button onClick={toggleTheme}>{mode}</button>;
};

describe("ThemeProvider", () => {
  it("localStorageに保存したテーマを復元する", async () => {
    localStorage.setItem("themeMode", "dark");
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("dark"));
  });

  it.each([null, "invalid"])(
    "保存値が%sの場合はOSのダークテーマ設定を使用する",
    async (savedMode) => {
      if (savedMode !== null) {
        localStorage.setItem("themeMode", savedMode);
      }
      vi.mocked(window.matchMedia).mockImplementation(
        (query) =>
          ({
            matches: true,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) satisfies MediaQueryList,
      );

      render(
        <ThemeProvider>
          <ThemeProbe />
        </ThemeProvider>,
      );

      await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("dark"));
    },
  );

  it("テーマ切り替えを保存し、再マウント後に復元する", async () => {
    const user = userEvent.setup();
    const firstRender = render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "light" }));
    expect(screen.getByRole("button", { name: "dark" })).toBeInTheDocument();
    expect(localStorage.getItem("themeMode")).toBe("dark");

    firstRender.unmount();
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("dark"));
  });
});

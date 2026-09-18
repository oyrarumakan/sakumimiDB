import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

/**
 * jsdomに未実装のmatchMediaをMUI向けに再現する。
 * @param query 評価対象のメディアクエリ。
 * @returns 常に未一致として扱うMediaQueryList。
 * @example
 * matchMediaMock("(prefers-color-scheme: dark)").matches;
 * // => false
 */
const matchMediaMock = (query: string): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

/**
 * OSテーマ設定を各コンポーネントテストの既定値へ戻す。
 * @returns 戻り値なし。
 */
const installMatchMediaMock = (): void => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn(matchMediaMock),
  });
};

/**
 * コンポーネントテスト間でDOM、モック、localStorageを初期化する。
 * @returns 戻り値なし。
 */
const resetTestEnvironment = (): void => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.clearAllMocks();
  window.localStorage.clear();
};

beforeEach(installMatchMediaMock);
afterEach(resetTestEnvironment);

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

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

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn(matchMediaMock),
});

/**
 * コンポーネントテスト間でDOM、モック、localStorageを初期化する。
 */
const resetTestEnvironment = (): void => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
  window.localStorage.clear();
};

afterEach(resetTestEnvironment);

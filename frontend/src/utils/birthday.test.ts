import { describe, expect, it } from "vitest";
import { createMembersFixture } from "@/test/fixtures";
import {
  formatBirthdayLabel,
  getBirthdayMembers,
  getJstMonthDay,
  isValidBirthday,
} from "@/utils/birthday";

describe("getJstMonthDay", () => {
  it("JSTの日付切り替わり直前は前日を返す", () => {
    expect(getJstMonthDay(new Date("2026-02-28T14:59:59.999Z"))).toBe("02/28");
  });

  it("JSTの日付切り替わり直後は翌日を返す", () => {
    expect(getJstMonthDay(new Date("2026-02-28T15:00:00.000Z"))).toBe("03/01");
  });
});

describe("formatBirthdayLabel", () => {
  it("MM/DDを日本語の日付ラベルへ変換する", () => {
    expect(formatBirthdayLabel("03/01")).toBe("3月1日");
  });

  it("数値に変換できない値はそのまま返す", () => {
    expect(formatBirthdayLabel("不明")).toBe("不明");
  });
});

describe("isValidBirthday", () => {
  it.each(["01/01", "02/29", "12/31"])("実在する月日%sを有効と判定する", (value) => {
    expect(isValidBirthday(value)).toBe(true);
  });

  it.each([undefined, "2/29", "02/30", "00/01", "13/40", "文字列"])(
    "%sを無効と判定する",
    (value) => {
      expect(isValidBirthday(value)).toBe(false);
    },
  );
});

describe("getBirthdayMembers", () => {
  it("指定日の誕生日メンバーを返す", () => {
    expect(getBirthdayMembers(createMembersFixture(), "04/17")).toEqual(["遠藤光莉"]);
  });

  it("同じ誕生日のメンバーをすべて返し、不正・未設定値を除外する", () => {
    const members = createMembersFixture();
    members["遠藤光莉"].birthday = "13/40";
    delete members["大園玲"].birthday;

    expect(getBirthdayMembers(members, "07/07")).toEqual(["小島凪紗", "土生瑞穂"]);
    expect(getBirthdayMembers(members, "13/40")).toEqual([]);
  });

  it("該当者がいなければ空配列を返す", () => {
    expect(getBirthdayMembers(createMembersFixture(), "12/31")).toEqual([]);
  });
});

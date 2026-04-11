import type { MembersData } from "@/types/member";

const JST_TIME_ZONE = "Asia/Tokyo";
const MONTH_DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: JST_TIME_ZONE,
  month: "2-digit",
  day: "2-digit",
});

/**
 * 現在時刻をJSTでMM/DD形式へ変換する。
 * @param date 変換対象の日付。省略時は現在時刻を使用する。
 * @returns JST基準のMM/DD文字列。
 */
export function getJstMonthDay(date: Date = new Date()): string {
  return MONTH_DAY_FORMATTER.format(date);
}

/**
 * MM/DD形式の誕生日文字列を表示用のM月D日形式へ変換する。
 * @param monthDay MM/DD形式の誕生日文字列。
 * @returns 表示用のM月D日文字列。不正形式の場合は入力値をそのまま返す。
 */
export function formatBirthdayLabel(monthDay: string): string {
  const [month, day] = monthDay.split("/").map((value) => Number.parseInt(value, 10));

  if (Number.isNaN(month) || Number.isNaN(day)) {
    return monthDay;
  }

  return `${month}月${day}日`;
}

/**
 * birthday値が実在するMM/DD形式かどうかを判定する。
 * @param value 判定対象の誕生日文字列。
 * @returns 実在する月日であればtrue。
 * @example
 * isValidBirthday("02/29");
 * // => true
 *
 * isValidBirthday("13/40");
 * // => false
 */
export function isValidBirthday(value: string | undefined): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const match = /^(\d{2})\/(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const month = Number.parseInt(match[1], 10);
  const day = Number.parseInt(match[2], 10);

  if (month < 1 || month > 12) {
    return false;
  }

  const daysInMonth = new Date(Date.UTC(2000, month, 0)).getUTCDate();

  return day >= 1 && day <= daysInMonth;
}

/**
 * JSTの当日文字列と一致する誕生日メンバー名を抽出する。
 * @param membersData メンバー辞書データ。
 * @param monthDay JST基準のMM/DD文字列。
 * @returns 誕生日が一致したメンバー名の配列。
 */
export function getBirthdayMembers(membersData: MembersData, monthDay: string): string[] {
  return Object.values(membersData)
    .filter((member) => isValidBirthday(member.birthday) && member.birthday === monthDay)
    .map((member) => member.name);
}
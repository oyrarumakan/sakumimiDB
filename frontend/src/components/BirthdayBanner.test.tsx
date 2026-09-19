import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import BirthdayBanner from "@/components/BirthdayBanner";

describe("BirthdayBanner", () => {
  it("誕生日メンバーがいなければ表示しない", () => {
    render(
      <BirthdayBanner
        birthdayMembers={[]}
        dateLabel="3月1日"
        onMemberSelect={vi.fn()}
      />,
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("日付と複数の誕生日メンバーを表示する", () => {
    render(
      <BirthdayBanner
        birthdayMembers={["小島凪紗", "土生瑞穂"]}
        dateLabel="7月7日"
        onMemberSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "7月7日は小島凪紗さん、土生瑞穂さんの誕生日です。",
    );
  });

  it("誕生日メンバーごとの検索導線を表示する", () => {
    render(
      <BirthdayBanner
        birthdayMembers={["小島凪紗", "土生瑞穂"]}
        dateLabel="7月7日"
        onMemberSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "小島凪紗さんのエピソードを聞いてみる" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "土生瑞穂さんのエピソードを聞いてみる" }),
    ).toBeInTheDocument();
  });

  it("検索導線を押すと対象メンバーをコールバック関数に渡す", async () => {
    const user = userEvent.setup();
    const onMemberSelect = vi.fn();
    render(
      <BirthdayBanner
        birthdayMembers={["小島凪紗"]}
        dateLabel="7月7日"
        onMemberSelect={onMemberSelect}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "小島凪紗さんのエピソードを聞いてみる" }),
    );

    expect(onMemberSelect).toHaveBeenCalledOnce();
    expect(onMemberSelect).toHaveBeenCalledWith("小島凪紗");
  });

  it("閉じる操作でバナーを非表示にする", async () => {
    const user = userEvent.setup();
    render(
      <BirthdayBanner
        birthdayMembers={["小島凪紗"]}
        dateLabel="7月7日"
        onMemberSelect={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "誕生日バナーを閉じる" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

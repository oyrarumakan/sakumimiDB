import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import BirthdayBanner from "@/components/BirthdayBanner";

describe("BirthdayBanner", () => {
  it("誕生日メンバーがいなければ表示しない", () => {
    render(<BirthdayBanner birthdayMembers={[]} dateLabel="3月1日" />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("日付と複数の誕生日メンバーを表示する", () => {
    render(
      <BirthdayBanner
        birthdayMembers={["小島凪紗", "土生瑞穂"]}
        dateLabel="7月7日"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "7月7日は小島凪紗さん、土生瑞穂さんの誕生日です。",
    );
  });

  it("閉じる操作でバナーを非表示にする", async () => {
    const user = userEvent.setup();
    render(<BirthdayBanner birthdayMembers={["小島凪紗"]} dateLabel="7月7日" />);

    await user.click(screen.getByRole("button", { name: "誕生日バナーを閉じる" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

import path from "path";
import { Box, Container } from "@mui/material";
import BirthdayBanner from "@/components/BirthdayBanner";
import ErrorComponent from "@/components/ErrorComponent";
import Header from "@/components/Header";
import SearchContainer from "@/components/SearchContainer";
import type { Episode } from "@/types/episode";
import type { MembersData } from "@/types/member";
import { formatBirthdayLabel, getBirthdayMembers, getJstMonthDay } from "@/utils/birthday";
import membersData from "@data/members.json";

export const revalidate = 3600;

const typedMembersData: MembersData = membersData;

const pageStyles = {
  main: {
    pb: 8,
    pt: 2,
    minHeight: "100vh",
    backgroundColor: "background.default",
  },
  errorContainer: {
    py: 3,
  },
};

/**
 * エピソード一覧ページを描画する。
 * @returns 誕生日バナーと検索UIを含むトップページ。
 */
const Home = async () => {
  const episodeFilePath = path.join(process.cwd(), "../data/episode_data.json");
  let episodes: Episode[] = [];
  let hasError = false;

  const monthDay = getJstMonthDay();
  const birthdayMembers = getBirthdayMembers(typedMembersData, monthDay);
  const birthdayLabel = formatBirthdayLabel(monthDay);

  try {
    const { readFile } = await import("fs/promises");
    const fileContents = await readFile(episodeFilePath, "utf8");
    episodes = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to load episode data:", error);
    hasError = true;
  }

  return (
    <Box component="main" sx={pageStyles.main}>
      <Header />
      <BirthdayBanner birthdayMembers={birthdayMembers} dateLabel={birthdayLabel} />
      {hasError ? (
        <Container maxWidth="md" sx={pageStyles.errorContainer}>
          <ErrorComponent />
        </Container>
      ) : (
        <SearchContainer episodes={episodes} />
      )}
    </Box>
  );
};

export default Home;

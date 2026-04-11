import fs from "fs/promises";
import path from "path";
import { Box, Container } from "@mui/material";
import BirthdayBanner from "@/components/BirthdayBanner";
import ErrorComponent from "@/components/ErrorComponent";
import Header from "@/components/Header";
import SearchContainer from "@/components/SearchContainer";
import type { Episode } from "@/types/episode";
import type { MembersData } from "@/types/member";
import { formatBirthdayLabel, getBirthdayMembers, getJstMonthDay } from "@/utils/birthday";

export const dynamic = "force-dynamic";

export default async function Home() {
  const episodeFilePath = path.join(process.cwd(), "../data/episode_data.json");
  const membersFilePath = path.join(process.cwd(), "src/data/members.json");
  let episodes: Episode[] = [];
  let birthdayMembers: string[] = [];
  let birthdayLabel = "";
  let hasError = false;

  try {
    const fileContents = await fs.readFile(episodeFilePath, "utf8");
    episodes = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to load episode data:", error);
    hasError = true;
  }

  try {
    const fileContents = await fs.readFile(membersFilePath, "utf8");
    const membersData = JSON.parse(fileContents) as MembersData;
    const monthDay = getJstMonthDay();

    birthdayMembers = getBirthdayMembers(membersData, monthDay);
    birthdayLabel = formatBirthdayLabel(monthDay);
  } catch (error) {
    console.error("Failed to load member data:", error);
  }

  return (
    <Box
      component="main"
      sx={{
        pb: 8,
        pt: 2,
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Header />
      <BirthdayBanner birthdayMembers={birthdayMembers} dateLabel={birthdayLabel} />
      {hasError ? (
        <Container maxWidth="md" sx={{ py: 3 }}>
          <ErrorComponent />
        </Container>
      ) : (
        <SearchContainer episodes={episodes} />
      )}
    </Box>
  );
}

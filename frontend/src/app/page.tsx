import fs from "fs/promises";
import path from "path";
import { Box, Container } from "@mui/material";
import ErrorComponent from "@/components/ErrorComponent";
import Header from "@/components/Header";
import SearchContainer from "@/components/SearchContainer";
import type { Episode } from "@/types/episode";

export default async function Home() {
  const filePath = path.join(process.cwd(), "../data/episode_data.json");
  let episodes: Episode[] = [];
  let hasError = false;

  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    episodes = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to load episode data:", error);
    hasError = true;
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

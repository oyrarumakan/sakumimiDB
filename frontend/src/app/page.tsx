import fs from "fs/promises";
import path from "path";
import Header from "@/components/Header";
import SearchContainer from "@/components/SearchContainer";
import type { Episode } from "@/types/episode";

export default async function Home() {
  const filePath = path.join(process.cwd(), "../data/episode_data.json");
  let episodes: Episode[] = [];

  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    episodes = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to load episode data:", error);
    // エラー時は空配列を渡すか、エラーUIを表示します
  }

  return (
    <main className="pb-16 pt-4 bg-gray-50 min-h-screen">
      <Header />
      <SearchContainer episodes={episodes} />
    </main>
  );
}

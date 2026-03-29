import fs from "fs/promises";
import path from "path";
import Header from "@/components/Header";
import SearchContainer from "@/components/SearchContainer";
import ErrorComponent from "@/components/ErrorComponent";
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
    <main className="pb-16 pt-4 bg-gray-50 min-h-screen">
      <Header />
      {hasError ? (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <ErrorComponent />
        </div>
      ) : (
        <SearchContainer episodes={episodes} />
      )}
    </main>
  );
}

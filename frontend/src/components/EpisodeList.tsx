import type { Episode } from "@/types/episode";

interface EpisodeListProps {
  episodes: Episode[];
}

export default function EpisodeList({ episodes }: EpisodeListProps) {
  if (episodes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
        該当するエピソードが見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {episodes.map((ep) => (
        <div
          key={ep.episode}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col md:flex-row md:items-start md:justify-between gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-bold text-gray-900 bg-pink-50 text-accent-pink px-3 py-1 rounded-full w-max">
                {ep.episode}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                {ep.date}
              </span>
            </div>
            
            <div className="mb-3 flex flex-wrap gap-2">
              {ep.members.map((member) => (
                <span
                  key={member}
                  className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {member}
                </span>
              ))}
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mb-4 md:mb-0 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
              {ep.caption}
            </p>
          </div>

          <div className="flex-shrink-0 flex items-end">
            <a
              href={ep.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-accent-pink hover:bg-accent-pink-hover text-white font-semibold py-2 px-6 rounded-full transition-colors w-full md:w-auto shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              聴く
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

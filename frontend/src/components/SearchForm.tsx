import type { SearchConditions } from "@/types/search";

interface SearchFormProps {
  conditions: SearchConditions;
  onConditionChange: (key: keyof SearchConditions, value: string) => void;
  availableMembers: string[];
  availableEpisodes: string[];
  availableYears: string[];
  onClear: () => void;
}

export default function SearchForm({
  conditions,
  onConditionChange,
  availableMembers,
  availableEpisodes,
  availableYears,
  onClear,
}: SearchFormProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 my-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-accent-pink"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        検索条件
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* メンバー1 */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">メンバー 1</label>
          <select
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-accent-pink focus:border-accent-pink outline-none transition-colors"
            value={conditions.member1}
            onChange={(e) => onConditionChange("member1", e.target.value)}
          >
            <option value="">すべて</option>
            {availableMembers.map((m) => (
              <option key={`m1-${m}`} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* メンバー2 */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">メンバー 2 (AND)</label>
          <select
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-accent-pink focus:border-accent-pink outline-none transition-colors"
            value={conditions.member2}
            onChange={(e) => onConditionChange("member2", e.target.value)}
          >
            <option value="">すべて</option>
            {availableMembers
              .filter((m) => m !== conditions.member1)
              .map((m) => (
                <option key={`m2-${m}`} value={m}>
                  {m}
                </option>
              ))}
          </select>
        </div>

        {/* エピソード */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">エピソード番号</label>
          <select
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-accent-pink focus:border-accent-pink outline-none transition-colors"
            value={conditions.episode}
            onChange={(e) => onConditionChange("episode", e.target.value)}
          >
            <option value="">すべて</option>
            {availableEpisodes.map((ep) => (
              <option key={ep} value={ep}>
                {ep}
              </option>
            ))}
          </select>
        </div>

        {/* 配信年 */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">配信年</label>
          <select
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-accent-pink focus:border-accent-pink outline-none transition-colors"
            value={conditions.year}
            onChange={(e) => onConditionChange("year", e.target.value)}
          >
            <option value="">すべて</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onClear}
          className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
        >
          検索結果をクリアする
        </button>
      </div>
    </div>
  );
}

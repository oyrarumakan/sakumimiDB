export default function Header() {
  return (
    <header className="py-8 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">音声コンテンツ検索</h1>
        <p className="text-gray-600">
          メンバー名、エピソード番号、配信年などからお目当ての話数を検索できます。
        </p>
      </div>
    </header>
  );
}

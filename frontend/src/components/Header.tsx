export default function Header() {
  return (
    <header className="py-8 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SakumimiDB</h1>
        <p className="text-gray-600">
          webラジオ「さくみみ」の過去のエピソード情報を検索できるデータベースです。<br />
          出演者や配信年などの条件で絞り込んで、気になるエピソードを見つけてみてください。
        </p>
      </div>
    </header>
  );
}

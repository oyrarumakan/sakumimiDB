export default function Header() {
  return (
    <header className="py-8 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-4">
          <img
            src="/logo.png"
            alt="SakumimiDB logo"
            className="h-42 w-auto"
          />
        </div>
        <p className="text-gray-600">
          webラジオ「さくみみ」の過去のエピソード情報を検索できるデータベースです。<br />
          出演者や配信年などの条件で絞り込んで、気になるエピソードを見つけてみてください。
        </p>
      </div>
    </header>
  );
}

# SakumimiDB frontend
## 必要な環境

- Node.js 24.21.0（リポジトリルートの`.tool-versions`に定義）
- npm

※E2Eテストを実行する場合は、Playwright用のChromiumも必要です。

## セットアップ

リポジトリをチェックアウトした後、frontendディレクトリに遷移して次のコマンドを実行します。

```bash
npm ci
npm run test:e2e:install
```

`npm ci`は`package-lock.json`に記録された依存関係を導入します。E2Eを実行しない場合、Chromiumのインストールは省略できます。

開発サーバーは次のコマンドで起動します。

```bash
npm run dev
```

ブラウザーで[http://localhost:3000](http://localhost:3000)を開いて確認します。

## テストの構成

| 種類 | 配置 | 実行環境 | 主な対象 |
| --- | --- | --- | --- |
| 単体テスト | `src/**/*.test.ts` | Node.js | 検索、ソート、メンバー分類、誕生日処理 |
| コンポーネントテスト | `src/**/*.test.tsx` | jsdom | 検索UI、誕生日バナー、テーマ、JSON読み込み |
| E2Eテスト | `e2e/**/*.spec.ts` | Chromium | 本番ビルド上の検索、並び替え、追加表示、クリア |

Vitestの共通設定は`vitest.config.mts`、DOM・モックの初期化は`vitest.setup.ts`、Playwrightの設定は`playwright.config.ts`にあります。共通fixtureは`src/test/fixtures.ts`に配置しています。

## 実行コマンド

| コマンド | 用途 |
| --- | --- |
| `npm test` | 単体・コンポーネントテストをwatchモードで実行する |
| `npm run test:run` | 単体・コンポーネントテストを1回実行する |
| `npm run test:unit` | 単体テストだけをwatchモードで実行する |
| `npm run test:component` | コンポーネントテストだけをwatchモードで実行する |
| `npm run test:e2e` | 本番ビルドとサーバーを起動してE2Eテストを実行する |
| `npm run test:e2e:ui` | Playwright UIを起動してE2Eテストを実行する |
| `npm run test:e2e:install` | Chromiumをインストールする |
| `npm run lint` | ESLintを実行する |
| `npm run type-check` | TypeScriptの型チェックを実行する |
| `npm run build` | 本番ビルドを作成する |

特定のテストファイルだけを実行する場合は、プロジェクト名とパスを指定します。

```bash
npx vitest run --project unit src/utils/search.test.ts
npx vitest run --project component src/components/SearchContainer.test.tsx
npx playwright test e2e/search.spec.ts
```

## テストの追加方法

検索や日付変換など、DOMを使わない純粋関数は対象ファイルと同じディレクトリへ`.test.ts`で追加します。
ReactコンポーネントやブラウザーAPIを使う処理は`.test.tsx`で追加します。
利用者の主要操作を本番ビルドで確認するケースは`e2e/`へ`.spec.ts`で追加します。

テストデータには`src/test/fixtures.ts`の固定データを使用します。
メンバーfixtureは実在メンバーの2026年9月19日時点の属性を固定しており、`src/data/members.json`の更新には追従しません。
テストしたい前提が変わった場合にfixtureと期待値を更新します。

日時依存テストではfixtureの`FIXED_NOW_ISO`とVitestのfake timerを使用します。
`vitest.setup.ts`が各テスト後に実時間へ戻し、DOM、モック、`localStorage`もリセットします。OSテーマは各テストで`matchMedia`を上書きできます。

E2Eは実際の`data/episode_data.json`を使用します。件数や最新エピソードを固定値にせず、入力データから期待値を算出してください。
外部の配信サイトへは遷移せず、「聴く」リンクのURLと属性までを検証します。

## Git hookとCI

- pre-commit：変更されたJavaScript・TypeScriptファイルへESLintを実行する
- pre-push：`npm run test:run`を実行する
- `.github/workflows/lint.yml`：PRとmain・developへのpushでESLintと型チェックを実行する
- `.github/workflows/test.yml`：PRとmain・developへのpushでVitest、本番ビルド、ChromiumのE2Eを実行する

CIは`frontend/**`または各ワークフロー自身が変更された場合に実行します。`data/episode_data.json`だけの変更では実行しません。
追加のシークレットや書き込み権限は使用しません。

E2Eが失敗した場合、GitHub Actionsは`playwright-report/`と`test-results/`をartifactとして7日間保存します。

## 失敗時の確認

Vitestが失敗した場合は、失敗したファイルを単独で実行し、表示された期待値と実際の値を確認します。
コンポーネントテストではTesting Libraryが出力するDOMも確認します。

Playwrightがブラウザーを見つけられない場合は、`npm run test:e2e:install`を実行します。ローカルのHTMLレポートは次のコマンドで開けます。

```bash
npx playwright show-report
```

トレースが生成されている場合は、次のように確認します。

```bash
npx playwright show-trace test-results/<テスト結果ディレクトリ>/trace.zip
```

本番ビルドで`Failed to fetch Geist`と表示された場合は、`next/font`がGoogle Fontsを取得できるネットワーク環境で再実行します。

## 現在の対象範囲

検索条件の組み合わせと境界、ソートと選択肢生成、検索UIの状態遷移、誕生日のJST境界、テーマ保存、ローカルJSONの正常・異常系、主要な検索導線を検証しています。

現状は次を対象外としています。

- Chromium以外のブラウザー
- スクリーンショットによる見た目の差分検出
- アクセシビリティ専用ツールによる監査
- スクレイピング処理とVercelへのデプロイ
- 外部配信サイトの応答と遷移先の内容

カバレッジ率の収集と数値目標は設定していません。主要な仕様と回帰しやすい境界をテストできることを完了基準としています。

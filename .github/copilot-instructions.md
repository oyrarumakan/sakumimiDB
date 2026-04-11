# Project Specific Rules: Next.js + TypeScript

これらはすべてfrontend/配下のjavascript / typescriptファイルに適用するものとします。

## Core Implementation Principles
- **No External API**: 基本的に、アプリケーション内で扱う全データはローカルのJSONファイルから参照します。`fetch` 等の外部通信はこちらが特別に依頼する場合を除いて実装せず、インポートしたJSONデータを型安全に扱ってください。
- **Modern Next.js (v15+)**: `params` や `searchParams` などの Async Request APIs にアクセスする際は、必ず `await` するか React の `use()` フックを使用してください。
- **React 19 Standards**: `forwardRef` は使用せず、`ref` を通常の prop として扱ってください。また、Promiseの解決には `use()` を優先してください。

## Coding Standards (Documentation)
- 新しく関数（`function`, `const`）を作成する際は、必ずJSDocを記載してください。
- JSDocには以下のタグを必須とします：
  - 引数がある場合：`@param`
  - 返り値がある場合：`@returns`
  - 独自定義の型（interface/type）を使用する場合：`@type`
- 複雑なロジック（文字列変換、計算処理、正規表現、データ変換など）を含む場合は、必ず`@example`を使用して具体例を記述してください。

## Technology Stack
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: mui (Material-UI)

## Architecture & Implementation Rules
- **Component Definition**: 原則として関数コンポーネントを使用し、`const` で定義してください。
- **Client/Server Components**:
  - デフォルトは Server Components とし、インタラクティブな要素（onClick, useStateなど）が必要な場合のみ `'use client'` を付与してください。
- **Data Fetching**:
  - Fetchingは原則として Server Components 内で `async/await` を用いて行ってください。
- **Type Safety**:
  - `any` の使用は禁止です。型定義が困難な場合は `unknown` を使用し、適切に型ガードを行ってください。
- **Naming Convention**:
  - コンポーネント名は PascalCase（例: `UserProfile.tsx`）。
  - 変数・関数名は camelCase。
  - 定数は UPPER_SNAKE_CASE。
- **Separation of Concerns**: 
  - 検索ロジック（ビジネスロジック）とUI（コンポーネント）は厳格に分離してください。
  - 複雑なフィルタリングやソート処理は `utils/` または `lib/` に純粋関数として切り出してください。
- **Performance**:
  - 大量のデータを扱う場合は `useMemo` を活用し、UIのレスポンスを損なわないようにしてください。

## Preferred Patterns
- Lucide React をアイコンライブラリとして推奨します。
- UIコンポーネントに shadcn/ui を使用している場合、新機能の実装でもそれに準じた構成を提案してください。

## Styling Rules (MUI / sx prop)
- **Inline Style Limit**: `sx` プロパティに記述するスタイルが5行を超える場合、または同じスタイルを再利用する場合は、コンポーネントの外で `const styles = { ... }` として定義するか、別ファイルに切り出してください。
- **Theme Usage**: 色や余白（spacing）をハードコードせず、必ず `theme.palette` や `theme.spacing` を使用してください。
- **Readability**: return文（JSX）の中がスタイル定義で埋め尽くされないよう、可読性を優先してください。

## import JSON Data
JSONファイルをインポートする際は `import data from '@/data/items.json';` のような形式（または現在のTS設定に準じた形式）を提案し、そのデータ構造に合わせた型定義を types/ に生成してください。


## 技術スタック
- Next.js 16.2.1
- React 19
- TypeScript 5.9.3
- mui/material
正確なバージョンは `package.json` もしくは `package-lock.json` を参照してください。

## バージョンアップについて
ライブラリのバージョンアップを依頼された際、バージョンアップによるコードの変更が必要な場合は、変更前と変更後のコードを両方提示してください。変更前のコードはコメントアウトして残し、変更後のコードと比較できるようにしてください。
また、ライブラリによってはLTS（Long Term Support）バージョンが存在する場合がありますので、その場合はLTSバージョンへのアップグレードを優先的に検討してください。

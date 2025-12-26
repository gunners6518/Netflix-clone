# Netflix Clone - ハンズオン教材

Next.js 15、React 19、Tailwind CSS v4を使用したNetflixクローンアプリケーションのハンズオン教材です。

## 📚 この教材について

このプロジェクトは、最新のReact 19とNext.js 15の機能を学習するための実践的なハンズオン教材です。以下の技術スタックと概念を学ぶことができます。

## 🛠️ 使用技術

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (CSS-first)
- **Shadcn/ui**
- **Server Actions**
- **TMDB API**

## 📁 プロジェクト構成

```
Netflix-clone/
├── app/                    # Next.js App Router
│   ├── @modal/            # Intercepting Routes（モーダル表示）
│   ├── api/               # API Routes
│   ├── components/        # Reactコンポーネント
│   │   ├── ui/           # Shadcn/uiコンポーネント
│   │   ├── Banner.tsx    # バナーコンポーネント
│   │   ├── Header.tsx    # ヘッダーコンポーネント
│   │   ├── MovieRow.tsx  # 映画リスト行コンポーネント
│   │   └── ...
│   ├── movie/            # 映画詳細ページ
│   ├── layout.tsx        # ルートレイアウト
│   └── page.tsx          # ホームページ
├── lib/                   # ユーティリティ関数
│   ├── actions/          # Server Actions
│   ├── tmdb.ts           # TMDB API関連
│   └── utils.ts          # 共通ユーティリティ
└── docs/                  # ドキュメント
```

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルをプロジェクトルートに作成し、以下の環境変数を設定してください：

```env
# TMDB API（映画データ取得に必要）
TMDB_API_KEY=your_tmdb_api_key
```

#### TMDB APIの取得方法

1. [TMDB](https://www.themoviedb.org/)でアカウントを作成
2. 設定 → API → APIキーのリクエスト
3. 取得したAPIキーを`.env.local`に設定

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

## ✨ 主な機能

- ✅ **Server Components** - サーバーサイドでのデータ取得とレンダリング
- ✅ **Intercepting Routes** - モーダル表示による映画詳細の表示
- ✅ **YouTubeトレイラー** - 映画のトレイラー動画の表示
- ✅ **Streaming SSR** - Suspenseを使ったストリーミングレンダリング
- ✅ **Server Actions** - サーバーサイドでのデータ処理
- ✅ **レスポンシブデザイン** - モバイル・タブレット・デスクトップ対応

## 📖 学習ポイント

### React 19の新機能

- **Server Components** - デフォルトでサーバーコンポーネント
- **Async Components** - コンポーネント内で直接async/awaitを使用
- **Suspense** - ストリーミングレンダリングによるUX向上

### Next.js 15の機能

- **App Router** - ファイルベースのルーティング
- **Intercepting Routes** - パラレルルートとインターセプティングルート
- **Server Actions** - サーバーサイドでのデータ処理
- **Streaming** - 段階的なコンテンツの読み込み

### アーキテクチャパターン

- **Server/Client Component分離** - 適切な場所でクライアントコンポーネントを使用
- **データフェッチング** - Server Componentsでの効率的なデータ取得
- **エラーハンドリング** - 適切なエラー処理とフォールバック

## 📝 スクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバーを起動
- `npm run lint` - リンターを実行

## ⚠️ 注意事項

- TMDB APIキーがない場合、映画データは取得できません
- APIのレート制限に注意してください
- 本プロジェクトは学習目的のため、本番環境での使用は推奨しません

## 📄 ライセンス

このプロジェクトは学習目的で作成されています。

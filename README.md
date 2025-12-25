## Netflix Clone - Next.js 15 + React 19

Next.js 15、React 19、Tailwind v4、Shadcn/uiを使用したNetflixクローンアプリケーションです。

## 使用技術

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (CSS-first)
- **Shadcn/ui**
- **Drizzle ORM** + **PostgreSQL** (Supabase)
- **Supabase Auth** (@supabase/ssr)
- **Server Actions**
- **TMDB API**

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# Supabase設定（認証機能に必要）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_DATABASE_URL=postgresql://user:password@host:port/database

# TMDB API（映画データ取得に必要）
TMDB_API_KEY=your_tmdb_api_key
```

#### Supabaseの設定方法

1. [Supabase](https://supabase.com/)でプロジェクトを作成
2. プロジェクト設定から以下を取得：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Database URL → `SUPABASE_DATABASE_URL`

#### TMDB APIの取得方法

1. [TMDB](https://www.themoviedb.org/)でアカウントを作成
2. API設定からAPIキーを取得 → `TMDB_API_KEY`

### 3. データベースのマイグレーション

```bash
# スキーマを生成
npm run db:generate

# マイグレーションを実行
npm run db:push
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

## 機能

- ✅ 映画一覧の表示（Server Components）
- ✅ 映画詳細モーダル（Intercepting Routes）
- ✅ マイリスト機能（楽観的UI）
- ✅ 認証機能（Supabase Auth）
- ✅ ストリーミングレンダリング（Suspense）
- ✅ レスポンシブデザイン

## 注意事項

- Supabaseの設定がない場合、認証機能は動作しませんが、映画一覧の表示は可能です
- TMDB APIキーがない場合、映画データは取得できません

## スクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバーを起動
- `npm run lint` - リンターを実行
- `npm run db:generate` - Drizzleスキーマを生成
- `npm run db:push` - データベースにスキーマをプッシュ
- `npm run db:studio` - Drizzle Studioを起動

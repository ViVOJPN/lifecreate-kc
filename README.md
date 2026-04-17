# LifeCreate Intelligence

AI経営ダッシュボード / 株式会社ライフクリエイト（216A・福岡）

> **ビジョン**: 日本一の御用聞き会社になる
> **開発**: ViVO × シーズグローバルコネクト
> **設計書**: [CLAUDE.md](./CLAUDE.md) （Claude Code のコンテキストファイル兼システム設計書 v0.2）

## セットアップ

```bash
# 依存関係をインストール
npm install

# 開発サーバー起動 (apps/web)
npm run dev

# 型チェック / Lint / Build
npm run typecheck
npm run lint
npm run build
```

Node.js 20+ 必須（`.node-version` 参照）。

## ディレクトリ構成

```
lifecreate-kc/
├── CLAUDE.md                  # システム設計書 v0.2（Claude Code コンテキスト）
├── apps/
│   └── web/                   # Next.js 14 App Router + Tailwind
├── packages/
│   ├── schema/                # Zod / DB 型定義
│   ├── market-reference/      # 相場メタAPI（設計書 §4.3）
│   ├── ai-agents/             # AIエージェント実装（Phase 1b 以降）
│   └── ui/                    # 共通UIコンポーネント
├── data-pipeline/
│   ├── dbt/                   # Semantic Layer（設計書 §1.1）
│   └── etl/                   # POS/市場/環境データ取込
└── docs/
    └── ai-prompts/            # LLMプロンプト（.md → import）
```

## ブランドカラー（トンマナ）

コーポレートサイト [lifecreate-kc.co.jp](https://lifecreate-kc.co.jp/) より抽出。

| Token | HEX | 用途 |
|---|---|---|
| `brand-500` / `primary` | `#EB031C` | コーポレートレッド（CTA・強調） |
| `brand-300` / `accent` | `#FF6F7A` | ホバー・アクセント |
| `neutral-800` / `foreground` | `#333333` | 本文テキスト |
| `neutral-600` / `muted.foreground` | `#656565` | 副次テキスト |
| `neutral-50` / `surface` | `#F5F5F5` | 背景サーフェス |
| `neutral-300` / `border` | `#E3E3E3` | 枠線・区切り |

Tailwind 定義は [apps/web/tailwind.config.ts](./apps/web/tailwind.config.ts) を参照。

## 開発フェーズ（設計書 §8 抜粋）

- **Phase 0**: 基盤整備 ← 現在地
- **Phase 1a**: 内部データ基盤（POS 日次取込）
- **Phase 1b**: MVP「朝の3つの示唆」
- **Phase 2**: 対話分析 / 相場メタAPI 拡張
- **Phase 3**: 査定AI（工具・ブランド品）
- **Phase 4**: FC展開対応

## 環境変数

[.env.example](./.env.example) をコピーして `.env.local` を作成。Supabase / Claude API / BigQuery / 各種外部API キーが必要。

## ライセンス

Private - Confidential.

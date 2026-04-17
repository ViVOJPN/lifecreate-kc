# LifeCreate Intelligence / システム設計書 v0.2

> **目的**: 本ドキュメントは、株式会社ライフクリエイトのAI経営ダッシュボード「LifeCreate Intelligence」を Claude Code で開発するためのコンテキストファイル兼システム設計書である。開発着手時、プロジェクトルートに `CLAUDE.md` として配置し、Claude Code が参照する前提で記述している。
>
> **バージョン**: v0.2 / 2026-04
> **作成**: ViVO株式会社 角田
> **開発**: シーズグローバルコネクト × ViVO
> **対象**: 株式会社ライフクリエイト（216A・福岡/東京/名証）

---

## 変更履歴

| Version | 日付 | 主な変更 |
|---|---|---|
| v0.1 | 2026-04 | 初版 |
| **v0.2** | **2026-04** | **データ層を全面拡張：Integration Layer / Semantic Layer導入、相場メタAPI層設計、新AIエージェント5種追加、指標体系を8軸に整理、外部データソース統合計画、コスト試算更新** |

---

## 0. プロジェクト概要

### 0.1 ビジョンとの整合

本システムは、ライフクリエイトの企業ビジョン **「日本一の御用聞き会社になる」** を技術的に実装するための中核資産である。単なるBIツールではなく、**経営者と現場の意思決定を能動的に支援するAIレイヤー**として設計する。

### 0.2 解決する4つの構造課題

| # | 課題 | AIによる打ち手 |
|---|---|---|
| 1 | FC展開に伴う暗黙知の移植問題 | 査定AI・対話分析による意思決定レプリカ化 |
| 2 | 買取担当者2名への属人化（74%集中） | 査定アシスタントによる標準化と学習 |
| 3 | 4事業の顧客データ分断 | 横断CRMとAI示唆エンジン |
| 4 | 御用聞きビジョンの定量未定義 | ビジョン測定指標の体系化（§5参照） |

### 0.3 MVP定義

**Phase 1 MVPは「朝の3つの示唆」機能と、それを支える最小データ接続に絞る。**

理由：
- 全機能並列開発は開発リソース分散を招く
- AIファーストの価値を最短で経営層に証明できる
- データパイプラインの正常性を早期に検証できる
- 失敗コストが最小

---

## 1. アーキテクチャ概要

### 1.1 システム構成図（論理）

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  Next.js 14 (App Router) + TypeScript + Tailwind + shadcn   │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                       API Layer                              │
│     Next.js Route Handlers + tRPC (型安全な内部API)           │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    AI Agents Layer                           │
│  morning-brief / conversational / appraisal / pricing /     │
│  meo-intelligence / ad-roi / demand-forecast / ...          │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│        Semantic Layer (統一ビュー・マート / dbt管理)           │
│  vw_store_360 / vw_market_price_unified / mart_kpis_daily   │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│       Integration Layer (抽象化された取得インターフェース)      │
│  ┌──────────────┐┌──────────────────┐┌──────────────────┐  │
│  │Internal Ops   ││Market Reference  ││Environmental     │  │
│  │Service        ││Service (META)    ││Service           │  │
│  │POS/TKC/GA/Ads ││相場10ソース統合   ││天気/イベント/人口  │  │
│  └──────────────┘└──────────────────┘└──────────────────┘  │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              Raw Data Layer (BigQuery datasets)              │
│   lifecreate_raw_internal / _market / _environment           │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    Ingestion Layer (ETL)                     │
│    各ソース個別の取込ジョブ (Cloud Functions / Cloud Run)      │
└─────────────────────────────────────────────────────────────┘

        App DB: Supabase (Postgres) - RLS / Auth / Realtime
        Cache:  Upstash Redis
        LLM:    Claude API (claude-opus-4-7)
```

### 1.2 アーキテクチャ設計原則

1. **AIエージェントは Semantic Layer のみを参照する** — 生データ直叩き禁止
2. **新データソース追加 = Ingestion + Integration の拡張のみ** — 上位層は変更しない
3. **Semantic Layer のビュー定義は dbt でバージョン管理** — データ定義の変更履歴を完全追跡
4. **外部データは取得日時必須** — 時系列性を担保
5. **法的リスクソースは Integration Layer で隔離** — 切り離し可能な設計

### 1.3 技術スタック選定理由

| 領域 | 採用技術 | 選定理由 |
|---|---|---|
| フロントエンド | **Next.js 14 (App Router) + TypeScript** | Claude Code との親和性最高、Vercelデプロイで運用負荷最小 |
| スタイリング | **Tailwind CSS + shadcn/ui** | モックのデザインシステムと互換、AI生成コードが安定 |
| DB (アプリ) | **Supabase (PostgreSQL)** | 認証・RLS・リアルタイムが一体、MVP期の開発速度が出る |
| DWH | **BigQuery** | ViVO補助金文書既定・POSデータ集約先として適合 |
| データ変換 | **dbt Core** | Semantic Layer のビュー定義、テスト、ドキュメント化 |
| キャッシュ | **Upstash Redis** | 相場データのキャッシュ、サーバレス親和 |
| 認証 | **Supabase Auth** | RLS連携、メールOTP/Google SSO対応 |
| LLM | **Claude API (claude-opus-4-7)** | 日本語精度・長文文脈、MCP対応 |
| AI オーケストレーション | **Vercel AI SDK + 素のfetch** | 軽量、フレームワーク依存最小化 |
| データ可視化 | **Recharts + D3 (必要時)** | モックと同等の表現力 |
| ETL | **dlt (data load tool) + Cloud Functions** | Python、POSエクスポート対応しやすい |
| デプロイ | **Vercel (Web) + Cloud Run (ETL/スクレイピング)** | 分離運用、スケール境界が明確 |
| 監視 | **Sentry + Vercel Analytics** | エラー追跡 + UX指標 |

**注記**: シーズグローバルコネクトが既存に持つスタック（PHP/Laravel系等）との摺り合わせは別途協議。上記は Claude Code 活用前提での最適解。

### 1.4 ディレクトリ構造

```
lifecreate-intelligence/
├── CLAUDE.md                       # Claude Code用コンテキスト（本書）
├── README.md                       # 人間向けセットアップガイド
├── .env.example                    # 環境変数テンプレート
├── package.json
├── turbo.json                      # monorepo管理（Turborepo）
│
├── apps/
│   └── web/                        # Next.js アプリケーション
│       ├── app/
│       │   ├── (auth)/             # 認証関連ルート
│       │   ├── (dashboard)/
│       │   │   ├── briefing/       # 朝の3つの示唆 [MVP]
│       │   │   ├── chat/           # 対話分析
│       │   │   ├── stores/         # 店舗マップ
│       │   │   ├── appraisal/      # 査定アシスタント
│       │   │   ├── meo/            # MEO・口コミ分析 [v0.2追加]
│       │   │   ├── ads/            # 広告ROI [v0.2追加]
│       │   │   └── fc/             # FC管理
│       │   ├── api/
│       │   │   ├── agents/
│       │   │   ├── trpc/
│       │   │   └── webhooks/
│       │   └── layout.tsx
│       ├── components/
│       └── lib/
│
├── packages/
│   ├── ui/                         # 共通UIコンポーネント
│   ├── schema/                     # Zod/DB共通型定義
│   ├── ai-agents/                  # AIエージェント実装
│   │   ├── morning-brief/
│   │   ├── conversational/
│   │   ├── appraisal-tool/         # 工具・家電用 [v0.2で分離]
│   │   ├── appraisal-luxury/       # ブランド・貴金属用 [v0.2新設]
│   │   ├── pricing/
│   │   ├── meo-intelligence/       # [v0.2新設]
│   │   ├── ad-roi/                 # [v0.2新設]
│   │   ├── demand-forecast/        # [v0.2新設]
│   │   ├── competitor-analysis/    # [v0.2新設]
│   │   └── trade-area/             # [v0.2新設]
│   ├── analytics/                  # 指標計算ロジック
│   ├── market-reference/           # [v0.2新設] 相場メタAPI
│   │   ├── providers/
│   │   │   ├── aucfan.ts
│   │   │   ├── yahoo-auction.ts
│   │   │   ├── mercari.ts
│   │   │   └── ...
│   │   └── service.ts
│   ├── internal-ops/               # [v0.2新設] 内部運用データ抽象化
│   └── environmental/              # [v0.2新設] 環境データ抽象化
│
├── data-pipeline/
│   ├── etl/
│   │   ├── pos-ingest/
│   │   ├── tkc-ingest/             # [v0.2]
│   │   ├── google-business/        # [v0.2]
│   │   ├── ga4-ingest/             # [v0.2]
│   │   ├── ads-ingest/             # [v0.2]
│   │   ├── market-price/
│   │   ├── weather/                # [v0.2]
│   │   ├── events/                 # [v0.2]
│   │   └── transforms/
│   ├── dbt/                        # [v0.2新設] Semantic Layer定義
│   │   ├── models/
│   │   │   ├── staging/
│   │   │   ├── intermediate/
│   │   │   └── marts/
│   │   └── tests/
│   └── schemas/
│
├── docs/
│   ├── architecture.md
│   ├── data-model.md
│   ├── data-governance.md          # [v0.2新設]
│   ├── ai-prompts/
│   │   ├── morning-brief.md
│   │   ├── appraisal-tool.md
│   │   ├── appraisal-luxury.md     # [v0.2]
│   │   ├── meo-intelligence.md     # [v0.2]
│   │   └── conversational.md
│   ├── api-spec.md
│   ├── indicators-catalog.md       # [v0.2新設] 指標体系定義
│   └── deployment.md
│
└── tests/
    ├── e2e/
    └── fixtures/
```

---

## 2. データモデル

### 2.1 主要エンティティ

#### 2.1.1 アプリケーションDB (Supabase/PostgreSQL)

```sql
-- 店舗マスター
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pos_store_code TEXT UNIQUE NOT NULL,     -- POSの店舗コード（例: "11"）
  name TEXT NOT NULL,                       -- "ハンズクラフト 福岡インター店"
  business_type TEXT NOT NULL,              -- "hands_craft" | "eco_plus" | "life_support"
  ownership TEXT NOT NULL,                  -- "direct" | "fc"
  opened_at DATE,
  prefecture TEXT,
  city TEXT,
  lat NUMERIC,
  lng NUMERIC,
  google_place_id TEXT,                     -- [v0.2] Google Business連携
  trade_area_population INT,                -- [v0.2] 商圏人口
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ユーザー・ロール
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL,                       -- "executive" | "hq_staff" | "store_manager" | "fc_owner" | "appraiser"
  store_id UUID REFERENCES stores(id),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AIシグナル（朝の3つの示唆のソース）
CREATE TABLE ai_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detected_at TIMESTAMPTZ DEFAULT now(),
  severity TEXT NOT NULL,                   -- "critical" | "warning" | "positive"
  category TEXT NOT NULL,                   -- "crm" | "attribution" | "inventory" | "meo" | "ads" | "external" | ...
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metric_value NUMERIC,
  metric_unit TEXT,
  metric_delta NUMERIC,
  store_id UUID REFERENCES stores(id),
  evidence_query TEXT,
  suggested_actions JSONB,
  dismissed_at TIMESTAMPTZ,
  dismissed_by UUID REFERENCES users(id)
);

-- 朝のブリーフ（ダイジェスト）
CREATE TABLE morning_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_date DATE NOT NULL,
  target_user_role TEXT NOT NULL,
  summary TEXT NOT NULL,
  top_signal_ids UUID[],
  generated_at TIMESTAMPTZ DEFAULT now(),
  model_version TEXT
);

-- 対話セッション
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  last_active_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  tool_calls JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 査定ログ
CREATE TABLE appraisals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  appraiser_id UUID REFERENCES users(id),
  business_type TEXT NOT NULL,              -- [v0.2] "tool" | "luxury"
  image_urls TEXT[],
  identified_product JSONB,
  ai_recommended_buy_price INT,
  ai_recommended_sell_price INT,
  ai_confidence NUMERIC,
  ai_reasoning TEXT,
  market_snapshot JSONB,                    -- 複数ソースの相場スナップショット
  actual_buy_price INT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- [v0.2新設] MEO・口コミ
CREATE TABLE google_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  google_review_id TEXT UNIQUE,
  rating INT NOT NULL,
  content TEXT,
  reviewer_name TEXT,
  posted_at TIMESTAMPTZ,
  reply_content TEXT,
  replied_at TIMESTAMPTZ,
  ai_themes JSONB,                          -- Claudeによるテーマ分類
  ai_sentiment_score NUMERIC,               -- -1.0 ~ 1.0
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- [v0.2新設] 外部イベント情報
CREATE TABLE regional_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),      -- 影響を受ける店舗
  event_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  category TEXT,                            -- "sports" | "festival" | "business" | ...
  expected_impact TEXT,                     -- "small" | "medium" | "large"
  source_url TEXT,
  ai_summary TEXT,
  curated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 2.1.2 データウェアハウス (BigQuery)

```
dataset: lifecreate_raw_internal
  - pos_transactions         (取引明細: 店頭売・店頭買)
  - pos_item_details         (単品詳細: 商品ライフサイクル)
  - pos_inventory_monthly    (月次在庫)
  - tkc_ledger               (会計仕訳)               [v0.2]
  - ga4_events               (Web行動)               [v0.2]
  - google_ads               (Google広告レポート)    [v0.2]
  - yahoo_ads                (Yahoo広告レポート)     [v0.2]
  - google_business_reviews  (口コミ・インサイト)    [v0.2]
  - member_registrations

dataset: lifecreate_raw_market
  - aucfan_snapshots         (オークファン相場)      [v0.2]
  - yahoo_auction_snapshots  [v0.2]
  - mercari_snapshots        [v0.2]
  - amazon_prices            [v0.2]
  - competitor_buy_prices    (アクトツール等の買取価格)  [v0.2]
  - luxury_references        (MEKIKI、コメ兵等)      [v0.2]

dataset: lifecreate_raw_environment
  - weather_daily            [v0.2]
  - regional_events          [v0.2]
  - trade_area_stats         (商圏統計)              [v0.2]
  - competitor_financials    (競合決算)              [v0.2]

dataset: lifecreate_analytics (dbt-managed)
  - vw_store_360             (店舗総合ビュー)        [v0.2]
  - vw_market_price_unified  (相場統一ビュー)        [v0.2]
  - vw_staff_performance
  - vw_inventory_aging
  - vw_member_continuity
  - vw_meo_score             [v0.2]
  - vw_ad_roi                [v0.2]
  - mart_daily_kpis          (日次KPI集計)
  - mart_weekly_signals      (週次異常検知ソース)    [v0.2]
```

### 2.2 RLS (Row Level Security) ポリシー

```sql
-- 店舗マネージャーは自店舗のデータのみ
CREATE POLICY "store_managers_own_store" ON ai_signals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid()
            AND (u.role = 'executive' OR u.store_id = ai_signals.store_id))
  );

-- FCオーナーは自店舗のみ、他店は集計ベンチマークのみ
-- 詳細は §7 セキュリティを参照
```

---

## 3. AIエージェント設計

### 3.1 エージェント一覧（v0.2拡張）

| エージェント | 役割 | トリガー | 推奨モデル | Phase |
|---|---|---|---|---|
| `morning-brief` | 朝の3つの示唆を生成 | 日次Cron 6:00 JST | claude-opus-4-7 | 1 |
| `conversational` | 対話分析（BI深掘り） | ユーザー入力 | claude-opus-4-7 | 2 |
| `appraisal-tool` | 工具・家電の査定 | 査定時 | claude-opus-4-7 (vision) | 3 |
| `appraisal-luxury` | ブランド・貴金属の査定 | 査定時 | claude-opus-4-7 (vision) | 3 |
| `pricing-optimizer` | 値下げタイミング推奨 | 週次 + イベント駆動 | claude-haiku-4-5 | 2 |
| `meo-intelligence` | 口コミ分析・返信下書き | 口コミ到着時 | claude-opus-4-7 | 1-2 |
| `ad-roi-optimizer` | 広告×POSのROI分析 | 週次 | claude-opus-4-7 | 2 |
| `demand-forecast` | 需要予測（天気×イベント） | 週次 | 独自MLモデル + LLM | 2 |
| `competitor-analysis` | 競合決算・サイト分析 | 四半期 | claude-opus-4-7 | 3 |
| `trade-area-analysis` | 商圏・出店候補分析 | オンデマンド | claude-opus-4-7 | 4 |

### 3.2 `morning-brief` エージェント詳細

#### 入力
- 前日までの全店舗データ（24時間分の変化）
- 過去30日の基準値（平均・分散）
- ユーザーロール（executive / store_manager / fc_owner）

#### 処理フロー
```
1. シグナル検出 (ルールベース + 統計的異常検知)
   カテゴリ別の検出ロジック:
   - CRM (会員化率、リピート率)
   - Attribution (担当者別パフォーマンス)
   - Inventory (滞留、在庫金額)
   - MEO (口コミ評価、急変)
   - Ads (ROAS急変)
   - External (天候・イベント特需予兆)

2. シグナルスコアリング (重要度 × 緊急度)
   - severity: critical / warning / positive
   - prioritization: ビジョン直結度 × 金額インパクト × 介入可能性

3. Top 3選抜

4. LLM (Claude) でブリーフ文章生成
   - 3件のシグナルをコンテキストとして投入
   - ロール別トーン調整
   - 御用聞きビジョンとの接続を必ず含める

5. morning_briefs テーブルに保存
```

#### プロンプト設計方針（`docs/ai-prompts/morning-brief.md` に配置）

```markdown
# System Prompt: Morning Brief Generator

あなたはライフクリエイトのシニア経営参謀である。
毎朝、経営陣に向けて昨日のシグナルから重要な3点を抽出し、
400文字以内のブリーフ文章を作成する。

## 出力スタイル
- 結論を先頭に置く（何が起きていて、なぜ重要か）
- 数字は必ず付記する（例: 12.3M円、-2.3pt）
- 「御用聞き」ビジョンとの接続を1文入れる
- 提案は「要判断」と「要実行」に分ける

## 禁止事項
- 原因を断定しない（シグナルは事実、原因は仮説）
- 過度な楽観・悲観
- 専門用語の多用

## 入力フォーマット
{signals_json}

## 出力フォーマット
{structured_brief_json}
```

### 3.3 `conversational` エージェント詳細

ユーザーの自然言語クエリを受け取り、**ツール呼び出しで分析を実行**して応答する。

#### 利用するツール（Function Calling）
```typescript
const tools = [
  {
    name: "query_bigquery",
    description: "BigQueryのlifecreate_analyticsデータセットに対してSQLを実行",
    input_schema: { sql: "string (read-only)" }
  },
  {
    name: "get_store_list",
    description: "店舗一覧を取得（店舗ヘルススコア付き）",
    input_schema: { filters: "object" }
  },
  {
    name: "run_anomaly_detection",
    description: "特定指標の異常検知を実行",
    input_schema: { metric: "string", window_days: "int" }
  },
  {
    name: "lookup_market_price",
    description: "相場メタAPIから市場価格を取得",
    input_schema: { product_identifier: "object" }
  },
  {
    name: "get_competitor_intel",
    description: "競合決算・サイト情報の取得",
    input_schema: { competitor: "string", metric: "string" }
  },
  {
    name: "generate_followup_questions",
    description: "深掘り候補の質問を3つ生成",
    input_schema: { current_context: "string" }
  }
];
```

#### 重要な設計指針
- **ユーザーが次の質問を考えなくて済むUX** が本質
- 毎回の応答に「次の深掘り候補3件」を必ず付ける
- ミニ可視化（小さなグラフ）を応答に埋め込む
- 参照データの行数・期間を常に明示（透明性）

### 3.4 `appraisal-tool` / `appraisal-luxury` エージェント

#### 分離理由（v0.2で明示）

| 観点 | 工具・家電 | ブランド・貴金属 |
|---|---|---|
| 真贋判定 | 原則不要 | **必須・最重要** |
| 状態評価 | 動作確認・付属品 | 傷・使用感・仕上げ |
| 相場ソース | オークファン等 | MEKIKI・コメ兵オークション等 |
| 査定ロジック | 型番×状態 | ブランド×モデル×シリアル×真贋 |
| 学習データ | PAUDEL氏・久芳氏の判断 | エコプラス専門担当者（要特定） |

同一エージェントに統合すると、**両方の精度が落ちる**。**プロンプト・ツールセット・評価基準を完全分離**する。

#### 共通フロー
```
1. 画像受信
2. Claude Vision で商品特定
3. 商品種別判定 (tool / luxury) → 適切なエージェントにルーティング
4. 相場メタAPI経由で市場価格取得 (並列)
5. 推奨価格生成 + 根拠文字列
6. 信頼度スコア算出
7. appraisals テーブルに記録
```

#### 学習ループ
- 実際の買取価格（担当者判断）をフィードバック
- AI推奨 vs 実採用の乖離を学習データとして蓄積
- 月次でプロンプト改善、四半期でファインチューニング検討

### 3.5 `meo-intelligence` エージェント (v0.2新設)

#### 処理フロー
```
1. 口コミ新規取得 (Google Business Profile API)
2. 口コミを Claude で構造化
   - ポジティブ/ネガティブ判定 (-1.0 ~ 1.0)
   - 言及テーマ抽出 (例: "接客", "品揃え", "査定額", "待ち時間")
   - 緊急対応必要性判定
3. 急変検知
   - 7日移動平均でのrating低下
   - ネガティブ連投パターン
4. 返信下書き生成（承認制）
5. 週次レポート: 褒められる点/不満点のテーマ別集計
```

#### 御用聞きビジョン直結
このエージェントは**最も御用聞きビジョンに直結する**。「お客様の声を拾う」ことをAIで自動化する以上、**必ず人間承認フローを挟む**（返信は自動投稿しない）。

### 3.6 `ad-roi-optimizer` エージェント (v0.2新設)

- Google Ads / Yahoo広告の費用データ × POS売上データ × GA4流入を紐付け
- 広告キャンペーン別のROAS算出
- 予算再配分の示唆生成
- 運用は代理店 or 社内の現状確認が前提（§12）

### 3.7 `demand-forecast` エージェント (v0.2新設)

- 天候予報 × 過去販売履歴 × イベント情報で需要予測
- 店舗別・カテゴリ別に前週比変動を予測
- 予想乖離が大きいものをアラート（例: 台風接近で売上-30%予測）

### 3.8 `competitor-analysis` エージェント (v0.2新設)

- 四半期毎にEDINET・競合IRを自動取得
- Claudeで決算要約・業界ポジション分析
- 競合買取価格（アクトツール等）と自社の同一商品価格比較
- 経営会議向けレポート自動生成

### 3.9 `trade-area-analysis` エージェント (v0.2新設)

- オンデマンド（出店候補地が挙がった時のみ）
- 商圏人口・交通量・競合密度データを統合
- 既存店との類似度マッチングで売上予測

---

## 4. データパイプライン・データ統合

### 4.1 データガバナンス基本方針

ライフクリエイトのAIシステムは、**3種類の異質なデータ**を統合する必要がある：

- **A. 内部運用データ**（POS、TKC、Web広告、GA、Google Business）
- **B. 市場相場データ**（各種相場サイト、競合買取価格）
- **C. 環境・商圏データ**（天気、イベント、人口、交通量、競合決算）

それぞれ**取得方法・更新頻度・法務リスク・ガバナンスが全く違う**。一律「BigQueryに突っ込む」発想では破綻するため、§1.1のレイヤーアーキテクチャで段階的に抽象化する。

### 4.2 A群: 内部運用データ接続仕様

#### 4.2.1 POS（タロスシステムズ）

| 項目 | 内容 |
|---|---|
| 優先度 | ★★★★★（必須） |
| 取得方式 | CSVエクスポート（CP932） → Cloud Storage → BQ |
| 頻度 | 日次（深夜1:00） |
| 既存 | あり（2022-2024年データ検証済） |
| 主要テーブル | 取引明細（84列）、単品詳細（64列）、月次在庫（37列） |
| 課題 | 文字コード変換、NULL処理、会員IDの連続性（2024/4断絶問題） |

**実装メモ**:
- 既存CSVフォーマットを正とする
- 会員ID欠損（2024/4〜）は**意図的運用**か**仕様変更**か要確認（§12）
- 「通販区分」列がNULLで埋まっている → EC取引は別ルートの可能性大

#### 4.2.2 TKC（会計システム）

| 項目 | 内容 |
|---|---|
| 優先度 | ★★★★☆ |
| 取得方式 | TKC公式API or CSV連携 |
| 頻度 | 月次（決算締め後） |
| 新規 | 補助金スコープで追加予定 |

**統合ポイント**: POSの売上・粗利と、TKC会計上の数字の**整合確認自動化**がMVP価値。現状手動で行っているなら本部経理工数削減に直結。

#### 4.2.3 Google Business Profile

| 項目 | 内容 |
|---|---|
| 優先度 | ★★★★★（MVPで最も費用対効果が高いソース） |
| 取得方式 | Google Business Profile API |
| 頻度 | 日次（口コミは即時が理想） |
| 実装難易度 | 低 |
| 費用 | 無料 |

**取得データ**:
- 口コミ本文、評価星数、投稿日時、返信状況
- 店舗閲覧数、ルート検索数、電話クリック数
- 写真投稿数、検索クエリ

#### 4.2.4 Google Analytics 4

| 項目 | 内容 |
|---|---|
| 優先度 | ★★★☆☆ |
| 取得方式 | GA4 Data API |
| 頻度 | 日次 |

**要件**: POSの"来店"と繋げる仕組み（QRコード等で来店時にトラッキングIDを引き継ぐ運用設計）が必要。

#### 4.2.5 Web広告（Google Ads / Yahoo広告）

| 項目 | 内容 |
|---|---|
| 優先度 | ★★★☆☆（広告予算規模次第で★4） |
| 取得方式 | Google Ads API / Yahoo広告API |
| 頻度 | 日次 |

### 4.3 B群: 市場相場データ接続仕様

#### 4.3.1 相場メタAPI層の設計（最重要）

複数の相場ソースを**1つの統一インターフェース**で扱う抽象化層。

```typescript
// packages/market-reference/types.ts

export interface MarketPrice {
  sourceId: string;              // "aucfan" | "mercari" | "yahoo_auction" | ...
  sourceType: "auction" | "marketplace" | "new_retail" | "competitor_buy";
  productIdentifier: {
    jan?: string;
    modelNumber?: string;
    freeText: string;
  };
  price: number;
  currency: "JPY";
  condition?: "new" | "used_A" | "used_B" | "used_C";
  observedAt: Date;
  sampleSize?: number;
  confidence: number;           // 0.0 - 1.0
  raw?: Record<string, unknown>;
}

export interface MarketReferenceService {
  lookup(params: {
    productIdentifier: ProductIdentifier;
    lookbackDays?: number;
    sourceTypes?: SourceType[];
  }): Promise<MarketPrice[]>;

  getAggregated(params: {
    productIdentifier: ProductIdentifier;
  }): Promise<{
    medianPrice: number;
    priceRange: [number, number];
    sampleSize: number;
    confidence: number;
    sources: string[];
  }>;
}
```

**実装のポイント**:
- AIエージェントは `getAggregated()` しか叩かない
- 個別ソース取得は `lookup()` でデバッグ・検証時のみ
- 各ソースは独立した Cloud Function、タイムアウト1件3秒
- キャッシュレイヤー（Redis）で商品別直近1時間の結果を保持
- プロバイダはInterface実装、新規追加はconfig追加のみ

#### 4.3.2 ハンズクラフト向け（工具・家電）

| ソース | 優先度 | 取得 | 月額目安 | 法務リスク | Phase |
|---|---|---|---|---|---|
| オークファン | ★★★★★ | 公式API | ¥10,000 | 低 | 1b |
| ヤフオク | ★★★★☆ | 公式API | 契約審査 | 低〜中 | 2b |
| Amazon | ★★★☆☆ | PA-API | 無料 | 低 | 2b |
| 楽天市場 | ★★☆☆☆ | 楽天市場API | 無料 | 低 | 2b |
| メルカリ | ★★★★☆ | 非公式（API閉鎖） | インフラ費 | **高** | 2c |
| ジモティー | ★☆☆☆☆ | 非公式 | 同上 | 中 | 2c |
| メーカー公式 | ★★☆☆☆ | スクレイピング | 同上 | 低 | 3 |
| アクトツール | ★★★☆☆ | スクレイピング | 同上 | 中 | 3b |
| 工具買取王国 | ★★★☆☆ | スクレイピング | 同上 | 中 | 3b |

#### 4.3.3 エコプラス向け（ブランド品・貴金属）

| ソース | 優先度 | Phase |
|---|---|---|
| Yahooショッピング | ★★☆☆☆ | 3a |
| MEKIKI Monograph | ★★★★☆ | 3a |
| 相場検索ドットコム | ★★★☆☆ | 3a |
| コメ兵オークション | ★★★★☆ | 3a |
| おおくら（ゲオ） | ★★☆☆☆ | 3a |

**構造的指摘**: エコプラスは**真贋判定**がハンズと全く異なる専門領域。査定AIは**別エージェント化**（`appraisal-luxury`）済み。相場ソースの統合は同じメタAPI層で扱うが、プロンプト設計と学習データは完全分離する。

### 4.4 C群: 環境・商圏データ接続仕様

#### 4.4.1 天気

| 項目 | 内容 |
|---|---|
| ソース | OpenWeather API（または気象庁オープンデータ） |
| 頻度 | 1時間毎 |
| 費用 | 無料（一定リクエスト数まで） |
| 用途 | 需要予測、来店予測 |

#### 4.4.2 地域イベント

| 項目 | 内容 |
|---|---|
| ソース | 手動キュレーション + Webサーチ + Claude要約 |
| 頻度 | 週次 |
| 費用 | 運用工数のみ |

**具体的運用**:
- 各店舗の商圏イベントカレンダーを Claude でWeb検索
- 「世界バレー」「ソフトバンクホークス試合」等を構造化
- 予想来店インパクト（小・中・大）を過去類似イベントから推定
- 店舗マネージャに事前通知

#### 4.4.3 商圏人口・交通量

| 項目 | 内容 |
|---|---|
| 人口: 国勢調査オープンデータ（無料） | 出店判断に利用 |
| 人口: 有料GIS（jSTAT MAP等） | 詳細分析時 |
| 交通量: 国交省道路交通センサス | 主要道路のみ |
| 交通量: 商用データ（KDDI等） | 有料、精度高 |

**注意**: 交通量データは**本当に必要か要検証**。出店判断は年数回のため常設価値が低い可能性。**オンデマンド分析**で十分かも。

#### 4.4.4 競合決算・競合情報

事業セグメント別に整理する。**FC展開ガバナンス（軸B）**および**同一商品価格競争力指数（軸H）**のベンチマーク源。

##### ハンズクラフト（工具・家電リユース）

| 競合 | 業態 | 証券コード | 取得方法 | 位置づけ |
|---|---|---|---|---|
| アクトツール | 工具専業・買取強い | 非上場 | 公式サイト・信用調査会社 | 直接競合・査定精度ベンチマーク |
| 工具買取王国 | 工具専業 | 非上場 | 同上 | 直接競合 |
| ハードオフHD | 総合リユースFC・工具/家電強い | **2674** | EDINET、適時開示 | 商圏重複・**FC展開の先行モデル（最重要比較対象）** |
| ゲオHD | 家電・ホビー・リユース | **2681** | EDINET | 家電側で競合 |
| トレジャー・ファクトリー | 総合リユース・店舗型 | **3093** | EDINET | 都市部商圏で競合 |

##### エコプラス（ブランド品・貴金属）

| 競合 | 業態 | 証券コード | 取得方法 | 位置づけ |
|---|---|---|---|---|
| コメ兵HD | ブランド品最大手 | **2780** | EDINET、適時開示 | 価格ベンチマーク源 |
| バイセル | 出張買取・着物/貴金属 | **7685** | EDINET | 買取チャネル競合 |
| SOU（なんぼや） | ブランド・時計・店舗型 | **9270** | EDINET | 直接競合 |
| 大黒屋 | ブランド・金券 | 非上場 | 公式サイト・信用調査会社 | 店舗競合 |
| おたからや（いーふらん） | 買取FC最大級 | 非上場 | 同上 | **FC戦略の直接ライバル** |
| 銀蔵 / ブランドオフ | ブランド品 | 非上場 | 同上 | 価格ソース候補 |

##### ライフサポート（遺品整理→リユース）

| 競合 | 業態 | 位置づけ |
|---|---|---|
| 関西クリーンサービス / メモリーズ | 遺品整理専業 | リユース導線が弱く差別化余地 |
| ハードオフ遺品整理提携網 | 総合リユース×遺品 | 間接競合 |
| 地域葬儀社系 | 地場 | 商圏ごとに異なる |

##### FC展開ガバナンス比較対象（軸B用）

- **ハードオフHD（2674）** — FC展開成熟、店舗オペレーションのテンプレ化で先進。**216A上場・FC展開という二軸でライフクリエイトの最良比較対象**
- **おたからや（いーふらん）** — 買取特化FC、爆発的出店モデル

##### EDINET 自動取得対象（`competitor-analysis` エージェント）

上場6社：**2674 / 2681 / 2780 / 3093 / 7685 / 9270**
四半期毎に有価証券報告書・決算短信を取得し、売上・粗利・既存店成長率・出店ペース等を自動抽出。

### 4.5 法務・倫理リスク管理

| 項目 | 方針 |
|---|---|
| 利用規約確認 | 各ソースのToSを年次レビュー、変更時は即時停止 |
| robots.txt尊重 | 必ず遵守 |
| アクセス頻度 | サイト負荷に配慮（1リクエスト/3秒を下限） |
| User-Agent明示 | LifeCreate Intelligence Bot として識別可能に |
| 代替API移行 | 公式API提供時は即移行 |
| データ使用範囲 | 社内分析のみ、外部公開・再配布禁止 |

### 4.6 ETLスケジュール

```yaml
schedules:
  # Phase 1 ソース
  pos_daily_import:
    cron: "0 1 * * *"
    retry: 3

  tkc_monthly_import:
    cron: "0 2 1 * *"            # 月初2時
    retry: 3

  google_business_sync:
    cron: "0 */6 * * *"           # 6時間毎
    retry: 2

  aucfan_sync:
    cron: "0 4 * * *"             # 毎日4時

  weather_sync:
    cron: "0 */3 * * *"           # 3時間毎
    retry: 1

  # Phase 1 集計
  morning_brief_generation:
    cron: "0 6 * * *"
    depends_on: [pos_daily_import, google_business_sync, aucfan_sync]

  # Phase 2+ ソース（順次追加）
  ga4_sync:
    cron: "0 3 * * *"
  ads_sync:
    cron: "0 3 * * *"
  market_price_extended_sync:
    cron: "0 5,17 * * *"
  weekly_pricing_review:
    cron: "0 7 * * MON"
  competitor_analysis_quarterly:
    cron: "0 8 1 */3 *"
```

---

## 5. 指標体系（v0.2新設章）

指標は**8軸で整理**する。追加するたびにモックやダッシュボードに無秩序に並べるのではなく、軸ごとにオーナーと優先度を定める。

### 5.1 軸A: 御用聞きビジョン測定指標（最優先）

ビジョンを数値で定義しないとAIも動かない。

| 指標 | 定義 | Phase |
|---|---|---|
| 顧客横断ユース率 | 4事業のうち複数利用した顧客比率 | 3 |
| リピート購買率 | 6ヶ月以内の再来店率（会員ベース） | 2 |
| 売り買い両面利用率 | 買取も販売も利用した顧客比率 | 2 |
| 顧客LTV | 初回来店から36ヶ月の累計粗利貢献 | 3 |
| 顧客の声スコア | 口コミ感情の加重平均 + 傾向変化 | 1 |
| 期待応答率 | 口コミに対する返信率と速度 | 1 |

### 5.2 軸B: FC展開ガバナンス指標

| 指標 | 定義 | Phase |
|---|---|---|
| FC査定精度カーブ | FC店員の粗利率の直営比の勤続月数遷移 | 4 |
| FC立ち上げ速度 | オープン→直営平均80%到達までの月数 | 4 |
| 価格ガバナンス乖離 | 同一JANコードの設定売価の店舗間標準偏差 | 4 |
| 本部問い合わせ件数 | FCオーナーから本部への問合せ頻度・分類 | 4 |

### 5.3 軸C: キャッシュ効率・資本効率

| 指標 | 定義 | Phase |
|---|---|---|
| GMROI | (粗利 ÷ 平均在庫原価) × 100 | 1 |
| 買取キャッシュ回転日数 | 買取資金→販売回収までの平均日数 | 1 |
| 滞留キャッシュ拘束額 | 180日超在庫の簿価合計 | 1 |
| 業者売りROI | 業者ルートの粗利 / 滞留日数 | 2 |

### 5.4 軸D: 属人化リスク

| 指標 | 定義 | Phase |
|---|---|---|
| ジニ係数（担当者×売上） | 店舗内担当者別売上の不均衡度 | 1 |
| トップ1離脱耐性 | 上位担当者1名離脱の売上・粗利影響シミュ | 2 |
| カテゴリ×担当者ヒートマップ | 誰が何カテゴリに強いか | 1 |
| 査定AI採用率 | AI推奨価格を採用した査定の比率 | 3 |

### 5.5 軸E: AI機能メタ指標

| 指標 | 定義 | Phase |
|---|---|---|
| AI推奨採用率 | AI提案の現場採用率 | 1 |
| AI推奨精度 | 推奨価格 vs 実販売価格の乖離 | 3 |
| AIブリーフ行動化率 | 朝の示唆3件のうちアクション化された件数 | 1 |
| 対話分析の解決率 | チャットが結論に至った比率 | 2 |

### 5.6 軸F: 集客・ブランド（v0.2新設）

| 指標 | 必要データ | Phase |
|---|---|---|
| 口コミテーマ分析 | Google Business + LLM | 1 |
| MEO可視性 | Google Business + 検索クエリ | 1 |
| 広告ROAS（店舗別） | Web広告費 × POS売上 | 2 |
| 店舗集客効率 | GA + 来店 + 広告費 | 2 |
| 商圏浸透率 | 会員数 ÷ 商圏人口 | 3 |
| 流入チャネル構成 | GA + POS | 2 |

### 5.7 軸G: 外部環境適応（v0.2新設）

| 指標 | 必要データ | Phase |
|---|---|---|
| 天候感応度 | 天気 × 店舗売上 | 2 |
| イベント特需係数 | イベント情報 × 売上変動 | 2 |
| 季節性プロファイル | POS時系列 | 1 |

### 5.8 軸H: 競合ベンチマーク（v0.2新設）

| 指標 | 必要データ | Phase |
|---|---|---|
| 同一商品 価格競争力指数 | 競合買取サイト × 自社設定 | 3 |
| 業界相対成長率 | 競合決算 × 自社売上 | 3 |
| 商品単価プレミアム | 自社販売価格 ÷ メルカリ中央値 | 3 |

---

## 6. API設計

### 6.1 tRPCルーター構造

```typescript
// apps/web/server/trpc.ts
export const appRouter = router({
  briefs: router({
    getToday: publicProcedure.query(...),
    getHistory: publicProcedure.query(...),
    dismissSignal: protectedProcedure.mutation(...),
  }),
  stores: router({
    list: publicProcedure.query(...),
    getHealth: publicProcedure.query(...),
    getDetail: publicProcedure.query(...),
  }),
  chat: router({
    sendMessage: protectedProcedure.mutation(...),
    getHistory: protectedProcedure.query(...),
  }),
  appraisal: router({
    submit: protectedProcedure.mutation(...),
    getHistory: protectedProcedure.query(...),
  }),
  meo: router({                                 // [v0.2]
    getReviews: protectedProcedure.query(...),
    draftReply: protectedProcedure.mutation(...),
    getThemeAnalysis: protectedProcedure.query(...),
  }),
  ads: router({                                 // [v0.2]
    getRoasByStore: protectedProcedure.query(...),
    getCampaignAnalysis: protectedProcedure.query(...),
  }),
  market: router({                              // [v0.2]
    lookup: protectedProcedure.query(...),
    getAggregated: protectedProcedure.query(...),
  }),
  kpis: router({
    getConsolidated: publicProcedure.query(...),
    getBySegment: publicProcedure.query(...),
    getByAxis: publicProcedure.query(...),      // [v0.2] 8軸別
  }),
});
```

### 6.2 ストリーミング対応

`chat.sendMessage` と `briefs.getToday` はClaude APIのstreamingレスポンスをそのままクライアントに中継（Vercel AI SDK使用）。

---

## 7. セキュリティ・権限

### 7.1 ロール設計

| ロール | 権限 |
|---|---|
| `executive` | 全店舗・全事業データ閲覧、AIブリーフ受信 |
| `hq_staff` | 本部スタッフ。ほぼ同等だが一部機密は制限 |
| `store_manager` | 自店舗のデータのみ、自店舗ブリーフ受信 |
| `fc_owner` | FC加盟店オーナー。自店舗 + ベンチマーク閲覧可 |
| `appraiser` | 査定AIのみ、買取支援画面アクセス |

### 7.2 データ秘匿化

- 会員IDは店舗担当者には**ハッシュ化した識別子**で表示
- 取引明細の金額は `executive` ロール以外は丸め表示（100円単位）
- FC加盟店オーナーには**他店舗個別データは絶対に見せない**（ベンチマーク平均のみ）
- すべてのAPIアクセスは Supabase RLS + tRPCプロシージャレベルの二重チェック

### 7.3 AI利用時のプライバシー

- 顧客個人情報（氏名・住所）はLLM呼び出し前に**マスキング**
- プロンプトログは90日保持後自動削除
- Claude API の zero-retention モード検討（Anthropic Business プラン）
- Google Business口コミの個人名・個人特定情報はLLMに投入する前にマスキング

### 7.4 AI出力の責任範囲

- AI推奨価格・分析示唆は**最終判断は人間**、AIは意思決定支援
- 競合決算分析・比較は**公開情報に基づく一般的な分析**の範囲で
- 口コミ返信下書きは**必ず人間承認**してから投稿

### 7.5 スクレイピングガバナンス

§4.5 参照。**Integration Layer での隔離**により、法的リスク発生時に該当ソースのみを停止可能な設計とする。

---

## 8. 開発ロードマップ

### Phase 0: 基盤整備 (〜4週)
- [ ] リポジトリセットアップ (monorepo)
- [ ] Supabase プロジェクト立ち上げ・スキーマ作成
- [ ] BigQuery データセット作成（`_raw_internal/_market/_environment/_analytics`）
- [ ] dbt 初期設定
- [ ] 基本認証とRBAC
- [ ] モックのデザインシステム移植 (shadcn/ui化)

### Phase 1a: 内部データ基盤 (4-6週)
- [ ] POSエクスポートの日次取込パイプライン（福岡インター店で検証→全店へ展開）
- [ ] TKC連携（補助金枠）
- [ ] `vw_store_360` の初版ビュー定義

### Phase 1b: MVP「朝の3つの示唆」 (6-12週)
- [ ] Google Business Profile API接続
- [ ] オークファンAPI接続
- [ ] 天気API接続
- [ ] ai_signals テーブル + シグナル検出ジョブ
- [ ] `morning-brief` エージェント実装
- [ ] `meo-intelligence` エージェント（基本機能）
- [ ] executive向けブリーフ画面
- [ ] 店舗ヘルス一覧画面（全17店舗対応）
- [ ] 有冨代表含む経営層5名での1ヶ月運用テスト
- [ ] フィードバック反映

### Phase 2a: 対話分析・集客 (12-18週)
- [ ] `conversational` エージェント
- [ ] ツール実装（BigQuery SQL、異常検知、相場ルックアップ）
- [ ] チャット履歴UI
- [ ] GA4 接続、`ad-roi-optimizer` エージェント
- [ ] 店舗マネージャーへの展開

### Phase 2b: 相場メタAPI成熟 (18-22週)
- [ ] `MarketReferenceService` 実装（オークファンのみの単一Provider状態から拡張）
- [ ] ヤフオク公式API、Amazon、楽天の統合
- [ ] `pricing-optimizer` エージェント
- [ ] `demand-forecast` エージェント

### Phase 2c: メルカリ等リスク系 (22-26週)
- [ ] 法務確認後、メルカリ・ジモティー取得
- [ ] スクレイピングインフラ（Cloud Run）運用整備

### Phase 3a: 査定AI + エコプラス対応 (26-32週)
- [ ] 画像アップロードUI（モバイル対応）
- [ ] Claude Vision 統合
- [ ] `appraisal-tool` エージェント（PAUDEL氏・久芳氏の査定データ学習）
- [ ] エコプラス相場ソース群（MEKIKI等）統合
- [ ] `appraisal-luxury` エージェント
- [ ] 福岡インター店・北九州本店でパイロット

### Phase 3b: 競合インテリジェンス (32-38週)
- [ ] 競合買取サイト（アクトツール・工具買取王国）スクレイピング
- [ ] `competitor-analysis` エージェント
- [ ] 業界ベンチマークダッシュボード

### Phase 4: FC展開対応 (38-46週)
- [ ] FC管理画面
- [ ] FCオーナー向けビュー
- [ ] ベンチマーク機能（匿名化）
- [ ] 島根出雲店への本格展開
- [ ] FC査定精度カーブの計測

### Phase 5: 商圏・全店・横断拡張 (46週〜)
- [ ] `trade-area-analysis` エージェント
- [ ] ライフサポート事業統合（遺品整理→リユース導線）
- [ ] 顧客LTV予測モデル
- [ ] 外部公開版（IR情報自動化、補助金案件と統合）

---

## 9. Claude Code 向け実装指針

### 9.1 コーディング規約
- TypeScript strict mode
- ESLint (next/core-web-vitals + @typescript-eslint/recommended)
- Prettier
- 関数・コンポーネント命名は英語、**コメント・ドキュメントは日本語**
- 1ファイル 300行を目安に分割

### 9.2 テスト方針
- ユニットテスト: Vitest（分析ロジック・AIエージェントのツール層）
- E2E: Playwright（主要ユーザーフロー）
- AIエージェント: **プロンプト評価テスト**（期待される構造の出力が返るか）
- dbt: `dbt test` でSemantic Layer整合性を継続検証

### 9.3 Claude Code 使用時の注意
- 機能単位で `packages/ai-agents/<agent-name>/` ディレクトリを指定して実装依頼する
- 大きな機能は `docs/ai-prompts/<feature>.md` に仕様を書いてから Claude Code に実装させる
- プロンプトは `.md` で別管理し、TypeScriptには `import` するだけにする
- DB変更は必ず migration ファイルを生成させる（直接変更禁止）
- 新データソース追加時は必ず Integration Layer のインターフェース実装から始める（Raw Layer直叩き禁止）

### 9.4 環境変数

```bash
# .env.example
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Claude API
ANTHROPIC_API_KEY=
ANTHROPIC_DEFAULT_MODEL=claude-opus-4-7

# BigQuery / dbt
GCP_PROJECT_ID=
GCP_SERVICE_ACCOUNT_KEY=
BQ_DATASET_RAW_INTERNAL=lifecreate_raw_internal
BQ_DATASET_RAW_MARKET=lifecreate_raw_market
BQ_DATASET_RAW_ENV=lifecreate_raw_environment
BQ_DATASET_ANALYTICS=lifecreate_analytics

# External APIs - Internal Ops
GOOGLE_BUSINESS_PROFILE_CLIENT_ID=
GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET=
GA4_PROPERTY_ID=
GOOGLE_ADS_CLIENT_ID=
YAHOO_ADS_CLIENT_ID=
TKC_API_KEY=

# External APIs - Market Reference
AUCFAN_API_KEY=
YAHOO_AUCTION_API_KEY=
AMAZON_PA_API_KEY=
RAKUTEN_API_KEY=

# External APIs - Environmental
OPENWEATHER_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
CRON_SECRET=
```

---

## 10. 運用・監視

### 10.1 監視対象

| 対象 | 手段 | 閾値 |
|---|---|---|
| POS取込成功 | Slack通知 + Datadog | 失敗1回で通知 |
| Google Business取込 | 同上 | 6時間以上欠落で通知 |
| 相場メタAPI可用性 | 同上 | プロバイダ個別、1社停止で警告 |
| Morning Brief 生成成功 | 同上 | 遅延30min超で通知 |
| AI API エラー率 | Sentry | 5%超で通知 |
| API p95 レイテンシ | Vercel Analytics | 2秒超で警告 |
| Claude API トークン消費 | 内製ダッシュボード | 日次予算超過で通知 |
| スクレイピング ToS違反リスク | 月次手動レビュー | 該当時即停止 |

### 10.2 月額ランニングコスト見積もり

| 項目 | MVP期 | フル運用期 |
|---|---|---|
| オークファン API | ¥10,000 | ¥10,000 |
| ヤフオク API | — | ¥15,000 |
| OpenWeather API | ¥0 | ¥0 |
| スクレイピングインフラ（Cloud Run） | — | ¥8,000 |
| MEKIKI / 相場検索 等 | — | ¥20,000〜 |
| 信用調査会社（競合情報） | — | ¥30,000 |
| GCP（BQ、Cloud Functions、Storage） | ¥15,000 | ¥40,000 |
| Supabase | ¥3,500 | ¥10,000 |
| Vercel | ¥3,000 | ¥10,000 |
| Upstash Redis | ¥2,000 | ¥5,000 |
| Claude API | ¥75,000 | ¥300,000 |
| **合計** | **約 ¥108,500 / 月** | **約 ¥448,000 / 月** |

**年間**: MVP期 約130万円、フル運用期 約540万円。収益インパクトとの比較は別途ROI計算書で。

---

## 11. 役割分担 (ViVO × シーズグローバルコネクト)

| 領域 | 主担当 | 支援 |
|---|---|---|
| AIエージェント設計・プロンプト | **ViVO** | シーズG (レビュー) |
| フロントエンド実装 | **シーズG** | ViVO (Claude Code支援) |
| データパイプライン（POS → BQ） | **シーズG** | ViVO (スキーマ定義) |
| Integration Layer（相場メタAPI等） | **シーズG** | ViVO (インターフェース設計) |
| Semantic Layer（dbtビュー定義） | **ViVO** | シーズG (データエンジニア) |
| 外部API連携（各種相場・広告） | **シーズG** | ViVO (スクレイピング倫理) |
| ユーザー受け入れ・要件調整 | **ViVO** | シーズG |
| セキュリティ監査 | **シーズG** | ViVO (AI特有リスク) |
| 運用・監視 | **シーズG** | ViVO (AI品質監視) |
| 法務レビュー（スクレイピング・ToS） | **ライフクリエイト法務** | ViVO・シーズG |

---

## 12. 未解決事項 / 要確認

### 12.1 データソース関連
- [ ] タロスPOSのAPI連携可否 / エクスポート仕様の確定
- [ ] 会員データ取得停止（2024年4月〜）の運用復元判断（**有冨代表判断事項**）
- [ ] TKC連携の具体的方式（TKC側の開発作業範囲）
- [ ] Google Business Profile の複数店舗管理アカウントの現状
- [ ] 現状のMEO対策・口コミ返信は誰が実施しているか
- [ ] Web広告予算と運用主体（社内 or 代理店）
- [ ] メルカリ・ヤフオク スクレイピングの法務確認
- [ ] メルカリAPI公式再開の可能性 / 代替手段
- [ ] 競合買取サイトのスクレイピング法務レビュー
- [ ] 商圏人口データの購入予算承認
- [ ] 各SaaS・APIの契約権限者
- [ ] 福岡インター店以外の店舗でCSVエクスポートが同形式で取れるか

### 12.2 事業・AI関連
- [ ] PAUDEL氏・久芳氏の査定データの学習利用について本人同意
- [ ] エコプラス専門担当者の特定（`appraisal-luxury` 学習データ提供者）
- [ ] エコプラス事業の売上に占めるブランド品 vs 貴金属の比率
- [ ] FCオーナー向け画面の開示粒度（ビジョン「御用聞き」との整合）
- [ ] Claude API の zero-retention モード導入可否
- [ ] 補助金対象範囲との整合（ViVO補助金文書との重複・ギャップ）

### 12.3 有冨代表判断事項（CEOマター）
- [ ] 御用聞きビジョンの定量定義に踏み込むか（軸A導入）
- [ ] 買取担当者の属人化を指標化する是非（本人モチベ影響）
- [ ] スクレイピング許容度の基本方針
- [ ] 月額フル運用¥448K（年540万円）の予算承認
- [ ] 競合インテリジェンスの踏み込み度
- [ ] FC展開のコアコンピタンスを"査定"に置くか"運営"に置くか
- [ ] エコプラス／ライフサポートのデータ開示範囲

---

## 付録A: Claude Code 初回実装プロンプト例

プロジェクト初期化時の Claude Code 向けプロンプト：

```
このリポジトリは LifeCreate Intelligence のMVP実装です。
CLAUDE.md に設計書があります。これを読み込んだ上で、
Phase 0 の基盤整備タスクから着手してください。

最初のタスク:
1. Turborepo monorepo の初期化
2. apps/web (Next.js 14 App Router) の作成
3. packages/schema にDB型定義の雛形を配置
4. packages/market-reference の interface 定義のみ先に作成
5. data-pipeline/dbt の初期セットアップ
6. モックHTMLのデザインシステムを apps/web/app/globals.css に移植

完了したら、git commit で "chore: initial scaffold" としてください。
```

---

## 付録B: Market Reference Service 実装指示例

```
packages/market-reference/ ディレクトリに、設計書 §4.3.1 の
Market Reference Service を実装してください。

要件:
1. MarketReferenceService インターフェースを定義
2. 初期実装として AucfanProvider のみを実装
3. lookup() と getAggregated() の両方を実装
4. モックプロバイダを tests/ に用意
5. キャッシュは Upstash Redis、TTL 1時間
6. エラー時は graceful degradation（空配列を返す、throwしない）

テストは Vitest で、実APIは叩かずモックで書いてください。
Phase 2b で複数プロバイダを追加するため、プロバイダ追加が
config のみで済む設計にしてください（Strategy Pattern推奨）。
```

---

## 付録C: Morning Brief シグナル検出ルール例

Phase 1b で実装するシグナル検出ロジックの初期ルール（`packages/analytics/signals/rules.ts`）：

```typescript
export const signalRules = [
  {
    id: "member_registration_drop",
    category: "crm",
    check: async (ctx) => {
      const rate = await ctx.bq.query(`
        SELECT member_rate FROM vw_member_continuity 
        WHERE date = CURRENT_DATE() - 1
      `);
      const baseline = await ctx.bq.query(`
        SELECT AVG(member_rate) FROM vw_member_continuity 
        WHERE date BETWEEN CURRENT_DATE() - 30 AND CURRENT_DATE() - 8
      `);
      if (rate < baseline * 0.3) {
        return { severity: "critical", ... };
      }
      return null;
    }
  },
  {
    id: "staff_concentration_high",
    category: "attribution",
    check: async (ctx) => { /* トップ2名の売上比率が75%超 */ }
  },
  {
    id: "inventory_aging_critical",
    category: "inventory",
    check: async (ctx) => { /* 180日超滞留の簿価が月末の5%超 */ }
  },
  {
    id: "review_rating_drop",
    category: "meo",
    check: async (ctx) => { /* Google Business 7日移動平均でrating低下 */ }
  },
  {
    id: "roas_anomaly",
    category: "ads",
    check: async (ctx) => { /* 店舗別ROASが過去30日比で-40%超 */ }
  },
  // ... 継続追加
];
```

---

**End of System Design Document v0.2**

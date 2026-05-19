# Prelegal Project

## 概要

これは、テンプレートディレクトリにあるテンプレートに基づいてユーザーが法的契約書を作成できるSaaS製品です。ユーザーはAIチャットを利用して、必要な文書の種類と入力方法を指定できます。利用可能な文書は、プロジェクトルートにあるcatalog.jsonファイルに記載されています。以下はその例です。

@catalog.json

現在の実装では、4種類の法的文書（MNDA・MNDA表紙・デザインパートナー契約・SLA）の作成ツールとAIチャット機能を提供しています。ログイン後に文書選択画面が表示され、各文書ページでAIチャットによるフォーム自動入力が使えます。ログイン画面は偽実装（認証なし）で、文書の永続化は未実装です。

## 開発プロセス

機能開発の指示を受けた場合：

1. Atlassianツールを使用して、Jiraから機能開発の指示を読みます。
2. feature-dev の7ステッププロセスに従って、すべてのステップを省略せずに開発を進めます。
3. 単体テストと統合テストで機能を徹底的にテストし、問題があれば修正します。
4. GitHubツールを使用してプルリクエストを送信します。

## AI設計

LLMを呼び出すコードを記述する際は、OpenRouter経由でLiteLLMを`openrouter/openai/gpt-oss-120b`モデルに渡して、Cerebrasを推論プロバイダとして使用します。構造化出力（`response_format={"type": "json_object"}`）を使用することで、結果を解釈し、法的文書のフィールドに値を入力できます。

プロジェクトルートの `.env` ファイルに `OPENROUTER_API_KEY` が含まれています。バックエンドは起動時に `load_dotenv()` でこのファイルを読み込みます。Docker では `docker-compose.yml` の `env_file: .env` 経由で環境変数として渡されます。

## 技術設計

### 構成 (実装済み)

- **Docker**: multi-stage ビルド (`Dockerfile`) + `docker-compose.yml` でシングルサービス構成
- **バックエンド**: `backend/` — FastAPI + uv プロジェクト。SQLite を起動ごとに新規作成
- **フロントエンド**: `frontend/` — Next.js (`output: export` で静的ビルド)。FastAPI が `/` で配信
- **DB**: SQLite (`/data/prelegal.db`)。コンテナ起動ごとに新規作成。現在は `users` テーブルのみ
- **ポート**: http://localhost:8000 のみ (フロントエンドと API を同一ポートで配信)

### 起動・停止スクリプト (実装済み)

```bash
# Mac
scripts/start-mac.sh    # docker compose up -d --build
scripts/stop-mac.sh     # docker compose down

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```

### API エンドポイント

- `GET /api/health` — ヘルスチェック
- `POST /api/chat` — AIチャット (`backend/app/routers/chat.py`)。リクエスト: `{messages, current_form, doc_type}`、レスポンス: `{reply, updates}`

`doc_type` は `"mnda"` / `"mnda_coverpage"` / `"design_partner"` / `"sla"` のいずれか。各タイプで異なるシステムプロンプト・Pydanticモデルを使用。

### フロントエンドルート

- `/` — 文書選択画面（ログイン後）
- `/mnda` — 相互秘密保持契約 作成ツール
- `/mnda-coverpage` — 相互秘密保持契約 表紙 作成ツール
- `/design-partner` — デザインパートナー契約 作成ツール
- `/sla` — サービスレベル契約 作成ツール
- `/login` — ログイン画面（偽実装）

## カラースキーマ

- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## 実装状況

| 機能 | 状態 | チケット |
|------|------|----------|
| v1基盤 (Docker・バックエンド・スクリプト) | 完了 | KAN-6 |
| ログイン画面 (偽実装・localStorage) | 完了 | KAN-6 |
| MNDA作成ツール | 完了 | KAN-5以前 |
| 法的テンプレート (4種) | 完了 | KAN-4以前 |
| AIチャット (MNDA限定・フォーム自動入力) | 完了 | KAN-7 |
| AIチャット (全文書タイプ対応・文書選択画面) | 完了 | KAN-8 |
| 実認証 (signup/signin) + 文書永続化 + 免責事項バナー | レビュー中 | KAN-9 |

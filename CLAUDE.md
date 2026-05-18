# Prelegal Project

## 概要

これは、テンプレートディレクトリにあるテンプレートに基づいてユーザーが法的契約書を作成できるSaaS製品です。ユーザーはAIチャットを利用して、必要な文書の種類と入力方法を指定できます。利用可能な文書は、プロジェクトルートにあるcatalog.jsonファイルに記載されています。以下はその例です。

@catalog.json

現在の実装 (v1基盤) では、MNDA（相互秘密保持契約）の作成ツールのみ提供しています。ログイン画面は偽実装（認証なし）で、文書の永続化は未実装です。

## 開発プロセス

機能開発の指示を受けた場合：

1. Atlassianツールを使用して、Jiraから機能開発の指示を読みます。
2. feature-dev の7ステッププロセスに従って、すべてのステップを省略せずに開発を進めます。
3. 単体テストと統合テストで機能を徹底的にテストし、問題があれば修正します。
4. GitHubツールを使用してプルリクエストを送信します。

## AI設計

LLMを呼び出すコードを記述する際は、Cerebrasスキルを使用して、OpenRouter経由でLiteLLMを`openrouter/openai/gpt-oss-120b`モデルに渡して、Cerebrasを推論プロバイダとして使用します。構造化出力を使用することで、結果を解釈し、法的文書のフィールドに値を入力できます。

プロジェクトルートの .env ファイルに OPENROUTER_API_KEY が含まれています。

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
| 実認証 (signup/signin) | 未実装 | - |
| 文書の永続化 | 未実装 | - |
| AIチャット連携 | 未実装 | - |

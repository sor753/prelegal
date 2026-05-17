# Prelegal Project

## 概要

これは、テンプレートディレクトリにあるテンプレートに基づいてユーザーが法的契約書を作成できるSaaS製品です。ユーザーはAIチャットを利用して、必要な文書の種類と入力方法を指定できます。利用可能な文書は、プロジェクトルートにあるcatalog.jsonファイルに記載されています。以下はその例です。

@catalog.json

現在の実装では、AIチャットを介して4種類の文書タイプすべてに対応しており、完全なユーザー認証と文書の永続化機能を提供しています。

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

プロジェクト全体を Docker コンテナにパッケージ化する必要があります。

バックエンドは backend/ ディレクトリに配置し、FastAPI を使用する uv プロジェクトとします。

フロントエンドは frontend/ ディレクトリに配置します。
データベースは SQLite を使用し、Docker コンテナが起動するたびに新規に作成します。これにより、サインアップとサインイン機能を備えたユーザーテーブルを作成できます。
可能であれば、フロントエンドを静的にビルドし、FastAPI 経由で提供することも検討してください。

scripts/ ディレクトリには、以下のスクリプトが必要です。:

```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```

Backend available at http://localhost:8000

## カラースキーマ

- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

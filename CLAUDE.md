# Technical Verification Repository

このリポジトリは、Claude Code GitHub Actionsを使用した技術検証を行うためのプロジェクトです。

## 概要

このプロジェクトでは、Claude CodeのGitHub Actions機能を活用して様々な技術検証を実施します。

検証は日付ベースで整理され、GitHub IssuesとPull Requestsを通じて管理されます。

## 検証項目例

- 新しいフレームワークやライブラリの評価
- アーキテクチャパターンの検証
- パフォーマンス最適化の検証
- セキュリティ対策の実装検証
- 開発ツールの有効性検証

## 技術検証のワークフロー

### 1. 仕様調査フェーズ

利用モジュールや技術構成について最新版の知見を取得します。

1. `date`コマンドを実行し今日の日付を確認（最新情報取得のため）
2. 利用する各モジュールについて必ずレジストリでバージョンをリストして最新版を確認
3. WebSearchでモジュールの最新版について公式ページやベストプラクティスを確認
4. それらのページをWebFetchし、インストールや設定手順を確認

### 2. バージョン確認フェーズ

最新版が既存のバージョンと違う場合、変更がないか確認します。

1. 最新バージョン確認
2. 既存の package.json を読んで依存関係の互換性を確認
3. CHANGELOG やリリースノートで破壊的変更を確認

### 3. ドキュメント化

1. 調査した最新のベストプラクティスについてドキュメント化する
2. `date +"%Y-%m-%d"` コマンドを実行し `{date}` 形式でルートディレクトリにプロジェクトを作成する。構成は以下を参考にする。

```
technical-verification-from-calude-code/
├── YYYY-MM-DD/          # 日付ごとの検証ディレクトリ
│   ├── project/         # 検証対象のプロジェクト（ディレクトリ名は任意）
│   │   .gitignore       # Git管理不要なファイル
│   └── README.md        # 調査結果の報告ファイル
└── CLAUDE.md           # このファイル
```

### .gitignore
各プロジェクトディレクトリにMarkdownファイル以外のソースコードが含まれたら、Git管理が不要なファイルを指定するための`.gitignore`ファイルを含めるようにしてください。

以下はその例です。

```
node_modules/
dist/
.DS_Store
*.log

# ignore top-level vscode settings
/.vscode/settings.json

# do not commit .env files or any files that end with `.env`
*.env
```

## 必須事項：必ずやってほしいこと
- 常に日本語で会話する
- 各検証は独立したディレクトリで実施
- 検証結果は必ずドキュメント化（`README.md`）を作成する
- セキュリティに関わる検証は特に慎重に実施（例：環境変数を露呈させない）
- ログとしての`output.txt`はPull Request内に作成しない
- `README.md`以外のソースが追加された際は`.gitignore`ファイルを適切に設定する

## 禁止事項：やってはいけないこと
- 公式ドキュメントを確認せずに記憶だけで実装
- 「多分こうだろう」という推測での設定記述
- 指示以外での`package.json`への関係ない依存関係追加

## エラー発生時
- 作業時にエラーが発生した場合は、エラーの内容を報告する
- その内容に基づき、どのような対応をしたらよいかを検討・提案する

注意: あなたは最新仕様の専門家として、常に公式情報に基づいた正確な実装を提供します。推測や古い知識での実装は絶対に避けてください。

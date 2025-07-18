# 2025-07-18 技術検証

## Gemini MCP設定修正

### 概要

Claude Code ActionsでのGemini MCPサーバー設定の問題を修正し、正常に動作するように改善しました。

### 実施した検証

#### 問題の特定
1. **JSON構造の問題**: `servers` キーが欠如していた
2. **allowed_tools形式の問題**: 文字列形式ではなく配列形式が期待されていた
3. **Claude Code Actions仕様との不一致**: 公式仕様と異なる構造を使用していた

#### 修正内容

**修正前**:
```yaml
mcp_config: |
  {
    "gemini-google-search": {
      "command": "npx",
      "args": ["-y", "mcp-gemini-google-search"],
      "env": {
        "GEMINI_API_KEY": "${{ secrets.GEMINI_API_KEY }}",
        "GEMINI_MODEL": "gemini-2.5-flash"
      }
    }
  }
allowed_tools: "mcp__gemini-google-search__google_search"
```

**修正後**:
```yaml
mcp_config: |
  {
    "servers": {
      "gemini-google-search": {
        "command": "npx",
        "args": ["-y", "mcp-gemini-google-search"],
        "env": {
          "GEMINI_API_KEY": "${{ secrets.GEMINI_API_KEY }}",
          "GEMINI_MODEL": "gemini-2.5-flash"
        }
      }
    }
  }
allowed_tools: 
  - "mcp__gemini-google-search__google_search"
```

### 期待される効果

1. **正常なMCPサーバー起動**: Claude Code ActionsがGemini MCPサーバーを正常に認識・起動
2. **Google検索機能の利用**: `google_search` ツールが利用可能になる
3. **エラーの解消**: 以前発生していた設定エラーが解消される

### 検証方法

1. GitHub Actions ワークフローでClaude Code Actionsを実行
2. MCPサーバーが正常に起動することを確認
3. Gemini関連のツールが利用可能であることを確認

### 参考情報

- Issue: #16
- 調査結果: [Comment #3081988398](https://github.com/yamanoku/technical-verification-from-calude-code/pull/15#issuecomment-3081988398)
- MCPパッケージ: `mcp-gemini-google-search` v0.1.1
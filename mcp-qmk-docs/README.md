# mcp-qmk-docs

QMK Firmwareドキュメント (https://docs.qmk.fm/) を対象に、一覧・検索・取得のツールを提供する MCP サーバーです。

## ツール一覧
- qmk_list_docs: サイトマップからURL一覧を返却。`{ limit?: number }`
- qmk_search_docs: タイトル/URL/簡易本文検索。`{ query: string, limit?: number, mode?: 'title'|'url'|'content', contentSample?: number }`
- qmk_get_doc: 指定URL(またはパス)のページ本文を取得。`{ urlOrPath: string }`

## セットアップ
```bash
cd mcp-qmk-docs
npm i
npm run build
```

## 起動
```bash
npm start
```
- stdio で待ち受けます。MCP対応クライアント（例: Cursor, Claude Desktop など）から接続してください。

## Cursor 連携例
`.cursor/mcp.json` に以下のように登録:
```json
{
  "mcpServers": {
    "qmk-docs": {
      "command": "node",
      "args": ["/Users/bwrs1/qmk_firmware_corne_procyon/mcp-qmk-docs/dist/server.js"],
      "env": {}
    }
  }
}
```

## 注意事項
- 本サーバーは `sitemap.xml` を元にURL一覧を取得します。ページ構造変更により一部抽出が不完全になる可能性があります。
- サイトの利用規約に従ってご利用ください。

## 参考
- QMK公式ドキュメント: https://docs.qmk.fm/

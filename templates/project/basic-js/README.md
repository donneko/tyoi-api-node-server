# Tyoi Starter

Tyoi の JavaScript スターターです。

```bash
npm install
npm run dev
```

ブラウザで静的ページ、`GET /api/hello`、WebSocket `/ws` を試せます。

## Scripts

- `npm run dev`: 変更を監視して開発サーバーを再起動
- `npm run check`: JavaScript の構文チェック
- `npm start`: サーバーを起動

API と WebSocket は `src/server.js`、画面は `public/main/` から編集できます。
`tyoi.config.js` は `npx tyoi run` で静的サーバーとして起動するときの設定です。

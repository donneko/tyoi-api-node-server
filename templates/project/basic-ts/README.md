# Tyoi Starter

Tyoi の TypeScript スターターです。

```bash
npm install
npm run dev
```

ブラウザで静的ページ、`GET /api/hello`、WebSocket `/ws` を試せます。

## Scripts

- `npm run dev`: 変更を監視して開発サーバーを再起動
- `npm run typecheck`: TypeScript の型チェック
- `npm run build`: `dist/` へビルド
- `npm start`: ビルド済みサーバーを起動

API と WebSocket は `src/server.ts`、画面は `public/main/` から編集できます。
`tyoi.config.js` は `npx tyoi run` で静的サーバーとして起動するときの設定です。

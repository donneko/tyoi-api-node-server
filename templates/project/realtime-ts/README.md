# Tyoi Realtime Starter

WebSocketチャットをブラウザですぐ試せるTypeScriptテンプレートです。

```bash
npm install
npm run dev
```

複数のブラウザタブで `http://localhost:3000` を開き、メッセージが配信されることを確認できます。

## Scripts

- `npm run dev`: 変更監視付きで起動
- `npm run typecheck`: TypeScriptの型チェック
- `npm run build`: `dist/` へビルド
- `npm start`: ビルド済みサーバーを起動

WebSocketのパスは `/ws` です。メッセージは `{ "type": "message", "text": "..." }` のJSONで送信します。

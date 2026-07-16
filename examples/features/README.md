# Tyoi 機能別ミニマム例

現在公開されている機能を、1ファイルにつき1テーマで確認するための最小構成です。

## 機能一覧

| 機能 | 最小例 |
| --- | --- |
| 静的ファイル配信 | [`01-static-files.ts`](./01-static-files.ts) |
| GET API | [`02-get-api.ts`](./02-get-api.ts) |
| POST API | [`03-post-api.ts`](./03-post-api.ts) |
| WebSocket | [`04-websocket.ts`](./04-websocket.ts) |
| Express middleware | [`05-middleware.ts`](./05-middleware.ts) |
| ポート・ブラウザ | [`06-port-and-browser.ts`](./06-port-and-browser.ts) |
| LAN・QR Code | [`07-lan-and-qr.ts`](./07-lan-and-qr.ts) |
| ログイベント | [`08-log-events.ts`](./08-log-events.ts) |
| 起動・停止・状態取得 | [`09-lifecycle.ts`](./09-lifecycle.ts) |
| 低レベル `Server` API | [`10-direct-server.ts`](./10-direct-server.ts) |
| 設定ファイル | [`config/tyoi.config.js`](./config/tyoi.config.js) |
| CLI | [`cli.md`](./cli.md) |

## 実行

```bash
npx tsx examples/features/02-get-api.ts
```

APIは既定で `/api` 配下です。各サーバーは `Ctrl+C` で停止できます。
LAN公開の例は、信頼できるネットワーク内だけで実行してください。

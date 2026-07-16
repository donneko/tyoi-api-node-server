# Tyoi API Starter

外部データベースなしでJSON APIを試せるTypeScriptテンプレートです。

```bash
npm install
npm run dev
```

利用できるエンドポイント:

- `GET /api/health`: 稼働状態
- `GET /api/tasks`: タスク一覧
- `POST /api/tasks`: `{ "title": "First task" }` でタスク作成

```bash
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/tasks \
  -H 'content-type: application/json' \
  -d '{"title":"First task"}'
```

`src/server.ts` がルート登録、`src/task-store.ts` がインメモリデータを担当します。
データはプロセスを再起動すると初期化されます。

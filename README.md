# tyoi-api-server

Express と TypeScript を使用した、小さな API と静的ファイル配信を素早く立てるためのローカル向けサーバーフレームワークです。

ちょいサーバーは、API を少し試したい、HTML や画像を配信したい、同じ LAN 内のスマートフォンから手元の画面を確認したい、といった用途に向いています。

> このプロジェクトは現在開発中です。API は今後変更される可能性があります。
> This project is currently experimental.

---

# 特徴

* TypeScript 対応
* Express ベース
* 型付き API 登録
* 静的ファイル配信
* LAN 公開対応
* Local / Network URL 表示
* QR Code 表示対応
* ブラウザ自動起動対応
* 使用中ポートの自動切り替え対応
* Express middleware 対応
* API Registry ベース設計
* Promise / async 対応
* start / stop lifecycle 対応
* public ディレクトリ外への path traversal 対策

---

# クイックスタート

```bash
npm install
npm run dev
```

通常設定で起動:

```bash
npm run tyoi
```

開発設定で起動:

```bash
npm run "tyoi dev"
```

型チェック:

```bash
npm run typecheck
```

ビルドして実行:

```bash
npm run build
npm start
```

`npm run dev` と `npm run tyoi` は通常設定の `src/config/tyoi.config.ts` を使って起動します。`npm run "tyoi dev"` は開発設定の `src/config/tyoi.dev.config.ts` を使って起動します。`npm test` はサーバー起動用ではなく、検証用のコマンドとして予約しています。

---

# 使用ライブラリ

## Core

* express

## Middleware

* morgan
* helmet
* cors
* express-rate-limit
* express-slow-down
* hpp

---

# サーバー作成

```ts
import { Server } from "./app/server.js";

import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import hpp from "hpp";

type RequestNameList =
    | "GET:/test"
    | "GET:/hello";

const server = new Server<RequestNameList>({
    baseUrl: import.meta.url,
    publicDirname: "main",
    apiPrefix: "/api",
    port: 3000,

    middlewares: [
        helmet(),
        cors(),
        morgan("dev"),

        rateLimit({
            windowMs: 60 * 1000,
            max: 100
        }),

        slowDown({
            windowMs: 60 * 1000,
            delayAfter: 5,
            delayMs: () => 500
        }),

        hpp()
    ]
});
```

---

# Options

## Constructor

| option | default | description |
| --- | --- | --- |
| `baseUrl` | required | `import.meta.url` を指定します。公開ディレクトリ解決の基準になります。 |
| `publicDirname` | `"main"` | `public` 配下で公開するディレクトリ名です。 |
| `apiPrefix` | `"/api"` | API の URL prefix です。 |
| `port` | `3000` | 起動時の初期ポートです。 |
| `middlewares` | `[]` | Express の `RequestHandler` 配列です。追加順で実行されます。 |
| `exposeLan` | `false` | `true` の場合は `0.0.0.0` で listen します。 |
| `showQrCode` | `false` | `true` の場合は Network URL の QR Code を表示します。 |
| `openBrowser` | `false` | `true` または `"local"` の場合は Local URL、`"network"` の場合は Network URL をブラウザで開きます。 |
| `autoPort` | `false` | `true` の場合は、指定ポートが使用中でも確認せず次の空きポートを探します。 |
| `signalShutdownHandling` | `true` | `true` の場合は `SIGINT` / `SIGTERM` を受け取ったときに `stopServer()` を実行します。 |

## startServer

`startServer()` には起動時だけ上書きしたい値を渡せます。

```ts
await server.startServer({
    port: 3000,
    exposeLan: true,
    showQrCode: true,
    autoPort: true,
    openBrowser: "network"
});
```

| option | description |
| --- | --- |
| `port` | 起動時に使用するポートです。constructor の `port` より優先されます。 |
| `exposeLan` | `true` の場合は LAN 内からアクセスできるようにします。 |
| `showQrCode` | `true` の場合は Network URL の QR Code を表示します。 |
| `autoPort` | `true` の場合は使用中ポートを避けて次の空きポートを探します。 |
| `openBrowser` | 起動後に開くブラウザ URL を指定します。`true` / `"local"` / `"network"` を指定できます。 |

---

# API 登録

```ts
server.onAPI("GET:/hello", async (data) => {
    return {
        message: "hello world",
        query: data.query
    };
});
```

API key は `METHOD:/path` の exact match です。

```txt
GET /api/hello -> GET:/hello
```

`GET:/users/:id` のような path params パターンは現在対応していません。必要な値は query string または request body で渡してください。

---

# API アクセス

```txt
GET /api/hello
```

レスポンス:

```json
{
  "ok": true,
  "data": {
    "message": "hello world"
  }
}
```

---

# RequestData

API handler には以下のデータが渡されます。

```ts
{
    query,
    body,
    headers
}
```

| field | description |
| --- | --- |
| `query` | URL query string です。 |
| `body` | JSON request body です。 |
| `headers` | request headers です。 |

---

# 静的ファイル配信

`publicDirname: "main"` の場合、`baseUrl` のあるファイルと同じ階層にある `public/main` が公開されます。

このプロジェクトの `src/main.ts` から開発起動する場合:

```txt
src/
├── main.ts
└── public/
    └── main/
        ├── index.html
        └── sub.html
```

ビルド後は `src/public` が `dist/public` にコピーされ、`dist/main.js` から `dist/public/main` が公開されます。

---

# LAN 公開

LAN 内からアクセスしたい場合は、`exposeLan: true` を指定します。

```ts
await server.startServer({
    exposeLan: true
});
```

起動時に Local / Network URL が表示されます。

```text
Local: http://localhost:3000
Network: http://192.168.0.9:3000
```

同じ Wi-Fi / LAN 内のスマートフォンや別 PC からアクセスできます。

> macOS の場合、初回は firewall の許可が必要な場合があります。

---

# QR Code

`showQrCode: true` を指定すると、Network URL の QR Code を表示できます。

```ts
await server.startServer({
    exposeLan: true,
    showQrCode: true
});
```

QR Code は `exposeLan: true` のときだけ表示されます。

---

# ブラウザ自動起動

`openBrowser` を指定すると、サーバー起動後にブラウザで URL を開けます。

```ts
await server.startServer({
    openBrowser: true
});
```

| value | behavior |
| --- | --- |
| `false` | ブラウザを開きません。 |
| `true` | Local URL を開きます。 |
| `"local"` | Local URL を開きます。 |
| `"network"` | `exposeLan: true` の場合は Network URL を開きます。LAN 公開されていない場合は Local URL を開きます。 |

---

# サーバー停止

```ts
await server.stopServer();
```

`stopServer()` は HTTP server の `close()` 完了を待ちます。終了処理が 10 秒を超えた場合は `closeAllConnections()` を呼び、強制的に接続を閉じて終了扱いにします。

---

# エラーレスポンス

## API NOT FOUND

HTTP status: `404`

```json
{
  "ok": false,
  "code": "API_NOT_FOUND",
  "message": "API not found"
}
```

## API INTERNAL ERROR

HTTP status: `500`

```json
{
  "ok": false,
  "code": "API_INTERNAL_ERROR",
  "message": "Internal server error"
}
```

静的ファイルと通常ページの 404 は text response の `Not Found` です。

---

# 現在の仕様と注意点

* API route は exact match のみです。
* path params は未対応です。
* `autoPort: false` の場合、ポートが使用中なら次のポートを使うか確認します。拒否した場合は起動を中止します。
* `autoPort: true` の場合、ポートが使用中なら確認せず次の空きポートを探します。
* `startServer()` は起動に失敗した場合に例外を投げます。
* middleware は API と静的ファイル配信の前に追加されます。
* `signalShutdownHandling: true` の場合、`SIGINT` / `SIGTERM` で `stopServer()` を実行してから終了します。

---

# ディレクトリ構造例

```txt
src/
├── app/
│   ├── config-server.ts
│   └── server.ts
├── config/
│   ├── tyoi.config.ts
│   └── tyoi.default.config.ts
├── public/
│   └── main/
├── service/
│   ├── find-available-port.ts
│   ├── open-browser.ts
│   ├── path-normalization.ts
│   └── server-start-summary.ts
├── types/
│   └── config.type.ts
├── util/
│   ├── api-registry.ts
│   ├── get-lan-ip.ts
│   ├── is-portIn-use.ts
│   ├── is-user-request.ts
│   └── logger.ts
└── main.ts
```

---

# 設計思想

このプロジェクトでは、Express を直接使用するのではなく、その上に API Registry 層を作成しています。

```txt
Node.js HTTP
↓
Express
↓
Server class
↓
ApiRegistry
↓
API handler
```

これにより、API 管理、middleware 管理、型安全性、lifecycle 管理を整理しやすくしています。

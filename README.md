# tyoi-api-server

Express と TypeScript を使用した、小型 API / 静的ファイルサーバーフレームワークです。

ちょいサーバーはちょっとしたことでちょっとだけサーバーを使いたいときに有効です。
APIをちょっとテストで実行したい。ファイルを配信したい。ローカルサーバーをちょっとだけ立てたい。などなど、実務まではいかないけど、ちょっとしたことに手が届くサーバーです。

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
* middleware 対応
* API Registry ベース設計
* Promise / async 対応
* start / stop lifecycle 対応
* path traversal 対策
* Express middleware を簡単追加可能

---

# インストール

```bash
npm install
```

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

# API 登録

```ts
server.onAPI("GET:/hello", async (data) => {
    return {
        message: "hello world"
    };
});
```

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
    params,
    headers
}
```

---

# 静的ファイル配信

```txt
public/
└── main/
    ├── index.html
    ├── style.css
    └── script.js
```

```ts
publicDirname: "main"
```

を指定すると、

```txt
/public/main
```

配下が公開されます。

---

# サーバー起動

```ts
server.startServer();
```

---

# LAN 公開

LAN 内からアクセスしたい場合は、

```ts
exposeLan: true
```

を指定します。

```ts
const server = new Server({
    port: 3000,
    exposeLan: true
});
```

起動時に Local / Network URL が表示されます。

```text
Local:   http://localhost:3000
Network: http://192.168.0.9:3000
```

同じ Wi-Fi / LAN 内のスマートフォンや別PCからアクセスできます。

>macOS の場合、初回は firewall の許可が必要な場合があります。

---

# QR Code

```ts
showQrCode: true
```
を指定すると、Network URL の QR Code を表示できます。

スマートフォンから簡単にアクセスできます。

---


# サーバー停止

```ts
await server.stopServer();
```

---

# Middleware

middleware は Express の RequestHandler を使用します。

```ts
middlewares:[
    helmet(),
    cors(),
    morgan("dev")
]
```

middleware は追加順で実行されます。


---

# エラーレスポンス

## API NOT FOUND

```json
{
  "ok": false,
  "code": "API_NOT_FOUND",
  "message": "API not found"
}
```

## API INTERNAL ERROR

```json
{
  "ok": false,
  "code": "API_INTERNAL_ERROR",
  "message": "Internal server error"
}
```

---

# ディレクトリ構造例

```txt
src/
├── app/
│   └── server.ts
├── util/
│   ├── api-registry.ts
│   └── event/
├── service/
│   └── path-normalization.ts
└── main.ts
```

---

# 設計思想

このプロジェクトでは、Express を直接使用するのではなく、
その上に API Registry 層を作成しています。

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

これにより、

* API 管理
* middleware 管理
* 型安全性
* lifecycle 管理

を整理しやすくしています。


# Usage

基本的な利用では `tyoi()` を使います。`tyoi()` は `Server` のショートハンドで、API、WebSocket、起動・停止を少ない記述で扱えます。

CLI テンプレートから始める場合は、まず README の Quick Start を使ってください。

## Basic Server

```ts
import { tyoi } from "@donneko/tyoi-server";

const app = tyoi({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main",
    port: 3000
});

app.get("/hello", () => {
    return {
        message: "Hello Tyoi!"
    };
});

await app.start({
    openBrowser: "local"
});
```

`app.get("/hello")` は内部的に `GET:/hello` として登録されます。既定では API は `/api` 配下に登録されるため、上の例は `GET /api/hello` で呼び出せます。

レスポンスは次の形式で返されます。

```json
{
  "ok": true,
  "data": {
    "message": "Hello Tyoi!"
  }
}
```

## Static Files

`publicDirname` は `baseDirname` から見た相対パスです。

```ts
const app = tyoi({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main",
    port: 3000
});
```

この例では、`src/server.ts` から見た `../public/main` を静的ファイルとして配信します。

## API Methods

`tyoi()` の戻り値では、`get()` と `post()` を使って API を登録します。

```ts
import { tyoi } from "@donneko/tyoi-server";

const app = tyoi({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main"
});

app.get("/status", (data) => {
    return {
        ok: true,
        query: data.query
    };
});

app.post("/message", (data) => {
    return {
        received: data.body
    };
});

await app.start();
```

関連メソッド:

- `get(path, handler)`: GET API ハンドラを登録
- `post(path, handler)`: POST API ハンドラを登録

`handler` には次のデータが渡されます。

```ts
type RequestData = {
    query: unknown;
    body: unknown;
    headers: unknown;
};
```

一度だけ実行する API、登録解除、手動実行などが必要な場合は、`app.server` から内部の `Server` を使えます。

```ts
app.server.onceAPI("GET:/once", () => {
    return {
        message: "called once"
    };
});

app.server.offAPI("GET:/status");
app.server.hasAPI("POST:/message");

const result = await app.server.emitAPI("POST:/message", {
    query: {},
    body: {
        message: "manual call"
    },
    headers: {}
});
```

## WebSocket

```ts
import { tyoi } from "@donneko/tyoi-server";

const app = tyoi({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main"
});

app.ws("/ws", ({ ws }) => {
    ws.send("connected");

    ws.on("message", (message) => {
        ws.send(`echo: ${message.toString()}`);
    });
});

await app.start();
```

WebSocket のパスには `apiPrefix` は付きません。上の例は `ws://localhost:3000/ws` で接続します。

関連メソッド:

- `ws(path, handler)`: WebSocket ハンドラを登録

一度だけ実行する WebSocket、登録解除、登録確認が必要な場合は `app.server` を使えます。

```ts
app.server.onceWebSocket("/ws-once", ({ ws }) => {
    ws.send("connected once");
});

app.server.offWebSocket("/ws");
app.server.hasWebSocket("/ws");
```

## Middleware

Express middleware を追加できます。

```ts
import morgan from "morgan";
import { tyoi } from "@donneko/tyoi-server";

const app = tyoi({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main",
    middlewares: [
        morgan("dev")
    ]
});
```

## LAN Access

`exposeLan: true` を指定すると、サーバーは `0.0.0.0` で起動します。

```ts
await app.start({
    exposeLan: true,
    showQrCode: true,
    openBrowser: "network"
});
```

LAN 公開時は、同じネットワークに接続している端末からアクセス可能になります。公開してよいファイルや API だけを扱ってください。

## Events

現在公開されているイベントはログイベントです。イベント API は `app.server` から使えます。

```ts
const onLog = (data) => {
    console.log(data?.type, data?.message);
};

app.server.onEvent("server/*:log", onLog);

app.server.onceEvent("server/*:log", (data) => {
    console.log("first log", data?.message);
});

app.server.hasEvent("server/*:log");
app.server.offEvent("server/*:log", onLog);
```

`offEvent()` には、登録時に渡した同じ関数参照を渡してください。

## Start And Stop

```ts
const httpServer = await app.start();

console.log(app.server.isRunning());
console.log(app.server.getPort());
console.log(app.server.getConfig("apiPrefix"));
console.log(app.server.getHttpServer() === httpServer);

await app.close();
```

関連メソッド:

- `start(options?)`: サーバーを起動
- `close()`: サーバーを停止

内部 `Server` の関連メソッド:

- `startServer(options?)`: サーバーを起動
- `stopServer()`: サーバーを停止
- `isRunning()`: サーバーが起動中か確認
- `getPort()`: 現在のポート番号を取得
- `getConfig(key)`: 現在の設定値を取得
- `getHttpServer()`: Node.js の `http.Server` を取得

## Direct Server

型付きの API キー、`onceAPI()`、`offAPI()`、`emitAPI()` などを最初から直接扱いたい場合は、`Server` を使えます。

```ts
import { Server } from "@donneko/tyoi-server";

type API =
    | "GET:/status"
    | "POST:/message";

type WS = "/ws";

const server = new Server<API, WS>({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main",
    port: 3000
});

server.onAPI("GET:/status", (data) => {
    return {
        ok: true,
        query: data.query
    };
});

server.onAPI("POST:/message", (data) => {
    return {
        received: data.body
    };
});

server.onWebSocket("/ws", ({ ws }) => {
    ws.send("connected");
});

await server.startServer();
```

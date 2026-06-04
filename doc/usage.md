# Usage

`Server` を直接使う場合の基本例です。CLI テンプレートから始める場合は、まず README の Quick Start を使ってください。

## Basic Server

```ts
import { Server } from "@donneko/tyoi-server";

type API = "GET:/hello";

const server = new Server<API>({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main",
    port: 3000
});

server.onAPI("GET:/hello", () => {
    return {
        message: "Hello Tyoi!"
    };
});

await server.startServer({
    openBrowser: "local"
});
```

`onAPI()` のキーは `METHOD:/path` の形式です。既定では API は `/api` 配下に登録されるため、上の例は `GET /api/hello` で呼び出せます。

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
const server = new Server({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main",
    port: 3000
});
```

この例では、`src/server.ts` から見た `../public/main` を静的ファイルとして配信します。

## API Methods

```ts
type API =
    | "GET:/status"
    | "POST:/message"
    | "GET:/once";

const server = new Server<API>({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main"
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

server.onceAPI("GET:/once", () => {
    return {
        message: "called once"
    };
});

server.offAPI("GET:/status");

const result = await server.emitAPI("POST:/message", {
    query: {},
    body: {
        message: "manual call"
    },
    headers: {}
});
```

関連メソッド:

- `onAPI(key, handler)`: API ハンドラを登録
- `onceAPI(key, handler)`: 一度だけ実行される API ハンドラを登録
- `offAPI(key)`: API ハンドラを解除
- `hasAPI(key)`: API ハンドラが登録済みか確認
- `emitAPI(key, data)`: API ハンドラを手動実行

## WebSocket

```ts
import { Server } from "@donneko/tyoi-server";

type API = "GET:/status";
type WS = "/ws";

const server = new Server<API, WS>({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main"
});

server.onWebSocket("/ws", ({ ws }) => {
    ws.send("connected");

    ws.on("message", (message) => {
        ws.send(`echo: ${message.toString()}`);
    });
});

await server.startServer();
```

関連メソッド:

- `onWebSocket(path, handler)`: WebSocket ハンドラを登録
- `onceWebSocket(path, handler)`: 一度だけ実行される WebSocket ハンドラを登録
- `offWebSocket(path)`: WebSocket ハンドラを解除
- `hasWebSocket(path)`: WebSocket ハンドラが登録済みか確認

## Middleware

Express middleware を追加できます。

```ts
import morgan from "morgan";
import { Server } from "@donneko/tyoi-server";

const server = new Server({
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
await server.startServer({
    exposeLan: true,
    showQrCode: true,
    openBrowser: "network"
});
```

LAN 公開時は、同じネットワークに接続している端末からアクセス可能になります。公開してよいファイルや API だけを扱ってください。

## Events

現在公開されているイベントはログイベントです。

```ts
const onLog = (data) => {
    console.log(data?.type, data?.message);
};

server.onEvent("server/*:log", onLog);

server.onceEvent("server/*:log", (data) => {
    console.log("first log", data?.message);
});

server.hasEvent("server/*:log");
server.offEvent("server/*:log", onLog);
```

`offEvent()` には、登録時に渡した同じ関数参照を渡してください。

## Start And Stop

```ts
const httpServer = await server.startServer();

console.log(server.isRunning());
console.log(server.getPort());
console.log(server.getConfig("apiPrefix"));
console.log(server.getHttpServer() === httpServer);

await server.stopServer();
```

関連メソッド:

- `startServer(options?)`: サーバーを起動
- `stopServer()`: サーバーを停止
- `isRunning()`: サーバーが起動中か確認
- `getPort()`: 現在のポート番号を取得
- `getConfig(key)`: 現在の設定値を取得
- `getHttpServer()`: Node.js の `http.Server` を取得

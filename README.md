# tyoi-server

TypeScript 向けの、小さな API と静的ファイル配信を素早く立てるためのローカル向けサーバーフレームワークです。

tyoi-server は、API を少し試したい、HTML や画像を配信したい、同じ LAN 内のスマートフォンから手元の画面を確認したい、といった用途に向いています。

> This project is experimental. APIs may change in future releases.

## Features

- TypeScript 対応
- Express ベース
- 静的ファイル配信
- Local / Network URL 表示
- LAN 公開対応
- QR Code 表示対応
- ブラウザ自動起動対応
- 使用中ポートの自動切り替え対応
- Express middleware 対応
- 設定ファイル対応

## Installation

```bash
npm install @donneko/tyoi-server
```

CLI からプロジェクトを作成する場合は、次のように実行できます。

```bash
npm exec --package @donneko/tyoi-server tyoi -- init my-app
```

## Quick Start

```bash
npm exec --package @donneko/tyoi-server tyoi -- init my-app
cd my-app
npm install
npm run dev
```

生成されるプロジェクトの基本構成です。

```txt
my-app/
├─ public/
│  └─ main/
│     └─ index.html
├─ src/
│  └─ server.ts
├─ package.json
├─ tsconfig.json
└─ tyoi.config.js
```

## Basic Usage

```ts
import { Server } from "@donneko/tyoi-server";

const server = new Server({
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

CLI の設定ファイルから起動する場合は、プロジェクトルートを基準にします。

```js
import { defineConfig } from "@donneko/tyoi-server";

export default defineConfig({
    publicDirname: "./public/main",
    port: 3000
});
```

## Configuration

`tyoi.config.js` をプロジェクトルート、または `config/` ディレクトリに置くと、`tyoi` または `tyoi run` で読み込まれます。

```js
import { defineConfig } from "@donneko/tyoi-server";

export default defineConfig({
    port: 3000,
    autoPort: true,
    publicDirname: "./public/main",
    apiPrefix: "/api",
    exposeLan: false,
    showQrCode: false,
    openBrowser: true
});
```

主な設定:

- `port`: 起動するポート番号
- `autoPort`: 指定ポートが使用中のときに別ポートを探す
- `publicDirname`: 静的ファイルとして配信するディレクトリ
- `apiPrefix`: API のベースパス
- `middlewares`: 追加する Express middleware
- `openBrowser`: 起動時にブラウザを開く。`true`、`"local"`、`"network"` を指定できます
- `exposeLan`: LAN 内の他の端末からアクセスできるようにする
- `showQrCode`: Network URL の QR Code を表示する
- `signalShutdownHandling`: `SIGINT` / `SIGTERM` でサーバーを停止する

## Server API

```ts
const httpServer = await server.startServer();
```

よく使うメソッド:

- `startServer(options?)`: サーバーを起動します
- `stopServer()`: サーバーを停止します
- `onAPI(key, handler)`: API ハンドラを登録します
- `onceAPI(key, handler)`: 一度だけ実行される API ハンドラを登録します
- `offAPI(key)`: API ハンドラを解除します
- `hasAPI(key)`: API ハンドラが登録済みか確認します
- `emitAPI(key, data)`: API ハンドラを手動実行します
- `getPort()`: 現在のポート番号を取得します
- `isRunning()`: サーバーが起動中か確認します
- `getHttpServer()`: Node.js の `http.Server` を取得します

## LAN Access

`exposeLan: true` を指定すると、サーバーは `0.0.0.0` で起動し、同じネットワーク上の他の端末からアクセスできるようになります。

```ts
await server.startServer({
    exposeLan: true,
    showQrCode: true,
    openBrowser: "network"
});
```

LAN 公開時は、同じ Wi-Fi やネットワークに接続している端末からアクセス可能になります。公開してよいファイルや API だけを扱ってください。

## Middleware

Express middleware を追加できます。

```ts
import morgan from "morgan";
import { Server } from "@donneko/tyoi-server";

const server = new Server({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main",
    port: 3000,
    middlewares: [
        morgan("dev")
    ]
});
```

## CLI

ローカルにインストール済みのプロジェクトでは、npm scripts から `tyoi` を呼び出すのが簡単です。

```json
{
  "scripts": {
    "dev": "tsx src/server.ts",
    "start": "tyoi run"
  }
}
```

### init

```bash
tyoi init my-app
```

プロジェクトテンプレートを生成します。現在対応しているテンプレートは `basic` です。

```bash
tyoi init my-app --template basic
```

### run

```bash
tyoi run
```

現在のプロジェクトから設定ファイルを探し、その設定でサーバーを起動します。コマンドを省略して `tyoi` だけを実行した場合も同じ起動処理になります。

### dev

```bash
tyoi dev
```

このパッケージ自身の開発確認用サーバーを、組み込みの開発設定で起動します。

## Development

このリポジトリを開発する場合のコマンドです。

```bash
npm install
npm test
npm run compile
```

公開前には、公開パッケージに含まれるファイルを確認してください。

```bash
npm pack --dry-run
```

## Roadmap

- 自動ブラウザ更新 (Live Reload)
- リクエスト監視ツール (Request Inspector)
- プラグインシステム (Plugin System)
- JSON 簡易ファイルデータベース (JSON File DB)
- 改善されたエラーシステム (Better Error System)

## License

MIT

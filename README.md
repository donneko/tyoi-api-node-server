# tyoi

TypeScript 向けの、小さな API と静的ファイル配信を素早く立てるためのローカル向けサーバーフレームワークです。

tyoi は、API を少し試したい、HTML や画像を配信したい、同じ LAN 内のスマートフォンから手元の画面を確認したい、といった用途に向いています。

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

## Installation

```bash
npm install tyoi
```

CLI からプロジェクトを作成する場合は、次のように実行できます。

```bash
npx tyoi init my-app
```

## Quick Start

```bash
npx tyoi init my-app
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
└─ tsconfig.json
```

## Basic Usage

```ts
import { Server } from "tyoi";

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

## API Routes

`onAPI()` で API を登録できます。キーは `METHOD:/path` の形式です。

```ts
server.onAPI("GET:/hello", () => {
    return {
        message: "hello"
    };
});
```

レスポンスは次の形式で返されます。

```json
{
  "ok": true,
  "data": {
    "message": "hello"
  }
}
```

## Server Options

```ts
await server.startServer({
    port: 3000,
    autoPort: true,
    openBrowser: "local",
    exposeLan: false,
    showQrCode: false
});
```

主なオプション:

- `port`: 起動するポート番号
- `autoPort`: 指定ポートが使用中のときに別ポートを探す
- `openBrowser`: 起動時にブラウザを開く
- `exposeLan`: LAN 内の他の端末からアクセスできるようにする
- `showQrCode`: Network URL の QR Code を表示する

## LAN Access

`exposeLan: true` を指定すると、サーバーは `0.0.0.0` で起動し、同じネットワーク上の他の端末からアクセスできるようになります。

```ts
await server.startServer({
    exposeLan: true,
    showQrCode: true
});
```

LAN 公開時は、同じ Wi-Fi やネットワークに接続している端末からアクセス可能になります。公開してよいファイルや API だけを扱ってください。

## Middleware

Express middleware を追加できます。

```ts
import morgan from "morgan";
import { Server } from "tyoi";

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

### init

```bash
tyoi init my-app
```

プロジェクトテンプレートを生成します。

現在対応しているテンプレート:

```txt
basic
```

### dev

```bash
tyoi dev
```

現在のプロジェクト設定で開発用サーバーを起動します。

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

## License

MIT

## Roadmap

- 自動ブラウザ更新 (Live Reload)
- リクエスト監視ツール (Request Inspector)
- プラグインシステム (Plugin System)
- JSON 簡易ファイルデータベース (JSON File DB)
- 設定ファイル自動読み込み (Config Loader)
- 改善されたエラーシステム (Better Error System)

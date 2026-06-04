# Config

`tyoi.config.js` をプロジェクトルート、または `config/` ディレクトリに置くと、`tyoi` または `tyoi run` で読み込まれます。

```js
import { defineConfig } from "@donneko/tyoi-server";
import morgan from "morgan";

export default defineConfig({
    port: 3000,
    autoPort: true,
    publicDirname: "./public/main",
    apiPrefix: "/api",
    exposeLan: false,
    showQrCode: false,
    openBrowser: true,
    middlewares: [
        morgan("dev")
    ]
});
```

CLI の設定ファイルから起動する場合、`publicDirname` はプロジェクトルートから見た相対パスとして扱われます。

## Options

| option | type | default | description |
| --- | --- | --- | --- |
| `port` | `number` | `3000` | 起動するポート番号 |
| `autoPort` | `boolean` | `false` | 指定ポートが使用中のときに別ポートを探す |
| `publicDirname` | `string` | `"../public/main"` | 静的ファイルとして配信するディレクトリ |
| `apiPrefix` | `string` | `"/api"` | API のベースパス |
| `middlewares` | `express.RequestHandler[]` | `[]` | 追加する Express middleware |
| `openBrowser` | `boolean \| "local" \| "network"` | `false` | 起動時にブラウザを開く |
| `exposeLan` | `boolean` | `false` | LAN 内の他の端末からアクセスできるようにする |
| `showQrCode` | `boolean` | `false` | Network URL の QR Code を表示する |
| `signalShutdownHandling` | `boolean` | `true` | `SIGINT` / `SIGTERM` でサーバーを停止する |

## Browser Open

```js
export default defineConfig({
    openBrowser: true
});
```

- `true`: Local URL を開く
- `"local"`: Local URL を開く
- `"network"`: `exposeLan: true` のとき Network URL を開く
- `false`: ブラウザを開かない

## LAN And QR Code

```js
export default defineConfig({
    exposeLan: true,
    showQrCode: true,
    openBrowser: "network"
});
```

LAN 公開時は、同じ Wi-Fi やネットワークに接続している端末からアクセス可能になります。
公開してよいファイルや API だけを扱ってください。

## Programmatic Options

`tyoi()` からサーバーを作る場合も、ほぼ同じ設定を渡せます。

```ts
import { tyoi } from "@donneko/tyoi-server";

const app = tyoi({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main",
    port: 3000,
    autoPort: true
});

await app.start();
```

`baseDirname` は `tyoi()` や `new Server()` で直接作る場合に必要です。CLI から起動する場合は自動で設定されます。

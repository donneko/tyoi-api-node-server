# tyoi-api-server

TypeScript 向けの、小さな API と静的ファイル配信を素早く立てるためのローカル向けサーバーフレームワークです。

ちょいサーバーは、API を少し試したい、HTML や画像を配信したい、同じ LAN 内のスマートフォンから手元の画面を確認したい、といった用途に向いています。

> このプロジェクトは現在開発中です。API は今後変更される可能性があります。
> This project is currently experimental.
---

# Features

* TypeScript 対応
* Express ベース
* 静的ファイル配信
* LAN 公開対応
* Local / Network URL 表示
* QR Code 表示対応
* ブラウザ自動起動対応
* 使用中ポートの自動切り替え対応
* Express middleware 対応


---

# Installation

## 開発中（ローカル参照）

```bash
npm install
```

生成されたプロジェクトでは現在、ローカル参照を使用します。

```json
{
  "dependencies": {
    "tyoi-api-server": "file:.."
  }
}
```

---

# Quick Start

## プロジェクト生成

```bash
npx tsx src/main.ts init my-app
```

---

## 起動

```bash
cd my-app
npm install
npm run dev
```

---

# Project Structure

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

---

# Example

```ts
import { Server } from "tyoi-api-server";

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

---

# publicDirname

`publicDirname` は `server.ts` から見た相対パスです。

```ts
publicDirname: "../public/main"
```

---

# API

## GET API

```ts
server.onAPI("GET:/hello", () => {
    return {
        message: "hello"
    };
});
```

---

# Logger

内部には簡易 logger が含まれています。

```txt
[INFO]
[PROCESS]
[SUCCESS]
[WARN]
[ERROR]
[MESSAGE]
[SYSTEM]
```

---

# CLI

## init

```bash
tyoi init my-app
```

プロジェクトテンプレートを生成します。

現在対応しているテンプレート:

```txt
basic
```

---

# Template System

テンプレートは以下に配置されています。

```txt
src/templates/
```

例:

```txt
src/templates/basic
```

---

# TypeScript Config

テンプレートでは strict mode を使用しています。

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

# Development

## Run CLI

```bash
npx tsx src/main.ts init app
```

---

## Run Example App

```bash
cd app
npm install
npm run dev
```

---

# Current Status

現在開発中です。

開発中構成では:

* `tsx`
* `exports -> src/index.ts`
* `file:..`

を利用しています。

公開時には:

* `dist`
* build
* npm publish

対応を予定しています。

---

# Roadmap

- 自動ブラウザ更新 (Live Reload)
- リクエスト監視ツール (Request Inspector)
- プラグインシステム (Plugin System)
- JSONファイルデータベース (JSON File DB)
- 設定ファイル自動読み込み (Config Loader)
- 改善されたエラーシステム (Better Error System)
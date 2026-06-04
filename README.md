# tyoi-server

![NPM Version](https://img.shields.io/npm/v/%40donneko%2Ftyoi-server) ![NPM License](https://img.shields.io/npm/l/%40donneko%2Ftyoi-server) [![Socket Badge](https://badge.socket.dev/npm/package/@donneko/tyoi-server/0.0.3)](https://badge.socket.dev/npm/package/@donneko/tyoi-server/0.0.3)

小さな API と静的ファイル配信をすぐに立てるための、ローカル向けサーバーフレームワークです。
CLI でテンプレートを作り、HTML / CSS / API / WebSocket の動作確認をすばやく始められます。

> This project is experimental. APIs may change in future releases.

## Features

- Express ベースの API / 静的ファイル配信
- JavaScript / TypeScript テンプレート
- WebSocket 対応
- Local / Network URL 表示
- LAN 公開、QR Code 表示、ブラウザ自動起動
- 使用中ポートの自動切り替え
- Express middleware と設定ファイル対応

## Quick Start

TypeScript テンプレートで始める場合:

```bash
npm exec --package @donneko/tyoi-server tyoi -- init my-app --template basic-ts
cd my-app
npm install
npm run dev
```

JavaScript テンプレートで始める場合:

```bash
npm exec --package @donneko/tyoi-server tyoi -- init my-app --template basic-js
cd my-app
npm install
npm run dev
```

起動後、表示された Local URL をブラウザで開くと、`public/main` のページを確認できます。

## Templates

- `basic-ts`: TypeScript 用テンプレート
- `basic-js`: JavaScript 用テンプレート

テンプレートを指定しない場合は、CLI 上で選択できます。

```bash
npm exec --package @donneko/tyoi-server tyoi -- init my-app
```

## Common CLI

作成済みプロジェクトでは、ローカルにインストールした `tyoi` を npm scripts から使えます。

```bash
tyoi run
tyoi run --port 3001
tyoi run --open
tyoi help
tyoi --version
```

主なコマンド:

- `tyoi init <name>`: テンプレートからプロジェクトを作成
- `tyoi run`: 現在のプロジェクトの設定でサーバーを起動
- `tyoi dev`: このパッケージの開発確認用サーバーを起動
- `tyoi help`: コマンド一覧を表示

## Docs

詳しい使い方は `doc/` に分けています。

- [Usage](./doc/usage.md): `Server` の基本、API、WebSocket、middleware、イベント
- [Config](./doc/config.md): `tyoi.config.js` と設定項目
- [CLI](./doc/cli.md): CLI コマンドとオプション

## Development

このリポジトリを開発する場合:

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

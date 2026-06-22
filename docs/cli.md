# CLI

`tyoi` はテンプレート作成、設定ファイル作成、サーバー起動を行う CLI です。

## Quick Start

新しいフォルダを作って始める場合は `create` を使います。

```bash
npm exec --package @donneko/tyoi-server tyoi -- create my-app --template basic-ts
cd my-app
npm install
npm run dev
```

今いるフォルダにテンプレートを作る場合は `init` を使います。

```bash
mkdir my-app
cd my-app
npm exec --package @donneko/tyoi-server tyoi -- init my-app --template basic-ts
npm install
npm run dev
```

## create

新しいフォルダにテンプレートを作成します。

```bash
tyoi create my-app --template basic-ts
tyoi create my-app --template basic-js
```

`my-app` は作成するフォルダ名と `package.json` の `name` に使われます。

テンプレートを指定しない場合は、CLI 上で選択できます。

```bash
tyoi create my-app
```

## init

今いるフォルダにテンプレートを作成します。

```bash
tyoi init my-app --template basic-ts
tyoi init my-app --template basic-js
```

`my-app` は `package.json` の `name` に使われます。フォルダは新しく作られません。

テンプレートを指定しない場合は、CLI 上で選択できます。

```bash
tyoi init my-app
```

対応テンプレート:

- `basic-ts`
- `basic-js`

## config

今いるフォルダに `tyoi.config.js` を追加します。

```bash
tyoi config
```

現在の設定テンプレートは `basic` です。明示する場合は `--template basic` を使います。

```bash
tyoi config --template basic
```

`tyoi config` は既存プロジェクトに設定ファイルを追加するためのコマンドです。生成済みテンプレートには最初から `tyoi.config.js` が含まれています。

## info

`tyoi run` で使われる設定を表示します。

```bash
tyoi info
```

複数の設定ファイルが見つかった場合は、CLI 上で使用する設定ファイルを選択できます。

## run

現在のプロジェクトから設定ファイルを探し、その設定でサーバーを起動します。

```bash
tyoi run
```

コマンドを省略して `tyoi` だけを実行した場合も、同じ起動処理になります。

```bash
tyoi
```

## dev

このパッケージ自身の開発確認用サーバーを、組み込みの開発設定で起動します。

```bash
tyoi dev
```

通常の利用では、生成プロジェクト内の `npm run dev` または `tyoi run` を使ってください。

## help

コマンド一覧を表示します。

```bash
tyoi help
```

## Options

### `--template`

`create` / `init` / `config` で使うテンプレートを指定します。

```bash
tyoi create my-app --template basic-ts
tyoi init my-app --template basic-js
tyoi config --template basic
```

### `--port` / `-p`

起動ポートを指定します。

```bash
tyoi run --port 3001
tyoi run -p 3001
```

### `--open` / `-o`

起動後にブラウザを開きます。

```bash
tyoi run --open
tyoi run -o
```

### `--help` / `-h`

ヘルプを表示します。

```bash
tyoi --help
tyoi -h
```

### `--version` / `-v`

バージョンを表示します。

```bash
tyoi --version
tyoi -v
```

## npm scripts

ローカルにインストール済みのプロジェクトでは、npm scripts から呼び出すのが簡単です。

```json
{
  "scripts": {
    "dev": "tsx src/server.ts",
    "start": "tyoi run"
  }
}
```

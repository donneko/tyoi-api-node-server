# CLI

`tyoi` はテンプレート作成とサーバー起動を行う CLI です。

## init

テンプレートからプロジェクトを作成します。

```bash
tyoi init my-app --template basic-ts
```

インストールせずに実行する場合:

```bash
npm exec --package @donneko/tyoi-server tyoi -- init my-app --template basic-ts
```

JavaScript テンプレートを使う場合:

```bash
tyoi init my-app --template basic-js
```

テンプレートを指定しない場合は、CLI 上で選択できます。

```bash
tyoi init my-app
```

対応テンプレート:

- `basic-ts`
- `basic-js`

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

```bash
tyoi help
```

コマンド一覧を表示します。

## Options

### `--template`

`init` で使うテンプレートを指定します。

```bash
tyoi init my-app --template basic-ts
tyoi init my-app --template basic-js
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
